"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, BookOpenText, Copy, Search, SearchX } from "lucide-react"
import { toast } from "sonner"

import { BibTeXModal } from "@/components/BibTeXModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  publicationCounts,
  publications,
  type Publication,
  type PublicationCategory,
} from "@/data/publications"

type FilterValue = "all" | PublicationCategory

const filters: readonly { value: FilterValue; label: string; count: number }[] = [
  { value: "all", label: "All", count: publicationCounts.all },
  {
    value: "journal-articles",
    label: "Journal Articles",
    count: publicationCounts["journal-articles"],
  },
  {
    value: "conference-posters",
    label: "Conference Posters",
    count: publicationCounts["conference-posters"],
  },
  {
    value: "book-chapters-thesis",
    label: "Book Chapters & Thesis",
    count: publicationCounts["book-chapters-thesis"],
  },
]

function matchesSearch(publication: Publication, query: string) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true

  const searchableText = [
    publication.title,
    ...publication.authors,
    publication.venue,
    publication.doi ?? "",
    ...publication.keywords,
  ]
    .join(" ")
    .toLocaleLowerCase()

  return terms.every((term) => searchableText.includes(term))
}

function AuthorList({ authors }: { authors: readonly string[] }) {
  return (
    <p className="mt-3 text-sm leading-6 text-muted-foreground">
      {authors.map((author, index) => {
        const isWisdomBenson = author === "W. Benson" || author === "W. H. Benson"
        const punctuation = index === authors.length - 1 ? "" : index === authors.length - 2 ? " & " : ", "

        return (
          <span key={`${author}-${index}`}>
            {isWisdomBenson ? <strong className="font-semibold text-foreground">{author}</strong> : author}
            {punctuation}
          </span>
        )
      })}
    </p>
  )
}

type PublicationListProps = {
  items: readonly Publication[]
  onCite: (publication: Publication) => void
  onCopyDoi: (publication: Publication) => void
}

function PublicationList({ items, onCite, onCopyDoi }: PublicationListProps) {
  const reduceMotion = useReducedMotion()

  if (items.length === 0) {
    return (
      <Empty className="min-h-64 border-b">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No matching publications</EmptyTitle>
          <EmptyDescription>Try a title, co-author, DOI, venue, or broader keyword.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ol className="divide-y border-b">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((publication, index) => (
          <motion.li
            layout
            key={publication.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="grid gap-5 py-8 lg:grid-cols-[3.5rem_1fr_auto] lg:gap-8"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>

            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{publication.type}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{publication.year}</span>
              </div>
              <h3 className="mt-4 max-w-4xl text-balance text-xl font-semibold leading-tight tracking-[-0.03em] sm:text-2xl">
                {publication.title}
              </h3>
              <AuthorList authors={publication.authors} />
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{publication.venue}</p>

              {publication.doi ? (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <a
                    href={publication.recordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-mono text-xs text-quantum underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {publication.doi}
                  </a>
                  <Button variant="ghost" size="xs" onClick={() => onCopyDoi(publication)}>
                    <Copy data-icon="inline-start" aria-hidden="true" />
                    Copy DOI
                  </Button>
                </div>
              ) : (
                <a
                  href={publication.recordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-quantum hover:text-foreground"
                >
                  Thesis record
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              )}
            </article>

            <div className="lg:pt-1">
              <Button variant="outline" size="sm" onClick={() => onCite(publication)}>
                <BookOpenText data-icon="inline-start" aria-hidden="true" />
                Cite / BibTeX
              </Button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  )
}

export function PublicationHub() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")
  const [query, setQuery] = useState("")
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const deferredQuery = useDeferredValue(query)

  const searchResults = useMemo(
    () => publications.filter((publication) => matchesSearch(publication, deferredQuery)),
    [deferredQuery],
  )

  function recordsFor(filter: FilterValue) {
    if (filter === "all") return searchResults
    return searchResults.filter((publication) => publication.category === filter)
  }

  async function copyDoi(publication: Publication) {
    if (!publication.doi) return

    try {
      await navigator.clipboard.writeText(publication.doi)
      toast.success("DOI copied", { description: publication.doi })
    } catch {
      toast.error("DOI could not be copied")
    }
  }

  const activeCount = recordsFor(activeFilter).length

  return (
    <section id="publications" className="section-block border-b">
      <div className="site-shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Publications &amp; Posters</p>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Research and scholarship
            </h2>
          </div>
          <p className="max-w-[65ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Seven records across condensed matter physics, computational modeling, materials research, and philosophical metaphysics.
          </p>
        </div>

        <Tabs
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value as FilterValue)}
          className="mt-10"
        >
          <div className="grid gap-5 border-y py-5 xl:grid-cols-[1fr_22rem] xl:items-end">
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-x-5 gap-y-2">
              {filters.map((filter) => (
                <TabsTrigger key={filter.value} value={filter.value} className="h-9 flex-none px-0">
                  {filter.label}
                  <span className="font-mono text-[0.68rem] text-muted-foreground">({filter.count})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <label className="grid gap-2">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                Search records
              </span>
              <span className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Title, author, DOI, or keyword"
                  className="pl-9"
                  type="search"
                />
              </span>
            </label>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {activeCount} record{activeCount === 1 ? "" : "s"} shown
          </p>

          {filters.map((filter) => (
            <TabsContent key={filter.value} value={filter.value}>
              <PublicationList
                items={recordsFor(filter.value)}
                onCite={setSelectedPublication}
                onCopyDoi={copyDoi}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BibTeXModal
        publication={selectedPublication}
        open={selectedPublication !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPublication(null)
        }}
      />
    </section>
  )
}
