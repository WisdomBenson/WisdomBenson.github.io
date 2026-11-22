"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { createInteractions, EDGE_FRACTION } from "./interactions"
import { createTracker } from "./tracker"
import type { Point, TrackingSample } from "./tracker"

const CALIBRATION = [[15, 21], [50, 21], [85, 21], [15, 50], [50, 50], [85, 50], [15, 77], [50, 77], [85, 77]]
const VALIDATION = [[29, 33], [71, 35], [70, 66], [32, 67]]
const SPEEDS = [600, 800, 1000, 1200]
const TRAINING_SAMPLES = 7
const TRAINING_SAMPLE_SPACING = 75
const TRAINING_SETTLE = 120
const TRAINING_ATTEMPT = 1050
const VALIDATION_SETTLE = 260
const VALIDATION_DURATION = 720
const EDGE_STYLE = { "--gaze-band-height": (EDGE_FRACTION * 100) + "%" } as CSSProperties
type Stage = "starting" | "calibration" | "validation" | "result" | "tracking"
type Grade = "Good" | "Fair" | "Poor"
type Result = { grade: Grade; median?: number; maximum?: number; note?: string }
type Capture = { point: Point; start: number; nextSample: number; errors: number[] }

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const center = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[center] : (sorted[center - 1] + sorted[center]) / 2
}

function grade(errors: number[]): Result {
  const typical = median(errors)
  return {
    grade: typical <= 180 ? "Good" : typical <= 260 ? "Fair" : "Poor",
    median: Math.ceil(typical * 10) / 10,
    maximum: Math.ceil(Math.max(...errors) * 10) / 10,
  }
}

export function GazeSession({ onStop }: { onStop: (message?: string) => void }) {
  const [stage, setStage] = useState<Stage>("starting")
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState("Starting camera")
  const [speed, setSpeed] = useState(800)
  const [paused, setPaused] = useState(false)
  const [busy, setBusy] = useState(false)
  const [hint, setHint] = useState("")
  const [result, setResult] = useState<Result>({ grade: "Poor" })
  const [showDot, setShowDot] = useState(false)
  const gazeDot = useRef<HTMLDivElement>(null)
  const edgeBands = useRef<HTMLDivElement>(null)
  const backend = useRef<ReturnType<typeof createTracker>>(null)
  const interactions = useRef<ReturnType<typeof createInteractions>>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const pauseButton = useRef<HTMLButtonElement>(null)
  const targetButton = useRef<HTMLButtonElement>(null)
  const live = useRef({
    stage: "starting" as Stage, index: 0, speed: 800, paused: false,
    deadline: 0, lastFace: 0, updated: 0, estimate: null as Point | null,
    capture: null as Capture | null, samplesAtDot: 0, errors: [] as number[], grade: "Poor" as Grade,
  })

  const enter = useCallback((next: Stage) => {
    const data = live.current
    data.stage = next
    data.index = 0
    data.capture = null
    data.samplesAtDot = 0
    if (next === "tracking") data.estimate = null
    setIndex(0)
    setBusy(false)
    setHint("")
    setStage(next)
  }, [])

  const showResult = useCallback((summary: Result) => {
    live.current.grade = summary.grade
    setResult(summary)
    enter("result")
  }, [enter])

  function skip() {
    showResult({ grade: "Poor", note: "Accuracy was not verified. Coarse controls require a usable gaze signal." })
  }

  function restart() {
    if (live.current.stage === "starting") return
    backend.current?.clear()
    const data = live.current
    data.errors = []
    data.estimate = null
    data.grade = "Poor"
    data.deadline = performance.now() + 42000
    interactions.current?.reset()
    enter("calibration")
  }

  function togglePause() {
    const data = live.current
    if (data.stage === "starting" || document.hidden) return
    data.paused = !data.paused
    data.estimate = null
    data.capture = null
    data.lastFace = performance.now()
    setBusy(false)
    setPaused(data.paused)
    interactions.current?.reset()
    backend.current?.pause(data.paused)
  }

  function finish(message?: string) {
    backend.current?.stop()
    onStop(message)
  }

  useEffect(() => {
    const data = live.current
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const registry = createInteractions((direction, progress, scrolling) => {
      const bands = edgeBands.current
      if (!bands) return
      if (!direction) {
        if (bands.dataset.gazeEdge) {
          delete bands.dataset.gazeEdge
          bands.removeAttribute("data-gaze-scrolling")
          bands.style.removeProperty("--gaze-edge-progress")
        }
        return
      }
      bands.dataset.gazeEdge = direction < 0 ? "up" : "down"
      bands.toggleAttribute("data-gaze-scrolling", scrolling)
      bands.style.setProperty("--gaze-edge-progress", String(progress))
    })
    interactions.current = registry
    let frame = 0
    let previous = performance.now()
    let displayed = "Starting camera"
    let ended = false

    function finishSession(message?: string) {
      if (ended) return
      ended = true
      backend.current?.stop()
      registry.reset()
      onStop(message)
    }

    function ingest(sample: TrackingSample) {
      if (ended || data.paused || document.hidden) return
      const now = performance.now()
      if (sample.face) data.lastFace = now
      const point = sample.face && Number.isFinite(sample.x) && Number.isFinite(sample.y)
        ? { x: sample.x!, y: sample.y! } : null
      if (point) {
        const prior = data.estimate
        const weight = 1 - Math.exp(-(now - data.updated) / 120)
        data.estimate = prior ? {
          x: prior.x + weight * (point.x - prior.x),
          y: prior.y + weight * (point.y - prior.y),
        } : point
        data.updated = now
      } else {
        data.estimate = null
      }

      const capture = data.capture
      if (!capture || !sample.face) return
      if (data.stage === "calibration" && data.samplesAtDot < TRAINING_SAMPLES && now >= capture.nextSample) {
        // Use a fresh camera frame for each recording, and keep partial bursts
        // at the same dot if the reader needs to retry or pause.
        if (backend.current?.record(capture.point)) {
          data.samplesAtDot++
          capture.nextSample = now + TRAINING_SAMPLE_SPACING
        }
      } else if (data.stage === "validation" && data.estimate && now - capture.start >= VALIDATION_SETTLE) {
        capture.errors.push(Math.hypot(data.estimate.x - capture.point.x, data.estimate.y - capture.point.y))
      }
    }

    function tick(now: number) {
      if (ended) return
      const delta = Math.max(0, Math.min(34, now - previous))
      previous = now
      const elapsed = now - data.lastFace
      const monitoring = data.stage !== "starting" && !data.paused && !document.hidden
      if (monitoring && elapsed >= 30000) {
        finishSession("Gaze mode stopped after 30 seconds without a face. The camera is off.")
        return
      }

      if ((data.stage === "calibration" || data.stage === "validation") && now > data.deadline && !data.paused) {
        showResult({ grade: "Poor", note: "The 42-second setup window ended before accuracy could be verified." })
      }
      const capture = data.capture
      const validation = data.stage === "validation"
      const burstComplete = !validation && data.samplesAtDot === TRAINING_SAMPLES
      const duration = validation ? VALIDATION_DURATION : TRAINING_ATTEMPT
      if (capture && (burstComplete || now - capture.start >= duration)) {
        data.capture = null
        setBusy(false)
        if (validation ? capture.errors.length < 3 : !burstComplete) {
          setHint("Hold your gaze on the dot and try again. Make sure your face is evenly lit.")
        } else {
          setHint("")
          if (validation) data.errors.push(median(capture.errors))
          const last = validation ? VALIDATION.length : CALIBRATION.length
          if (data.index + 1 < last) {
            data.index++
            data.samplesAtDot = 0
            setIndex(data.index)
          } else if (validation) {
            showResult(grade(data.errors))
          } else {
            enter("validation")
          }
        }
      }

      const next = data.stage === "starting" ? "Starting camera"
        : data.paused ? "Paused"
        : elapsed >= 1000 ? "Face lost"
        : data.stage === "tracking" ? "Tracking" : "Calibrating"
      if (next !== displayed) {
        displayed = next
        setStatus(next)
      }
      const tracking = data.stage === "tracking" && monitoring && elapsed < 1000
      const point = tracking && now - data.updated < 260 ? data.estimate : null
      if (gazeDot.current) {
        gazeDot.current.hidden = !point
        if (point) {
          const x = Math.max(0, Math.min(innerWidth - 1, point.x))
          const y = Math.max(0, Math.min(innerHeight - 1, point.y))
          gazeDot.current.style.transform = "translate3d(" + x + "px, " + y + "px, 0) translate(-50%, -50%)"
        }
      }
      if (tracking) {
        registry.step(point, now, delta, data.speed, data.grade !== "Poor", !motion.matches)
      } else {
        registry.reset()
      }
      frame = requestAnimationFrame(tick)
    }

    function hide() {
      if (!document.hidden) return
      data.paused = true
      data.capture = null
      data.estimate = null
      setBusy(false)
      setPaused(true)
      backend.current?.pause(true)
      registry.reset()
    }

    function interruptTracking() {
      if (data.stage === "tracking") registry.interrupt()
    }

    function keyboard(event: KeyboardEvent) {
      interruptTracking()
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        finishSession()
      }
    }

    function updateMotion() {
      registry.reset()
    }

    function stopOnExit() {
      // pagehide also covers documents preserved by the back/forward cache.
      finishSession()
    }

    const start = requestAnimationFrame(() => {
      if (document.hidden) {
        finishSession("Gaze mode needs a visible tab. The camera was not started.")
        return
      }
      const fail = () => finishSession("Camera or local tracking unavailable. Check access and try again.")
      const tracker = createTracker(ingest, fail)
      backend.current = tracker
      void tracker.ready.then(() => {
        if (ended) return
        data.lastFace = performance.now()
        data.deadline = data.lastFace + 42000
        enter("calibration")
        if (data.paused) tracker.pause(true)
      }).catch(() => { if (!ended) fail() })
      updateMotion()
      frame = requestAnimationFrame(tick)
    })
    document.documentElement.dataset.gazeActive = ""
    document.addEventListener("visibilitychange", hide)
    window.addEventListener("wheel", interruptTracking, { passive: true })
    window.addEventListener("touchstart", interruptTracking, { passive: true })
    window.addEventListener("pointerdown", interruptTracking, { passive: true })
    window.addEventListener("keydown", keyboard, true)
    window.addEventListener("pagehide", stopOnExit)
    motion.addEventListener("change", updateMotion)
    return () => {
      ended = true
      delete document.documentElement.dataset.gazeActive
      cancelAnimationFrame(start)
      cancelAnimationFrame(frame)
      backend.current?.stop()
      backend.current = null
      registry.stop()
      interactions.current = null
      document.removeEventListener("visibilitychange", hide)
      window.removeEventListener("wheel", interruptTracking)
      window.removeEventListener("touchstart", interruptTracking)
      window.removeEventListener("pointerdown", interruptTracking)
      window.removeEventListener("keydown", keyboard, true)
      window.removeEventListener("pagehide", stopOnExit)
      motion.removeEventListener("change", updateMotion)
    }
  }, [enter, onStop, showResult])

  useEffect(() => {
    if (stage === "result") continueButton.current?.focus()
    if (stage === "tracking") pauseButton.current?.focus({ preventScroll: true })
    if (stage === "validation" || stage === "calibration") targetButton.current?.focus()
  }, [stage])

  const attachPreview = useCallback((video: HTMLVideoElement | null) => {
    if (video) return backend.current?.preview(video)
  }, [])

  function measure() {
    const data = live.current
    const dot = targetButton.current
    if (!dot || data.capture || data.paused) return
    const box = dot.getBoundingClientRect()
    const start = performance.now()
    data.capture = {
      point: { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      start,
      nextSample: start + TRAINING_SETTLE,
      errors: [],
    }
    setBusy(true)
  }

  const showingEdges = stage === "tracking" && !paused
  const controls = (
    <div
      data-gaze-controls=""
      data-gaze-edge-layout={showingEdges ? "" : undefined}
      style={EDGE_STYLE}
      role="region"
      aria-label="Gaze controls"
      className="gaze-controls flex w-max max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg"
    >
      <span role="status" className="min-w-24 px-2 font-medium text-primary">{status}</span>
      <Button ref={pauseButton} size="sm" variant="ghost" onClick={togglePause} disabled={stage === "starting"}>{paused ? "Resume" : "Pause"}</Button>
      <Button size="sm" variant="ghost" onClick={restart} disabled={stage === "starting"}>Recalibrate</Button>
      <span className="pl-1 text-muted-foreground" aria-hidden="true">Dwell</span>
      <Select value={String(speed)} onValueChange={value => {
        const selected = Number(value)
        live.current.speed = selected
        setSpeed(selected)
        interactions.current?.reset()
      }}>
        <SelectTrigger size="sm" aria-label="Dwell speed"><SelectValue /></SelectTrigger>
        <SelectContent>
          {SPEEDS.map(value => <SelectItem key={value} value={String(value)}>{value} ms</SelectItem>)}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={() => { restart(); if (stage !== "starting") setHint("Calibration cleared. Follow the dots to build a new model.") }} disabled={stage === "starting"}>Clear calibration</Button>
      {stage === "tracking" && (
        <Toggle size="sm" variant="outline" pressed={showDot} onPressedChange={setShowDot}>
          Show gaze dot
        </Toggle>
      )}
      <Button size="sm" onClick={() => finish()}>Stop</Button>
      {stage === "tracking" && (
        <p role="status" className="hidden basis-full text-center text-xs text-muted-foreground motion-reduce:block">
          Scroll paused: reduced motion
        </p>
      )}
    </div>
  )

  if (stage === "starting") return controls
  if (stage === "tracking") {
    return (
      <>
        {showingEdges && (
          <div ref={edgeBands} aria-hidden="true" className="gaze-edges" style={EDGE_STYLE}>
            <span>Look here to scroll up</span>
            <span>Look here to scroll down</span>
          </div>
        )}
        {showDot && <div ref={gazeDot} aria-hidden="true" className="gaze-debug-dot" hidden />}
        {controls}
      </>
    )
  }

  const checking = stage === "validation"
  const points = checking ? VALIDATION : CALIBRATION
  const [x, y] = points[index] ?? points[0]

  return (
    <Dialog open onOpenChange={open => { if (!open) finish() }}>
      <DialogContent
        className="gaze-setup translate-x-0 translate-y-0"
        showCloseButton={false}
        onOpenAutoFocus={event => { event.preventDefault(); targetButton.current?.focus() }}
        onCloseAutoFocus={event => event.preventDefault()}
        onEscapeKeyDown={event => { event.preventDefault(); finish() }}
      >
        <div className="absolute inset-x-0 top-[3vh] mx-auto max-w-xl px-5 text-center">
          <DialogTitle className="font-serif text-3xl">{stage === "result" ? "Gaze accuracy" : checking ? "Check accuracy" : "Calibrate gaze"}</DialogTitle>
          <DialogDescription className="mt-2 leading-relaxed">
            {stage === "result" ? "These estimates apply to this session and screen position." : "Sit about 50–70 cm from the screen with even front lighting. Look at the dot, then click it or press Space."}
          </DialogDescription>
        </div>

        {stage === "calibration" && (
          <figure className="pointer-events-none absolute right-4 top-4 w-[clamp(6rem,10vw,9rem)] rounded-lg border border-border bg-card p-1.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <video
                ref={attachPreview}
                aria-label="Local camera preview"
                autoPlay
                muted
                playsInline
                className="size-full -scale-x-100 object-cover"
              />
              <div aria-hidden="true" className="absolute inset-x-[24%] inset-y-[12%] rounded-[45%] border-2 border-dashed border-primary-foreground/80 shadow-sm" />
            </div>
            <figcaption className="mt-1.5 text-center text-xs text-muted-foreground">
              {paused ? "Camera paused" : status === "Face lost" ? "Center your face" : "Local camera preview"}
            </figcaption>
          </figure>
        )}

        {stage === "result" ? (
          <div className="absolute left-1/2 top-1/2 flex w-[min(28rem,90%)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 text-center">
            <p role="status" className="font-serif text-4xl text-primary">{result.grade}</p>
            {result.median !== undefined && <p className="text-sm text-muted-foreground">Typical error {result.median} px · Largest point error {result.maximum} px</p>}
            {result.note && <p className="text-sm text-muted-foreground">{result.note}</p>}
            {result.grade === "Poor" && <p className="text-sm text-muted-foreground">Coarse scrolling and highlights are available. Dwell expansion is off.</p>}
            <p className="text-sm text-muted-foreground">If the estimate drifts, face an even light, reduce glare on glasses, and keep a steady distance.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={restart}>Recalibrate</Button>
              <Button ref={continueButton} onClick={() => { enter("tracking"); interactions.current?.invalidate() }}>Continue</Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              ref={targetButton}
              type="button"
              onClick={measure}
              aria-label={checking ? "Record validation point" : "Record calibration point"}
              aria-disabled={busy || paused}
              data-gaze-point=""
              className="absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-primary/20 transition-none focus-visible:ring-4 focus-visible:ring-ring/70 active:not-aria-[haspopup]:-translate-y-1/2"
              style={{ left: x + "%", top: y + "%" }}
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-primary-foreground" />
              {busy && <span aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-full border-2 border-primary/60 motion-safe:animate-pulse motion-safe:[animation-duration:450ms]" />}
            </Button>
            <div className="absolute inset-x-0 bottom-[12vh] flex flex-col items-center gap-1 px-5 text-center">
              <p className="text-sm tabular-nums text-primary" role="status">{index + 1} of {points.length}{busy ? " · Hold your gaze" : ""}</p>
              {hint && <p role="status" className="text-sm text-muted-foreground">{hint}</p>}
              <Button variant="ghost" size="sm" onClick={skip}>Skip setup</Button>
            </div>
          </>
        )}
        {controls}
      </DialogContent>
    </Dialog>
  )
}
