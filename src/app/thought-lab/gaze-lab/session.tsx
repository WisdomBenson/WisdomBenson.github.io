"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { openCamera } from "./camera"
import { createOneEuroFilter, extractFeatures, fitRidge, median, validationGrade } from "./gaze-math"
import type { Point, TrainingSample, ValidationPoint } from "./gaze-math"
import { createInteractions, EDGE_FRACTION } from "./interactions"

const CALIBRATION = [[50, 50], [14, 23], [86, 23], [14, 75], [86, 75]]
const VALIDATION = [[31, 34], [70, 38], [68, 64], [32, 67]]
const FRAMES_PER_POINT = 10
const SPEEDS = [600, 800, 1000, 1200]
const EDGE_STYLE = { "--gaze-band-height": EDGE_FRACTION * 100 + "%" } as CSSProperties
type Phase = "starting" | "calibration" | "validation" | "result" | "tracking"
type Input = TrainingSample["input"]
type Capture = { target: Point; started: number; frames: Input[] }
type Result = { points: ValidationPoint[]; width: number; height: number }

export function GazeSession({ onStop }: { onStop: (message: string) => void }) {
  const [phase, setPhase] = useState<Phase>("starting")
  const [index, setIndex] = useState(0)
  const [sampling, setSampling] = useState(false)
  const [status, setStatus] = useState("Starting camera")
  const [hint, setHint] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [showDot, setShowDot] = useState(false)
  const [allowDwell, setAllowDwell] = useState(false)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(800)
  const edges = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const target = useRef<HTMLButtonElement>(null)
  const stopButton = useRef<HTMLButtonElement>(null)
  const continueButton = useRef<HTMLButtonElement>(null)
  const camera = useRef<ReturnType<typeof openCamera>>(null)
  const registry = useRef<ReturnType<typeof createInteractions>>(null)
  const filter = useRef(createOneEuroFilter())
  const live = useRef({
    phase: "starting" as Phase, index: 0, paused: false, speed: 800, allowDwell: false,
    capture: null as Capture | null, training: [] as TrainingSample[], validation: [] as ValidationPoint[],
    model: null as ReturnType<typeof fitRidge> | null,
    point: null as Point | null, lastFace: 0, lastPoint: 0,
  })

  const enter = useCallback((next: Phase) => {
    const state = live.current
    state.phase = next
    state.index = 0
    state.capture = null
    state.point = null
    filter.current.reset()
    setIndex(0)
    setSampling(false)
    setHint("")
    setPhase(next)
  }, [])

  const recalibrate = useCallback(() => {
    const state = live.current
    state.training = []
    state.validation = []
    state.model = null
    setResult(null)
    registry.current?.reset()
    enter("calibration")
  }, [enter])

  const finish = useCallback((message = "Gaze lab stopped. The camera is off.") => {
    try {
      camera.current?.stop()
    } finally {
      onStop(message)
    }
  }, [onStop])

  useEffect(() => {
    const sandbox = document.querySelector<HTMLElement>("[data-gaze-lab]")
    if (!sandbox) return
    const state = live.current
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const interactions = createInteractions(sandbox, (direction, progress, scrolling) => {
      const bands = edges.current
      if (!bands) return
      if (!direction) {
        if (!bands.dataset.gazeEdge) return
        delete bands.dataset.gazeEdge
        bands.removeAttribute("data-gaze-scrolling")
        bands.style.removeProperty("--gaze-edge-progress")
        return
      }
      bands.dataset.gazeEdge = direction > 0 ? "down" : "up"
      bands.toggleAttribute("data-gaze-scrolling", scrolling)
      bands.style.setProperty("--gaze-edge-progress", String(progress))
    })
    registry.current = interactions

    let ended = false
    let frame = 0
    let previous = performance.now()
    let displayed = "Starting camera"
    let viewportWidth = innerWidth
    let viewportHeight = innerHeight

    function end(message?: string) {
      if (ended) return
      ended = true
      interactions.reset()
      finish(message)
    }

    function record(input: Input, now: number) {
      const capture = state.capture
      if (!capture || now - capture.started < 60) return
      capture.frames.push(input)
      target.current?.style.setProperty("--sample-progress", String(capture.frames.length / FRAMES_PER_POINT))
      if (capture.frames.length < FRAMES_PER_POINT) return

      state.capture = null
      setSampling(false)
      setHint("")
      const validation = state.phase === "validation"
      if (validation && state.model) {
        const predictions = capture.frames.map(state.model)
        const prediction = {
          x: median(predictions.map(point => point.x)),
          y: median(predictions.map(point => point.y)),
        }
        state.validation.push({
          target: capture.target,
          prediction,
          error: Math.hypot(prediction.x - capture.target.x, prediction.y - capture.target.y),
        })
      } else {
        state.training.push(...capture.frames.map(input => ({ input, target: capture.target })))
      }

      if (state.index + 1 < (validation ? VALIDATION.length : CALIBRATION.length)) {
        setIndex(++state.index)
      } else if (validation) {
        const grade = validationGrade(median(state.validation.map(point => point.error)))
        state.allowDwell = grade !== "Poor"
        setAllowDwell(state.allowDwell)
        setResult({ points: state.validation, width: innerWidth, height: innerHeight })
        enter("result")
      } else {
        state.model = fitRidge(state.training)
        state.training = []
        enter("validation")
      }
    }

    function tick(now: number) {
      if (ended) return
      const delta = Math.min(34, Math.max(0, now - previous))
      previous = now
      if (state.phase !== "starting" && !state.paused) {
        try {
          const reading = camera.current?.readFrame(now)
          if (reading) {
            if (reading.landmarks?.length) state.lastFace = now
            const input = extractFeatures(reading)
            if (input) {
              if (state.phase === "tracking" && state.model) {
                state.point = filter.current.update(state.model(input), now)
                state.lastPoint = now
              }
              record(input, now)
            } else {
              state.point = null
              filter.current.reset()
            }
          }
        } catch {
          end("Local face tracking stopped unexpectedly. The camera is off.")
          return
        }
        if (now - state.lastFace >= 30000) {
          end("No face was detected for 30 seconds. The camera is off.")
          return
        }
        if (state.capture && now - state.capture.started > 2200) {
          state.capture = null
          setSampling(false)
          setHint("The lab needs ten clear frames. Face the camera, look at the dot, and try again.")
        }
      }

      const next = state.phase === "starting" ? "Starting camera"
        : state.paused ? "Paused"
        : now - state.lastFace >= 1000 ? "Face lost"
        : state.phase === "tracking" ? "Tracking" : "Calibrating"
      if (displayed !== next) {
        displayed = next
        setStatus(next)
      }

      const tracking = state.phase === "tracking" && !state.paused
      const point = tracking && now - state.lastPoint < 200 ? state.point : null
      if (dot.current) {
        dot.current.hidden = !point
        if (point) {
          const x = Math.max(0, Math.min(innerWidth - 1, point.x))
          const y = Math.max(0, Math.min(innerHeight - 1, point.y))
          dot.current.style.transform = "translate3d(" + x + "px, " + y + "px, 0) translate(-50%, -50%)"
        }
      }
      if (tracking) interactions.step(point, now, delta, state.speed, state.allowDwell, !motion.matches)
      frame = requestAnimationFrame(tick)
    }

    function visibility() {
      if (document.hidden) end("The tab was hidden. The camera is off.")
    }

    function pageExit() { end() }

    function interrupt() {
      if (state.phase === "tracking") interactions.interrupt()
    }

    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        end()
      } else {
        interrupt()
      }
    }

    function resize() {
      if (innerWidth === viewportWidth && innerHeight === viewportHeight) return
      viewportWidth = innerWidth
      viewportHeight = innerHeight
      if (state.phase === "starting") return
      recalibrate()
      setHint("The viewport changed. Calibrate again for the new size.")
    }

    // Deferring startup prevents double camera requests during a development effect replay.
    const start = requestAnimationFrame(() => {
      if (document.hidden) { visibility(); return }
      try {
        const active = openCamera(() => end("Camera access ended. The gaze lab is stopped."))
        camera.current = active
        void active.ready.then(() => {
          if (ended) return
          state.lastFace = performance.now()
          enter("calibration")
        }).catch(() => end("The camera or local model could not start. Check camera access and try again."))
        frame = requestAnimationFrame(tick)
      } catch {
        end("The camera or local model could not start. Check camera access and try again.")
      }
    })

    window.addEventListener("keydown", keyboard, true)
    window.addEventListener("wheel", interrupt, { passive: true })
    window.addEventListener("pointerdown", interrupt, { passive: true })
    window.addEventListener("resize", resize)
    window.addEventListener("pagehide", pageExit)
    document.addEventListener("visibilitychange", visibility)
    return () => {
      ended = true
      cancelAnimationFrame(start)
      cancelAnimationFrame(frame)
      window.removeEventListener("keydown", keyboard, true)
      window.removeEventListener("wheel", interrupt)
      window.removeEventListener("pointerdown", interrupt)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pagehide", pageExit)
      document.removeEventListener("visibilitychange", visibility)
      interactions.stop()
      camera.current?.stop()
      camera.current = null
    }
  }, [enter, finish, recalibrate])

  useEffect(() => {
    if (phase === "calibration" || phase === "validation") target.current?.focus({ preventScroll: true })
    if (phase === "result") continueButton.current?.focus({ preventScroll: true })
    if (phase === "tracking" || phase === "starting") stopButton.current?.focus({ preventScroll: true })
  }, [phase])

  function measure() {
    const state = live.current
    if (!target.current || state.capture || state.paused) return
    const rect = target.current.getBoundingClientRect()
    target.current.style.setProperty("--sample-progress", "0")
    state.capture = {
      target: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
      started: performance.now(),
      frames: [],
    }
    setHint("")
    setSampling(true)
  }

  function togglePause() {
    const state = live.current
    state.paused = !state.paused
    state.capture = null
    state.point = null
    state.lastFace = performance.now()
    filter.current.reset()
    camera.current?.pause(state.paused)
    registry.current?.reset()
    setPaused(state.paused)
    setSampling(false)
  }

  const tracking = phase === "tracking"
  const bands = tracking && !paused
  const controls = (
    <div data-gaze-controls="" data-gaze-edge-layout={bands ? "" : undefined} style={EDGE_STYLE}
      role="region" aria-label="Gaze lab controls"
      className="gaze-controls flex w-max max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <span role="status" className="min-w-24 px-2 font-medium text-primary">{status}</span>
      {phase !== "starting" && (
        <Button size="sm" variant="ghost" onClick={togglePause}>{paused ? "Resume" : "Pause"}</Button>
      )}
      {tracking && (
        <>
          <Toggle size="sm" variant="outline" pressed={showDot} onPressedChange={setShowDot}>Show gaze dot</Toggle>
          <Toggle size="sm" variant="outline" pressed={allowDwell} onPressedChange={value => {
            live.current.allowDwell = value
            setAllowDwell(value)
            registry.current?.reset()
          }}>Allow dwell</Toggle>
          <Select value={String(speed)} onValueChange={value => {
            live.current.speed = Number(value)
            setSpeed(Number(value))
            registry.current?.reset()
          }}>
            <SelectTrigger size="sm" aria-label="Dwell speed"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SPEEDS.map(value => <SelectItem key={value} value={String(value)}>{value} ms</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={recalibrate}>Recalibrate</Button>
        </>
      )}
      <Button ref={stopButton} size="sm" onClick={() => finish()}>Stop</Button>
      {tracking && (
        <p className="hidden basis-full text-center text-xs text-muted-foreground motion-reduce:block">Scroll paused: reduced motion</p>
      )}
    </div>
  )

  if (phase === "starting") return controls
  if (tracking) return (
    <>
      {bands && (
        <div ref={edges} className="gaze-edges" style={EDGE_STYLE} aria-hidden="true">
          <span>Look here to scroll up</span>
          <span>Look here to scroll down</span>
        </div>
      )}
      {showDot && <div ref={dot} className="gaze-debug-dot" aria-hidden="true" hidden />}
      {controls}
    </>
  )

  const checking = phase === "validation"
  const points = checking ? VALIDATION : CALIBRATION
  const [x, y] = points[index] ?? points[0]
  return (
    <Dialog open onOpenChange={open => { if (!open) finish() }}>
      <DialogContent className="gaze-setup translate-x-0 translate-y-0" showCloseButton={false}
        onOpenAutoFocus={event => { event.preventDefault(); target.current?.focus({ preventScroll: true }) }}
        onCloseAutoFocus={event => event.preventDefault()}>
        <div className="absolute inset-x-0 top-[3vh] mx-auto max-w-xl px-5 text-center">
          <DialogTitle className="font-serif text-3xl">
            {result ? "Gaze accuracy" : checking ? "Check accuracy" : "Calibrate gaze"}
          </DialogTitle>
          <DialogDescription className="mt-2">
            {result ? "Each pair shows a target and the estimated gaze point."
              : "Sit comfortably in even light. Look at the dot, then click it or press Space. Keep looking until it moves."}
          </DialogDescription>
        </div>
        {result ? (
          <Accuracy result={result} continueButton={continueButton} onRecalibrate={recalibrate} onContinue={() => enter("tracking")} />
        ) : (
          <>
            <Button ref={target} type="button" onClick={measure}
              aria-label={checking ? "Record validation point" : "Record calibration point"}
              aria-disabled={sampling || paused} data-gaze-point=""
              className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-primary/20 transition-none active:not-aria-[haspopup]:-translate-y-1/2"
              style={{ left: x + "%", top: y + "%" }}>
              <span aria-hidden="true" className="size-2 rounded-full bg-primary-foreground" />
              {sampling && <span className="gaze-sampling-ring" aria-hidden="true" />}
            </Button>
            <div className="absolute inset-x-0 bottom-[13vh] flex flex-col gap-1 px-5 text-center text-sm">
              <p role="status" className="tabular-nums text-primary">{index + 1} of {points.length}{sampling ? " · Hold your gaze" : ""}</p>
              {hint && <p role="status" className="text-muted-foreground">{hint}</p>}
            </div>
          </>
        )}
        {controls}
      </DialogContent>
    </Dialog>
  )
}

function Accuracy({ result, continueButton, onRecalibrate, onContinue }: {
  result: Result
  continueButton: React.Ref<HTMLButtonElement>
  onRecalibrate: () => void
  onContinue: () => void
}) {
  const typical = median(result.points.map(point => point.error))
  const grade = validationGrade(typical)
  const radius = result.width * 0.012
  return (
    <div className="absolute inset-x-0 inset-y-[19%] mx-auto grid w-[min(56rem,90%)] grid-cols-[1fr_15rem] content-center items-center gap-8 overflow-auto">
      <figure>
        <svg role="img" aria-label="Plot of four validation targets and their predicted points" data-gaze-accuracy=""
          viewBox={"0 0 " + result.width + " " + result.height} className="max-h-[43vh] w-full rounded-xl border border-border bg-card">
          {result.points.map(({ target, prediction, error }, i) => {
            const x = Math.max(radius, Math.min(result.width - radius, prediction.x))
            const y = Math.max(radius, Math.min(result.height - radius, prediction.y))
            return (
              <g key={i}>
                <title>{"Point " + (i + 1) + ", " + Math.round(error) + " pixels of error"}</title>
                <line x1={target.x} y1={target.y} x2={x} y2={y} className="stroke-primary/60" strokeWidth={radius / 4} />
                <circle cx={target.x} cy={target.y} r={radius} fill="none" className="stroke-primary" strokeWidth={radius / 4} />
                <circle cx={x} cy={y} r={radius / 2} className="fill-foreground" />
              </g>
            )
          })}
        </svg>
        <figcaption className="mt-2 flex justify-center gap-5 text-xs text-muted-foreground">
          <span>○ Target</span><span>● Prediction</span>
        </figcaption>
      </figure>
      <div className="flex flex-col gap-3">
        <p role="status" className="font-serif text-4xl text-primary">{grade}</p>
        <p className="text-sm text-muted-foreground">Median error {Math.round(typical)} px</p>
        {grade === "Poor" && <p className="text-sm text-muted-foreground">Dwell starts off. You can enable it in the controls.</p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onRecalibrate}>Recalibrate</Button>
          <Button ref={continueButton} onClick={onContinue}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
