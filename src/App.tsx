import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react"

import {
  ArrowUpRight,
  Atom,
  Award,
  BookOpen,
  Code2,
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

import { blogCategories, blogPosts, type BlogCategory, type BlogPost } from "@/blog-posts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emailAddress = "wisdom.benson@bison.howard.edu"
const phoneNumber = "+1 984-312-9015"
const fromBase = (path: string) => `${import.meta.env.BASE_URL}${path}`
const sectionHref = (id: string) => `${import.meta.env.BASE_URL}#${id}`
const resumeHref = fromBase("wisdom-benson-resume.docx")

const navItems = [
  { label: "Research", href: sectionHref("research") },
  { label: "Publications", href: sectionHref("publications") },
  { label: "Blog", href: sectionHref("blog") },
  { label: "CV", href: sectionHref("cv") },
  { label: "Experience", href: sectionHref("experience") },
  { label: "Contact", href: sectionHref("contact") },
]

const metrics = [
  { value: "5", label: "journal articles and thesis publications" },
  { value: "1", label: "CRC Press book chapter" },
  { value: "6", label: "conference presentations" },
  { value: "2", label: "APS Student Ambassador terms" },
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
  useEffect(() => {
    if (!window.location.hash) return

    const scrollToHashTarget = () => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" })
    }

    window.requestAnimationFrame(scrollToHashTarget)
    window.setTimeout(scrollToHashTarget, 300)
  }, [])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ResearchSection />
        <PublicationsSection />
        <BlogSection />
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

    event.preventDefault()
    setMobileMenuOpen(false)
    window.history.pushState(null, "", href)
    const scrollToTarget = () => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" })
    }
    window.setTimeout(scrollToTarget, 260)
    window.setTimeout(scrollToTarget, 560)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href={sectionHref("top")} className="group inline-flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="grid size-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold transition-transform group-hover:-translate-y-0.5">
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
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/Wisemanking001" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={`mailto:${emailAddress}`}>
              <Mail className="size-4" aria-hidden="true" />
              Contact
            </a>
          </Button>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
              <Menu className="size-4" aria-hidden="true" />
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
                      <Mail className="size-4" aria-hidden="true" />
                      Email Wisdom
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={resumeHref} onClick={() => setMobileMenuOpen(false)}>
                      <Download className="size-4" aria-hidden="true" />
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
          src={fromBase("assets/zno-qd-coordinate-map.png")}
          alt="Ligand-passivated ZnO quantum dot coordinate map."
          className="hero-image absolute inset-y-0 right-0 z-0 h-full w-full object-cover"
        />
        <div className="hero-veil absolute inset-0 z-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-11rem)] max-w-7xl content-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-3xl space-y-6 reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Silver Spring, MD | Howard University Physics
            </div>
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Wisdom Benson</p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
                First-principles research for quantum dots, perovskites, and Raman spectroscopy.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Physics PhD student building first-principles workflows for ZnO quantum dots, tin-lead perovskite photovoltaics,
                and spectroscopy-guided nanomaterials design.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <a href={sectionHref("publications")}>
                  Publications
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={resumeHref}>
                  <Download className="size-4" aria-hidden="true" />
                  Download resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div data-slot="metrics-strip" className="relative z-10 border-t border-border/80 bg-background/86 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border/80 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-4 py-5 first:pl-0 sm:py-6">
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
        eyebrow="Research"
        title="A materials workflow spanning theory, experiment, and computing."
        body="Current work connects first-principles simulation, Raman spectroscopy, and GPU-enabled HPC workflows for optoelectronic and quantum information materials."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-lg border border-border bg-card">
          <ResearchArtifact kind={researchThreads[0].artifact} />
          <div className="p-6 sm:p-8">
            <ResearchCopy thread={researchThreads[0]} />
          </div>
        </article>
        <div className="grid gap-5">
          {researchThreads.slice(1).map((thread) => (
            <article key={thread.title} className="grid gap-0 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-[0.92fr_1.08fr] lg:grid-cols-1 xl:grid-cols-[0.88fr_1.12fr]">
              <ResearchArtifact kind={thread.artifact} compact />
              <div className="p-6">
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
        <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">{thread.eyebrow}</p>
      </div>
      <h3 className={compact ? "text-xl font-semibold leading-tight" : "text-3xl font-semibold leading-tight"}>{thread.title}</h3>
      <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{thread.body}</p>
    </div>
  )
}

function PublicationsSection() {
  return (
    <section id="publications" data-slot="publications" className="section-wrap border-t border-border">
      <SectionHeader
        eyebrow="Publications"
        title="Articles, a CRC Press chapter, and conference work."
        body="DOI links are wired directly where the publication record exposes them; conference records are listed from the current resume source."
      />
      <Tabs defaultValue="articles" className="mt-10 flex-col">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-lg bg-muted p-1 sm:w-fit">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="chapter">Chapter</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
        </TabsList>
        <TabsContent value="articles" className="mt-7">
          <PublicationGrid items={journalArticles} />
        </TabsContent>
        <TabsContent value="chapter" className="mt-7">
          <PublicationGrid items={bookChapters} />
        </TabsContent>
        <TabsContent value="conferences" className="mt-7">
          <div className="grid gap-3">
            {conferenceItems.map((item) => (
              <div key={`${item.venue}-${item.title}`} className="grid gap-3 rounded-lg border border-border bg-card p-5 sm:grid-cols-[9rem_1fr]">
                <div>
                  <Badge variant="outline">{item.year}</Badge>
                  <p className="mt-3 text-sm font-medium text-primary">{item.venue}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
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
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.title} className="overflow-hidden rounded-lg border-border bg-card shadow-none transition-transform hover:-translate-y-0.5">
          <CardContent className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge>{item.year}</Badge>
                <Badge variant="secondary">{item.venue}</Badge>
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.citation}</p>
              <p className="mt-3 font-mono text-sm text-foreground">{item.doi}</p>
            </div>
            <div className="flex items-start sm:justify-end">
              <Button asChild variant="outline" size="sm">
                <a href={item.href} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Open
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BlogSection() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")
  const [selectedSlug, setSelectedSlug] = useState(blogPosts[0].slug)

  const visiblePosts = useMemo(() => {
    if (activeCategory === "All") return blogPosts
    return blogPosts.filter((post) => post.categories.includes(activeCategory))
  }, [activeCategory])

  const selectedPost = useMemo(() => {
    return visiblePosts.find((post) => post.slug === selectedSlug) ?? visiblePosts[0] ?? blogPosts[0]
  }, [selectedSlug, visiblePosts])

  return (
    <section id="blog" data-slot="blog" className="section-wrap border-t border-border">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <SectionHeader
          eyebrow="Blog"
          title="Field notes across philosophy, computation, and materials research."
          body="A public writing space for essays, research notebooks, build logs, and technical reflections across philosophy, ZnO and perovskite modeling, quantum computing, ML, OCaml, CUDA, and related work."
        />
        <Card className="rounded-lg border-border bg-card shadow-none">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold leading-tight">Public comments are enabled per post.</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Readers can sign in with GitHub and leave comments through the discussion panel beneath each article.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" aria-label="Filter blog posts by topic">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="grid content-start gap-3">
          {visiblePosts.map((post) => (
            <BlogPostButton
              key={post.slug}
              post={post}
              selected={post.slug === selectedPost.slug}
              onSelect={() => setSelectedSlug(post.slug)}
            />
          ))}
        </div>
        <div className="grid gap-4">
          <BlogReader post={selectedPost} />
          <BlogComments post={selectedPost} />
        </div>
      </div>
    </section>
  )
}

function BlogPostButton({ post, selected, onSelect }: { post: BlogPost; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group rounded-lg border border-border bg-card p-4 text-left shadow-none transition-all hover:-translate-y-0.5 hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      data-slot="blog-post-trigger"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={selected ? "default" : "secondary"}>{post.mode}</Badge>
        <span className="text-xs text-muted-foreground">{post.date}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{post.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.summary}</p>
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

function BlogReader({ post }: { post: BlogPost }) {
  return (
    <article data-slot="blog-reader">
      <Card className="rounded-lg border-border bg-card shadow-none">
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{post.mode}</Badge>
            <Badge variant="secondary">{post.readTime}</Badge>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{post.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>

          <Separator className="my-7" />

          <div className="grid gap-7">
            {post.body.map((section) => (
              <section key={section.heading}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
                    <Code2 className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold leading-snug">{section.heading}</h3>
                </div>
                <div className="grid gap-4 text-base leading-8 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  )
}

function BlogComments({ post }: { post: BlogPost }) {
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = commentsRef.current
    if (!container) return

    container.innerHTML = ""
    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("repo", "Wisemanking001/WisdomBenson.github.io")
    script.setAttribute("issue-term", `blog-${post.slug}`)
    script.setAttribute("label", "blog-comment")
    script.setAttribute("theme", "github-light")
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [post.slug])

  return (
    <Card className="rounded-lg border-border bg-card shadow-none" data-slot="blog-comments">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-xl font-semibold leading-tight">Comments</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Comments are public and powered by GitHub Issues. Sign in with GitHub to join the discussion.
            </p>
          </div>
        </div>
        <div ref={commentsRef} className="mt-5 min-h-40 overflow-hidden rounded-md border border-border bg-background/60 p-2" />
      </CardContent>
    </Card>
  )
}

function CVSection() {
  return (
    <section id="cv" data-slot="cv" className="section-wrap border-t border-border">
      <SectionHeader
        eyebrow="CV and resume"
        title="Physics training, computational materials research, and product-building range."
        body="The web CV is structured for scanning; the downloadable resume mirrors the current source document from Downloads."
      />
      <Tabs defaultValue="cv" className="mt-10 flex-col">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-lg bg-muted p-1 sm:w-fit">
          <TabsTrigger value="cv">Curriculum Vitae</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
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
          <div className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
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
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
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
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
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
        title="Research, teaching, mentoring, and software implementation."
        body="The through-line is hands-on scientific computing: from lab instruction and thin-film synthesis to many-body simulation workflows and analytics product work."
      />
      <Accordion type="single" collapsible defaultValue="howard" className="mt-10 rounded-lg border border-border bg-card">
        {experienceItems.map((item, index) => (
          <AccordionItem key={item.role + item.place} value={index === 0 ? "howard" : item.place} className="px-5 sm:px-6">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">{item.role}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {item.place} | {item.period}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-3 pb-5 text-sm leading-6 text-muted-foreground">
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
    <section data-slot="contact" className="section-wrap border-t border-border pb-12">
      <div id="contact" className="grid scroll-mt-20 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-[28rem] border-b border-border lg:border-b-0 lg:border-r">
          <img
            src={fromBase("assets/wisdom-benson-portrait.jpeg")}
            alt="Portrait of Wisdom Benson."
            className="h-full min-h-[28rem] w-full object-cover object-top"
          />
        </div>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Open to research collaboration, conference contact, and academic opportunities.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Reach out for ZnO quantum dot simulations, perovskite characterization, Raman spectroscopy, or computational materials workflows.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">Response expectation:</span> email and phone calls are answered within 24 hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg">
              <a href={`mailto:${emailAddress}`}>
                <Mail className="size-4" aria-hidden="true" />
                {emailAddress}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:+19843129015">
                <Phone className="size-4" aria-hidden="true" />
                {phoneNumber}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://bold.pro/my/wisdom-benson/382r" target="_blank" rel="noreferrer">
                <BookOpen className="size-4" aria-hidden="true" />
                Portfolio
              </a>
            </Button>
          </div>
        </div>
      </div>
      <footer className="mt-10 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Wisdom Benson | Physics, computational materials, and spectroscopy</p>
        <a href={sectionHref("top")} className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
          Back to top
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </footer>
    </section>
  )
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-muted-foreground">{body}</p>
    </div>
  )
}

export default App
