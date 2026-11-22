import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { essays } from "@/content/essays"
import { cn } from "@/lib/utils"

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

        <EssayList className="mt-9" />
      </div>
    </section>
  )
}

export function EssayList({ className }: { className: string }) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-2", className)}>
      {essays.map((essay) => {
        const isArticle = essay.type === "Peer-reviewed article"
        const MetaIcon = isArticle ? BookOpenText : Clock3
        return (
          <article key={essay.href}>
            <Card className="editorial-card h-full gap-3">
              <CardHeader className="gap-3">
                <Badge variant="outline" className="text-philosophy">{essay.type}</Badge>
                <h3 className="max-w-lg text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {essay.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{essay.description}</p>
              </CardContent>
              <CardFooter className="mt-auto justify-between gap-2 border-t bg-transparent">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MetaIcon className="size-3.5" aria-hidden="true" /> {essay.readingTimeMinutes === undefined ? "Full article · PDF" : `${essay.readingTimeMinutes} min essay`}
                </span>
                <Button variant="ghost" asChild>
                  <a href={essay.href} aria-label={`Read ${essay.title}`}>
                    Read <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </article>
        )
      })}
    </div>
  )
}
