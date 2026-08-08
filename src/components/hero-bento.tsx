"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowDownRight,
  ArrowUpRight,
  Atom,
  BookOpenText,
  Check,
  Copy,
  MapPin,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { affiliations, metrics, profile } from "@/content/profile"

async function copyEmail() {
  await navigator.clipboard.writeText(profile.email)
  toast.success("Email copied", { description: profile.email })
}

export function HeroBento() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="relative overflow-hidden border-b">
      <div className="surface-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="site-shell py-6 sm:py-8 lg:py-10">
        <div className="grid auto-rows-[minmax(8rem,auto)] grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[29rem] flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 md:col-span-6 lg:col-span-7 lg:p-9"
          >
            <div className="absolute right-0 top-0 size-48 rounded-full bg-quantum/10 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow text-quantum">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Howard University · Physics PhD
              </p>
              <h1 className="mt-8 max-w-3xl text-balance text-[clamp(3.2rem,8vw,6.65rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
                Quantum matter.<br />
                <span className="text-muted-foreground">Human meaning.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
                Wisdom Benson studies finite semiconductor nanostructures with first-principles methods—and writes on value, personhood, and metaphysical structure.
              </p>
            </div>

            <div className="relative mt-10 flex flex-wrap gap-2">
              <Button size="lg" asChild>
                <a href="#research">
                  Explore the research <ArrowDownRight data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#philosophy">Read philosophy</a>
              </Button>
              <Button size="lg" variant="ghost" onClick={copyEmail}>
                <Copy data-icon="inline-start" aria-hidden="true" /> Copy email
              </Button>
            </div>
          </motion.div>

          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative min-h-[25rem] overflow-hidden rounded-2xl border bg-muted md:col-span-3 lg:col-span-5 lg:min-h-0"
          >
            <Image
              src={profile.portrait}
              alt="Portrait of Wisdom Benson"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover object-[50%_24%] grayscale-[14%] transition duration-700 group-hover:scale-[1.015] group-hover:grayscale-0"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent p-6 pt-20">
              <p className="text-sm font-semibold">{profile.descriptor}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" /> {profile.location}
              </p>
            </div>
          </motion.figure>

          <article className="group relative overflow-hidden rounded-2xl border bg-quantum-muted p-6 md:col-span-3 lg:col-span-4">
            <div className="flex items-center justify-between text-quantum">
              <Atom className="size-6" aria-hidden="true" />
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em]">Research track 01</span>
            </div>
            <h2 className="mt-9 text-2xl font-semibold tracking-[-0.04em]">Quantum & nano physics</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              ZnO quantum dots, many-body electronic structure, Raman spectroscopy, and tunable perovskite materials.
            </p>
            <a href="#research" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-quantum">
              Enter the lab <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border bg-philosophy-muted p-6 md:col-span-3 lg:col-span-4">
            <div className="flex items-center justify-between text-philosophy">
              <BookOpenText className="size-6" aria-hidden="true" />
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em]">Inquiry track 02</span>
            </div>
            <h2 className="mt-9 text-2xl font-semibold tracking-[-0.04em]">Philosophy & metaphysics</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Essays on value, romantic exclusivity, moral personhood, and the structures beneath ordinary commitments.
            </p>
            <a href="#philosophy" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-philosophy">
              Open the thought lab <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </article>

          <div className="rounded-2xl border bg-card p-6 md:col-span-3 lg:col-span-4">
            <p className="eyebrow text-muted-foreground">Current signal</p>
            <div className="mt-6 grid grid-cols-3 divide-x">
              {metrics.map((metric) => (
                <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                  <p className="font-mono text-2xl font-semibold tracking-[-0.05em]">{metric.value}</p>
                  <p className="mt-1 text-[0.68rem] leading-4 text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
            <a
              href={profile.links.googleScholar}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Search citation record <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-2xl border bg-card p-6 md:col-span-3 lg:col-span-12">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow text-muted-foreground">Affiliations & communities</p>
                <p className="mt-2 text-sm text-muted-foreground">Active research, academic lineage, and philosophical scholarship.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {affiliations.map((item) => (
                  <Badge key={item.label} variant="outline" className="h-8 gap-2 rounded-lg px-3">
                    {item.active ? <Check className="size-3 text-quantum" aria-hidden="true" /> : null}
                    <span>{item.label}</span>
                    <span className="hidden text-muted-foreground sm:inline">· {item.note}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
