import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { EssayList } from "@/components/thought-lab"

export const metadata: Metadata = {
  title: "Philosophy & Essays",
  description: "Essays and published work by Wisdom Benson on metaphysics, commitment, scientific models, and AI in the workplace.",
}

export default function ThoughtLabIndexPage() {
  return (
    <main id="main-content" className="site-shell pb-20 pt-12 sm:pb-28 sm:pt-16">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Home
      </Link>
      <div className="max-w-2xl">
        <p className="eyebrow text-philosophy">Philosophy &amp; Essays</p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl">
          Essays and published work
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Writing on value, agency, scientific models, and the future of work.
        </p>
      </div>
      <h2 className="sr-only">Essays and articles</h2>
      <EssayList className="mt-12" />
    </main>
  )
}
