import type { Metadata } from "next"
import Link from "next/link"

import { GazeLab } from "./gaze-lab"
import { SampleCard } from "./sample-card"
import "./gaze-lab.css"

export const metadata: Metadata = {
  title: "Gaze Lab",
  description: "An on-device experiment in gaze-assisted reading.",
}

export default function GazeLabPage() {
  return (
    <main id="main-content" data-gaze-lab="" className="site-shell pb-24 pt-12 sm:pt-16">
      <Link href="/thought-lab/" prefetch={false} className="mb-8 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        ← Thought Lab
      </Link>
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-normal tracking-tight sm:text-6xl">Gaze-assisted reading</h1>
        <p className="mt-4 max-w-[56ch] text-base leading-7 text-muted-foreground">
          Try scrolling and opening reading cards with your eyes. The lab uses a webcam to estimate where you look.
        </p>
        <GazeLab />
      </header>

      <section aria-labelledby="sandbox-title" className="mt-20 border-t border-border pt-8 sm:mt-24">
        <h2 id="sandbox-title" className="font-serif text-3xl">Reading sandbox</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Look at a card to highlight it. With dwell enabled, hold your gaze to open its notes. You can also open each card with its button.
        </p>
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-[100px]">
          <SampleCard label="Plate 01" title="Reading a coordinate map" summary="A projected map can make a finite structure easier to compare.">
            Follow the dashed guides to locate the labeled coordinates before comparing the panels.
          </SampleCard>
          <SampleCard label="Plate 02" title="Reading a Raman spectrum" summary="Peak position and peak intensity answer different questions about a spectrum.">
            Read the horizontal axis for Raman shift and the vertical axis for relative intensity.
          </SampleCard>
          <SampleCard label="Essay excerpt" title="What a model leaves out" summary="The choices that make a model tractable also limit the questions it can answer.">
            The essay moves from the assumptions of a quantum-dot model to the effects those assumptions can have when people use models at work.
          </SampleCard>
          <SampleCard label="Essay excerpt" title="AI in our workplace" summary="The benefits of AI at work depend on who gains access to the tools and who shares in the value.">
            The essay asks how employers can give workers access to AI while keeping them connected to the value they help create.
          </SampleCard>
        </div>
      </section>
    </main>
  )
}
