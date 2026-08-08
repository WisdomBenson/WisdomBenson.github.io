"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Info, Orbit, Waves } from "lucide-react"
import { useTheme } from "next-themes"

import { MathExpression } from "@/components/math-expression"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function QuantumVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [radius, setRadius] = useState(2.6)
  const [passivation, setPassivation] = useState(72)
  const { resolvedTheme } = useTheme()

  const bandGap = useMemo(
    () => 3.37 + 1.15 / radius ** 2 - (0.28 * (100 - passivation)) / (100 * radius),
    [radius, passivation],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let animationFrame = 0

    const draw = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.floor(bounds.width * pixelRatio))
      const height = Math.max(1, Math.floor(bounds.height * pixelRatio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, bounds.width, bounds.height)

      const quantum = readToken("--quantum")
      const philosophy = readToken("--philosophy")
      const foreground = readToken("--foreground")
      const muted = readToken("--muted-foreground")
      const centerX = bounds.width * 0.5
      const centerY = bounds.height * 0.48
      const visualRadius = Math.min(bounds.width, bounds.height) * (0.17 + radius * 0.02)
      const phase = reduceMotion ? 0 : frame * 0.006

      context.save()
      context.globalAlpha = 0.18
      context.strokeStyle = muted
      context.lineWidth = 1
      for (let ring = 1; ring <= 4; ring += 1) {
        context.beginPath()
        context.arc(centerX, centerY, visualRadius * (ring / 4), 0, Math.PI * 2)
        context.stroke()
      }
      context.restore()

      const atomCount = Math.round(18 + radius * 6)
      for (let index = 0; index < atomCount; index += 1) {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5))
        const normalized = Math.sqrt((index + 0.5) / atomCount)
        const angle = index * goldenAngle + phase * (index % 3 === 0 ? 1 : -0.35)
        const x = centerX + Math.cos(angle) * visualRadius * normalized
        const y = centerY + Math.sin(angle) * visualRadius * normalized
        const isSurface = normalized > 0.78
        const particleRadius = isSurface ? 3.2 : 4.2

        context.beginPath()
        context.arc(x, y, particleRadius, 0, Math.PI * 2)
        context.fillStyle = index % 2 === 0 ? quantum : philosophy
        context.globalAlpha = isSurface ? 0.62 + passivation / 260 : 0.9
        context.fill()
      }

      context.globalAlpha = 1
      context.fillStyle = foreground
      context.font = "600 12px 'JetBrains Mono Variable', monospace"
      context.textAlign = "center"
      context.fillText(`r = ${radius.toFixed(1)} nm`, centerX, bounds.height - 26)

      if (!reduceMotion) {
        frame += 1
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    draw()
    const resizeObserver = new ResizeObserver(draw)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [radius, passivation, resolvedTheme])

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <p className="eyebrow text-quantum">
            <Orbit className="size-3.5" aria-hidden="true" /> Conceptual canvas
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Quantum-confinement sandbox</h3>
        </div>
        <Badge variant="outline" className="font-mono text-quantum">Interactive</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
        <div className="relative min-h-[22rem] border-b bg-muted/30 lg:border-b-0 lg:border-r">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            aria-label={`Conceptual zinc oxide quantum dot with radius ${radius.toFixed(1)} nanometers and ${passivation} percent passivation`}
          />
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] backdrop-blur">
            <Waves className="size-3 text-quantum" aria-hidden="true" /> ZnO finite cluster
          </div>
        </div>

        <div className="flex flex-col justify-between gap-7 p-5 sm:p-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Estimated optical gap</p>
            <p className="mt-2 font-mono text-4xl font-semibold tracking-[-0.06em] text-quantum">
              {bandGap.toFixed(2)} <span className="text-base text-muted-foreground">eV</span>
            </p>
            <div className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 text-sm">
              <MathExpression expression={String.raw`E_g(r)=E_{g,\mathrm{bulk}}+\frac{A}{r^2}-\frac{B(1-P)}{r}`} />
            </div>
          </div>

          <div className="space-y-7">
            <label className="block">
              <span className="flex items-center justify-between text-sm font-medium">
                Nanoparticle radius <span className="font-mono text-xs text-muted-foreground">{radius.toFixed(1)} nm</span>
              </span>
              <Slider
                className="mt-4"
                min={1.2}
                max={5}
                step={0.1}
                value={[radius]}
                onValueChange={(value) => setRadius(value[0])}
                aria-label="Nanoparticle radius in nanometers"
              />
            </label>

            <label className="block">
              <span className="flex items-center justify-between text-sm font-medium">
                Surface passivation <span className="font-mono text-xs text-muted-foreground">{passivation}%</span>
              </span>
              <Slider
                className="mt-4"
                min={0}
                max={100}
                step={1}
                value={[passivation]}
                onValueChange={(value) => setPassivation(value[0])}
                aria-label="Surface passivation percentage"
              />
            </label>
          </div>

          <p className="flex gap-2 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            This is a conceptual Brus-style visualization for intuition, not a reported DFT or GW calculation.
          </p>
        </div>
      </div>
    </div>
  )
}
