"use client"

import { useEffect, useRef } from "react"

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !element.animate || !("IntersectionObserver" in window)) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const linkedSection = document.getElementById(window.location.hash.slice(1))
    if (
      reducedMotion.matches ||
      linkedSection?.contains(element) ||
      element.getBoundingClientRect().top < window.innerHeight
    ) return

    let animation: Animation | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      observer.disconnect()
      if (reducedMotion.matches || element.matches(":focus-within")) return

      animation = element.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 550, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      )
    })

    function stop() {
      observer.disconnect()
      animation?.cancel()
    }

    observer.observe(element)
    element.addEventListener("focusin", stop)
    reducedMotion.addEventListener("change", stop)
    window.addEventListener("pagehide", stop)

    return () => {
      stop()
      element.removeEventListener("focusin", stop)
      reducedMotion.removeEventListener("change", stop)
      window.removeEventListener("pagehide", stop)
    }
  }, [])

  return <div ref={ref} className={className} data-slot="reveal">{children}</div>
}
