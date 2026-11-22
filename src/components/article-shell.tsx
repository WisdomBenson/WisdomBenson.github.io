"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Copy, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { profile } from "@/content/profile"

type TocItem = { id: string; label: string; level: 2 | 3 }

export function ArticleShell({ children }: { children: React.ReactNode }) {
  const articleRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState("")
  const [readingTime, setReadingTime] = useState("")

  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3"))
    const items = headings.map((heading, index) => {
      const id = heading.id || `section-${index + 1}`
      heading.id = id
      return { id, label: heading.textContent || `Section ${index + 1}`, level: heading.tagName === "H2" ? 2 : 3 } as TocItem
    })

    setToc(items)
    const words = (article.textContent || "").trim().split(/\s+/).length
    setReadingTime(`${Math.max(1, Math.ceil(words / 220))} min read`)

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
    <main id="main-content" className="site-shell section-block">
      <div className="editorial-panel p-6 sm:p-10 lg:p-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-4 sm:mb-8">
          <Button variant="ghost" asChild>
            <a href="/thought-lab/"><ArrowLeft data-icon="inline-start" aria-hidden="true" /> Philosophy &amp; Essays</a>
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{readingTime}</span>
            <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy article link">
              <Copy aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" onClick={share} aria-label="Share article">
              <Share2 aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="article-layout grid gap-10 xl:gap-14">
          <article className="prose-lab min-w-0 max-w-3xl">
            <div ref={articleRef} data-slot="article-body">{children}</div>
            <div className="mt-16 border-t pt-8">
              <p className="eyebrow text-philosophy"><Check className="size-3.5" aria-hidden="true" /> About me</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                I am {profile.name}, a physics PhD researcher at Howard University and a philosophical writer working across materials, models, value, and metaphysics.
              </p>
            </div>
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav className="sticky top-24 border-l pl-5" aria-label="Table of contents">
                <p className="eyebrow text-muted-foreground">On this page</p>
                <ol className="mt-5 flex flex-col gap-3">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
                      <a
                        href={`#${item.id}`}
                        aria-current={activeId === item.id ? "location" : undefined}
                        className="block text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground aria-[current=location]:font-medium aria-[current=location]:text-philosophy"
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
      </div>
    </main>
  )
}
