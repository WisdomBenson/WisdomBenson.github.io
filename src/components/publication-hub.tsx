"use client"

import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  BookMarked,
  Check,
  Copy,
  FileDown,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { publications, type Publication } from "@/content/publications"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "quantum", label: "Quantum & nano" },
  { value: "modeling", label: "Modeling / DFT" },
  { value: "philosophy", label: "Philosophy & ethics" },
] as const

function matchesQuery(publication: Publication, query: string) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true

  const haystack = [
    publication.title,
    publication.authors,
    publication.venue,
    publication.kind,
    ...publication.tags,
  ]
    .join(" ")
    .toLowerCase()

  return tokens.every((token) => haystack.includes(token))
}

export function PublicationHub() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Publication | null>(null)

  const visiblePublications = useMemo(
    () =>
      publications.filter(
        (publication) =>
          (filter === "all" || publication.domain === filter) && matchesQuery(publication, query),
      ),
    [filter, query],
  )

  async function copyBibtex(publication: Publication) {
    await navigator.clipboard.writeText(publication.bibtex)
    toast.success("BibTeX copied", { description: publication.title })
  }

  return (
    <section id="publications" className="section-block border-b">
      <div className="site-shell">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="eyebrow text-quantum">
              <BookMarked className="size-3.5" aria-hidden="true" /> Publication index
            </p>
            <h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Work that moves between evidence and argument.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            Search peer-reviewed articles, a book chapter, and thesis work. Open any record for a concise abstract, verified destination, or reusable citation.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-y py-4 xl:flex-row xl:items-center xl:justify-between">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 xl:w-auto">
              {filters.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="h-9 flex-none rounded-full border px-4 data-active:border-foreground data-active:bg-foreground data-active:text-background"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <label className="relative block w-full xl:max-w-sm">
            <span className="sr-only">Search publications</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, method, or venue"
              className="h-10 rounded-full pl-9"
            />
          </label>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {visiblePublications.length} publication{visiblePublications.length === 1 ? "" : "s"} shown
        </p>

        <div className="divide-y border-b">
          {visiblePublications.map((publication, index) => (
            <article
              key={publication.id}
              className="group grid gap-5 py-7 transition-colors hover:bg-muted/25 sm:px-4 lg:grid-cols-[3.5rem_1fr_15rem] lg:gap-8 lg:py-9"
            >
              <div className="flex items-center justify-between lg:block">
                <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "lg:hidden",
                    publication.domain === "philosophy" ? "text-philosophy" : "text-quantum",
                  )}
                >
                  {publication.year}
                </Badge>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "hidden lg:inline-flex",
                      publication.domain === "philosophy" ? "text-philosophy" : "text-quantum",
                    )}
                  >
                    {publication.year}
                  </Badge>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {publication.kind}
                  </span>
                </div>
                <h3 className="mt-3 max-w-4xl text-balance text-xl font-semibold leading-tight tracking-[-0.035em] sm:text-2xl">
                  {publication.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{publication.authors}</p>
                <p className="text-sm leading-6 text-muted-foreground">{publication.venue}</p>

                <Accordion type="single" collapsible className="mt-4 max-w-3xl">
                  <AccordionItem value={`${publication.id}-abstract`} className="border-none">
                    <AccordionTrigger className="w-fit gap-2 py-2 text-xs uppercase tracking-[0.11em] text-muted-foreground hover:text-foreground hover:no-underline">
                      Abstract note
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl pb-1 leading-6 text-muted-foreground">
                      {publication.abstract}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="flex flex-wrap content-start gap-2 lg:justify-end">
                <Button variant="outline" size="sm" asChild>
                  <a href={publication.href} target="_blank" rel="noreferrer">
                    {publication.doi ? "DOI" : "Record"} <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                  </a>
                </Button>
                {publication.pdf ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={publication.pdf} target="_blank" rel="noreferrer">
                      {publication.pdfLabel ?? "PDF"} <FileDown data-icon="inline-end" aria-hidden="true" />
                    </a>
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" asChild>
                  <a href={publication.scholar} target="_blank" rel="noreferrer">Scholar</a>
                </Button>
                {publication.philPeople ? (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={publication.philPeople} target="_blank" rel="noreferrer">PhilPeople</a>
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={() => setSelected(publication)}>
                  <Copy data-icon="inline-start" aria-hidden="true" /> BibTeX
                </Button>
              </div>
            </article>
          ))}
        </div>

        {visiblePublications.length === 0 ? (
          <div className="grid min-h-56 place-items-center border-b text-center">
            <div>
              <Sparkles className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 font-medium">No matching records</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a broader topic, method, or venue.</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Two new manuscripts are awaiting editorial decisions.</p>
            <p className="mt-1 text-sm text-muted-foreground">Details will be added when their status can be reported accurately.</p>
          </div>
          <Badge variant="secondary" className="h-7">Under review · 02</Badge>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>BibTeX citation</DialogTitle>
            <DialogDescription>{selected?.title}</DialogDescription>
          </DialogHeader>
          <pre className="max-h-[55vh] overflow-auto rounded-lg border bg-muted p-4 font-mono text-xs leading-6">
            <code>{selected?.bibtex}</code>
          </pre>
          <DialogFooter>
            <Button
              onClick={() => selected && copyBibtex(selected)}
              disabled={!selected}
              className="min-h-10"
            >
              <Check data-icon="inline-start" aria-hidden="true" /> Copy BibTeX
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
