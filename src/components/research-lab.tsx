import { ArrowUpRight, Atom, Cpu, Microscope } from "lucide-react"
import Image from "next/image"

import { QuantumVisualizer } from "@/components/quantum-visualizer"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"

const focusAreas = [
  {
    icon: Cpu,
    index: "01",
    title: "Finite-system electronic structure",
    description: "DFT, DFPT, and PDEP-GW workflows for frontier levels, surface states, phonons, and size-dependent response.",
    tags: ["Quantum ESPRESSO", "WEST", "HPC"],
  },
  {
    icon: Microscope,
    index: "02",
    title: "Spectroscopy as a constraint",
    description: "Raman and optical measurements used to test assignments, expose heating effects, and connect computation to experiment.",
    tags: ["Raman", "488 nm", "Optical response"],
  },
  {
    icon: Atom,
    index: "03",
    title: "Materials by composition",
    description: "Mixed-cation tin-lead perovskites engineered for near-infrared tunability and improved storage stability.",
    tags: ["Perovskites", "Thin films", "Near-IR"],
  },
]

export function ResearchLab() {
  return (
    <section id="research" className="section-block border-b">
      <div className="site-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow text-quantum">Research program</p>
            <h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Surface, size, and the physics between them.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            The central question is practical and fundamental: when a material becomes finite, which properties remain bulk-like—and which are rewritten by its surface?
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {focusAreas.map((area, index) => {
            const Icon = area.icon
            return (
              <Reveal key={area.title} delay={index * 0.06}>
                <article className="flex h-full min-h-72 flex-col rounded-2xl border bg-card p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-quantum-muted text-quantum">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{area.index}</span>
                  </div>
                  <h3 className="mt-9 text-xl font-semibold tracking-[-0.035em]">{area.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{area.description}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {area.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-3">
          <QuantumVisualizer />
        </Reveal>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Reveal>
            <figure className="group relative min-h-[24rem] overflow-hidden rounded-2xl border bg-card">
              <Image
                src="/assets/zno-qd-coordinate-map-1400.webp"
                alt="Coordinate map of a passivated zinc oxide quantum dot"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6 pt-24">
                <p className="eyebrow text-quantum">Structure plate</p>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">Passivated ZnO lattice, orbital shell, and surface sites.</p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.06}>
            <figure className="group relative min-h-[24rem] overflow-hidden rounded-2xl border bg-card">
              <Image
                src="/assets/raman-spectrum-488nm-rt-1400.webp"
                alt="Room-temperature Raman spectrum of ZnO quantum dots measured with 488 nanometer excitation"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 transition duration-700 group-hover:scale-[1.015]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/92 to-transparent p-6 pt-20">
                <p className="eyebrow text-quantum">Evidence plate</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  ZnO QD 7B · 488 nm excitation · room temperature
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
