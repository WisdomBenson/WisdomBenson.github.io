// Run after pnpm build. Use an installed Chrome or set GAZE_CHROME_CHANNEL=chromium.
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { createServer } from "node:http"
import { resolve, extname, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const out = fileURLToPath(new URL("../out", import.meta.url))
const index = await readFile(resolve(out, "index.html"))
const contentTypes = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".json": "application/json", ".woff2": "font/woff2",
}
const server = createServer(async (request, response) => {
  const path = resolve(out, "." + new URL(request.url, "http://localhost").pathname)
  if (path !== out && !path.startsWith(out + sep)) {
    response.writeHead(404).end()
    return
  }
  try {
    const body = path === out ? index : await readFile(path)
    response.writeHead(200, { "Content-Type": path === out ? "text/html" : contentTypes[extname(path)] ?? "application/octet-stream" })
    response.end(body)
  } catch {
    response.writeHead(404).end()
  }
})
await new Promise((done, reject) => server.once("error", reject).listen(0, "127.0.0.1", done))
const origin = "http://localhost:" + server.address().port

// Replace WebGazer predictions only. The actual exported app, iframe bridge,
// regression buffer configuration, media ownership, and scroll code still run.
const webgazerFixture = () => {
  const fields = ["screenXClicksArray", "screenYClicksArray", "eyeFeaturesClicks", "dataClicks"]
  const regression = { init() { for (const field of fields) this[field] = { windowSize: 50, data: [] } } }
  regression.init()
  const detector = { async getEyePatches() { return {} } }
  let gazeListener
  let timer
  const tracker = {
    params: {},
    getTracker: () => detector,
    getRegression: () => [regression],
    saveDataAcrossSessions() {},
    applyKalmanFilter() {},
    showVideoPreview() { return this },
    showPredictionPoints() {},
    setGazeListener(listener) { gazeListener = listener },
    async begin() {
      await navigator.mediaDevices.getUserMedia({ video: true })
      timer = setInterval(async () => {
        await detector.getEyePatches()
        if (!this.paused) gazeListener?.(window.testGaze)
      }, 12)
    },
    removeMouseEventListeners() { window.removedTrainingListeners = true },
    recordScreenPosition(x, y, type) {
      const { data, windowSize } = regression.dataClicks
      if (data.length >= windowSize) data.shift()
      data.push({ x, y, type, time: performance.now() })
    },
    pause() { this.paused = true; return this },
    async resume() { this.paused = false },
    clearGazeListener() { gazeListener = undefined; return this },
    end() { clearInterval(timer) },
  }
  window.webgazer = tracker
  window.readCalibration = () => regression.dataClicks.data
}

let browser
try {
  browser = await chromium.launch({
    channel: process.env.GAZE_CHROME_CHANNEL ?? "chrome",
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
  })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" })
  await context.grantPermissions(["camera"], { origin })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  const vendorRequests = []
  page.on("pageerror", error => errors.push(String(error)))
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()) })
  page.on("request", request => {
    if (request.url().includes("/vendor/webgazer/")) vendorRequests.push(request.url())
  })
  await page.route("**/vendor/webgazer/webgazer.js", route => route.fulfill({
    contentType: "application/javascript",
    body: "(" + webgazerFixture.toString() + ")()",
  }))

  const button = name => page.getByRole("button", { name, exact: true })
  const gaze = async (x, y) => page.evaluate(({ x, y }) => {
    document.querySelector(".gaze-tracker-frame").contentWindow.testGaze = { x, y }
  }, { x, y })
  const dot = page.locator("[data-gaze-point]")
  const calibrated = () => page.evaluate(() => document.querySelector(".gaze-tracker-frame").contentWindow.readCalibration())
  const readPosition = () => page.evaluate(() => window.scrollY)
  const numberOfSteps = () => page.evaluate(() => window.gazeScrollCalls.length)
  const edge = page.locator(".gaze-edges")

  assert.equal((await page.goto(origin)).status(), 200)
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "smooth")
  await button("Gaze mode").click()
  await page.getByRole("heading", { name: "Try gaze mode" }).waitFor()
  assert.deepEqual(vendorRequests, [])
  await button("Continue to camera").click()

  const preview = page.getByLabel("Local camera preview")
  await preview.waitFor()
  await page.waitForFunction(() => {
    const video = document.querySelector('video[aria-label="Local camera preview"]')
    return video?.srcObject?.getVideoTracks().length === 1 && video.readyState >= 2
  })
  const stream = await preview.evaluateHandle(video => video.srcObject)
  assert(await page.evaluate(() => {
    const frame = document.querySelector(".gaze-tracker-frame").contentWindow
    return frame.removedTrainingListeners && frame.webgazer.params.moveTickSize === Infinity
  }))

  for (let i = 0; i < 9; i++) {
    await page.getByText((i + 1) + " of 9", { exact: true }).waitFor()
    const box = await dot.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await gaze(x, y)
    if (i % 2) {
      await dot.focus()
      await page.keyboard.press("Space")
    } else {
      await dot.click()
    }
    await page.mouse.move(30, 300)
    await page.waitForFunction(expected => {
      const frame = document.querySelector(".gaze-tracker-frame").contentWindow
      return frame.readCalibration().length >= expected
    }, (i + 1) * 7)
    const samples = (await calibrated()).slice(i * 7)
    assert.equal(samples.length, 7)
    assert(samples.every(sample => Math.abs(sample.x - x) < 1 && Math.abs(sample.y - y) < 1 && sample.type === "click"),
      "Dot " + (i + 1) + " expected (" + x + ", " + y + "), got " + JSON.stringify(samples))
    assert(samples.at(-1).time - samples[0].time >= 450)
    assert(samples.at(-1).time - samples[0].time < 800)
  }
  await page.getByRole("heading", { name: "Check accuracy" }).waitFor()
  assert.equal(await preview.count(), 0)
  for (let i = 0; i < 4; i++) {
    await page.getByText((i + 1) + " of 4", { exact: true }).waitFor()
    const box = await dot.boundingBox()
    await gaze(box.x + box.width / 2 + 220, box.y + box.height / 2)
    await dot.click()
  }
  await page.getByText("Fair", { exact: true }).waitFor()
  assert.equal((await calibrated()).length, 63)
  await button("Continue").locator("..").getByRole("button", { name: "Recalibrate", exact: true }).waitFor()
  console.log("PASS: seven spaced samples per dot, local preview lifecycle, and Fair validation at 220 px.")

  await button("Continue").click()
  await edge.waitFor()
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    window.gazeScrollCalls = []
    const scrollBy = window.scrollBy.bind(window)
    window.scrollBy = (...args) => {
      window.gazeScrollCalls.push(args[0])
      scrollBy(...args)
    }
  })
  const start = await readPosition()
  const controls = await page.getByRole("region", { name: "Gaze controls" }).boundingBox()
  assert(controls.y + controls.height < 900 * 0.82)
  const bottomY = 900 * 0.855
  await gaze(720, bottomY)
  const enteringBand = page.waitForFunction(() => document.querySelector(".gaze-edges").dataset.gazeEdge === "down")
  await Promise.all([enteringBand, page.waitForTimeout(1200)])
  const distance = (await readPosition()) - start
  assert(distance > 200, "Expected >200 px of real scroll, got " + distance + " px")
  assert(await page.evaluate(() => window.gazeScrollCalls.every(call => call.behavior === "instant" && call.top > 0)))

  await page.mouse.wheel(0, 45)
  await page.waitForFunction(() => !document.querySelector(".gaze-edges").hasAttribute("data-gaze-scrolling"))
  const afterWheel = await numberOfSteps()
  await page.waitForTimeout(750)
  assert.equal(await numberOfSteps(), afterWheel)

  await gaze(720, 450)
  await page.waitForTimeout(400)
  await gaze(720, 930)
  await page.waitForFunction(() => document.querySelector(".gaze-edges").hasAttribute("data-gaze-scrolling"))
  await gaze(720, 450)
  await page.waitForFunction(() => !document.querySelector(".gaze-edges").hasAttribute("data-gaze-scrolling"))
  const afterExit = await numberOfSteps()
  await page.waitForTimeout(250)
  assert.equal(await numberOfSteps(), afterExit)
  console.log("PASS: " + distance + " px of scroll in 1.2 s with smooth CSS, plus wheel/exit interruption.")

  const showGaze = button("Show gaze dot")
  assert.equal(await showGaze.getAttribute("aria-pressed"), "false")
  await showGaze.click()
  await page.locator(".gaze-debug-dot").waitFor()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.waitForFunction(() => matchMedia("(prefers-reduced-motion: reduce)").matches)
  await page.getByText("Scroll paused: reduced motion", { exact: true }).waitFor()
  await edge.waitFor({ state: "hidden" })
  const beforeReduced = await numberOfSteps()
  await gaze(720, bottomY)
  await page.waitForTimeout(800)
  assert.equal(await numberOfSteps(), beforeReduced)
  await page.keyboard.press("Escape")
  await button("Gaze mode").waitFor()
  assert(await stream.evaluate(value => value.getTracks().every(track => track.readyState === "ended")))
  assert.deepEqual(errors, [])
  console.log("PASS: gaze dot toggle, reduced-motion status, Escape camera cleanup, and no uncaught errors.")
} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}
