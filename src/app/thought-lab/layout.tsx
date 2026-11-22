import { SiteFooterBar } from "@/components/site-footer-bar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"

export default function ThoughtLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      {children}
      <footer className="site-shell pb-6 sm:pb-8">
        <SiteFooterBar />
      </footer>
      <Toaster richColors position="bottom-right" />
    </>
  )
}
