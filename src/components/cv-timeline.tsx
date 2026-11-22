"use client"

import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Download, GraduationCap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { conferences, education, experience, profile } from "@/content/profile"

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

function TimelineList({ items }: { items: ReadonlyArray<{ period: string; school?: string; degree?: string; role?: string; place?: string; detail: string }> }) {
  return (
    <ol className="divide-y border-b">
      {items.map((item) => (
        <li
          key={`${item.period}-${item.degree ?? item.role}`}
          className="grid gap-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-5 lg:grid-cols-[8rem_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-8"
        >
          <p className="pt-1 font-mono text-xs text-muted-foreground">{item.period}</p>
          <div>
            <h3 className="text-lg font-semibold leading-snug tracking-tight">{item.degree ?? item.role}</h3>
            <p className="mt-1 text-sm font-medium text-quantum">{item.school ?? item.place}</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground sm:col-start-2 lg:col-start-auto">{item.detail}</p>
        </li>
      ))}
    </ol>
  )
}

export function CVTimeline() {
  return (
    <section id="cv" className="section-block">
      <div className="editorial-panel site-shell p-6 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="eyebrow text-quantum">Curriculum vitae</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">A trajectory built across theory and experiment.</h2>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="max-w-xl text-base leading-7 text-muted-foreground">Academic appointments, education, and selected conference presentations.</p>
            <Button variant="outline" className="min-h-10" asChild>
              <a href={profile.resume} download><Download data-icon="inline-start" aria-hidden="true" /> Download CV</a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="experience" className="mt-9 min-w-0 flex-col">
          <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-x-4 gap-y-1 border-b px-0 pb-1 pt-0">
            <TabsTrigger value="experience" className="h-10 flex-none px-0 data-[state=active]:text-quantum data-[state=active]:after:bg-quantum">
              <BriefcaseBusiness data-icon="inline-start" aria-hidden="true" /> Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="h-10 flex-none px-0 data-[state=active]:text-quantum data-[state=active]:after:bg-quantum">
              <GraduationCap data-icon="inline-start" aria-hidden="true" /> Education
            </TabsTrigger>
            <TabsTrigger value="conferences" className="h-10 flex-none px-0 data-[state=active]:text-quantum data-[state=active]:after:bg-quantum">
              <CalendarDays data-icon="inline-start" aria-hidden="true" /> Conferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="pt-2"><TimelineList items={experience} /></TabsContent>
          <TabsContent value="education" className="pt-2"><TimelineList items={education} /></TabsContent>
          <TabsContent value="conferences" className="pt-2">
            <div className="divide-y border-b">
              {conferences.map((conference) => (
                <article key={`${conference.year}-${conference.title}`} className="grid gap-4 py-6 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-start sm:px-4">
                  <Badge variant="outline" className="font-mono text-quantum">{conference.year}</Badge>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">{conference.venue}</p>
                    <h3 className="mt-2 max-w-3xl text-lg font-semibold leading-snug tracking-[-0.025em]">{conference.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{conference.detail}</p>
                  </div>
                  {"href" in conference && conference.href ? (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={conference.href} target="_blank" rel="noreferrer">Source <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></a>
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10 grid gap-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10">
          <div className="border-t pt-5">
            <h3 className="eyebrow text-muted-foreground">Computational toolkit</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Quantum ESPRESSO", "WEST / PDEP-GW", "SIESTA", "Python", "C++", "MATLAB", "LaTeX", "SDSC Expanse"].map((skill) => (
                <Badge key={skill} variant="secondary" className="h-7">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="border-t pt-5">
            <h3 className="eyebrow text-muted-foreground">Recognition</h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
              {recognitions.map((recognition) => (
                <li key={`${recognition.label}-${recognition.period}`}>
                  {"certificate" in recognition ? (
                    <a
                      href={recognition.certificate}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${recognition.label} ${recognition.period} certificate (PDF)`}
                      className="group inline-flex items-center gap-1.5 rounded-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-quantum hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {recognition.label} · {recognition.period}
                      <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span>{recognition.label} · {recognition.period}</span>
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
