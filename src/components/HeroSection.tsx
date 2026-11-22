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
  return (
    <section id="top" className="pb-4 pt-6 sm:pb-6">
      <div className="editorial-panel site-shell grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
        <div className="min-w-0 lg:col-span-7">
          <Badge variant="outline" className="h-auto min-h-5 max-w-full whitespace-normal py-0.5 leading-tight">Howard University · Physics PhD Researcher</Badge>
          <h1 className="mt-8 max-w-4xl text-balance text-[clamp(2rem,11vw,3rem)] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl">
            Quantum Matter &amp; Metaphysical Inquiry
          </h1>
          <p className="mt-7 max-w-[65ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            My research examines finite semiconductor nanostructures, with a focus on zinc oxide (ZnO) quantum dots and first-principles DFT/GW methods. In philosophy, I explore value, agency, and metaphysical structure through Kant, Scheler, and Schopenhauer.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button size="lg" asChild>
              <a href="#publications">
                Read my publications
                <ArrowDownRight data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#philosophy">Read my essays</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-1 border-y py-4 font-mono text-[0.68rem] leading-6 tracking-[0.09em] text-muted-foreground">
            {affiliations.map((affiliation) => (
              <span key={affiliation} className="whitespace-nowrap">
                {affiliation}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <Card className="editorial-card gap-0 overflow-hidden py-0">
            <CardContent className="relative aspect-[4/5] p-0">
              <Image
                src={profile.portrait}
                alt="Portrait of Wisdom Benson"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[50%_18%] brightness-[0.97] saturate-[0.92]"
              />
            </CardContent>
            <CardFooter className="grid gap-5 border-t bg-card px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
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
        </div>
      </div>
    </section>
  )
}
