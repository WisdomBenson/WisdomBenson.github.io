import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react"

import {
  ArrowUpRight,
  Atom,
  Award,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Microscope,
  Phone,
  ScrollText,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { blogCategories, type BlogCategory, type BlogPost } from "@/blog-posts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ResearchArtifact, type ResearchArtifactKind } from "@/components/research-artifacts"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emailAddress = "wisdom.benson@bison.howard.edu"
const phoneNumber = "+1 984-312-9015"
const fromBase = (path: string) => `${import.meta.env.BASE_URL}${path}`
const sectionHref = (id: string) => `${import.meta.env.BASE_URL}#${id}`
const resumeHref = fromBase("wisdom-benson-resume.docx")
const blogHref = fromBase("blog/")
const githubIssuesApi = "https://api.github.com/repos/WisdomBenson/WisdomBenson.github.io/issues"
const newBlogIssueHref = "https://github.com/WisdomBenson/WisdomBenson.github.io/issues/new?template=blog-post.yml"
const approvedBlogAuthors = new Set(["wisdombenson", "wisemanking001"])

const navItems = [
  { label: "Research", href: sectionHref("research") },
  { label: "Publications", href: sectionHref("publications") },
  { label: "Blog", href: blogHref },
  { label: "CV", href: sectionHref("cv") },
  { label: "Experience", href: sectionHref("experience") },
  { label: "Contact", href: sectionHref("contact") },
]

type GitHubIssue = {
  number: number
  title: string
  body: string | null
  html_url: string
  created_at: string
  labels: Array<{ name: string }>
  user: { login: string } | null
  pull_request?: unknown
}

type DisplayBlogPost = BlogPost & {
  href?: string
  issueNumber?: number
  rawBody: string
}

const metrics = [
  { value: "5", label: "journal articles and thesis publications" },
  { value: "1", label: "CRC Press book chapter" },
  { value: "6", label: "conference presentations" },
  { value: "2", label: "APS Student Ambassador terms" },
]

const currentFocus = [
  "ZnO quantum-dot frontier levels",
  "Raman power and temperature diagnostics",
  "Tin-lead perovskite optical stability",
]

const researchThreads = [
  {
    eyebrow: "ZnO quantum dots",
    title: "First-principles modeling of finite oxide nanocrystals",
    body: "DFT, DFPT, and PDEP-GW workflows for band-edge control, phonon behavior, passivation chemistry, and size-dependent piezoelectric response.",
    artifact: "nanocrystal",
    icon: Atom,
  },
  {
    eyebrow: "Raman spectroscopy",
    title: "Temperature and excitation-power resolved Raman analysis",
    body: "Experimental and computational Raman pipelines for ZnO quantum dots, including linewidth, phonon confinement, and heating diagnostics.",
    artifact: "raman",
    icon: Microscope,
  },
  {
    eyebrow: "Perovskite photovoltaics",
    title: "Tin-lead alloy perovskites with multi-cation engineering",
    body: "Spin-coated thin-film synthesis and optical characterization focused on stability, near-IR tunability, and photovoltaic relevance.",
    artifact: "perovskite",
    icon: Cpu,
  },
] satisfies Array<{
  eyebrow: string
  title: string
  body: string
  artifact: ResearchArtifactKind
  icon: typeof Atom
}>

const journalArticles = [
  {
    title: "Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory",
    citation: "Benson, W., Adams, C., Baral, B., & Misra, P. AIP Advances, 16(2), 2026.",
    venue: "AIP Advances",
    year: "2026",
    doi: "10.1063/5.0303211",
    href: "https://doi.org/10.1063/5.0303211",
    tags: ["DFT", "ZnO quantum dots", "AIP"],
  },
  {
    title: "Enhanced stability and near-IR tunability in tin-lead perovskites via multi-cation engineering",
    citation: "Benson, W. H., Adesina, K. E., Fowodu, T. O., & Smart, G. M. Journal of Physics and Chemistry of Solids, 211, 113511, 2026.",
    venue: "Journal of Physics and Chemistry of Solids",
    year: "2026",
    doi: "10.1016/j.jpcs.2025.113511",
    href: "https://doi.org/10.1016/j.jpcs.2025.113511",
    tags: ["Perovskites", "near-IR", "Elsevier"],
  },
  {
    title: "Romantic exclusivity as structural necessity: A Kantian-Scheler-Schopenhauer synthesis in contemporary discourse",
    citation: "Benson, W. H. Philosophies, 10(5), 102, 2025.",
    venue: "Philosophies",
    year: "2025",
    doi: "10.3390/philosophies10050102",
    href: "https://doi.org/10.3390/philosophies10050102",
    tags: ["Philosophy", "ethics", "MDPI"],
  },
  {
    title: "Synthesis and optical characterization of lead-tin alloy perovskites for photovoltaic applications",
    citation: "Benson, W. ProQuest dissertation/thesis publication, 2024.",
    venue: "ProQuest",
    year: "2024",
    doi: "ProQuest 3176103303",
    href: "https://www.proquest.com/docview/3176103303",
    tags: ["Thesis", "perovskites", "optical characterization"],
  },
  {
    title: "Analysis of a steady MHD mixed convection fluid flow in a microchannel within permeable walls with suction and injection parameters",
    citation: "OALib, 10(07), 1-9, 2023.",
    venue: "OALib",
    year: "2023",
    doi: "10.4236/oalib.1110363",
    href: "https://www.oalib.com/articles/6798430",
    tags: ["MHD", "microchannel flow", "fluid dynamics"],
  },
]

const bookChapters = [
  {
    title: "Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications",
    citation: "Benson, W., Bandopadhyay, S., Adams, C., Baral, B., & Misra, P. In Nanoelectronics, pp. 169-197. CRC Press, 2025.",
    venue: "Nanoelectronics, CRC Press",
    year: "2025",
    doi: "10.1201/9781003512899-8",
    href: "https://doi.org/10.1201/9781003512899-8",
    tags: ["Book chapter", "quantum dots", "nanoelectronics"],
  },
]

const conferenceItems = [
  {
    title: "Quantifying surface-driven band-edge control in ZnO quantum dots using GW-DFT with truncation for quasiparticle gap",
    venue: "MRS Spring Meeting",
    year: "2026",
    details: "Wisdom Benson, Hind Ajadani, Jovani Pitterson, and Prabhakar Misra.",
  },
  {
    title: "Validated GW/BSE workflow with uncertainty quantification for finite oxide nanocrystals",
    venue: "APS March Meeting",
    year: "2026",
    details: "Wisdom Benson, Hind Ajadani, Jovani Pitterson, and Prabhakar Misra.",
  },
  {
    title: "Spin-orbit coupling and piezoelectric properties of zinc oxide quantum dots using first-principles calculations",
    venue: "SMT",
    year: "2025",
    details: "Misra, P., Benson, W. H., Adams, C., Baral, B., Ogbuka, J., and Williams, Z.",
  },
  {
    title: "Spin-orbit coupling and piezoelectric properties of zinc oxide quantum dot: Insights from first-principles calculations",
    venue: "APS Global Summit",
    year: "2025",
    details: "Wisdom Benson and collaborators.",
  },
  {
    title: "Investigating the optical properties of multiple cation tin-lead alloy perovskite thin films",
    venue: "PREM",
    year: "2024",
    details: "Presented in April 2024.",
  },
  {
    title: "Tin-lead alloy perovskite thin films: Enhancing stability and efficiency by varying the lead-tin and halide ratios",
    venue: "Triangle Student Research Competition",
    year: "2023",
    details: "11th Annual Triangle Student Research Competition.",
  },
]

const educationItems = [
  {
    school: "Howard University",
    degree: "Doctor of Philosophy in Physics",
    meta: "Washington, DC | Aug. 2024 - May 2029 anticipated",
    body: "Graduate research in modeling and simulation of piezoelectric quantum dots for quantum computing, quantum sensing, and storage.",
  },
  {
    school: "North Carolina Central University",
    degree: "Master of Science in Physics",
    meta: "Durham, NC | Completed May 2024",
    body: "Thesis: Synthesis and Optical Properties of Triple Cation, Tin-Lead Alloy Perovskite Thin Films.",
  },
  {
    school: "University of Nigeria Nsukka",
    degree: "Bachelor of Science in Physics with Honors",
    meta: "Nsukka, Nigeria | Completed June 2021",
    body: "Undergraduate research on density functional theory for methylammonium lead iodide perovskite.",
  },
]

const experienceItems = [
  {
    role: "Graduate Research & Teaching Assistant",
    place: "Howard University",
    period: "Aug. 2024 - Present",
    bullets: [
      "Conduct first-principles DFT and many-body GW calculations with Quantum ESPRESSO and WEST on SDSC Expanse and ANL-CNM HPC resources.",
      "Model phonon dynamics, frontier levels, passivation chemistry, and electronic structure in ZnO quantum dots.",
      "Led the summer 2025 REU program on modeling and simulation of piezoelectric quantum dots in the Laser Spectroscopy Lab.",
      "Designed GPU-accelerated computational workflows using Agile and SOLID software-design principles.",
    ],
  },
  {
    role: "Graduate Research & Teaching Assistant",
    place: "North Carolina Central University",
    period: "Aug. 2022 - May 2024",
    bullets: [
      "Synthesized and optically characterized perovskite thin films with statistical analysis of experimental results.",
      "Taught practical physics laboratory sections to 200+ undergraduate students and supported academic mentoring.",
      "Presented research at national conferences and contributed to peer-reviewed publications.",
    ],
  },
  {
    role: "Classroom Teacher, Physics",
    place: "God's Will Academy",
    period: "Feb. 2022 - July 2022",
    bullets: [
      "Developed and delivered physics lesson plans for 100+ students across secondary-school levels.",
      "Coordinated with parents and counselors to support student academic development.",
    ],
  },
]

const skills = [
  "Quantum ESPRESSO",
  "WEST/PDEP-GW",
  "SIESTA",
  "VESTA",
  "DFT",
  "DFPT",
  "Many-body perturbation theory",
  "Python",
  "C++",
  "Java",
  "MATLAB",
  "LaTeX",
  "TensorFlow",
  "Data profiling",
  "Systems analysis",
  "Database management",
  "Reinforcement ML",
  "Unsupervised ML",
  "SaaS product design",
  "Agile",
  "SOLID design",
]

const awards = [
  "APS Student Ambassador, 2024-2025 and 2025-2026 terms",
  "NCCU International Student Award, 2024",
  "MSc Physics with Honors, North Carolina Central University, 2024",
  "BSc Physics with Honors, University of Nigeria Nsukka, 2021",
]

function App() {
  const isBlogPage = window.location.pathname.endsWith("/blog/") || window.location.pathname.endsWith("/blog/index.html")

  useEffect(() => {
    if (isBlogPage) return
    if (!window.location.hash) return

    const scrollToHashTarget = () => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" })
    }

    window.requestAnimationFrame(scrollToHashTarget)
    window.setTimeout(scrollToHashTarget, 300)
  }, [isBlogPage])

  if (isBlogPage) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <SiteHeader />
        <main>
          <BlogPage />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ResearchSection />
        <PublicationsSection />
        <CVSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  )
}

function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleMobileSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.split("#")[1]
    if (!targetId) return

    setMobileMenuOpen(false)
    const target = document.getElementById(targetId)
    if (!target) return

    event.preventDefault()
    window.history.pushState(null, "", href)
    const scrollToTarget = () => {
      target.scrollIntoView({ block: "start" })
    }
    window.setTimeout(scrollToTarget, 260)
    window.setTimeout(scrollToTarget, 560)
  }

  return (
    <header className="site-header sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href={sectionHref("top")} className="group inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground">
          <span className="grid size-9 place-items-center border border-foreground bg-foreground text-xs font-semibold text-background transition-transform duration-300 group-hover:-translate-y-0.5">
            W/B
          </span>
          <span className="hidden sm:inline">Wisdom Benson</span>
        </a>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={`mailto:${emailAddress}`}>
              <Mail data-icon="inline-start" aria-hidden="true" />
              Contact
            </a>
          </Button>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(86vw,24rem)] p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <ScrollArea className="h-dvh">
              <div className="space-y-8 p-6">
                <div>
                  <p className="text-sm font-medium">Wisdom Benson</p>
                  <p className="mt-1 text-sm text-muted-foreground">Physics PhD student and computational materials researcher.</p>
                </div>
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(event) => handleMobileSectionClick(event, item.href)}
                      className="rounded-md px-3 py-3 text-base text-foreground transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <Separator />
                <div className="grid gap-3">
                  <Button asChild>
                    <a href={`mailto:${emailAddress}`} onClick={() => setMobileMenuOpen(false)}>
                      <Mail data-icon="inline-start" aria-hidden="true" />
                      Email Wisdom
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={resumeHref} onClick={() => setMobileMenuOpen(false)}>
                      <Download data-icon="inline-start" aria-hidden="true" />
                      Resume
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <>
      <section id="top" data-slot="hero" className="hero-shell relative isolate overflow-hidden">
        <img
          src={fromBase("assets/wisdom-benson-lab-hero.webp")}
          alt="Wisdom Benson in a computational materials laboratory."
          className="hero-image absolute inset-0 z-0 size-full object-cover object-[68%_center]"
        />
        <div className="hero-veil absolute inset-0 z-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-[90rem] content-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
          <div className="reveal max-w-3xl">
            <p className="mb-6 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Howard University · Computational materials physics
            </p>
            <h1 className="flex flex-col gap-3 tracking-[-0.055em] text-foreground">
              <span className="text-5xl font-semibold leading-[0.9] sm:text-7xl lg:text-[6.9rem]">Wisdom Benson.</span>
              <span className="max-w-2xl text-3xl font-medium leading-[0.98] text-foreground/78 sm:text-4xl lg:text-5xl">
                I model materials where their behavior begins.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
              First-principles simulation, Raman spectroscopy, and computational workflows for quantum dots and photovoltaic materials.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <a href={sectionHref("research")}>
                  Explore the research
                  <ArrowUpRight data-icon="inline-end" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="hero-secondary-action">
                <a href={resumeHref}>
                  <Download data-icon="inline-start" aria-hidden="true" />
                  Download resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="focus-band border-b border-border" aria-label="Current research focus">
        <div className="mx-auto grid max-w-[90rem] gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[0.7fr_2.3fr] lg:px-10 lg:py-10">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">Now investigating</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Three active lines of inquiry, one materials-scale question.</p>
          </div>
          <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {currentFocus.map((item, index) => (
              <div key={item} className="grid grid-cols-[2rem_1fr] gap-3 py-4 first:pt-0 last:pb-0 lg:px-6 lg:py-0 lg:first:pl-0 lg:last:pr-0">
                <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div data-slot="metrics-strip" className="border-b border-border bg-muted/35">
        <div className="mx-auto grid max-w-[90rem] grid-cols-2 divide-x divide-y divide-border px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-4 py-5 first:pl-0 sm:py-7 lg:px-7">
              <p className="font-mono text-2xl font-semibold text-foreground">{metric.value}</p>
              <p className="mt-1 max-w-44 text-sm leading-5 text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ResearchSection() {
  return (
    <section id="research" data-slot="research" className="section-wrap">
      <SectionHeader
        eyebrow="Research practice"
        title="Theory and experiment, connected at the materials scale."
        body="I move between atomistic simulation, Raman evidence, and high-performance computing to understand how nanoscale structure becomes measurable behavior."
      />
      <div className="mt-14 border-y border-border">
        <article className="research-lead grid lg:grid-cols-[1.2fr_0.8fr]">
          <ResearchArtifact kind={researchThreads[0].artifact} />
          <div className="flex items-center border-t border-border p-6 sm:p-10 lg:border-l lg:border-t-0">
            <ResearchCopy thread={researchThreads[0]} />
          </div>
        </article>
        <div className="grid border-t border-border lg:grid-cols-2 lg:divide-x lg:divide-border">
          {researchThreads.slice(1).map((thread) => (
            <article key={thread.title} className="grid border-b border-border last:border-b-0 sm:grid-cols-[0.85fr_1.15fr] lg:grid-cols-1 lg:border-b-0 xl:grid-cols-[0.85fr_1.15fr]">
              <ResearchArtifact kind={thread.artifact} compact />
              <div className="flex items-center border-t border-border p-6 sm:border-l sm:border-t-0 lg:border-l-0 lg:border-t xl:border-l xl:border-t-0">
                <ResearchCopy thread={thread} compact />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ResearchCopy({ thread, compact = false }: { thread: (typeof researchThreads)[number]; compact?: boolean }) {
  const Icon = thread.icon

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center border border-border bg-background text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{thread.eyebrow}</p>
      </div>
      <h3 className={compact ? "text-xl font-semibold leading-tight tracking-tight" : "text-3xl font-semibold leading-tight tracking-tight"}>{thread.title}</h3>
      <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{thread.body}</p>
    </div>
  )
}

function PublicationsSection() {
  return (
    <section id="publications" data-slot="publications" className="section-wrap border-t border-border">
      <SectionHeader
        eyebrow="Publications"
        title="A record built across computation, experiment, and theory."
        body="Peer-reviewed articles, a CRC Press chapter, and conference work—organized for quick review and direct access."
      />
      <Tabs defaultValue="articles" className="mt-10 flex-col">
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <TabsList variant="line" className="line-tabs-list h-auto w-max min-w-full justify-start gap-7 p-0 sm:min-w-0">
            <TabsTrigger value="articles" className="min-h-10 flex-none px-0">
              Articles
            </TabsTrigger>
            <TabsTrigger value="chapter" className="min-h-10 flex-none px-0">
              Chapter
            </TabsTrigger>
            <TabsTrigger value="conferences" className="min-h-10 flex-none px-0">
              Conferences
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="articles" className="mt-7">
          <PublicationGrid items={journalArticles} />
        </TabsContent>
        <TabsContent value="chapter" className="mt-7">
          <PublicationGrid items={bookChapters} />
        </TabsContent>
        <TabsContent value="conferences" className="mt-7">
          <div className="divide-y divide-border border-y border-border">
            {conferenceItems.map((item) => (
              <div key={`${item.venue}-${item.title}`} className="group grid gap-5 py-7 transition-colors hover:bg-muted/35 sm:grid-cols-[10rem_1fr] sm:px-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{item.year}</p>
                  <p className="mt-2 text-sm font-medium text-primary">{item.venue}</p>
                </div>
                <div>
                  <h3 className="max-w-4xl text-lg font-semibold leading-snug tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function PublicationGrid({ items }: { items: typeof journalArticles }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <article key={item.title} className="publication-row group grid gap-5 py-7 transition-colors hover:bg-muted/35 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:px-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{item.year}</p>
            <p className="mt-2 text-sm font-medium text-primary">{item.venue}</p>
          </div>
          <div>
            <h3 className="max-w-4xl text-xl font-semibold leading-snug tracking-tight">{item.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.citation}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              <span className="font-mono text-xs text-foreground">{item.doi}</span>
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button asChild variant="ghost" size="icon" className="publication-open shrink-0" aria-label={`Open ${item.title}`}>
            <a href={item.href} target="_blank" rel="noreferrer">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </article>
      ))}
    </div>
  )
}

function issueToBlogPost(issue: GitHubIssue): DisplayBlogPost {
  const body = issue.body?.trim() || "This article was published from a GitHub issue. Add a body to the issue to show the full essay here."
  const articleBody = issueArticleBody(body)
  const markdownBody = withoutDuplicateTitle(articleBody, issue.title)
  const labelCategories = issue.labels
    .map((label) => label.name)
    .filter((label): label is BlogCategory => blogCategories.includes(label as BlogCategory))
  const topicCategories = issueTopics(body)
  const categories = topicCategories.length ? topicCategories : labelCategories

  return {
    slug: `issue-${issue.number}-${slugify(issue.title)}`,
    title: issue.title,
    date: new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(issue.created_at)),
    readTime: `${Math.max(1, Math.ceil(markdownBody.split(/\s+/).length / 220))} min read`,
    mode: issueMode(issue.labels.map((label) => label.name), body),
    categories: categories.length ? categories : ["Field Notes"],
    summary: issueSummary(markdownBody),
    body: [],
    rawBody: markdownBody,
    href: issue.html_url,
    issueNumber: issue.number,
  }
}

function issueMode(labels: string[], body: string): BlogPost["mode"] {
  const normalized = labels.map((label) => label.toLowerCase())
  if (normalized.includes("essay")) return "Essay"
  if (normalized.includes("research-note")) return "Research note"
  if (normalized.includes("build-log")) return "Build log"
  const fieldMode = issueField(body, "Mode").toLowerCase()
  if (fieldMode.includes("essay")) return "Essay"
  if (fieldMode.includes("research note")) return "Research note"
  if (fieldMode.includes("build log")) return "Build log"
  return "Notebook"
}

function issueTopics(body: string) {
  const topics = issueField(body, "Topics")
  if (!topics) return []

  return topics
    .split(/,|\n/)
    .map((topic) => topic.trim())
    .filter((topic): topic is BlogCategory => blogCategories.includes(topic as BlogCategory))
}

function issueArticleBody(body: string) {
  const article = issueField(body, "Article body")
  return article || body
}

function withoutDuplicateTitle(body: string, title: string) {
  const lines = body.split("\n")
  const firstLine = lines[0]?.replace(/^#\s+/, "").trim()
  if (firstLine?.toLowerCase() !== title.trim().toLowerCase()) return body
  return lines.slice(1).join("\n").trim()
}

function issueField(body: string, fieldName: string) {
  const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = body.match(new RegExp(`### ${escapedField}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`, "i"))
  return match?.[1]?.trim() ?? ""
}

function issueSummary(body: string) {
  const firstParagraph = body
    .split(/\n{2,}/)
    .map((part) =>
      part
        .replace(/^#+\s+/gm, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`>#-]/g, "")
        .trim(),
    )
    .find((part) => part && !part.toLowerCase().startsWith("topics:"))

  if (!firstParagraph) return "A public article from Wisdom Benson's GitHub-backed blog."
  return firstParagraph.length > 220 ? `${firstParagraph.slice(0, 217).trim()}...` : firstParagraph
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function fetchPublishedBlogIssues() {
  const issues: GitHubIssue[] = []

  for (let page = 1; ; page += 1) {
    const query = new URLSearchParams({
      state: "open",
      labels: "blog-post",
      per_page: "100",
      page: String(page),
    })
    const response = await fetch(`${githubIssuesApi}?${query}`)
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)

    const batch = (await response.json()) as GitHubIssue[]
    issues.push(...batch)
    if (batch.length < 100) return issues
  }
}

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [githubPosts, setGithubPosts] = useState<DisplayBlogPost[]>([])
  const [postStatus, setPostStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    async function loadGitHubPosts() {
      try {
        const issues = await fetchPublishedBlogIssues()
        if (cancelled) return

        setGithubPosts(
          issues
            .filter((issue) => !issue.pull_request && issue.user && approvedBlogAuthors.has(issue.user.login.toLowerCase()))
            .map(issueToBlogPost),
        )
        setPostStatus("ready")
      } catch {
        if (cancelled) return
        setPostStatus("error")
      }
    }

    void loadGitHubPosts()

    return () => {
      cancelled = true
    }
  }, [])

  const visiblePosts = useMemo(() => {
    if (activeCategory === "All") return githubPosts
    return githubPosts.filter((post) => post.categories.includes(activeCategory))
  }, [activeCategory, githubPosts])

  const selectedPost = useMemo(() => {
    return visiblePosts.find((post) => post.slug === selectedSlug) ?? visiblePosts[0] ?? null
  }, [selectedSlug, visiblePosts])

  return (
    <section id="blog" data-slot="blog" className="section-wrap min-w-0">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.75fr)] lg:items-end">
        <SectionHeader
          eyebrow="Blog"
          title="Field notes across philosophy, computation, and materials research."
          body="A public writing space for essays, research notebooks, build logs, and technical reflections. New posts can be published from GitHub Issues and appear here without changing the site code."
        />
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="size-4" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>Publish from GitHub</CardTitle>
                <CardDescription>New issues become public posts without a site deployment.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-stretch gap-2 border-t sm:flex-row">
            <Button asChild size="sm">
              <a href={newBlogIssueHref} target="_blank" rel="noreferrer">
                <FileText data-icon="inline-start" aria-hidden="true" />
                New article
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://github.com/WisdomBenson/WisdomBenson.github.io/issues?q=is%3Aissue%20label%3Ablog-post" target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" aria-hidden="true" />
                Manage posts
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {postStatus === "error" ? (
        <Alert className="mt-8">
          <MessageSquare aria-hidden="true" />
          <AlertTitle>Posts could not be loaded</AlertTitle>
          <AlertDescription>
            Refresh the page or use Manage posts to confirm the article is open and labeled <span className="font-mono">blog-post</span>.
          </AlertDescription>
        </Alert>
      ) : null}

      {postStatus === "loading" ? (
        <div className="mt-10 grid gap-3" aria-label="Loading blog posts">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : null}

      {postStatus === "ready" && githubPosts.length === 0 ? (
        <Empty className="mt-10 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No articles published yet</EmptyTitle>
            <EmptyDescription>Use the prepared GitHub form to publish your first essay or research note.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="sm">
              <a href={newBlogIssueHref} target="_blank" rel="noreferrer">
                <FileText data-icon="inline-start" aria-hidden="true" />
                Create article
              </a>
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {githubPosts.length > 0 ? (
        <>
          <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Filter blog posts by topic">
            <div className="flex w-max gap-2">
              <Button
                type="button"
                variant={activeCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("All")}
              >
                All
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <p className="text-sm leading-6 text-muted-foreground">No published posts match this topic.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setActiveCategory("All")}
              >
                Show all posts
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
              <div className="grid min-w-0 content-start gap-3 lg:sticky lg:top-24 lg:self-start">
                {visiblePosts.map((post) => (
                  <BlogPostButton
                    key={post.slug}
                    post={post}
                    selected={post.slug === selectedPost?.slug}
                    onSelect={() => setSelectedSlug(post.slug)}
                  />
                ))}
              </div>
              {selectedPost ? (
                <div className="grid min-w-0 gap-4">
                  <BlogReader post={selectedPost} />
                  <BlogComments post={selectedPost} />
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}

function BlogPostButton({ post, selected, onSelect }: { post: DisplayBlogPost; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group min-w-0 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-ring hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      data-slot="blog-post-trigger"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={selected ? "default" : "secondary"}>{post.mode}</Badge>
        <span className="text-xs text-muted-foreground">{post.date}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.categories.map((category) => (
          <Badge key={category} variant="outline">
            {category}
          </Badge>
        ))}
      </div>
    </button>
  )
}

function BlogReader({ post }: { post: DisplayBlogPost }) {
  return (
    <article data-slot="blog-reader" className="min-w-0">
      <Card className="min-w-0">
        <CardHeader className="gap-4 px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{post.mode}</Badge>
            <Badge variant="secondary">{post.readTime}</Badge>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <CardTitle>
            <h2 className="text-2xl leading-tight sm:text-4xl">{post.title}</h2>
          </CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">{post.summary}</CardDescription>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
          {post.href ? (
            <Button asChild variant="outline" size="sm" className="mt-6">
              <a href={post.href} target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" aria-hidden="true" />
                Open source issue
              </a>
            </Button>
          ) : null}
        </CardHeader>
        <Separator />
        <CardContent className="blog-prose min-w-0 px-5 sm:px-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
            }}
          >
            {post.rawBody}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </article>
  )
}

function BlogComments({ post }: { post: DisplayBlogPost }) {
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = commentsRef.current
    if (!container) return

    container.innerHTML = ""
    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("repo", "WisdomBenson/WisdomBenson.github.io")
    if (post.issueNumber) {
      script.setAttribute("issue-number", String(post.issueNumber))
    } else {
      script.setAttribute("issue-term", `blog-${post.slug}`)
    }
    script.setAttribute("label", "blog-comment")
    script.setAttribute("theme", "github-light")
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [post.issueNumber, post.slug])

  return (
    <Card data-slot="blog-comments">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Public discussion powered by GitHub Issues. Sign in with GitHub to join.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={commentsRef} className="min-h-40 min-w-0 overflow-hidden rounded-md border border-border bg-background/60 p-2" />
      </CardContent>
    </Card>
  )
}

function CVSection() {
  return (
    <section id="cv" data-slot="cv" className="section-wrap border-t border-border">
      <SectionHeader
        eyebrow="CV and resume"
        title="Training for questions that cross disciplinary boundaries."
      />
      <Tabs defaultValue="cv" className="mt-10 flex-col">
        <TabsList variant="line" className="line-tabs-list h-auto w-max min-w-full justify-start gap-7 p-0 sm:min-w-0">
          <TabsTrigger value="cv" className="min-h-10 flex-none px-0">
            Curriculum Vitae
          </TabsTrigger>
          <TabsTrigger value="resume" className="min-h-10 flex-none px-0">
            Resume
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cv" className="mt-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <Timeline title="Education" icon={GraduationCap} items={educationItems} />
            <div className="space-y-8">
              <SkillCloud />
              <AwardsBlock />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="resume" className="mt-8">
          <div className="grid gap-8 border-y border-border py-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center border border-border bg-background text-primary">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold">Wisdom Benson resume</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Current resume source: wisdom_benson_resume.docx</p>
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground">
                Focus areas include Quantum ESPRESSO, WEST/PDEP-GW, perovskite thin-film characterization, Raman spectroscopy,
                HPC workflows, and SaaS product implementation through CryptoTrackAI.
              </p>
            </div>
            <div className="flex items-start lg:justify-end">
              <Button asChild size="lg">
                <a href={resumeHref}>
                  <Download className="size-4" aria-hidden="true" />
                  Download DOCX
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function Timeline({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: typeof GraduationCap
  items: typeof educationItems
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {items.map((item) => (
          <div key={item.school} className="p-5 sm:p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{item.school}</p>
            <h4 className="mt-2 text-xl font-semibold leading-snug">{item.degree}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{item.meta}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillCloud() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center border border-border bg-background text-primary">
          <ScrollText className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-semibold">Technical skills</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1.5">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function AwardsBlock() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center border border-border bg-background text-primary">
          <Award className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-semibold">Achievements</h3>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {awards.map((award) => (
          <div key={award} className="p-5 text-sm font-medium leading-6">
            {award}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExperienceSection() {
  return (
    <section id="experience" data-slot="experience" className="section-wrap border-t border-border">
      <SectionHeader
        eyebrow="Experience"
        title="Research deepens when it can also be taught, tested, and built."
        body="From laboratory instruction and thin-film synthesis to many-body simulation workflows and scientific software."
      />
      <Accordion type="single" collapsible defaultValue="howard" className="mt-10 border-y border-border">
        {experienceItems.map((item, index) => (
          <AccordionItem
            key={item.role + item.place}
            value={index === 0 ? "howard" : item.place}
            className="border-b border-border bg-transparent shadow-none last:border-b-0"
          >
            <AccordionTrigger className="rounded-none border-0 px-0 py-6 text-left hover:no-underline focus-visible:ring-2 sm:px-4 sm:py-7">
              <div className="grid gap-1 sm:grid-cols-[15rem_1fr] sm:gap-8">
                <span className="font-mono text-xs font-normal uppercase tracking-[0.16em] text-primary">{item.place}</span>
                <span className="text-lg font-semibold">{item.role}</span>
                <span className="text-sm font-normal text-muted-foreground sm:col-start-2">{item.period}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-7 sm:pl-[17rem] sm:pr-12">
              <ul className="grid max-w-3xl gap-3 text-sm leading-6 text-muted-foreground">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[0.6rem_1fr] gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function ContactSection() {
  return (
    <section data-slot="contact" className="contact-shell border-t border-border">
      <div id="contact" className="mx-auto grid min-h-[38rem] max-w-[90rem] scroll-mt-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="order-2 flex items-center px-4 py-14 sm:px-6 lg:order-1 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">Start a conversation</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl">
              Bring me the material question you cannot resolve at one scale.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              I am open to research collaboration, conference conversations, and academic opportunities in computational materials, spectroscopy, and nanomaterials.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <a href={`mailto:${emailAddress}`}>
                  <Mail data-icon="inline-start" aria-hidden="true" />
                  Email Wisdom
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+19843129015">
                  <Phone data-icon="inline-start" aria-hidden="true" />
                  {phoneNumber}
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
            </div>
            <p className="mt-7 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Silver Spring, Maryland · Replies typically within 24 hours
            </p>
          </div>
        </div>
        <div className="relative order-1 min-h-[30rem] border-b border-border lg:order-2 lg:min-h-full lg:border-b-0 lg:border-l">
          <img
            src={fromBase("assets/wisdom-benson-portrait.jpeg")}
            alt="Portrait of Wisdom Benson."
            className="size-full object-cover object-top grayscale-[0.12]"
          />
        </div>
      </div>
      <footer className="mx-auto flex max-w-[90rem] flex-col gap-3 border-t border-border px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>Wisdom Benson | Physics, computational materials, and spectroscopy</p>
        <a href={sectionHref("top")} className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
          Back to top
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </footer>
    </section>
  )
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_2.3fr] lg:gap-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <div className="max-w-4xl">
        <h2 className="text-3xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">{title}</h2>
        {body ? <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{body}</p> : null}
      </div>
    </div>
  )
}

export default App
