import Link from "next/link"

import { SiteFooterBar } from "@/components/site-footer-bar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty"

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="site-shell section-block">
        <Empty className="min-h-80 rounded-2xl border border-border/80 bg-card/80 py-16">
          <EmptyHeader>
            <span className="eyebrow text-quantum">404</span>
            <h1 className="mt-2 font-serif text-4xl font-normal tracking-[-0.015em] text-foreground sm:text-5xl">
              Page not found
            </h1>
            <EmptyDescription>The page may have moved or the address may be incomplete.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-4 flex-row flex-wrap justify-center gap-3">
            <Button className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button variant="outline" className="rounded-full bg-card" asChild>
              <a href="/thought-lab/">Browse essays</a>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
      <footer className="site-shell">
        <SiteFooterBar />
      </footer>
    </>
  )
}
