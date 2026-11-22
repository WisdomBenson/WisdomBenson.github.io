import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { profile } from "@/content/profile"

const credentials = [
  "Howard University (PhD)",
  "APS Student Ambassador",
  "NCCU (MSc)",
  "PhilPeople",
] as const

export function HeroSection() {
  return (
    <section id="top" className="pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="site-shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <p className="eyebrow text-quantum">Howard University · Physics PhD Researcher</p>

          <h1 className="mt-5 max-w-2xl text-balance font-serif text-[clamp(2.1rem,6vw,4.35rem)] font-normal leading-[1.06] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl xl:text-[4.35rem]">
            Quantum Matter &amp; Metaphysical Inquiry
          </h1>

          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
            My research examines finite semiconductor nanostructures, with a focus on zinc oxide (ZnO) quantum dots and first-principles DFT/GW methods. In philosophy, I explore value, agency, and metaphysical structure through Kant, Scheler, and Schopenhauer.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
            <Button
              size="lg"
              className="h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              asChild
            >
              <a href="#publications">
                Read my publications
                <ArrowDownRight data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
            <a
              href="#philosophy"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Explore essays
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/80 pt-6 text-xs text-muted-foreground">
            {credentials.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="text-border">·</span>}
                <span>{item}</span>
              </span>
            ))}
            <span aria-hidden="true" className="text-border">·</span>
            <a
              href={profile.links.googleScholar}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:underline"
            >
              Google Scholar
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <figure className="mx-auto max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface shadow-[0_24px_60px_-28px_rgba(28,27,24,0.28)] ring-1 ring-foreground/5">
              <Image
                src={profile.portrait}
                alt="Portrait of Wisdom Benson"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[50%_18%] contrast-[1.03] brightness-[0.97] saturate-[0.94]"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-0.5 text-xs text-muted-foreground">
              <span className="font-serif text-sm font-medium text-foreground">{profile.name}</span>
              <span>Condensed Matter Physics · Philosophical Metaphysics</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
