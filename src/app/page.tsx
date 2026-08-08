import { ContactFooter } from "@/components/contact-footer"
import { CVTimeline } from "@/components/cv-timeline"
import { HeroBento } from "@/components/hero-bento"
import { PublicationHub } from "@/components/publication-hub"
import { ResearchLab } from "@/components/research-lab"
import { SiteHeader } from "@/components/site-header"
import { ThoughtLab } from "@/components/thought-lab"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroBento />
        <ResearchLab />
        <PublicationHub />
        <ThoughtLab />
        <CVTimeline />
      </main>
      <ContactFooter />
      <Toaster richColors position="bottom-right" />
    </>
  )
}
