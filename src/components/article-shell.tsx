"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Copy, Share2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { profile } from "@/content/profile"

type TocItem = { id: string; label: string; level: 2 | 3 }

export function ArticleShell({ children }: { children: React.ReactNode }) {
  const articleRef = useRef<HTMLElement>(null)
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
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Article link copied")
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href })
      return
    }
    await copyLink()
  }

  return (
    <main className="site-shell section-block">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <Button variant="ghost" asChild>
          <Link href="/#philosophy"><ArrowLeft data-icon="inline-start" aria-hidden="true" /> Thought lab</Link>
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

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article ref={articleRef} className="prose-lab min-w-0 max-w-3xl">
          {children}
          <div className="mt-16 border-t pt-8">
            <p className="eyebrow text-philosophy"><Check className="size-3.5" aria-hidden="true" /> About the author</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {profile.name} is a physics PhD researcher at Howard University and a philosophical writer working across materials, models, value, and metaphysics.
            </p>
          </div>
        </article>

        <aside className="hidden lg:block">
          <nav className="sticky top-24 border-l pl-5" aria-label="Table of contents">
            <p className="eyebrow text-muted-foreground">On this page</p>
            <ol className="mt-5 space-y-3">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm leading-5 transition-colors ${activeId === item.id ? "text-philosophy" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </main>
  )
}
