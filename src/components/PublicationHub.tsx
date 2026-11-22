"use client"

import { useDeferredValue, useMemo, useRef, useState } from "react"
import { ArrowUpRight, BookOpenText, Copy, Search, SearchX } from "lucide-react"
import { toast } from "sonner"

import { BibTeXModal } from "@/components/BibTeXModal"
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

const publicationsByYear = [...publications].sort((first, second) => second.year - first.year)

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
    <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
      {authors.map((author, index) => {
        const isWisdomBenson = author === "W. H. Benson"
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
  onCite: (publication: Publication, trigger: HTMLButtonElement) => void
  onCopyDoi: (publication: Publication) => void
}

function PublicationList({ items, onCite, onCopyDoi }: PublicationListProps) {
  if (items.length === 0) {
    return (
      <Empty className="mt-6 min-h-56 rounded-2xl border border-dashed border-border/90 bg-card/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No matching publications</EmptyTitle>
          <EmptyDescription>Search by title, author, DOI, journal, conference, or keyword.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ol className="divide-y divide-border/80 border-b border-border/80">
      {items.map((publication, index) => (
        <li
          key={publication.id}
          className="grid w-full min-w-0 gap-y-1.5 py-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-2 sm:py-7 lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-x-8"
        >
          <div className="flex items-baseline gap-2.5 pt-1 font-mono text-xs text-muted-foreground sm:flex-col sm:gap-1">
            <span className="font-medium text-foreground">{publication.year}</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>

          <article className="min-w-0">
            <p className="text-[0.68rem] uppercase tracking-[0.13em] text-quantum">
              {publication.type}
            </p>
            <h3 className="mt-2 max-w-4xl text-balance font-serif text-xl font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-[1.45rem]">
              <a
                href={publication.recordUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                {publication.title}
              </a>
            </h3>
            <AuthorList authors={publication.authors} />
            <p className="mt-0.5 text-sm italic leading-6 text-muted-foreground">{publication.venue}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              {publication.doi ? (
                <>
                  <a
                    href={publication.recordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 break-all text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    {publication.doi}
                    <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onCopyDoi(publication)}
                    className="inline-flex items-center gap-1.5 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                    Copy DOI
                  </button>
                </>
              ) : (
                <a
                  href={publication.recordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  Thesis record
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              )}

              <button
                type="button"
                onClick={(event) => onCite(publication, event.currentTarget)}
                className="inline-flex items-center gap-1.5 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BookOpenText className="size-3.5" aria-hidden="true" />
                Cite / BibTeX
              </button>
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}

export function PublicationHub() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")
  const [query, setQuery] = useState("")
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const citationTrigger = useRef<HTMLButtonElement>(null)
  const deferredQuery = useDeferredValue(query)

  const searchResults = useMemo(
    () => publicationsByYear.filter((publication) => matchesSearch(publication, deferredQuery)),
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
      toast.error("Cannot copy the DOI. Select the DOI link to open the record.")
    }
  }

  const activeCount = recordsFor(activeFilter).length

  return (
    <section id="publications" className="section-block">
      <div className="site-shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Publications &amp; Posters</p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.015em] text-foreground sm:text-5xl">
              Selected publications and posters
            </h2>
          </div>
          <p className="max-w-[56ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Seven records across condensed matter physics, computational modeling, materials research, and philosophical metaphysics.
          </p>
        </div>

        <Tabs
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value as FilterValue)}
          className="mt-10 flex-col"
        >
          <div className="grid gap-5 border-b border-border/80 pb-4 xl:grid-cols-[1fr_20rem] xl:items-end">
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-x-3 gap-y-2 p-0 max-[360px]:gap-x-2 sm:gap-x-6">
              {filters.map((filter) => (
                <TabsTrigger
                  key={filter.value}
                  value={filter.value}
                  className="h-10 flex-none rounded-none border-0 px-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:inset-x-0 max-[360px]:gap-1 max-[360px]:text-xs data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:opacity-100"
                >
                  {filter.label}
                  <span className="text-[0.7rem]">({filter.count})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <label className="relative block">
              <span className="sr-only">Search publications</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, author, DOI, keyword..."
                className="h-10 rounded-full border-border/90 bg-card pl-9 text-sm shadow-none focus-visible:border-primary"
                type="search"
              />
            </label>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {activeCount} record{activeCount === 1 ? "" : "s"} shown
          </p>

          {filters.map((filter) => (
            <TabsContent key={filter.value} value={filter.value} className="mt-0">
              <PublicationList
                items={recordsFor(filter.value)}
                onCite={(publication, trigger) => {
                  citationTrigger.current = trigger
                  setSelectedPublication(publication)
                }}
                onCopyDoi={copyDoi}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BibTeXModal
        publication={selectedPublication}
        open={selectedPublication !== null}
        onCloseAutoFocus={(event) => {
          if (citationTrigger.current?.isConnected) {
            event.preventDefault()
            citationTrigger.current.focus()
          }
        }}
        onOpenChange={(open) => {
          if (!open) setSelectedPublication(null)
        }}
      />
    </section>
  )
}
