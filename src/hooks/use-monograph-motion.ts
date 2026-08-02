import { useEffect } from "react"

export function useMonographMotion(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const scope = document.querySelector<HTMLElement>("#main-content")
    if (!scope) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const revealElements = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"))
    const ambientElements = Array.from(scope.querySelectorAll<HTMLElement>("[data-ambient]"))

    const revealAll = () => {
      revealElements.forEach((element) => element.setAttribute("data-visible", "true"))
    }

    const applyMotionPreference = () => {
      document.documentElement.dataset.motion = motionPreference.matches ? "reduced" : "full"
      if (motionPreference.matches) revealAll()
    }

    applyMotionPreference()
    motionPreference.addEventListener("change", applyMotionPreference)

    if (!("IntersectionObserver" in window)) {
      revealAll()
      return () => motionPreference.removeEventListener("change", applyMotionPreference)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute("data-visible", "true")
          revealObserver.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    )

    const ambientObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.toggleAttribute("data-motion-active", entry.isIntersecting && !document.hidden)
        })
      },
      { threshold: 0.05 },
    )

    const syncVisibility = () => {
      ambientElements.forEach((element) => {
        const bounds = element.getBoundingClientRect()
        const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight
        element.toggleAttribute("data-motion-active", !document.hidden && isVisible)
      })
    }

    revealElements.forEach((element) => revealObserver.observe(element))
    ambientElements.forEach((element) => ambientObserver.observe(element))
    document.addEventListener("visibilitychange", syncVisibility)

    return () => {
      revealObserver.disconnect()
      ambientObserver.disconnect()
      motionPreference.removeEventListener("change", applyMotionPreference)
      document.removeEventListener("visibilitychange", syncVisibility)
    }
  }, [enabled])
}
