"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, BookOpenText, Copy, Share2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { essays } from "@/content/essays"
import { profile } from "@/content/profile"

type TocItem = { id: string; label: string; level: 2 | 3 }

export function ArticleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const canonicalPath = pathname.endsWith("/") ? pathname : pathname + "/"
  const readingTimeMinutes = essays.find((essay) => essay.href === canonicalPath)?.readingTimeMinutes
  const articleRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3"))
    const requestedId = window.location.hash.slice(1)
    const items = headings.map((heading, index) => {
      const needsId = !heading.id
      const id = heading.id || `section-${index + 1}`
      heading.id = id
      // Static HTML cannot scroll to a fragment whose ID is assigned here.
      if (needsId && id === requestedId) heading.scrollIntoView({ behavior: "instant" })
      return {
        id,
        label: heading.textContent || `Section ${index + 1}`,
        level: heading.tagName === "H2" ? 2 : 3,
      } as TocItem
    })

    if (items.length < 2) return
    setToc(items)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: "-20% 0px -70%" },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Article link copied")
    } catch {
      toast.error("Could not copy the link. You can copy it from the address bar.")
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href })
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) await copyLink()
      }
      return
    }
    await copyLink()
  }

  return (
    <main id="main-content" className="site-shell pb-16 pt-10 sm:pb-24 sm:pt-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border/80 pb-5">
        <a
          href="/thought-lab/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Philosophy &amp; Essays
        </a>
        <div className="flex items-center gap-3">
          {readingTimeMinutes !== undefined && (
            <span data-slot="reading-time" className="text-xs text-muted-foreground">
              {readingTimeMinutes} min read
            </span>
          )}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy article link"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Copy className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={share}
            aria-label="Share article"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="article-layout grid gap-12 xl:gap-16">
        <article className="prose-lab min-w-0 max-w-[68ch]">
          <div ref={articleRef} data-slot="article-body">
            {children}
          </div>
          <div className="mt-16 border-t border-border/80 pt-8">
            <p className="eyebrow text-philosophy">
              <BookOpenText className="size-3.5" aria-hidden="true" /> About the author
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              I am {profile.name}, a physics PhD researcher at Howard University and a philosophical writer working across materials, models, value, and metaphysics.
            </p>
          </div>
        </article>

        {toc.length >= 2 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-24 border-l border-border/80 pl-5" aria-label="Table of contents">
              <p className="eyebrow text-muted-foreground">On this page</p>
              <ol className="mt-5 flex flex-col gap-3">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
                    <a
                      href={`#${item.id}`}
                      aria-current={activeId === item.id ? "location" : undefined}
                      className="block text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground aria-[current=location]:font-medium aria-[current=location]:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>
    </main>
  )
}
