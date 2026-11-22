"use client"

import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Download, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { conferences, education, experience, profile } from "@/content/profile"

const toolkitGroups = [
  {
    category: "First-Principles & DFT",
    items: ["Quantum ESPRESSO", "WEST / PDEP-GW", "SIESTA"],
  },
  {
    category: "Scientific Computing",
    items: ["Python", "C++", "MATLAB"],
  },
  {
    category: "HPC & Typesetting",
    items: ["SDSC Expanse", "LaTeX"],
  },
  {
    category: "AI-Assisted Programming",
    items: ["Rust", "CUDA", "OCaml"],
  },
  {
    category: "App Development (CryptoTrackAI)",
    items: ["React", "TypeScript", "React Native", "Electron", "REST API integration", "Cypress testing"],
  },
] as const

const recognitions = [
  {
    label: "APS Student Ambassador",
    period: "2025–2026 cohort",
    certificate: "/assets/certificates/aps-student-ambassador-2025-2026.pdf",
  },
  {
    label: "APS Student Ambassador",
    period: "2026–2027 cohort",
    certificate: "/assets/certificates/aps-student-ambassador-2026-2027.pdf",
  },
  { label: "APS Advocacy Champion", period: "2025–present" },
  {
    label: "Optica Reviewer Certification Course",
    period: "2026",
    certificate: "/assets/certificates/optica-reviewer-certification-2026.pdf",
  },
  { label: "NCCU International Student Award", period: "2024" },
  { label: "MSc Physics with Honors", period: "2024" },
  { label: "BSc Physics with Honors", period: "2021" },
] as const

function TimelineList({
  items,
}: {
  items: ReadonlyArray<{ period: string; school?: string; degree?: string; role?: string; place?: string; detail: string }>
}) {
  return (
    <ol className="divide-y divide-border/80 border-b border-border/80">
      {items.map((item) => (
        <li
          key={`${item.period}-${item.degree ?? item.role}`}
          className="grid gap-2 py-6 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[8.5rem_minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-10"
        >
          <p className="pt-1 font-mono text-xs text-muted-foreground">{item.period}</p>
          <div>
            <h3 className="font-serif text-xl font-medium leading-snug text-foreground">
              {item.degree ?? item.role}
            </h3>
            <p className="mt-1 text-sm font-medium text-quantum">{item.school ?? item.place}</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground sm:col-start-2 lg:col-start-auto">
            {item.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function CVTimeline() {
  return (
    <section id="cv" className="section-block">
      <div className="site-shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Curriculum Vitae</p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.015em] text-foreground sm:text-5xl">
              A trajectory built across theory and experiment
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end">
            <p className="max-w-md text-base leading-7 text-muted-foreground lg:text-right">
              Academic appointments, education, and selected conference presentations.
            </p>
            <Button
              variant="outline"
              className="h-10 rounded-full border-border bg-card px-5 text-sm font-medium text-foreground shadow-none hover:border-primary/40 hover:bg-quantum-muted/50 hover:text-primary"
              asChild
            >
              <a href={profile.resume} download>
                <Download data-icon="inline-start" aria-hidden="true" />
                Download CV
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="experience" className="mt-10 min-w-0 flex-col">
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap justify-start gap-x-7 gap-y-2 border-b border-border/80 px-0 pb-3 pt-0"
          >
            <TabsTrigger
              value="experience"
              className="h-9 flex-none rounded-none border-0 px-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:inset-x-0 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:opacity-100"
            >
              <BriefcaseBusiness data-icon="inline-start" aria-hidden="true" /> Experience
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="h-9 flex-none rounded-none border-0 px-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:inset-x-0 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:opacity-100"
            >
              <GraduationCap data-icon="inline-start" aria-hidden="true" /> Education
            </TabsTrigger>
            <TabsTrigger
              value="conferences"
              className="h-9 flex-none rounded-none border-0 px-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:inset-x-0 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:opacity-100"
            >
              <CalendarDays data-icon="inline-start" aria-hidden="true" /> Conferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="mt-0">
            <TimelineList items={experience} />
          </TabsContent>
          <TabsContent value="education" className="mt-0">
            <TimelineList items={education} />
          </TabsContent>
          <TabsContent value="conferences" className="mt-0">
            <div className="divide-y divide-border/80 border-b border-border/80">
              {conferences.map((conference) => (
                <article
                  key={`${conference.year}-${conference.title}`}
                  className="grid gap-3 py-6 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-x-6"
                >
                  <span className="pt-1 font-mono text-xs font-medium text-quantum">{conference.year}</span>
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {conference.venue}
                    </p>
                    <h3 className="mt-1.5 max-w-3xl font-serif text-lg font-medium leading-snug text-foreground sm:text-xl">
                      {conference.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{conference.detail}</p>
                  </div>
                  {"href" in conference && conference.href ? (
                    <a
                      href={conference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      Source <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h3 className="eyebrow text-muted-foreground">Computational toolkit</h3>
            <dl className="mt-5 space-y-4">
              {toolkitGroups.map((group) => (
                <div key={group.category} className="grid gap-1.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline">
                  <dt className="text-xs font-medium text-muted-foreground">{group.category}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="eyebrow text-muted-foreground">Recognition</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              {recognitions.map((recognition) => (
                <li key={`${recognition.label}-${recognition.period}`}>
                  {"certificate" in recognition ? (
                    <a
                      href={recognition.certificate}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${recognition.label} ${recognition.period} certificate (PDF)`}
                      className="group inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {recognition.label}
                      <span className="font-normal text-muted-foreground">· {recognition.period}</span>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <span>
                      <span className="font-medium text-foreground">{recognition.label}</span> · {recognition.period}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
