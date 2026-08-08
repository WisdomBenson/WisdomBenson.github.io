import { ContactFooter } from "@/components/contact-footer"
import { CVTimeline } from "@/components/cv-timeline"
import { HeroSection } from "@/components/HeroSection"
import { PublicationHub } from "@/components/PublicationHub"
import { ResearchShowcase } from "@/components/ResearchShowcase"
import { SiteHeader } from "@/components/site-header"
import { ThoughtLab } from "@/components/thought-lab"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <ResearchShowcase />
        <PublicationHub />
        <ThoughtLab />
        <CVTimeline />
      </main>
      <ContactFooter />
      <Toaster richColors position="bottom-right" />
    </>
  )
}
