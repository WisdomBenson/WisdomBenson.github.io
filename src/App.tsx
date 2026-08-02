import { lazy, Suspense, useEffect, useMemo, useRef, useState, type MouseEvent } from "react"

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Maximize2,
  Menu,
  MessageSquare,
  MoveRight,
} from "lucide-react"

import { blogCategories, type BlogCategory, type BlogPost } from "@/blog-posts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { MaterialField } from "@/components/monograph/material-field"
import { useMonographMotion } from "@/hooks/use-monograph-motion"

const emailAddress = "wisdom.benson@bison.howard.edu"
const phoneNumber = "+1 984-312-9015"
const fromBase = (path: string) => `${import.meta.env.BASE_URL}${path}`
const responsiveSrcSet = (srcSet: string) =>
  srcSet
    .split(",")
    .map((source) => {
      const [path, descriptor] = source.trim().split(/\s+/)
      return `${fromBase(path)} ${descriptor}`
    })
    .join(", ")
const sectionHref = (id: string) => `${import.meta.env.BASE_URL}#${id}`
const resumePdfHref = fromBase("wisdom-benson-resume.pdf")
const resumeDocxHref = fromBase("wisdom-benson-resume.docx")
const blogHref = fromBase("blog/")
const githubIssuesApi = "https://api.github.com/repos/WisdomBenson/WisdomBenson.github.io/issues"
const approvedBlogAuthors = new Set(["wisdombenson", "wisemanking001"])
const MarkdownArticle = lazy(() =>
  import("@/components/markdown-article").then((module) => ({ default: module.MarkdownArticle })),
)

const navItems = [
  { label: "Research", href: sectionHref("research") },
  { label: "Publications", href: sectionHref("publications") },
  { label: "Experience", href: sectionHref("experience") },
  { label: "CV", href: sectionHref("cv") },
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

type ConferenceItem = {
  title: string
  venue: string
  year: string
  details: string
  href?: string
  sourceLabel?: string
}

const proofPoints = [
  { value: "First author", label: "AIP Advances · ZnO quantum dots · 2026" },
  { value: "First author", label: "JPCS · mixed Sn-Pb perovskites · 2026" },
  { value: "HPC workflows", label: "Quantum ESPRESSO + WEST · Expanse + ANL-CNM" },
  { value: "First author", label: "CRC Press · quantum-dot applications · 2026" },
]

const researchThreads = [
  {
    index: "01",
    eyebrow: "Ongoing passivation work + published foundation",
    title: "Mapping passivation in finite ZnO nanocrystals",
    question:
      "How do finite size, surface termination, and many-body corrections alter the band edges and electromechanical behavior of ZnO quantum dots?",
    contribution:
      "I build and validate first-principles workflows spanning DFT, DFPT, and ongoing PDEP-GW calculations on ligand-passivated nanocrystals.",
    outcome:
      "The coordinate map documents ongoing ligand-passivation models. The linked first-author AIP paper provides the published DFT foundation for this next stage of work.",
    methods: ["DFT", "DFPT", "PDEP-GW"],
    image: "assets/zno-qd-coordinate-map-1400.webp",
    imageSrcSet:
      "assets/zno-qd-coordinate-map-800.webp 800w, assets/zno-qd-coordinate-map-1400.webp 1400w",
    imageWidth: 1400,
    imageHeight: 1572,
    imageAlt: "Atomic coordinate map for ligand-passivated zinc oxide quantum dots.",
    figureCaption: "Atomic coordinate indexing across hydroxyl- and acetate-passivated ZnO structures.",
    proofHref: "https://doi.org/10.1063/5.0303211",
    proofLabel: "Read the AIP Advances paper",
  },
  {
    index: "02",
    eyebrow: "Spectral record",
    title: "Room-temperature Raman response under 488 nm excitation",
    question: "What does the room-temperature vibrational response reveal under 488 nm excitation?",
    contribution:
      "I analyze Raman spectra alongside computational phonon workflows, keeping the measured trace and the model interpretation explicitly separated.",
    outcome:
      "The figure shows the available room-temperature 488 nm plotted spectrum for this stage of the ZnO quantum-dot study.",
    methods: ["488 nm excitation", "Room temperature", "Spectral analysis"],
    image: "assets/raman-spectrum-488nm-rt-1400.webp",
    imageSrcSet:
      "assets/raman-spectrum-488nm-rt-800.webp 800w, assets/raman-spectrum-488nm-rt-1400.webp 1400w",
    imageWidth: 1400,
    imageHeight: 955,
    imageAlt: "Room-temperature Raman spectrum for ZnO quantum dots under 488 nanometer laser excitation.",
    figureCaption:
      "ZnO QD 7B at room temperature under 488 nm excitation; plotted intensity shown against Raman shift.",
    proofHref: null,
    proofLabel: null,
  },
  {
    index: "03",
    eyebrow: "First-author experimental study",
    title: "Engineering stable near-IR tin-lead perovskites",
    question: "How can mixed-cation chemistry tune stability and near-IR response in Sn-Pb perovskite films?",
    contribution:
      "I synthesized and optically characterized mixed tin-lead thin films, connecting composition to bandgap response and storage stability.",
    outcome:
      "The resulting first-author paper reports multi-cation engineering as a route to near-IR tunability and improved material stability.",
    methods: ["Thin-film synthesis", "Optical characterization", "Near-IR response"],
    image: null,
    imageSrcSet: null,
    imageWidth: null,
    imageHeight: null,
    imageAlt: "",
    figureCaption: "",
    proofHref: "https://doi.org/10.1016/j.jpcs.2025.113511",
    proofLabel: "Read the JPCS paper",
  },
]

const journalArticles = [
  {
    title: "Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory",
    citation: "Benson, W., Adams, C., Baral, B., & Misra, P. AIP Advances, 16(2), 025236, 2026.",
    venue: "AIP Advances",
    year: "2026",
    doi: "10.1063/5.0303211",
    href: "https://doi.org/10.1063/5.0303211",
    contribution: "First author",
    kind: "Article",
    tags: ["DFT", "ZnO quantum dots", "AIP"],
  },
  {
    title: "Enhanced stability and near-IR tunability in tin-lead perovskites via multi-cation engineering",
    citation: "Benson, W. H., Adesina, K. E., Fowodu, T. O., & Smart, G. M. Journal of Physics and Chemistry of Solids, 211, 113511, 2026.",
    venue: "Journal of Physics and Chemistry of Solids",
    year: "2026",
    doi: "10.1016/j.jpcs.2025.113511",
    href: "https://doi.org/10.1016/j.jpcs.2025.113511",
    contribution: "First author",
    kind: "Article",
    tags: ["Perovskites", "near-IR", "Elsevier"],
  },
  {
    title: "Romantic exclusivity as structural necessity: A Kantian-Scheler-Schopenhauer synthesis in contemporary discourse",
    citation: "Benson, W. H. Philosophies, 10(5), 102, 2025.",
    venue: "Philosophies",
    year: "2025",
    doi: "10.3390/philosophies10050102",
    href: "https://doi.org/10.3390/philosophies10050102",
    contribution: "Sole author",
    kind: "Article",
    tags: ["Philosophy", "ethics", "MDPI"],
  },
  {
    title: "Synthesis and optical characterization of lead-tin alloy perovskites for photovoltaic applications",
    citation: "Benson, W. Master's thesis, North Carolina Central University, 2024.",
    venue: "ProQuest",
    year: "2024",
    doi: "ProQuest publication no. 31237299",
    href: "https://www.proquest.com/docview/3176103303",
    contribution: "Author",
    kind: "Master's thesis",
    tags: ["Thesis", "perovskites", "optical characterization"],
  },
  {
    title: "Analysis of a steady MHD mixed convection fluid flow in a microchannel within permeable walls with suction and injection parameters",
    citation: "OALib, 10(07), 1-9, 2023.",
    venue: "OALib",
    year: "2023",
    doi: "10.4236/oalib.1110363",
    href: "https://www.oalib.com/articles/6798430",
    contribution: "Coauthor",
    kind: "Article",
    tags: ["MHD", "microchannel flow", "fluid dynamics"],
  },
]

const bookChapters = [
  {
    title: "Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications",
    citation: "Benson, W., Bandopadhyay, S., Adams, C., Baral, B., & Misra, P. In Nanoelectronics, pp. 169-197. CRC Press, 2026.",
    venue: "Nanoelectronics, CRC Press",
    year: "2026",
    doi: "10.1201/9781003512899-8",
    href: "https://doi.org/10.1201/9781003512899-8",
    contribution: "First author",
    kind: "Book chapter",
    tags: ["Book chapter", "quantum dots", "nanoelectronics"],
  },
]

const selectedMaterialsPublications = [journalArticles[0], journalArticles[1], bookChapters[0]]
const additionalScholarship = [journalArticles[2], journalArticles[3], journalArticles[4]]

const conferenceItems: ConferenceItem[] = [
  {
    title: "Quantifying Surface-Driven Band-Edge Control in ZnO Quantum Dots Using the GW Approximation and Density Functional Theory",
    venue: "2026 MRS Spring Meeting & Exhibit",
    year: "2026",
    details: "Presented on April 29, 2026, in Symposium QT03: Quantum Information Generation and Processing.",
    href: "https://www.mrs.org/docs/default-source/meetings-events/spring-meetings/2026/2026-mrs-spring-meeting-program.pdf",
    sourceLabel: "View MRS program",
  },
  {
    title: "Spectroscopic Characterization and Modeling and Simulation of Zinc Oxide and Zinc Sulfide Quantum Dots",
    venue: "APS Global Physics Summit",
    year: "2026",
    details: "First-author contribution; presented by PI Prabhakar Misra at the APS Global Physics Summit on March 20, 2026.",
    href: "https://meetings-archive.aps.org/smt/2026/mar-y17/8/",
    sourceLabel: "View APS abstract",
  },
  {
    title: "Spin-orbit coupling and piezoelectric properties of zinc oxide quantum dots using first-principles calculations",
    venue: "APS Global Physics Summit",
    year: "2025",
    details: "Coauthor; presented by Prabhakar Misra at the APS Global Physics Summit on March 18, 2025.",
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
      "Develop computational workflows for electronic-structure calculations and research analysis.",
    ],
  },
  {
    role: "Graduate Research & Teaching Assistant",
    place: "North Carolina Central University",
    period: "Aug. 2022 - May 2024",
    bullets: [
      "Synthesized and optically characterized perovskite thin films with statistical analysis of experimental results.",
      "Taught practical physics laboratory sections and supported undergraduate academic mentoring.",
      "Presented research at national conferences and contributed to peer-reviewed publications.",
    ],
  },
  {
    role: "Classroom Teacher, Physics",
    place: "God's Will Academy",
    period: "Feb. 2022 - July 2022",
    bullets: [
      "Developed and delivered physics lesson plans across secondary-school levels.",
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
    label: "Characterization",
    items: ["Raman spectroscopy", "Optical spectroscopy", "Thin-film synthesis", "Spectral analysis"],
  },
  {
    label: "Research workflows",
    items: ["SDSC Expanse", "ANL-CNM resources", "Convergence testing", "Workflow validation", "Research analysis"],
  },
]

const awards = [
  "APS Student Ambassador, 2026-2027 cohort",
  "NCCU International Student Award, 2024",
  "MSc Physics with Honors, North Carolina Central University, 2024",
  "BSc Physics with Honors, University of Nigeria Nsukka, 2021",
]

function App() {
  const isBlogPage = window.location.pathname.endsWith("/blog/") || window.location.pathname.endsWith("/blog/index.html")

  useMonographMotion(!isBlogPage)

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
        <ExperienceSection />
        <CVSection />
        <ContactSection />
      </main>
    </div>
  )
}

function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || "top")
  const pendingMobileTarget = useRef<string | null>(null)

  useEffect(() => {
    if (window.location.pathname.includes("/blog")) return

    const sections = ["top", ...navItems.map((item) => item.href.split("#")[1])]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: "-18% 0px -68%", threshold: [0, 0.2, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleMobileSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.split("#")[1]
    if (!targetId) return

    event.preventDefault()
    pendingMobileTarget.current = targetId
    window.history.pushState(null, "", href)
    setMobileMenuOpen(false)
  }

  return (
    <header className="monograph-header sticky top-0 z-20 border-b border-border bg-background/94 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a
          href={sectionHref("top")}
          aria-label="Wisdom Benson — home"
          className="group inline-flex min-h-11 items-center gap-3"
        >
          <span className="grid size-9 place-items-center border border-foreground bg-foreground font-mono text-[0.68rem] font-semibold tracking-[0.08em] text-background transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true">
            WB
          </span>
          <span className="grid leading-none">
            <span className="text-sm font-semibold tracking-[-0.02em]">Wisdom Benson</span>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-muted-foreground">Research monograph</span>
          </span>
        </a>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-0">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  data-active={activeSection === item.href.split("#")[1] ? "true" : undefined}
                  aria-current={activeSection === item.href.split("#")[1] ? "location" : undefined}
                  className="monograph-nav-link px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-[active=true]:text-foreground"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href={resumePdfHref} download>
              <Download data-icon="inline-start" aria-hidden="true" />
              Résumé
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={`mailto:${emailAddress}`}>
              <Mail data-icon="inline-start" aria-hidden="true" />
              Start a conversation
            </a>
          </Button>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-11 lg:hidden" aria-label="Open navigation">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(86vw,24rem)] p-0 [&_[data-slot=sheet-close]]:size-11"
            onCloseAutoFocus={(event) => {
              const targetId = pendingMobileTarget.current
              if (!targetId) return
              event.preventDefault()
              pendingMobileTarget.current = null
              const target = document.getElementById(targetId)
              if (!target) return
              target.scrollIntoView({ block: "start" })
              target.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true })
            }}
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <ScrollArea className="h-dvh">
              <div className="flex min-h-dvh flex-col gap-9 p-6 pt-18">
                <div>
                  <p className="font-serif text-3xl leading-none">Wisdom Benson</p>
                  <p className="mt-3 max-w-[24ch] text-sm leading-6 text-muted-foreground">Physics PhD researcher in computational materials and spectroscopy.</p>
                </div>
                <nav className="grid gap-1">
                  {navItems.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      aria-current={activeSection === item.href.split("#")[1] ? "location" : undefined}
                      onClick={(event) => handleMobileSectionClick(event, item.href)}
                      className="grid min-h-12 grid-cols-[2rem_1fr_auto] items-center border-b border-border text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="font-mono text-[0.68rem] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.label}</span>
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </a>
                  ))}
                </nav>
                <Separator />
                <div className="grid gap-3">
                  <Button asChild variant="ghost">
                    <a href={blogHref} onClick={() => setMobileMenuOpen(false)}>
                      <FileText data-icon="inline-start" aria-hidden="true" />
                      Writing
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={`mailto:${emailAddress}`} onClick={() => setMobileMenuOpen(false)}>
                      <Mail data-icon="inline-start" aria-hidden="true" />
                      Email Wisdom
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={resumePdfHref} download onClick={() => setMobileMenuOpen(false)}>
                      <Download data-icon="inline-start" aria-hidden="true" />
                      Résumé (PDF)
                    </a>
                  </Button>
                </div>
                <p className="mt-auto font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Silver Spring, Maryland · EDT</p>
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
    <section id="top" data-slot="hero" className="monograph-hero relative isolate overflow-hidden border-b border-border">
      <div className="monograph-hero__field" data-ambient aria-hidden="true">
        <MaterialField />
      </div>
      <div className="mx-auto grid max-w-[90rem] lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]">
        <div className="monograph-hero__copy flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-20">
          <div className="hero-enter hero-enter--one flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-primary">
            <span>Monograph 01</span>
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
            <span>Computational materials</span>
          </div>
          <h1
            tabIndex={-1}
            className="destination-heading hero-enter hero-enter--two mt-7 max-w-[10.5ch] font-serif text-[3.35rem] font-medium leading-[0.9] tracking-[-0.055em] text-foreground sm:text-[4.8rem] lg:text-[clamp(4.6rem,6.4vw,7rem)]"
          >
            I model matter before it becomes material.
          </h1>
          <figure className="hero-enter hero-enter--three mt-7 overflow-hidden border border-border bg-muted lg:hidden">
            <div className="relative aspect-[16/7]">
              <img
                src={fromBase("assets/wisdom-benson-portrait.jpeg")}
                alt="Portrait of Wisdom Benson."
                width="1023"
                height="1537"
                fetchPriority="high"
                className="size-full object-cover object-[center_25%]"
              />
              <div className="portrait-plate__wash" aria-hidden="true" />
              <span className="portrait-plate__index font-mono text-[0.68rem] uppercase tracking-[0.12em] text-background">Wisdom Benson · Howard University</span>
            </div>
          </figure>
          <p className="hero-enter hero-enter--three mt-7 max-w-[58ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I connect first-principles physics, Raman spectroscopy, and computational workflows to explain how nanoscale materials behave.
          </p>
          <div className="hero-enter hero-enter--four mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group min-h-11 px-5">
              <a href={sectionHref("research")}>
                Enter the research
                <ArrowUpRight data-icon="inline-end" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 px-5">
              <a href={resumePdfHref} download>
                <Download data-icon="inline-start" aria-hidden="true" />
                Résumé
              </a>
            </Button>
          </div>
          <div className="hero-enter hero-enter--five mt-10 max-w-2xl border-y border-border py-4">
            <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">Current question</span>
              <span className="text-sm leading-6 text-muted-foreground">How do finite size, passivation, and many-body effects reshape ZnO quantum-dot response?</span>
            </div>
          </div>
        </div>
        <div className="monograph-hero__portrait relative hidden items-end px-4 pb-10 sm:px-6 lg:flex lg:px-10 lg:pb-14 lg:pt-12">
          <figure className="hero-enter hero-enter--portrait relative ml-auto w-full max-w-[34rem]" data-ambient>
            <div className="portrait-plate relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={fromBase("assets/wisdom-benson-portrait.jpeg")}
                alt="Portrait of Wisdom Benson."
                width="1023"
                height="1537"
                fetchPriority="high"
                className="size-full object-cover object-[center_18%]"
              />
              <div className="portrait-plate__wash" aria-hidden="true" />
              <span className="portrait-plate__index font-mono text-[0.68rem] uppercase tracking-[0.13em] text-background">Fig. 00 / Researcher</span>
            </div>
            <figcaption className="grid grid-cols-[1fr_auto] gap-5 border-b border-border py-4 text-xs leading-5 text-muted-foreground">
              <span>Wisdom Benson · Physics PhD researcher at Howard University</span>
              <span className="font-mono uppercase tracking-[0.1em]">Silver Spring, MD</span>
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="mx-auto grid max-w-[90rem] border-t border-border px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6 lg:px-10">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">DFT · DFPT · PDEP-GW · Raman · Spectral analysis</p>
        <a href={`mailto:${emailAddress}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary sm:mt-0">
          Open to computational-materials research opportunities
          <MoveRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function ResearchSection() {
  const featuredThreads = researchThreads.slice(0, 2)
  const supportingThread = researchThreads[2]

  return (
    <section id="research" data-slot="research" className="monograph-section section-wrap">
      <SectionHeader
        index="01"
        eyebrow="Investigations"
        title="Two ways of asking the same question: what is the material telling us?"
        body="The model and the measurement stay distinct. Together, they define the next question without overstating what either can prove alone."
      />
      <div className="mt-12 border-t border-border sm:mt-16">
        {featuredThreads.map((thread, threadIndex) => (
          <article
            key={thread.title}
            data-reveal
            className="research-chapter grid gap-8 border-b border-border py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center lg:gap-16 lg:py-24"
          >
            <figure
              data-ambient
              className={`research-figure order-2 overflow-hidden bg-card ${threadIndex % 2 === 1 ? "lg:order-2" : "lg:order-none"}`}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                  Evidence plate {thread.index}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-primary">Open figure</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className={`group relative block w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                      thread.index === "02" ? "aspect-[5/3]" : "aspect-[4/3]"
                    }`}
                    aria-label={`Enlarge figure: ${thread.imageAlt}`}
                  >
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={responsiveSrcSet(thread.imageSrcSet!)}
                        sizes="(min-width: 1024px) 58vw, 100vw"
                      />
                      <img
                        src={fromBase(thread.image!)}
                        alt={thread.imageAlt}
                        width={thread.imageWidth!}
                        height={thread.imageHeight!}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-contain object-center"
                      />
                    </picture>
                    <span className="absolute bottom-4 right-4 grid size-11 place-items-center border border-border bg-background text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <Maximize2 className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[92dvh] overflow-y-auto p-4 [&_[data-slot=dialog-close]]:size-11 sm:max-w-[min(94vw,76rem)] sm:p-6">
                  <DialogTitle>{thread.title}</DialogTitle>
                  <DialogDescription>{thread.figureCaption}</DialogDescription>
                  <div className={thread.index === "02" ? "mt-2 aspect-[5/3] overflow-hidden bg-muted" : "mt-2"}>
                    <img
                      src={fromBase(thread.image!)}
                      srcSet={responsiveSrcSet(thread.imageSrcSet!)}
                      sizes="94vw"
                      alt={thread.imageAlt}
                      width={thread.imageWidth!}
                      height={thread.imageHeight!}
                      className="max-h-[76dvh] size-full object-contain object-center"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <figcaption className="grid gap-2 border-t border-border px-4 py-4 text-xs leading-5 text-muted-foreground sm:grid-cols-[5rem_1fr]">
                <span className="font-mono uppercase tracking-[0.1em] text-primary">Caption</span>
                <span>{thread.figureCaption}</span>
              </figcaption>
            </figure>
            <ResearchCopy thread={thread} />
          </article>
        ))}
        <article data-reveal className="research-coda grid gap-8 border-b border-border py-12 sm:py-16 lg:grid-cols-[0.38fr_1fr] lg:gap-16 lg:py-20">
          <div className="flex items-start gap-4">
            <span className="font-serif text-6xl leading-none text-primary/30">03</span>
            <span className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Experimental origin</span>
          </div>
          <div className="max-w-3xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">{supportingThread.eyebrow}</p>
            <h3 className="mt-5 font-serif text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl">{supportingThread.title}</h3>
            <p className="mt-6 max-w-[65ch] text-base leading-7 text-muted-foreground">{supportingThread.contribution} {supportingThread.outcome}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {supportingThread.methods.map((method) => <Badge key={method} variant="outline">{method}</Badge>)}
            </div>
            {supportingThread.proofHref ? (
              <Button asChild variant="link" className="mt-5 h-auto justify-start px-0">
                <a href={supportingThread.proofHref} target="_blank" rel="noreferrer">
                  Read the first-author paper
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  )
}

function ResearchCopy({
  thread,
}: {
  thread: (typeof researchThreads)[number]
}) {
  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4">
        <span className="font-serif text-5xl leading-none text-primary/30">{thread.index}</span>
        <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {thread.eyebrow}
        </p>
      </div>
      <h3 className="mt-6 font-serif text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl">{thread.title}</h3>
      <dl className="mt-8 border-t border-border">
        <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[6.5rem_1fr]">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">Question</dt>
          <dd className="text-sm leading-6 text-muted-foreground">{thread.question}</dd>
        </div>
        <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[6.5rem_1fr]">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">My role</dt>
          <dd className="text-sm leading-6 text-muted-foreground">{thread.contribution}</dd>
        </div>
        <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[6.5rem_1fr]">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">Evidence</dt>
          <dd className="text-sm leading-6 text-foreground/82">{thread.outcome}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {thread.methods.map((method) => (
          <Badge key={method} variant="outline">{method}</Badge>
        ))}
      </div>
      {thread.proofHref && thread.proofLabel ? (
        <Button asChild variant="link" className="mt-5 h-auto justify-start px-0 text-primary">
          <a href={thread.proofHref} target="_blank" rel="noreferrer">
            {thread.proofLabel}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      ) : null}
    </div>
  )
}

function PublicationsSection() {
  return (
    <section id="publications" data-slot="publications" className="monograph-section section-wrap border-t border-border">
      <SectionHeader
        index="02"
        eyebrow="Selected record"
        title="Work that can be opened, read, and challenged."
        body="Peer-reviewed materials research leads the record. Every selected work links to its source. Two new manuscripts are currently under editorial review."
      />
      <div className="mt-12 sm:mt-16">
        <PublicationGrid items={selectedMaterialsPublications} />
      </div>
      <Accordion type="single" collapsible className="publication-index mt-8 border-b border-border">
        <AccordionItem value="additional-record">
          <AccordionTrigger className="min-h-20 py-4 text-left hover:no-underline">
            <span className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 pr-4">
              <span className="font-serif text-2xl font-normal text-primary/45">04</span>
              <span className="grid gap-1">
                <span className="font-serif text-xl font-medium">Additional scholarship</span>
                <span className="text-sm font-normal text-muted-foreground">Philosophy, thesis research, and interdisciplinary work</span>
              </span>
              <span className="hidden font-mono text-[0.68rem] font-normal uppercase tracking-[0.1em] text-muted-foreground sm:block">{additionalScholarship.length} works</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-8">
            <PublicationGrid items={additionalScholarship} compact />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="conference-record">
          <AccordionTrigger className="min-h-20 py-4 text-left hover:no-underline">
            <span className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 pr-4">
              <span className="font-serif text-2xl font-normal text-primary/45">05</span>
              <span className="grid gap-1">
                <span className="font-serif text-xl font-medium">Conference record</span>
                <span className="text-sm font-normal text-muted-foreground">Selected talks, posters, and research meetings</span>
              </span>
              <span className="hidden font-mono text-[0.68rem] font-normal uppercase tracking-[0.1em] text-muted-foreground sm:block">{conferenceItems.length} entries</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-8">
            <div className="border-t border-border">
              {conferenceItems.map((item, index) => (
                <div key={`${item.venue}-${item.title}`} className="grid gap-4 border-b border-border py-6 sm:grid-cols-[4rem_9rem_1fr]">
                  <span className="font-serif text-2xl text-primary/45">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{item.year}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{item.venue}</p>
                  </div>
                  <div>
                    <h3 className="max-w-4xl text-base font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.details}</p>
                    {item.href ? (
                      <Button asChild variant="link" size="sm" className="mt-3 h-auto border-0 px-0 py-1 text-muted-foreground hover:text-foreground">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${item.sourceLabel ?? "View official record"} (opens in a new tab)`}
                        >
                          {item.sourceLabel ?? "View official record"}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

function PublicationGrid({ items, compact = false }: { items: typeof journalArticles; compact?: boolean }) {
  return (
    <div className="border-t border-border">
      {items.map((item, index) => (
        <article key={item.title} data-reveal className="publication-row group grid gap-5 border-b border-border py-8 transition-colors sm:grid-cols-[4rem_9rem_1fr_auto] sm:items-start sm:py-10">
          <span className="font-serif text-3xl leading-none text-primary/35">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{item.year}</p>
            <p className="mt-2 text-sm font-medium text-primary">{item.venue}</p>
          </div>
          <div>
            <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{item.contribution} · {item.kind}</p>
            <h3 className={`${compact ? "text-lg" : "font-serif text-2xl sm:text-3xl"} max-w-4xl font-medium leading-snug tracking-[-0.02em]`}>{item.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.citation}</p>
            <p className="mt-4 font-mono text-[0.68rem] text-foreground">{item.doi}</p>
          </div>
          <Button asChild variant="ghost" size="icon" className="publication-open size-11 shrink-0" aria-label={`Open publication: ${item.title}`}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open publication: ${item.title} (opens in a new tab)`}
            >
              <ArrowUpRight aria-hidden="true" />
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
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 9000)

  try {
    for (let page = 1; ; page += 1) {
      const query = new URLSearchParams({
        state: "open",
        labels: "blog-post",
        per_page: "100",
        page: String(page),
      })
      const response = await fetch(`${githubIssuesApi}?${query}`, { signal: controller.signal })
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`)

      const batch = (await response.json()) as GitHubIssue[]
      issues.push(...batch)
      if (batch.length < 100) return issues
    }
  } finally {
    window.clearTimeout(timeout)
  }
}

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get("post"),
  )
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

  useEffect(() => {
    function restorePostFromHistory() {
      setSelectedSlug(new URLSearchParams(window.location.search).get("post"))
    }

    window.addEventListener("popstate", restorePostFromHistory)
    return () => window.removeEventListener("popstate", restorePostFromHistory)
  }, [])

  useEffect(() => {
    if (!selectedPost) return
    document.title = `${selectedPost.title} | Wisdom Benson`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", selectedPost.summary)
  }, [selectedPost])

  function selectBlogPost(slug: string) {
    setSelectedSlug(slug)
    const url = new URL(window.location.href)
    url.searchParams.set("post", slug)
    window.history.pushState(null, "", url)
    window.setTimeout(() => document.getElementById("blog-reader-heading")?.focus(), 0)
  }

  return (
    <section id="blog" data-slot="blog" className="section-wrap min-w-0">
      <SectionHeader
        eyebrow="Writing"
        title="Field notes across computation, materials research, and philosophy."
        body="Essays, research notes, and build logs written for readers who care about how ideas are tested, interpreted, and made useful."
        headingLevel="h1"
      />

      {postStatus === "error" ? (
        <Alert className="mt-8">
          <MessageSquare aria-hidden="true" />
          <AlertTitle>Writing is temporarily unavailable</AlertTitle>
          <AlertDescription>
            The article index could not be reached. Please refresh in a moment or return to the portfolio.
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
            <EmptyTitle>Writing archive in progress</EmptyTitle>
            <EmptyDescription>Research notes and essays will appear here as they are published.</EmptyDescription>
          </EmptyHeader>
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
                    onSelect={() => selectBlogPost(post.slug)}
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
      aria-controls="blog-reader"
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
    <article id="blog-reader" data-slot="blog-reader" className="min-w-0">
      <Card className="min-w-0">
        <CardHeader className="gap-4 px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{post.mode}</Badge>
            <Badge variant="secondary">{post.readTime}</Badge>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <CardTitle>
            <h2 id="blog-reader-heading" tabIndex={-1} className="destination-heading text-2xl leading-tight sm:text-4xl">
              {post.title}
            </h2>
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
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <MarkdownArticle>{post.rawBody}</MarkdownArticle>
          </Suspense>
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
    <section id="cv" data-slot="cv" className="cv-shell border-y border-border bg-muted/45">
      <div className="section-wrap">
        <div className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            index="04"
            eyebrow="Working practice"
            title="Methods deep enough for the physics; systems disciplined enough for the evidence."
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="min-h-11 w-full px-5 sm:w-auto">
              <a href={resumePdfHref} download>
                <Download data-icon="inline-start" aria-hidden="true" />
                Download résumé (PDF)
              </a>
            </Button>
            <Button asChild variant="ghost" className="min-h-11">
              <a href={resumeDocxHref} download>
                <FileText data-icon="inline-start" aria-hidden="true" />
                Editable DOCX
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div data-reveal>
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">Methods and tools</p>
            <div className="mt-6 border-t border-border">
              {skillGroups.map((group, index) => (
                <div key={group.label} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_10rem_1fr]">
                  <span className="font-serif text-2xl text-primary/40">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-sm font-semibold">{group.label}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{group.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div>
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">Selected capabilities</p>
              <div className="mt-6 border-t border-border">
                {proofPoints.map((proof, index) => (
                  <div key={proof.label} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[2.5rem_1fr]">
                    <span className="font-mono text-[0.68rem] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-sm font-semibold">{proof.value}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{proof.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">Recognition</p>
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
    <section id="experience" data-slot="experience" className="monograph-section section-wrap border-t border-border">
      <SectionHeader
        index="03"
        eyebrow="Trajectory"
        title="Nsukka → Durham → Washington, DC."
        body="A path from theoretical physics to thin-film experiments, then into first-principles nanomaterials and computational research workflows."
      />
      <ol data-reveal className="career-trajectory relative mt-12 border-y border-border sm:mt-16">
        {[...educationItems].reverse().map((item, index) => (
          <li key={item.school} className="career-stop grid gap-4 border-b border-border py-8 last:border-b-0 sm:grid-cols-[5rem_13rem_1fr] sm:py-10">
            <div className="career-stop__node relative flex items-start">
              <span className="grid size-8 place-items-center border border-primary bg-background font-serif text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">{item.school}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.meta}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium leading-tight tracking-[-0.025em] sm:text-3xl">{item.degree}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid gap-8 lg:grid-cols-[0.38fr_1fr] lg:gap-16">
        <div data-reveal>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">Appointments</p>
          <h3 className="mt-4 max-w-[12ch] font-serif text-4xl font-medium leading-none tracking-[-0.035em]">Research, teaching, and workflow ownership.</h3>
        </div>
        <Accordion type="single" collapsible defaultValue="howard" className="border-t border-border">
        {experienceItems.map((item, index) => (
          <AccordionItem
            key={item.role + item.place}
            value={index === 0 ? "howard" : item.place}
            className="border-b border-border bg-transparent shadow-none"
          >
            <AccordionTrigger className="rounded-none border-0 px-0 py-6 text-left hover:no-underline focus-visible:ring-2 sm:py-7">
              <div className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <span className="font-mono text-[0.68rem] font-normal uppercase tracking-[0.12em] text-primary">{item.place}</span>
                <span className="font-serif text-xl font-medium">{item.role}</span>
                <span className="text-sm font-normal text-muted-foreground sm:col-start-2">{item.period}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-7 sm:pl-[13rem] sm:pr-12">
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
      </div>
    </section>
  )
}

function ContactSection() {
  const [emailCopied, setEmailCopied] = useState(false)

  async function copyEmail() {
    let copied: boolean

    try {
      await navigator.clipboard.writeText(emailAddress)
      copied = true
    } catch {
      const helper = document.createElement("textarea")
      helper.value = emailAddress
      helper.setAttribute("readonly", "")
      helper.style.position = "fixed"
      helper.style.opacity = "0"
      document.body.appendChild(helper)
      helper.select()
      copied = document.execCommand("copy")
      helper.remove()
    }

    if (!copied) return
    setEmailCopied(true)
    window.setTimeout(() => setEmailCopied(false), 2200)
  }

  return (
    <section id="contact" data-slot="contact" className="contact-shell scroll-mt-20">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:px-10 lg:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4">
            <span className="font-serif text-4xl text-primary">05</span>
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Correspondence</p>
          </div>
          <h2 tabIndex={-1} className="destination-heading mt-7 max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            Bring me the material question that refuses an easy answer.
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground">
            I am open to computational-materials research, doctoral collaborations, and roles involving electronic structure, spectroscopy, or HPC workflows.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-stretch">
          <Button asChild size="lg" className="min-h-11 px-5">
            <a href={`mailto:${emailAddress}`}>
              <Mail data-icon="inline-start" aria-hidden="true" />
              Email Wisdom
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-h-11 px-5"
            onClick={() => void copyEmail()}
          >
            {emailCopied ? <Check data-icon="inline-start" aria-hidden="true" /> : <Copy data-icon="inline-start" aria-hidden="true" />}
            {emailCopied ? "Email copied" : "Copy email address"}
          </Button>
          <span className="sr-only" aria-live="polite">
            {emailCopied ? "Email address copied to clipboard." : ""}
          </span>
          <Button asChild variant="ghost" size="lg" className="min-h-11">
            <a href={resumePdfHref} download>
              <Download data-icon="inline-start" aria-hidden="true" />
              Download résumé (PDF)
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="min-h-11">
            <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
            Silver Spring, Maryland · {phoneNumber}
          </p>
        </div>
      </div>
      <footer className="mx-auto flex max-w-[90rem] flex-col gap-3 border-t border-border px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>Wisdom Benson | Physics, computational materials, and spectroscopy</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={blogHref} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
            Writing
          </a>
          <a href="https://github.com/WisdomBenson" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href={sectionHref("top")} className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Back to top
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
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
    <div data-reveal className="section-heading grid gap-7 lg:grid-cols-[0.58fr_1.42fr] lg:gap-16">
      <div className="flex items-start gap-4">
        {index ? <span className="font-serif text-4xl leading-none text-primary/40">{index}</span> : null}
        <p className="mt-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">{eyebrow}</p>
      </div>
      <div className="max-w-4xl">
        <Heading tabIndex={-1} className="destination-heading font-serif text-4xl font-medium leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl">{title}</Heading>
        {body ? <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{body}</p> : null}
      </div>
    </div>
  )
}

export default App
