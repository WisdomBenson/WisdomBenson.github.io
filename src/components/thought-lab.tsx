import { ArrowUpRight, BookOpenText, Clock3, FileText, Scale } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const essays = [
  {
    type: "Published essay",
    title: "Romantic exclusivity as structural necessity",
    description: "A reading path through Kantian respect, Schelerian value, and Schopenhauerian metaphysics—and the pressure each places on exclusivity.",
    meta: "8 min essay guide",
    href: "/thought-lab/romantic-exclusivity/",
    icon: Scale,
  },
  {
    type: "Research note",
    title: "What a model leaves out",
    description: "A short inquiry into abstraction, explanatory success, and the difference between controlling a system and understanding it.",
    meta: "5 min note",
    href: "/thought-lab/model-and-meaning/",
    icon: FileText,
  },
]

export function ThoughtLab() {
  return (
    <section id="philosophy" className="section-block">
      <div className="editorial-panel site-shell p-6 sm:p-10 lg:p-12">
        <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow text-philosophy">
              <BookOpenText className="size-3.5" aria-hidden="true" /> Philosophy &amp; Essays
            </p>
            <h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Value, agency, and metaphysical structure
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            The philosophical work asks what our concepts commit us to: in love, value, agency, and the explanations we accept as complete.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 lg:grid-cols-2">
          {essays.map((essay, index) => {
            const Icon = essay.icon
            return (
              <Reveal key={essay.title} delay={index * 0.07}>
                <article className="editorial-card group flex min-h-[25rem] flex-col overflow-hidden p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-philosophy-muted text-philosophy">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <Badge variant="outline" className="text-philosophy">{essay.type}</Badge>
                  </div>
                  <h3 className="mt-16 max-w-lg text-balance text-3xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl">
                    {essay.title}
                  </h3>
                  <p className="mt-5 max-w-xl flex-1 text-base leading-7 text-muted-foreground">{essay.description}</p>
                  <div className="mt-8 flex items-center justify-between border-t pt-5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" aria-hidden="true" /> {essay.meta}
                    </span>
                    <Button variant="ghost" asChild>
                      <a href={essay.href}>
                        Read <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
