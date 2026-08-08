"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { profile } from "@/content/profile"

const affiliations = [
  "HOWARD UNIV (PhD)",
  "APS PHYSICS AMBASSADOR",
  "NCCU (MSc)",
  "PHILPEOPLE",
] as const

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="border-b">
      <div className="site-shell grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
        <motion.div
          className="lg:col-span-7"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <Badge variant="outline">Howard University · Physics PhD Researcher</Badge>
          <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Quantum Matter &amp; Metaphysical Inquiry
          </h1>
          <p className="mt-7 max-w-[65ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Wisdom Benson studies finite semiconductor nanostructures, with current work on ZnO quantum dots and first-principles DFT/GW workflows. His philosophical scholarship examines value, agency, and metaphysical structure through Kantian, Schelerian, and Schopenhauerian traditions.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button size="lg" asChild>
              <a href="#publications">
                View Publications
                <ArrowDownRight data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#philosophy">Philosophy Essays</a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="#contact">Contact</a>
            </Button>
          </div>

          <div className="mt-10 border-y py-4 font-mono text-[0.68rem] leading-6 tracking-[0.09em] text-muted-foreground">
            {affiliations.map((affiliation, index) => (
              <span key={affiliation} className="whitespace-nowrap">
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                {affiliation}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.08 }}
        >
          <Card className="overflow-hidden py-0">
            <CardContent className="relative aspect-[4/5] p-0">
              <Image
                src="/assets/wisdom-benson-portrait.jpeg"
                alt="Portrait of Wisdom Benson"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[50%_24%] grayscale-[8%] transition-[filter,transform] duration-500 hover:scale-[1.01] hover:grayscale-0"
              />
            </CardContent>
            <CardFooter className="grid gap-5 border-t px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-lg font-semibold tracking-[-0.025em]">{profile.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Condensed Matter Physics · Philosophical Metaphysics</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={profile.links.googleScholar} target="_blank" rel="noreferrer">
                  Google Scholar
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
