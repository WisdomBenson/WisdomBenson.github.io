"use client"

import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Download, GraduationCap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { conferences, education, experience, profile } from "@/content/profile"

function TimelineList({ items }: { items: ReadonlyArray<{ period: string; school?: string; degree?: string; role?: string; place?: string; detail: string }> }) {
  return (
    <ol className="relative border-l">
      {items.map((item) => (
        <li key={`${item.period}-${item.degree ?? item.role}`} className="relative pb-10 pl-7 last:pb-0">
          <span className="absolute -left-1.5 top-1.5 size-3 rounded-full border-2 border-background bg-quantum" aria-hidden="true" />
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{item.period}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em]">{item.degree ?? item.role}</h3>
          <p className="mt-1 text-sm font-medium text-quantum">{item.school ?? item.place}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.detail}</p>
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
            <p className="max-w-xl text-base leading-7 text-muted-foreground">Academic formation, active research roles, and public conference contributions—presented as evidence, not decoration.</p>
            <Button variant="outline" className="min-h-10" asChild>
              <a href={profile.resume} download><Download data-icon="inline-start" aria-hidden="true" /> Download résumé</a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="experience" className="mt-12 flex-col">
          <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="experience" className="h-11 flex-none rounded-none border-0 px-4 data-[state=active]:bg-transparent data-[state=active]:text-quantum">
              <BriefcaseBusiness data-icon="inline-start" aria-hidden="true" /> Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="h-11 flex-none rounded-none border-0 px-4 data-[state=active]:bg-transparent data-[state=active]:text-quantum">
              <GraduationCap data-icon="inline-start" aria-hidden="true" /> Education
            </TabsTrigger>
            <TabsTrigger value="conferences" className="h-11 flex-none rounded-none border-0 px-4 data-[state=active]:bg-transparent data-[state=active]:text-quantum">
              <CalendarDays data-icon="inline-start" aria-hidden="true" /> Conferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="pt-10"><TimelineList items={experience} /></TabsContent>
          <TabsContent value="education" className="pt-10"><TimelineList items={education} /></TabsContent>
          <TabsContent value="conferences" className="pt-8">
            <div className="divide-y border-y">
              {conferences.map((conference) => (
                <article key={`${conference.year}-${conference.title}`} className="grid gap-4 py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-start sm:px-4">
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

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          <div className="editorial-card p-6">
            <p className="eyebrow text-muted-foreground">Computational toolkit</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Quantum ESPRESSO", "WEST / PDEP-GW", "SIESTA", "Python", "C++", "MATLAB", "LaTeX", "SDSC Expanse"].map((skill) => (
                <Badge key={skill} variant="secondary" className="h-7">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="editorial-card p-6">
            <p className="eyebrow text-muted-foreground">Recognition</p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>APS Student Ambassador · 2026–2027 cohort</li>
              <li>NCCU International Student Award · 2024</li>
              <li>MSc Physics with Honors · 2024</li>
              <li>BSc Physics with Honors · 2021</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
