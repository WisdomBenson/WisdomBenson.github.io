import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"

export default function ThoughtLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  )
}
