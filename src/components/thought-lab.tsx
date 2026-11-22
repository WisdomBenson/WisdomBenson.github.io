import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const essays = [
  {
    type: "Peer-reviewed article",
    title: "Romantic exclusivity as structural necessity",
    description: "The original article in Philosophies 10(5), 102 (2025): a Kantian–Scheler–Schopenhauer synthesis of romantic exclusivity.",
    meta: "Full article · PDF",
    href: "/assets/articles/philosophies-10-00102.pdf",
  },
  {
    type: "Essay",
    title: "What a model leaves out: From quantum dots to the future of work",
    description: "Controlling a physical system differs fundamentally from understanding it.",
    meta: "3 min essay",
    href: "/thought-lab/model-and-meaning/",
  },
  {
    type: "Essay",
    title: "AI in our workplace",
    description: "An argument for giving workers AI tools and keeping them connected to the value they help create.",
    meta: "2 min essay",
    href: "/thought-lab/ai-in-our-workplace/",
  },
  {
    type: "Essay",
    title: "AI utopia or dystopia? The answer will be written in employment contracts",
    description: "How employment contracts, access to AI tools, and institutional incentives shape the future of work.",
    meta: "7 min essay",
    href: "/thought-lab/ai-utopia-or-dystopia/",
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
                  <MetaIcon className="size-3.5" aria-hidden="true" /> {essay.meta}
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
