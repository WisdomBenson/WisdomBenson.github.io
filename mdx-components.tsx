import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"

import { ArticleShell } from "@/components/article-shell"

function EssayLayout({ children }: { children: ReactNode }) {
  return <ArticleShell>{children}</ArticleShell>
}

export function useMDXComponents(): MDXComponents {
  return { wrapper: EssayLayout }
}
