import type { LandmarkFrame } from "./gaze-math"

type Runtime = {
  start: (stream: MediaStream) => Promise<void>
  readFrame: (now: number) => LandmarkFrame | undefined
  pause: (paused: boolean) => void
  stop: () => void
}

export function openCamera(onTrackEnded: () => void) {
  const frame = document.createElement("iframe")
  // A rendered, inert frame keeps video decoding active without taking space.
  frame.style.cssText = "display:block;position:fixed;left:0;top:0;width:1px;height:1px;opacity:0.001;pointer-events:none;border:0"
  frame.title = "Local face landmark inference"
  frame.tabIndex = -1
  frame.setAttribute("aria-hidden", "true")
  frame.sandbox.add("allow-scripts", "allow-same-origin")
  frame.allow = "camera 'none'; microphone 'none'"
  frame.referrerPolicy = "no-referrer"

  const abort = new AbortController()
  let stream: MediaStream | undefined
  let runtime: Runtime | undefined

  function stop() {
    if (abort.signal.aborted) return
    abort.abort()
    stream?.getTracks().forEach(track => track.stop())
    try {
      runtime?.stop()
    } finally {
      frame.remove()
    }
  }

  const frameReady = new Promise<Runtime>((resolve, reject) => {
    frame.onload = () => {
      const window = frame.contentWindow as (Window & { landmarkerRuntime?: Runtime }) | null
      const bridge = window?.landmarkerRuntime
      if (bridge) resolve(bridge)
      else reject(new Error("Local inference unavailable"))
    }
    frame.onerror = () => reject(new Error("Local inference unavailable"))
    abort.signal.addEventListener("abort", () => reject(abort.signal.reason), { once: true })
  })
  frame.src = "/vendor/mediapipe/frame.html"
  document.body.append(frame)

  const cameraReady = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
  }).then(capture => {
    if (abort.signal.aborted) {
      capture.getTracks().forEach(track => track.stop())
      throw abort.signal.reason
    }
    stream = capture
    capture.getTracks().forEach(track => track.addEventListener("ended", onTrackEnded, { once: true, signal: abort.signal }))
    return capture
  })

  const ready = Promise.all([frameReady, cameraReady]).then(async ([bridge, capture]) => {
    abort.signal.throwIfAborted()
    runtime = bridge
    let timeout = 0
    try {
      await Promise.race([
        bridge.start(capture),
        new Promise<never>((_, reject) => {
          timeout = window.setTimeout(() => reject(new Error("Local inference timed out")), 30000)
          abort.signal.addEventListener("abort", () => reject(abort.signal.reason), { once: true })
        }),
      ])
    } finally {
      clearTimeout(timeout)
    }
  })

  return {
    ready, stop,
    readFrame: (now: number) => runtime?.readFrame(now),
    pause(paused: boolean) {
      stream?.getVideoTracks().forEach(track => { track.enabled = !paused })
      runtime?.pause(paused)
    },
  }
}
