import { ArrowUpRight } from "lucide-react"

import { profile } from "@/content/profile"

export function SiteFooterBar() {
  return (
    <div className="flex flex-col gap-3 border-t border-border/75 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} {profile.name}. Physics, computation, and philosophy.</p>
      <a
        href="https://github.com/WisdomBenson/WisdomBenson.github.io"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 transition-colors hover:text-primary"
      >
        Source on GitHub <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  )
}
