import { ArticleShell } from "@/components/article-shell"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"

export default function ThoughtLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#article">Skip to article</a>
      <SiteHeader />
      <div id="article">
        <ArticleShell>{children}</ArticleShell>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  )
}
