import { FaceLandmarker, FilesetResolver } from "./vision_bundle.mjs"

const video = document.createElement("video")
video.autoplay = true
video.muted = true
video.playsInline = true

let detector
let consumedTime = -1
let consumedFrames = 0
let presentedFrames = 0
let videoCallback
const hasVideoCallback = typeof video.requestVideoFrameCallback === "function"

function framePresented(_, metadata) {
  presentedFrames = metadata.presentedFrames
  videoCallback = video.requestVideoFrameCallback(framePresented)
}
let stopped = false

window.landmarkerRuntime = {
  async start(stream) {
    document.body.append(video)
    video.srcObject = stream
    if (hasVideoCallback) videoCallback = video.requestVideoFrameCallback(framePresented)
    await video.play()
    if (stopped) return

    const files = await FilesetResolver.forVisionTasks(new URL("./wasm", import.meta.url).href)
    if (stopped) return
    const model = await FaceLandmarker.createFromOptions(files, {
      baseOptions: {
        modelAssetPath: new URL("./face_landmarker.task", import.meta.url).href,
        delegate: "CPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFacialTransformationMatrixes: true,
    })
    if (stopped) model.close()
    else detector = model
  },

  readFrame(now) {
    if (!detector || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return undefined
    const time = video.currentTime
    const frames = hasVideoCallback ? presentedFrames : video.getVideoPlaybackQuality().totalVideoFrames
    if (time <= consumedTime || frames <= consumedFrames) return undefined
    consumedTime = time
    consumedFrames = frames
    const result = detector.detectForVideo(video, now)
    return {
      landmarks: result.faceLandmarks[0],
      matrix: result.facialTransformationMatrixes[0]?.data,
      aspect: video.videoWidth / video.videoHeight,
    }
  },

  pause(paused) {
    if (paused) video.pause()
    else {
      consumedTime = -1
      consumedFrames = hasVideoCallback ? presentedFrames : video.getVideoPlaybackQuality().totalVideoFrames
      void video.play().catch(() => {})
    }
  },

  stop() {
    stopped = true
    if (hasVideoCallback) video.cancelVideoFrameCallback(videoCallback)
    video.pause()
    video.srcObject = null
    detector?.close()
    detector = undefined
  },
}
