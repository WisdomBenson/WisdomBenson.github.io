import type { Point } from "./tracker"

export const EDGE_FRACTION = 0.13
const EDGE_DWELL = 400
const HIT_PADDING = 80
const HALF_DEAD_ZONE = 50
const MIN_SIZE = 180
const GRACE = 300
const BLINK = 100

type Box = { left: number; right: number; top: number; bottom: number }
type Target = {
  element: HTMLElement
  trigger: HTMLButtonElement
  box: DOMRect
  hit: Box
  blocked: DOMRect[]
}

function contains(box: Box, point: Point) {
  return point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom
}

function separate(target: Target, other: Target) {
  const a = target.box
  const b = other.box
  const xGap = Math.max(b.left - a.right, a.left - b.right)
  const yGap = Math.max(b.top - a.bottom, a.top - b.bottom)
  if (Math.max(xGap, yGap) < 0) return

  if (xGap >= yGap) {
    if (a.left < b.left) target.hit.right = Math.min(target.hit.right, (a.right + b.left) / 2 - HALF_DEAD_ZONE)
    else target.hit.left = Math.max(target.hit.left, (b.right + a.left) / 2 + HALF_DEAD_ZONE)
  } else if (a.top < b.top) {
    target.hit.bottom = Math.min(target.hit.bottom, (a.bottom + b.top) / 2 - HALF_DEAD_ZONE)
  } else {
    target.hit.top = Math.max(target.hit.top, (b.bottom + a.top) / 2 + HALF_DEAD_ZONE)
  }
}

export function createInteractions() {
  const elements = [...document.querySelectorAll<HTMLElement>("[data-gaze-target]")]
  const resize = new ResizeObserver(invalidate)
  elements.forEach(element => resize.observe(element))
  window.addEventListener("scroll", invalidate, { passive: true })
  window.addEventListener("resize", invalidate)

  let targets: Target[] = []
  let dirty = true
  let current: HTMLElement | undefined
  let latch: { element: HTMLElement; exitAt?: number } | undefined
  let dwell = 0
  let lastExit: number | undefined
  let edge = 0
  let edgeSince = 0
  let blockedUntil = 0
  let edgeInterrupted = false

  function invalidate() {
    dirty = true
  }

  function refresh() {
    targets = elements.flatMap(element => {
      const trigger = element.querySelector<HTMLButtonElement>("button[data-gaze-expand]")
      const box = element.getBoundingClientRect()
      if (!trigger || box.width < MIN_SIZE || box.height < MIN_SIZE) return []

      const hit = { left: box.left - HIT_PADDING, right: box.right + HIT_PADDING, top: box.top - HIT_PADDING, bottom: box.bottom + HIT_PADDING }
      const blocked = [...element.querySelectorAll("a[href]:not([data-gaze-card-link]), [data-gaze-exclude], button:not([data-gaze-expand]), input, select, textarea")].map(control => control.getBoundingClientRect())
      return [{ element, trigger, box, hit, blocked }]
    })
    for (const target of targets) {
      for (const other of targets) {
        if (target !== other) separate(target, other)
      }
    }
    dirty = false
  }

  function nearest(point: Point) {
    let candidate: Target | undefined
    let distance = Infinity
    for (const target of targets) {
      if (target.hit.right - target.hit.left < MIN_SIZE || target.hit.bottom - target.hit.top < MIN_SIZE) continue
      if (!contains(target.hit, point) || target.blocked.some(box => box.width > 0 && contains(box, point))) continue
      const x = target.box.left + target.box.width / 2
      const y = target.box.top + target.box.height / 2
      const score = (x - point.x) ** 2 + (y - point.y) ** 2
      if (score < distance) {
        candidate = target
        distance = score
      }
    }
    return candidate
  }

  function clearDwell() {
    current?.removeAttribute("data-gaze-hover")
    current?.style.removeProperty("--gaze-progress")
    current = undefined
    dwell = 0
    lastExit = undefined
  }

  function reset() {
    clearDwell()
    edge = 0
  }

  function interrupt() {
    blockedUntil = performance.now() + 650
    edgeInterrupted = true
    reset()
  }

  function step(point: Point | null, time: number, delta: number, speed: number, canExpand: boolean, canScroll: boolean) {
    if (time < blockedUntil || document.querySelector('[role="dialog"][data-state="open"], [role="listbox"][data-state="open"]')) {
      reset()
      return
    }
    if (dirty) refresh()

    const controls = document.querySelector("[data-gaze-controls]")?.getBoundingClientRect()
    const valid = point && point.x >= 0 && point.x < innerWidth && point.y >= 0 && point.y < innerHeight && !(controls && contains(controls, point))
    const band = valid && canScroll ? point.y < innerHeight * EDGE_FRACTION ? -1 : point.y > innerHeight * (1 - EDGE_FRACTION) ? 1 : 0 : 0
    if (!band && valid) edgeInterrupted = false
    if (latch) {
      const { element } = latch
      const previous = targets.find(target => target.element === element)
      // A blink provides no evidence that the reader looked away from the card.
      if (point && (!previous || !contains(previous.hit, point))) {
        latch.exitAt ??= time
        if (time - latch.exitAt > BLINK) latch = undefined
      } else {
        latch.exitAt = undefined
      }
    }
    const nextEdge = edgeInterrupted ? 0 : band
    if (nextEdge !== edge) {
      edge = nextEdge
      edgeSince = time
    }
    const target = valid && !edge ? nearest(point) : undefined
    if (current && target?.element !== current) lastExit ??= time
    if (lastExit !== undefined && time - lastExit > BLINK) clearDwell()

    if (edge) {
      if (time - edgeSince > EDGE_DWELL) {
        const available = edge < 0 ? window.scrollY : document.documentElement.scrollHeight - innerHeight - window.scrollY
        if (available > 0) window.scrollBy({ top: edge * Math.min(available, 350 * delta / 1000), behavior: "instant" })
      }
      return
    }

    if (!target || (current && target.element !== current)) return
    if (current !== target.element) {
      current = target.element
      current.setAttribute("data-gaze-hover", "")
      delta = 0
    }
    if (lastExit !== undefined) {
      delta = 0
      lastExit = undefined
    }

    if (!canExpand || latch?.element === current || target.trigger.getAttribute("aria-expanded") !== "false") {
      current.style.removeProperty("--gaze-progress")
      dwell = 0
      return
    }

    dwell += delta
    if (dwell >= GRACE) current.style.setProperty("--gaze-progress", String(Math.min(1, (dwell - GRACE) / speed)))
    if (dwell >= GRACE + speed) {
      latch = { element: current }
      current.style.removeProperty("--gaze-progress")
      target.trigger.click()
      invalidate()
    }
  }

  return {
    step, reset, interrupt, invalidate,
    stop() {
      reset()
      resize.disconnect()
      window.removeEventListener("scroll", invalidate)
      window.removeEventListener("resize", invalidate)
    },
  }
}
