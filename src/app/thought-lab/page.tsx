import type { Metadata } from "next"

import { EssayList } from "@/components/thought-lab"

export const metadata: Metadata = {
  title: "Philosophy & Essays",
  description: "Essays and published work by Wisdom Benson on metaphysics, commitment, scientific models, and AI in the workplace.",
}

export default function ThoughtLabIndexPage() {
  return (
    <main id="main-content" className="site-shell section-block">
      <div className="editorial-panel p-6 sm:p-10 lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Philosophy &amp; Essays</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Essays and published work on value, agency, scientific models, and the future of work.
        </p>
        <h2 className="sr-only">Essays and articles</h2>
        <EssayList className="mt-9" />
      </div>
    </main>
  )
}
