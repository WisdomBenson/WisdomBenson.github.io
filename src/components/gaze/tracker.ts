export type Point = { x: number; y: number }
export type TrackingSample = { face: boolean; x?: number; y?: number }

type Bridge = {
  start: (stream: MediaStream, sample: (sample: TrackingSample) => void, error: () => void) => Promise<void>
  record: (x: number, y: number) => boolean
  clear: () => void
  pause: () => void
  resume: () => Promise<void>
  stop: () => void
}

export function createTracker(sample: (sample: TrackingSample) => void, error: () => void) {
  const frame = document.createElement("iframe")
  frame.className = "gaze-tracker-frame"
  frame.title = "Local gaze processing"
  frame.tabIndex = -1
  frame.setAttribute("aria-hidden", "true")
  frame.sandbox.add("allow-same-origin", "allow-scripts")
  frame.referrerPolicy = "no-referrer"
  frame.allow = "camera 'none'; microphone 'none'"

  const abort = new AbortController()
  let stream: MediaStream | undefined
  let bridge: Bridge | undefined
  let paused = false

  function stop() {
    if (abort.signal.aborted) return
    abort.abort()
    stream?.getTracks().forEach(track => track.stop())
    try {
      bridge?.stop()
    } finally {
      frame.remove()
    }
  }

  function pause(value: boolean) {
    paused = value
    stream?.getTracks().forEach(track => { track.enabled = !value })
    if (value) bridge?.pause()
    else if (bridge) void bridge.resume().catch(error)
  }

  const ready = (async () => {
    const loaded = new Promise<Bridge>((resolve, reject) => {
      frame.onload = () => {
        const controller = (frame.contentWindow as (Window & { gazeBridge?: Bridge }) | null)?.gazeBridge
        if (controller) resolve(controller)
        else reject(new Error("Tracker unavailable"))
      }
      frame.onerror = () => reject(new Error("Tracker unavailable"))
      abort.signal.addEventListener("abort", () => reject(abort.signal.reason), { once: true })
    })
    frame.src = "/vendor/webgazer/frame.html"
    document.body.append(frame)

    const camera = navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
    }).then(capture => {
      if (abort.signal.aborted) {
        capture.getTracks().forEach(track => track.stop())
        throw abort.signal.reason
      }
      stream = capture
      capture.getTracks().forEach(track => {
        track.enabled = !paused
        track.addEventListener("ended", error, { once: true, signal: abort.signal })
      })
      return capture
    })
    const [controller, capture] = await Promise.all([loaded, camera])
    if (abort.signal.aborted) throw abort.signal.reason
    bridge = controller

    let timeout = 0
    try {
      await Promise.race([
        bridge.start(capture, sample, error),
        new Promise<never>((_, reject) => {
          timeout = window.setTimeout(() => reject(new Error("Tracker startup timed out")), 20000)
          abort.signal.addEventListener("abort", () => reject(abort.signal.reason), { once: true })
        }),
      ])
    } finally {
      window.clearTimeout(timeout)
    }
    if (paused) pause(true)
  })()

  return {
    ready, stop, pause,
    clear: () => bridge?.clear(),
    record: (point: Point) => bridge?.record(point.x, point.y) ?? false,
    preview(video: HTMLVideoElement) {
      video.muted = true
      video.srcObject = stream ?? null
      void video.play().catch(() => {})
      return () => { video.srcObject = null }
    },
  }
}
