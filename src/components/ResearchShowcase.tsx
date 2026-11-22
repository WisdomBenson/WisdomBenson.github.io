import Image from "next/image"

import { FigureZoom } from "@/components/figure-zoom"
import { Reveal } from "@/components/reveal"

const evidenceFigures = [
  {
    plate: "Plate 01",
    title: "ZnO Quantum Dot Coordinate Map & Orbital Passivation Model",
    src: "/assets/zno-qd-coordinate-map-1400.webp",
    height: 1572,
    alt: "Four-panel coordinate map comparing hydroxyl- and acetate-passivated zinc oxide quantum dots",
    caption:
      "xy-projected coordinate indexing for ligand-passivated ZnO quantum dots under OH-low, OH-high, acetate-low, and acetate-high surface models. Dashed guides mark schematic row and column indices; selected labels report indices derived from the SCF coordinates.",
  },
  {
    plate: "Plate 02",
    title: "Raman Spectrum under 488 nm Excitation",
    src: "/assets/raman-spectrum-488nm-rt-1400.webp",
    height: 955,
    alt: "Raman spectrum of zinc oxide quantum dots under 488 nanometer excitation, plotted as intensity against Raman shift",
    caption:
      "Raman intensity in arbitrary units for ZnO quantum dots under 488 nm excitation. The plotted range extends to 1,200 cm⁻¹.",
  },
] as const

export function ResearchShowcase() {
  return (
    <section id="research" className="surface-band section-block">
      <div className="site-shell">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Research Overview</p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.015em] text-foreground sm:text-5xl">
              Evidence from finite structures and measured spectra
            </h2>
          </div>
          <p className="max-w-[56ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            The research combines electronic-structure calculations for finite ZnO systems with Raman and optical measurements, while related work examines composition-dependent response in lead–tin alloy perovskites.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {evidenceFigures.map((figure, index) => (
            <Reveal key={figure.plate} className="min-w-0" delay={index * 0.08}>
              <figure
                data-slot="evidence-figure"
                className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-[0_12px_36px_-22px_rgba(28,27,24,0.14)] sm:p-5"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card">
                  <Image
                    src={figure.src}
                    alt={figure.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-contain p-2 sm:p-3"
                  />
                </div>
                <figcaption className="mt-5 flex flex-1 flex-col border-t border-border/60 px-1 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-quantum">
                      {figure.plate}
                    </span>
                    <FigureZoom src={figure.src} alt={figure.alt} title={figure.title} height={figure.height} />
                  </div>
                  <h3 className="mt-2.5 font-serif text-xl font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-2xl">
                    {figure.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{figure.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
