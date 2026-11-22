import { ArrowRight, ArrowUpRight, BookOpenText } from "lucide-react"

import { CardDetails } from "@/components/gaze/card-details"
import { Reveal } from "@/components/reveal"
import { essays } from "@/content/essays"
import { cn } from "@/lib/utils"

export function ThoughtLab() {
  return (
    <section id="philosophy" className="surface-band section-block">
      <div className="site-shell">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-philosophy">
              <BookOpenText className="size-3.5" aria-hidden="true" /> Philosophy &amp; Essays
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.015em] text-foreground sm:text-5xl">
              Value, agency, and metaphysical structure
            </h2>
          </div>
          <p className="max-w-[56ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            The philosophical work asks what our concepts commit us to: in love, value, agency, and the explanations we accept as complete.
          </p>
        </Reveal>

        <EssayList className="mt-12" />
      </div>
    </section>
  )
}

export function EssayList({ className }: { className?: string }) {
  return (
    <div data-gaze-grid="" className={cn("grid gap-4 sm:gap-6 lg:grid-cols-2", className)}>
      {essays.map((essay) => {
        const isPdf = essay.readingTimeMinutes === undefined
        const metaLabel = isPdf
          ? `${essay.type} · PDF`
          : `${essay.type} · ${essay.readingTimeMinutes} min read`

        return (
          <article
            key={essay.href}
            data-gaze-target=""
            className="flex h-full min-w-0 flex-col rounded-2xl bg-card/90 shadow-[0_8px_28px_-20px_rgba(28,27,24,0.12)] transition-[background-color,box-shadow] hover:bg-card hover:shadow-[0_18px_40px_-22px_rgba(28,27,24,0.18)]"
          >
            <a
              data-gaze-card-link=""
              href={essay.href}
              className="group flex flex-1 flex-col rounded-2xl p-5 pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8 sm:pb-4"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.13em] text-philosophy">
                {metaLabel}
              </p>
              <h3 data-gaze-exclude="" className="mt-3.5 font-serif text-[1.35rem] font-medium leading-snug tracking-[-0.015em] text-foreground transition-colors group-hover:text-primary sm:text-[1.7rem]">
                {essay.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">
                {essay.description}
              </p>
              <span data-gaze-exclude="" className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-primary">
                {isPdf ? "Read article" : "Read essay"}
                {isPdf ? (
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </span>
            </a>
            <div className="px-5 pb-3 sm:px-8 sm:pb-4">
              <CardDetails label="Reading notes">{essay.note}</CardDetails>
            </div>
          </article>
        )
      })}
    </div>
  )
}
