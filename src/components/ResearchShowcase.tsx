import Image from "next/image"

import { Reveal } from "@/components/reveal"

const evidenceFigures = [
  {
    plate: "Plate 01",
    title: "ZnO Quantum Dot Coordinate Map & Orbital Passivation Model",
    src: "/assets/zno-qd-coordinate-map-1400.webp",
    alt: "Four-panel coordinate map comparing hydroxyl- and acetate-passivated zinc oxide quantum dots",
    caption:
      "xy-projected coordinate indexing for ligand-passivated ZnO quantum dots under OH-low, OH-high, acetate-low, and acetate-high surface models. Dashed guides mark schematic row and column indices; selected labels report indices derived from the SCF coordinates.",
  },
  {
    plate: "Plate 02",
    title: "Room-Temperature Raman Spectrum under 488 nm Excitation",
    src: "/assets/raman-spectrum-488nm-rt-1400.webp",
    alt: "Raman spectrum of zinc oxide quantum dot sample 7B measured at room temperature using 488 nanometer excitation",
    caption:
      "Measured Raman intensity for ZnO QD 7B from approximately 80 to 1200 cm⁻¹ under 488 nm excitation at room temperature. The plotted trace is presented without assigning vibrational modes beyond the information contained in the source figure.",
  },
] as const

export function ResearchShowcase() {
  return (
    <section id="research" className="section-block border-b">
      <div className="site-shell">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Research Overview</p>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Evidence from finite structures and measured spectra
            </h2>
          </div>
          <p className="max-w-[65ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            The research combines electronic-structure calculations for finite ZnO systems with Raman and optical measurements, while related work examines composition-dependent response in lead–tin alloy perovskites.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {evidenceFigures.map((figure, index) => (
            <Reveal key={figure.plate} delay={index * 0.08}>
              <figure data-slot="evidence-figure" className="border-t pt-4">
                <div className="relative aspect-[7/6] overflow-hidden border bg-card">
                  <Image
                    src={figure.src}
                    alt={figure.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>
                <figcaption className="grid gap-3 border-b py-5 sm:grid-cols-[6rem_1fr]">
                  <span className="font-mono text-xs text-quantum">{figure.plate}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.025em]">{figure.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{figure.caption}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
