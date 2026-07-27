import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react"

import {
  ArrowUpRight,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Menu,
  MessageSquare,
  Phone,
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

const researchThreads = [
  {
    index: "01",
    eyebrow: "ZnO quantum dots",
    title: "First-principles modeling of finite oxide nanocrystals",
    body: "DFT, DFPT, and PDEP-GW workflows for band-edge control, phonon behavior, passivation chemistry, and size-dependent piezoelectric response.",
    methods: ["DFT", "DFPT", "PDEP-GW"],
    image: "assets/zno-qd-coordinate-map.png",
    imageAlt: "Atomic coordinate map for ligand-passivated zinc oxide quantum dots.",
    evidence: "Atomic coordinate indexing across hydroxyl- and acetate-passivated ZnO structures.",
  },
  {
    index: "02",
    eyebrow: "Raman spectroscopy",
    title: "Temperature and excitation-power resolved Raman analysis",
    body: "Experimental and computational Raman pipelines for ZnO quantum dots, including linewidth, phonon confinement, and heating diagnostics.",
    methods: ["532 nm excitation", "Power series", "Peak analysis"],
    image: "assets/raman-spectra.png",
    imageAlt: "Raman spectra for zinc oxide quantum dots across a 532 nanometer excitation-power series.",
    evidence: "Raw spectra across five excitation powers, retained as data rather than decoration.",
  },
  {
    index: "03",
    eyebrow: "Perovskite photovoltaics",
    title: "Tin-lead alloy perovskites with multi-cation engineering",
    body: "Spin-coated thin-film synthesis and optical characterization focused on stability, near-IR tunability, and photovoltaic relevance.",
    methods: ["Thin-film synthesis", "Optical characterization", "Near-IR response"],
    image: null,
    imageAlt: "",
    evidence: "A materials-design line connecting composition, optical response, and device relevance.",
  },
]

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

const skillGroups = [
  {
    label: "Electronic structure",
    items: ["Quantum ESPRESSO", "WEST/PDEP-GW", "SIESTA", "DFT", "DFPT", "Many-body perturbation theory", "VESTA"],
  },
  {
    label: "Scientific computing",
    items: ["Python", "C++", "Java", "MATLAB", "LaTeX"],
  },
  {
    label: "Data and ML",
    items: ["TensorFlow", "Data profiling", "Database management", "Reinforcement ML", "Unsupervised ML"],
  },
  {
    label: "Product practice",
    items: ["Systems analysis", "SaaS product design", "Agile", "SOLID design"],
  },
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
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          <BlogPage />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
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
      target.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true })
    }
    window.setTimeout(scrollToTarget, 260)
    window.setTimeout(scrollToTarget, 560)
  }

  return (
    <header className="site-header sticky top-0 z-20 border-b border-background/15 bg-foreground text-background">
      <div className="mx-auto flex h-16 max-w-[86rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href={sectionHref("top")} className="group inline-flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="grid size-8 place-items-center border border-background/30 font-mono text-[0.65rem] font-semibold transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
            WB
          </span>
          <span className="hidden sm:inline">Wisdom Benson</span>
        </a>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className="px-3 py-2 text-sm text-background/65 transition-colors hover:bg-transparent hover:text-background focus:bg-transparent focus:text-background"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" className="text-background hover:bg-background/10 hover:text-background">
            <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <Button asChild className="bg-background text-foreground hover:bg-background/90">
            <a href={`mailto:${emailAddress}`}>
              <Mail data-icon="inline-start" aria-hidden="true" />
              Contact
            </a>
          </Button>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-11 border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background lg:hidden" aria-label="Open navigation">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(86vw,24rem)] p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <ScrollArea className="h-dvh">
              <div className="flex flex-col gap-8 p-6">
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
                      className="flex min-h-11 items-center rounded-md px-3 text-base text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <section id="top" data-slot="hero" className="hero-shell overflow-hidden bg-foreground text-background">
        <div className="hero-grid mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[86rem] lg:grid-cols-[minmax(0,1.12fr)_minmax(24rem,0.88fr)]">
          <div className="order-2 flex flex-col justify-between px-4 py-12 sm:px-6 sm:py-16 lg:order-1 lg:px-8 lg:py-20">
            <div className="reveal max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-primary" aria-hidden="true" />
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Computational materials physics
                </p>
              </div>
              <h1 tabIndex={-1} className="mt-8 max-w-[11ch] text-5xl font-semibold leading-[0.94] tracking-[-0.045em] outline-none sm:text-6xl lg:text-[4.7rem]">
                From atoms to evidence.
              </h1>
              <p className="mt-7 max-w-xl text-xl font-medium leading-[1.25] text-background/82 sm:text-2xl">
                I study how nanoscale structure becomes measurable electronic, vibrational, and optical behavior.
              </p>
              <p className="mt-6 max-w-[60ch] text-base leading-7 text-background/60">
                Wisdom Benson is a Physics PhD researcher at Howard University working across first-principles simulation,
                Raman spectroscopy, and high-performance computing.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href={sectionHref("research")}>
                    View selected research
                    <ArrowUpRight data-icon="inline-end" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
                  <a href={resumeHref}>
                    <Download data-icon="inline-start" aria-hidden="true" />
                    Download resume
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-background/15 pt-6 sm:grid-cols-4 lg:mt-20">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-mono text-xl font-semibold text-background">{metric.value}</p>
                  <p className="mt-1 max-w-36 text-xs leading-5 text-background/52">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-portrait order-1 flex min-h-[24rem] items-end px-4 pt-6 sm:min-h-[34rem] sm:px-6 lg:order-2 lg:min-h-0 lg:px-8 lg:pt-10">
            <figure className="relative mx-auto aspect-[5/6] w-full max-w-[34rem] overflow-hidden border-x border-t border-background/15 lg:h-full lg:aspect-auto">
              <div className="absolute inset-y-0 right-0 z-10 w-2 bg-primary" aria-hidden="true" />
              <img
                src={fromBase("assets/wisdom-benson-portrait.jpeg")}
                alt="Portrait of Wisdom Benson."
                width="1023"
                height="1536"
                className="size-full object-cover object-[center_20%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-foreground/88 px-4 py-4 backdrop-blur-sm">
                <span className="text-sm font-medium">Wisdom Benson</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-background/55">
                  Silver Spring, MD
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  )
}

function ResearchSection() {
  const featuredThreads = researchThreads.slice(0, 2)
  const supportingThread = researchThreads[2]

  return (
    <section id="research" data-slot="research" className="section-wrap">
      <SectionHeader
        index="01"
        eyebrow="Selected research"
        title="The work begins with a physical question, not a visual effect."
        body="Real coordinate maps and measured spectra anchor the research record. Each project connects a material system, a method, and the evidence needed to make a defensible claim."
      />
      <div className="mt-14 flex flex-col gap-20 sm:mt-16 lg:gap-28">
        {featuredThreads.map((thread, threadIndex) => (
          <article
            key={thread.title}
            className="research-story grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] lg:gap-14"
          >
            <figure className={`research-figure overflow-hidden border border-border bg-card ${threadIndex % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Evidence plate {thread.index}
                </span>
                <span className="size-2 bg-primary" aria-hidden="true" />
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={fromBase(thread.image!)}
                  alt={thread.imageAlt}
                  width="1600"
                  height="1200"
                  loading="lazy"
                  className="size-full object-cover object-center"
                />
              </div>
              <figcaption className="border-t border-border px-4 py-3 text-xs leading-5 text-muted-foreground">
                {thread.evidence}
              </figcaption>
            </figure>
            <ResearchCopy thread={thread} />
          </article>
        ))}
        <article className="research-alloy grid overflow-hidden border-y border-border bg-foreground text-background lg:grid-cols-[0.62fr_1.38fr]">
          <div className="flex min-h-64 items-center justify-center border-b border-background/15 p-8 lg:border-b-0 lg:border-r">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Material system</p>
              <p className="mt-4 text-6xl font-semibold tracking-[-0.06em] sm:text-7xl">Sn/Pb</p>
              <p className="mt-2 font-mono text-sm text-background/55">ABX3 alloy perovskite</p>
            </div>
          </div>
          <div className="flex items-center p-7 sm:p-10 lg:p-14">
            <ResearchCopy thread={supportingThread} dark />
          </div>
        </article>
      </div>
    </section>
  )
}

function ResearchCopy({ thread, dark = false }: { thread: (typeof researchThreads)[number]; dark?: boolean }) {
  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-semibold text-primary">{thread.index}</span>
        <span className={`h-px w-8 ${dark ? "bg-background/25" : "bg-border"}`} aria-hidden="true" />
        <p className={`font-mono text-xs font-medium uppercase tracking-[0.18em] ${dark ? "text-background/55" : "text-muted-foreground"}`}>
          {thread.eyebrow}
        </p>
      </div>
      <h3 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl">{thread.title}</h3>
      <p className={`mt-5 text-base leading-7 ${dark ? "text-background/62" : "text-muted-foreground"}`}>{thread.body}</p>
      <div className={`mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${dark ? "border-background/15 text-background/55" : "border-border text-muted-foreground"}`}>
        {thread.methods.map((method) => (
          <span key={method}>{method}</span>
        ))}
      </div>
    </div>
  )
}

function PublicationsSection() {
  return (
    <section id="publications" data-slot="publications" className="section-wrap border-t border-border">
      <SectionHeader
        index="02"
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
            <h3 className="max-w-4xl text-xl font-semibold leading-snug tracking-tight">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="decoration-primary/50 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.title}
              </a>
            </h3>
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
          <Button asChild variant="outline" size="sm" className="publication-open min-h-11 shrink-0 px-4">
            <a href={item.href} target="_blank" rel="noreferrer">
              View publication
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
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
          headingLevel="h1"
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
    <section id="cv" data-slot="cv" className="cv-shell border-y border-border bg-muted/55">
      <div className="section-wrap">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            index="03"
            eyebrow="Curriculum"
            title="Training, methods, and recognition in one continuous record."
          />
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={resumeHref}>
              <Download data-icon="inline-start" aria-hidden="true" />
              Download resume
            </a>
          </Button>
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Education</p>
            <div className="mt-6 border-t border-border">
              {educationItems.map((item, index) => (
                <article key={item.school} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[5rem_1fr]">
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-primary">{item.school}</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.025em]">{item.degree}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.meta}</p>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Methods and tools</p>
              <div className="mt-6 border-t border-border">
                {skillGroups.map((group, index) => (
                  <div key={group.label} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[2rem_9rem_1fr]">
                    <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-sm font-semibold">{group.label}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{group.items.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recognition</p>
              <ol className="mt-6 border-t border-border">
                {awards.map((award, index) => (
                  <li key={award} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-border py-4 text-sm font-medium leading-6">
                    <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <span>{award}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section id="experience" data-slot="experience" className="section-wrap border-t border-border">
      <SectionHeader
        index="04"
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
    <section data-slot="contact" className="contact-shell bg-foreground text-background">
      <div id="contact" className="mx-auto grid max-w-[86rem] scroll-mt-20 gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold text-primary">05</span>
            <span className="h-px w-10 bg-background/20" aria-hidden="true" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-background/55">Contact</p>
          </div>
          <h2 tabIndex={-1} className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] outline-none sm:text-6xl">
            Let us work on the question between the scales.
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-7 text-background/60">
            I am open to research collaboration, conference conversations, and academic opportunities in computational materials, spectroscopy, and nanomaterials.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-stretch">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href={`mailto:${emailAddress}`}>
              <Mail data-icon="inline-start" aria-hidden="true" />
              Email Wisdom
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
            <a href="tel:+19843129015">
              <Phone data-icon="inline-start" aria-hidden="true" />
              {phoneNumber}
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-background hover:bg-background/10 hover:text-background">
            <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-background/45">
            Silver Spring, Maryland · Replies typically within 24 hours
          </p>
        </div>
      </div>
      <footer className="mx-auto flex max-w-[86rem] flex-col gap-3 border-t border-background/15 px-4 py-8 text-sm text-background/48 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Wisdom Benson | Physics, computational materials, and spectroscopy</p>
        <a href={sectionHref("top")} className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Back to top
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </footer>
    </section>
  )
}

function SectionHeader({
  index,
  eyebrow,
  title,
  body,
  headingLevel = "h2",
}: {
  index?: string
  eyebrow: string
  title: string
  body?: string
  headingLevel?: "h1" | "h2"
}) {
  const Heading = headingLevel

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_2.28fr] lg:gap-12">
      <div className="flex items-center gap-4 lg:items-start">
        {index ? <span className="font-mono text-xs font-semibold text-primary">{index}</span> : null}
        {index ? <span className="mt-2 hidden h-px flex-1 bg-border lg:block" aria-hidden="true" /> : null}
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      </div>
      <div className="max-w-4xl">
        <Heading tabIndex={-1} className="text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground outline-none sm:text-5xl">{title}</Heading>
        {body ? <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{body}</p> : null}
      </div>
    </div>
  )
}

export default App
