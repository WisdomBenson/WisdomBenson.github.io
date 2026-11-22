// Run after pnpm build with Chrome installed.
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { createServer } from "node:http"
import { resolve, extname, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const out = fileURLToPath(new URL("../out", import.meta.url))
const contentTypes = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".mjs": "application/javascript", ".wasm": "application/wasm", ".json": "application/json",
  ".txt": "text/plain", ".woff2": "font/woff2",
}
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname
  const path = resolve(out, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""))
  if (!path.startsWith(out + sep)) {
    response.writeHead(404).end()
    return
  }
  try {
    const body = await readFile(path)
    response.writeHead(200, { "Content-Type": contentTypes[extname(path)] ?? "application/octet-stream" }).end(body)
  } catch {
    response.writeHead(404).end()
  }
})
await new Promise((done, reject) => server.once("error", reject).listen(0, "127.0.0.1", done))
const origin = "http://localhost:" + server.address().port
const lab = "/thought-lab/gaze-lab/"

async function observe(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, ...options })
  const page = await context.newPage()
  page.setDefaultTimeout(12000)
  const requests = []
  const errors = []
  page.on("request", request => {
    if (request.url().includes("/vendor/")) requests.push(request.url())
  })
  page.on("pageerror", error => errors.push(String(error)))
  page.on("console", message => {
    // The WASM loader writes native diagnostics to stderr, including this success message.
    if (message.type() === "error" && message.text() !== "INFO: Created TensorFlow Lite XNNPACK delegate for CPU.") {
      errors.push(message.text())
    }
  })
  await context.grantPermissions(["camera"], { origin })
  await page.addInitScript(() => {
    const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
    const stop = MediaStreamTrack.prototype.stop
    MediaStreamTrack.prototype.stop = function () {
      const stopped = Number(sessionStorage.getItem("test-stopped-tracks") ?? 0)
      sessionStorage.setItem("test-stopped-tracks", String(stopped + 1))
      return stop.call(this)
    }
    window.cameraRequests = 0
    window.captures = []
    navigator.mediaDevices.getUserMedia = async options => {
      window.cameraRequests++
      const stream = await getUserMedia(options)
      window.captures.push(stream)
      return stream
    }
  })
  return { context, page, requests, errors }
}

const button = (page, name) => page.getByRole("button", { name, exact: true })
const text = (page, value) => page.getByText(value, { exact: true })
const setup = page => page.getByRole("heading", { name: "Calibrate gaze" })
async function start(page) {
  await button(page, "Start gaze lab").click()
  await button(page, "Continue to camera").click()
  await setup(page).waitFor({ timeout: 35000 })
}
async function cameraOff(page) {
  await page.waitForFunction(() => ![...document.querySelectorAll("iframe")].some(frame => frame.src.includes("/vendor/mediapipe/")) &&
    window.captures.length > 0 && window.captures.every(stream => stream.getTracks().every(track => track.readyState === "ended")))
}

// Use the real frame/video pipeline and replace only Face Landmarker predictions.
const fixture = String.raw`
  export const FilesetResolver = { async forVisionTasks() { return {} } }
  export const FaceLandmarker = {
    async createFromOptions() {
      return {
        close() {},
        detectForVideo(video) {
          (window.frameTimes ??= []).push(video.currentTime)
          if (window.testFace === false) return { faceLandmarks: [], facialTransformationMatrixes: [] }
          const gaze = window.testGaze || { x: parent.innerWidth / 2, y: parent.innerHeight / 2 }
          const x = (gaze.x / parent.innerWidth - 0.5) * 0.78
          const y = (gaze.y / parent.innerHeight - 0.5) * 0.78
          const mesh = new Array(478).fill({ x: 0.5, y: 0.5 })
          for (const [base, iris, corners, top, bottom] of [
            [0.27, 468, [33, 133], [159, 158], [145, 153]],
            [0.60, 473, [362, 263], [386, 385], [374, 380]],
          ]) {
            mesh[corners[0]] = { x: base, y: 0.5 }
            mesh[corners[1]] = { x: base + 0.13, y: 0.5 }
            top.forEach(i => { mesh[i] = { x: base + 0.065, y: 0.47 } })
            bottom.forEach(i => { mesh[i] = { x: base + 0.065, y: 0.53 } })
            mesh[iris] = { x: base + 0.13 * (0.5 + x), y: 0.47 + 0.06 * (0.5 + y) }
          }
          const yaw = 0.16 + 0.18 * x * y
          const pitch = 0.08 + 0.10 * (x * x - y * y)
          return {
            faceLandmarks: [mesh],
            facialTransformationMatrixes: [{ data: [
              Math.cos(yaw), 0, -Math.sin(yaw), 0,
              Math.sin(yaw) * Math.sin(pitch), Math.cos(pitch), Math.cos(yaw) * Math.sin(pitch), 0,
              Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch), 0,
              0, 0, -5, 1,
            ] }],
          }
        },
      }
    },
  }
`

let browser
try {
  browser = await chromium.launch({
    channel: process.env.GAZE_CHROME_CHANNEL ?? "chrome",
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream",
      "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  })

  const pinned = await observe(browser)
  const homeChunks = []
  pinned.page.on("response", response => {
    if (response.url().includes("/_next/") && ["script", "stylesheet"].includes(response.request().resourceType())) {
      homeChunks.push(response.text())
    }
  })
  assert.equal((await pinned.page.goto(origin)).status(), 200)
  const notes = pinned.page.getByRole("button", { name: "Figure notes", exact: true }).first()
  await notes.focus()
  await pinned.page.keyboard.press("Space")
  await pinned.page.waitForFunction(() => document.querySelector('figure button[aria-expanded="true"]'))
  await pinned.page.keyboard.press("Space")
  assert.equal(await pinned.page.locator("[data-gaze-target], [data-gaze-expand]").count(), 0)
  for (const chunk of await Promise.all(homeChunks)) {
    assert.doesNotMatch(chunk, /\/vendor\/(?:webgazer|mediapipe)|Start gaze lab|\.gaze-edges\s*\{/)
  }
  assert.deepEqual(pinned.requests, [])
  assert.equal(await pinned.page.evaluate(() => window.cameraRequests), 0)

  await pinned.page.goto(origin + "/thought-lab/")
  await pinned.page.getByRole("link", { name: /Interactive lab: Gaze-assisted reading/ }).click()
  await button(pinned.page, "Start gaze lab").click()
  await pinned.page.getByRole("heading", { name: "Camera and privacy" }).waitFor()
  assert.deepEqual(pinned.requests, [])
  assert.equal(await pinned.page.evaluate(() => window.cameraRequests), 0)
  await button(pinned.page, "Cancel").click()
  await start(pinned.page)
  assert(pinned.requests.some(url => url.endsWith(".wasm")))
  assert(pinned.requests.some(url => url.endsWith("face_landmarker.task")))
  assert(pinned.requests.every(url => url.startsWith(origin + "/vendor/mediapipe/")))
  assert.equal(await pinned.page.evaluate(() => window.cameraRequests), 1)
  assert.equal(await pinned.page.evaluate(() => window.captures[0].getAudioTracks().length), 0)
  await text(pinned.page, "Face lost").waitFor()
  await pinned.page.keyboard.press("Escape")
  await cameraOff(pinned.page)
  assert.deepEqual(pinned.errors, [])
  await pinned.context.close()
  console.log("PASS portfolio isolation, consent gate, real WASM/model initialization, and Escape camera cleanup")

  const mobile = await observe(browser, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })
  await mobile.page.goto(origin + "/thought-lab/")
  assert.equal(await mobile.page.getByRole("link", { name: /Interactive lab/ }).count(), 0)
  await mobile.page.goto(origin + lab)
  await mobile.page.getByText(/Gaze tracking requires a desktop/).waitFor()
  assert.equal(await button(mobile.page, "Start gaze lab").count(), 0)
  assert.deepEqual(mobile.requests, [])
  assert.equal(await mobile.page.evaluate(() => window.cameraRequests), 0)
  assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth), await mobile.page.evaluate(() => innerWidth))
  await mobile.context.close()
  console.log("PASS mobile notice and zero camera/runtime activity")

  const sim = await observe(browser, { reducedMotion: "no-preference" })
  const { page } = sim
  await page.route("**/vendor/mediapipe/vision_bundle.mjs", route => route.fulfill({
    contentType: "application/javascript", body: fixture,
  }))
  await page.goto(origin + lab)
  await start(page)

  const dot = page.locator("[data-gaze-point]")
  const gaze = (x, y) => page.evaluate(value => {
    document.querySelector('iframe[title="Local face landmark inference"]').contentWindow.testGaze = value
  }, { x, y })
  const sampleProgress = () => dot.evaluate(el => el.style.getPropertyValue("--sample-progress"))
  for (const [count, shift] of [[5, 0], [4, 310]]) {
    for (let index = 1; index <= count; index++) {
      await text(page, index + " of " + count).waitFor()
      const rect = await dot.boundingBox()
      await gaze(rect.x + rect.width / 2 + shift, rect.y + rect.height / 2)
      if (index % 2 === 0) {
        await dot.focus()
        await page.keyboard.press("Space")
      } else {
        await dot.click()
      }
      if (count === 5 && index === 1) {
        await page.waitForFunction(() => {
          const progress = Number(document.querySelector("[data-gaze-point]").style.getPropertyValue("--sample-progress"))
          return progress > 0 && progress < 0.8
        })
        const frozen = await page.evaluate(() => {
          const frame = document.querySelector('iframe[title="Local face landmark inference"]').contentWindow
          const video = frame.document.querySelector("video")
          Object.defineProperty(video, "currentTime", { value: frame.frameTimes.at(-1), configurable: true })
          return {
            frames: frame.frameTimes.length,
            progress: document.querySelector("[data-gaze-point]").style.getPropertyValue("--sample-progress"),
          }
        })
        await page.waitForTimeout(180)
        assert.equal(await sampleProgress(), frozen.progress)
        assert.equal(await page.evaluate(() => document.querySelector('iframe[title="Local face landmark inference"]').contentWindow.frameTimes.length), frozen.frames)
        await page.evaluate(() => {
          const frame = document.querySelector('iframe[title="Local face landmark inference"]').contentWindow
          delete frame.document.querySelector("video").currentTime
        })
      }
      if (count === 5) {
        const label = index === 5 ? "1 of 4" : index + 1 + " of 5"
        await text(page, label).waitFor()
        assert.equal(await sampleProgress(), "1", "Ten fresh frames are required at each calibration target")
      }
    }
  }
  await text(page, "Poor").waitFor()
  const plot = page.locator("[data-gaze-accuracy]")
  assert.equal(await plot.locator("g").count(), 4)
  for (const error of await plot.locator("title").allTextContents()) {
    const pixels = Number(error.match(/, (\d+) pixels/)[1])
    assert(pixels > 270 && pixels < 345, error)
  }
  const frameTimes = await page.evaluate(() => document.querySelector('iframe[title="Local face landmark inference"]').contentWindow.frameTimes)
  assert(frameTimes.length >= 90)
  assert(frameTimes.every((time, i) => i === 0 || time > frameTimes[i - 1]))
  console.log("PASS five-point fit, frozen-frame rejection, ten fresh frames per point, and four held-out estimates")

  await button(page, "Continue").click()
  const allow = button(page, "Allow dwell")
  assert.equal(await allow.getAttribute("aria-pressed"), "false")
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    window.scrollCalls = []
    const scrollBy = window.scrollBy.bind(window)
    window.scrollBy = options => {
      window.scrollCalls.push(options)
      scrollBy(options)
    }
  })
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "smooth")
  await gaze(720, 900)
  await page.waitForTimeout(1200)
  const scroll = await page.evaluate(() => scrollY)
  assert(scroll > 200, "Expected gaze scroll >200 px, got " + scroll)
  assert(await page.evaluate(() => window.scrollCalls.every(call => call.behavior === "instant" && call.top > 0)))
  await page.mouse.wheel(0, 20)
  const afterWheel = await page.evaluate(() => window.scrollCalls.length)
  await page.waitForTimeout(750)
  assert.equal(await page.evaluate(() => window.scrollCalls.length), afterWheel)

  await allow.click()
  const card = page.locator("[data-gaze-target]").first()
  const trigger = card.getByRole("button", { name: /Reading notes/ })
  await card.evaluate(el => scrollTo({ top: scrollY + el.getBoundingClientRect().top - 240, behavior: "instant" }))
  const position = await card.boundingBox()
  await gaze(position.x + position.width / 2, position.y + position.height * 0.4)
  await card.and(page.locator("[data-gaze-hover]")).waitFor()
  assert.equal(await trigger.getAttribute("aria-expanded"), "false")
  await page.waitForFunction(() => document.querySelector("[data-gaze-expand]").ariaExpanded === "true")
  assert(Math.abs((await card.boundingBox()).y - position.y) < 3)
  await gaze(10, 450)
  await page.waitForTimeout(400)
  assert.equal(await trigger.getAttribute("aria-expanded"), "true")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await text(page, "Scroll paused: reduced motion").waitFor()
  await page.locator(".gaze-edges").waitFor({ state: "hidden" })
  await page.keyboard.press("Escape")
  await cameraOff(page)
  console.log("PASS " + scroll + " px of instant edge scroll, wheel interruption, Poor-grade dwell override and anchored expansion")

  await start(page)
  const beforeExit = await page.evaluate(() => Number(sessionStorage.getItem("test-stopped-tracks") ?? 0))
  await page.evaluate(() => document.querySelector('main a[href="/thought-lab/"]').click())
  await page.waitForURL(origin + "/thought-lab/")
  await page.waitForFunction(before => Number(sessionStorage.getItem("test-stopped-tracks")) > before, beforeExit)

  await page.goto(origin + lab)
  await start(page)
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await text(page, "The tab was hidden. The camera is off.").waitFor()
  await cameraOff(page)
  assert.deepEqual(sim.errors, [])
  await sim.context.close()
  console.log("PASS explicit track.stop() on Escape, client-side route exit, and tab hide")
} finally {
  await browser?.close()
  await new Promise(done => server.close(done))
}
