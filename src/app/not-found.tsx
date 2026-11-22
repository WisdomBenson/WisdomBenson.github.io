import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty"

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="site-shell section-block">
        <Empty className="editorial-panel min-h-80 py-14">
          <EmptyHeader>
            <span className="eyebrow text-quantum">404</span>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
            <EmptyDescription>The page may have moved or the address may be incomplete.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-2 flex-row flex-wrap justify-center">
            <Button asChild><Link href="/">Back to home</Link></Button>
            <Button variant="outline" asChild><a href="/thought-lab/">Browse essays</a></Button>
          </EmptyContent>
        </Empty>
      </main>
    </>
  )
}
