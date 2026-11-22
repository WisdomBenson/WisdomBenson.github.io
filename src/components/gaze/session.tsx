"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInteractions } from "./interactions"
import { createTracker } from "./tracker"
import type { Point, TrackingSample } from "./tracker"

const CALIBRATION = [[15, 21], [50, 21], [85, 21], [15, 50], [50, 50], [85, 50], [15, 77], [50, 77], [85, 77]]
const VALIDATION = [[29, 33], [71, 35], [70, 66], [32, 67]]
const SPEEDS = [600, 800, 1000, 1200]
type Stage = "starting" | "calibration" | "validation" | "result" | "tracking"
type Grade = "Good" | "Fair" | "Poor"
type Result = { grade: Grade; median?: number; maximum?: number; note?: string }
type Capture = { point: Point; start: number; count: number; errors: number[] }

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const center = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[center] : (sorted[center - 1] + sorted[center]) / 2
}

function grade(errors: number[]): Result {
  const typical = median(errors)
  const maximum = Math.max(...errors)
  return {
    grade: typical <= 80 && maximum <= 120 ? "Good" : typical <= 140 && maximum <= 220 ? "Fair" : "Poor",
    median: Math.round(typical),
    maximum: Math.round(maximum),
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
  const [reduced, setReduced] = useState(false)
  const backend = useRef<ReturnType<typeof createTracker>>(null)
  const interactions = useRef<ReturnType<typeof createInteractions>>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const pauseButton = useRef<HTMLButtonElement>(null)
  const targetButton = useRef<HTMLButtonElement>(null)
  const live = useRef({
    stage: "starting" as Stage, index: 0, speed: 800, paused: false,
    deadline: 0, lastFace: 0, updated: 0, estimate: null as Point | null,
    capture: null as Capture | null, errors: [] as number[], grade: "Poor" as Grade,
  })

  const enter = useCallback((next: Stage) => {
    const data = live.current
    data.stage = next
    data.index = 0
    data.capture = null
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
    const registry = createInteractions()
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
      if (!capture || !sample.face || now - capture.start < 180) return
      if (data.stage === "calibration" && capture.count < 4) {
        // Keep all nine targets in the 50-sample WebGazer window.
        backend.current?.record(capture.point)
        capture.count++
      } else if (point && data.stage === "validation") {
        capture.errors.push(Math.hypot(point.x - capture.point.x, point.y - capture.point.y))
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
      if (capture && now - capture.start >= 660) {
        data.capture = null
        setBusy(false)
        const validation = data.stage === "validation"
        if ((validation ? capture.errors.length : capture.count) < 3) {
          setHint("Hold your gaze on the dot and try again. Make sure your face is evenly lit.")
        } else {
          setHint("")
          if (validation) data.errors.push(median(capture.errors))
          const last = validation ? VALIDATION.length : CALIBRATION.length
          if (data.index + 1 < last) {
            data.index++
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
      if (data.stage === "tracking" && monitoring && elapsed < 1000) {
        registry.step(now - data.updated < 260 ? data.estimate : null, now, delta, data.speed, data.grade !== "Poor", !motion.matches)
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

    function keyboard(event: KeyboardEvent) {
      registry.interrupt()
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        finishSession()
      }
    }

    function updateMotion() {
      setReduced(motion.matches)
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
    window.addEventListener("wheel", registry.interrupt, { passive: true })
    window.addEventListener("touchstart", registry.interrupt, { passive: true })
    window.addEventListener("pointerdown", registry.interrupt, { passive: true })
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
      window.removeEventListener("wheel", registry.interrupt)
      window.removeEventListener("touchstart", registry.interrupt)
      window.removeEventListener("pointerdown", registry.interrupt)
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

  function measure() {
    const data = live.current
    const dot = targetButton.current
    if (!dot || data.capture || data.paused) return
    const box = dot.getBoundingClientRect()
    data.capture = { point: { x: box.x + box.width / 2, y: box.y + box.height / 2 }, start: performance.now(), count: 0, errors: [] }
    setBusy(true)
  }

  const controls = (
    <div data-gaze-controls="" role="region" aria-label="Gaze controls" className="gaze-controls flex w-max max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
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
      <Button size="sm" onClick={() => finish()}>Stop</Button>
    </div>
  )

  if (stage === "starting") return controls
  if (stage === "tracking") {
    return (
      <>
        {!reduced && !paused && (
          <div aria-hidden="true" className="gaze-edges">
            <span>Look here to scroll up</span>
            <span>Look here to scroll down</span>
          </div>
        )}
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

        {stage === "result" ? (
          <div className="absolute left-1/2 top-1/2 flex w-[min(28rem,90%)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 text-center">
            <p role="status" className="font-serif text-4xl text-primary">{result.grade}</p>
            {result.median !== undefined && <p className="text-sm text-muted-foreground">Typical error {result.median} px · Largest point error {result.maximum} px</p>}
            {result.note && <p className="text-sm text-muted-foreground">{result.note}</p>}
            {result.grade === "Poor" && <p className="text-sm text-muted-foreground">Coarse scrolling and highlights are available. Dwell expansion is off.</p>}
            <p className="text-sm text-muted-foreground">If the estimate drifts, face an even light, reduce glare on glasses, and keep a steady distance.</p>
            <Button ref={continueButton} onClick={() => { enter("tracking"); interactions.current?.invalidate() }}>Continue</Button>
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
              className="absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-primary/20 focus-visible:ring-4 focus-visible:ring-ring/70"
              style={{ left: x + "%", top: y + "%" }}
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-primary-foreground" />
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
