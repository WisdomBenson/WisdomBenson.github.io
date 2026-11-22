/* Adapter for the unmodified, pinned WebGazer build in this frame. */
(() => {
  let tracker
  let pendingFrame
  let resumeId
  let stopped = false
  let ready = false
  let face = false
  let pauseVersion = 0
  let reportError

  function resetTraining() {
    // WebGazer 3.5.3 otherwise drops the earliest samples after 50 clicks.
    for (const regression of tracker.getRegression()) {
      regression.init()
      for (const name of ["screenXClicksArray", "screenYClicksArray", "eyeFeaturesClicks", "dataClicks"]) {
        regression[name].windowSize = 72
      }
    }
  }

  window.gazeBridge = {
    async start(stream, onSample, onError) {
      tracker = window.webgazer
      reportError = onError
      const devices = navigator.mediaDevices
      const capture = devices.getUserMedia
      const detector = tracker.getTracker()
      const readEyes = detector.getEyePatches.bind(detector)

      tracker.params.faceMeshSolutionPath = new URL("./mediapipe/face_mesh/", document.baseURI).href
      tracker.saveDataAcrossSessions(false)
      // Disable passive training even while begin() installs its listeners.
      tracker.params.moveTickSize = Number.POSITIVE_INFINITY
      resetTraining()
      tracker.applyKalmanFilter(false)
      tracker.showVideoPreview(false).showPredictionPoints(false)
      detector.getEyePatches = async (...args) => {
        const reading = readEyes(...args)
        pendingFrame = reading
        try {
          const eyes = await reading
          face = Boolean(eyes)
          return eyes
        } catch (error) {
          if (!stopped) onError(error)
          return null
        }
      }
      tracker.setGazeListener((point) => {
        if (!stopped) onSample(point ? { x: point.x, y: point.y, face } : { face })
      })

      // The parent acquires and owns the only stream. WebGazer receives that
      // stream through its normal capture path inside this isolated document.
      devices.getUserMedia = async () => stream
      try {
        await tracker.begin(() => {})
        if (!stopped) ready = true
      } finally {
        devices.getUserMedia = capture
        tracker.removeMouseEventListeners()
      }
    },
    record(x, y) {
      if (!ready || stopped || !face) return false
      tracker.recordScreenPosition(x, y, "click")
      return true
    },
    clear() {
      // clearData() also touches IndexedDB. This integration trains in RAM.
      if (tracker) resetTraining()
    },
    pause() {
      pauseVersion++
      cancelAnimationFrame(resumeId)
      tracker?.pause()
    },
    async resume() {
      if (!ready || stopped) return
      const version = ++pauseVersion
      await pendingFrame?.catch(() => {})
      if (stopped || version !== pauseVersion) return
      cancelAnimationFrame(resumeId)
      // Let the previous loop observe pause before starting a new one.
      resumeId = requestAnimationFrame(() => {
        if (stopped || version !== pauseVersion) return
        resumeId = requestAnimationFrame(() => {
          if (!stopped && version === pauseVersion) void tracker.resume().catch(reportError)
        })
      })
    },
    stop() {
      stopped = true
      pauseVersion++
      cancelAnimationFrame(resumeId)
      tracker?.pause().clearGazeListener().removeMouseEventListeners()
      if (ready) tracker.end()
    },
  }
})()
