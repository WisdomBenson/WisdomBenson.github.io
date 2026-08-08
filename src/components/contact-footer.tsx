"use client"

import { ArrowUp, ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { profile } from "@/content/profile"

const profileLinks = [
  { label: "Google Scholar", href: profile.links.googleScholar },
  { label: "ResearchGate", href: profile.links.researchGate },
  { label: "PhilPeople", href: profile.links.philPeople },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
  { label: "Audiomack search", href: profile.links.audiomack },
]

export function ContactFooter() {
  async function copyEmail() {
    await navigator.clipboard.writeText(profile.email)
    toast.success("Email copied", { description: profile.email })
  }

  return (
    <footer id="contact" className="section-block">
      <div className="site-shell">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-quantum/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-philosophy/8 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow text-quantum">Open correspondence</p>
              <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl">
                Work across models, materials, and meaning.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
                Open to computational-materials collaborations, doctoral research conversations, speaking invitations, and carefully framed philosophical exchange.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <Button className="min-h-11 justify-between" asChild>
                <a href={`mailto:${profile.email}`}><span className="inline-flex items-center gap-2"><Mail className="size-4" aria-hidden="true" /> Email Wisdom</span><ArrowUpRight className="size-4" aria-hidden="true" /></a>
              </Button>
              <Button variant="outline" className="min-h-11 justify-between" onClick={copyEmail}>
                <span className="inline-flex items-center gap-2"><Copy className="size-4" aria-hidden="true" /> Copy email</span><Check className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" className="min-h-11 justify-between sm:col-span-2 lg:col-span-1" asChild>
                <a href={profile.resume} download><span className="inline-flex items-center gap-2"><Download className="size-4" aria-hidden="true" /> Résumé PDF</span><ArrowUpRight className="size-4" aria-hidden="true" /></a>
              </Button>
            </div>
          </div>

          <div className="relative mt-14 grid gap-6 border-t pt-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Find the work elsewhere</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {profileLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              <p>{profile.location} · {profile.phone}</p>
              <a href="#top" className="mt-2 inline-flex items-center gap-1.5 hover:text-foreground">Back to top <ArrowUp className="size-3.5" aria-hidden="true" /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-1 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Wisdom Benson. Physics, computation, and philosophy.</p>
          <a href="https://github.com/WisdomBenson/WisdomBenson.github.io" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
            Source on GitHub <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
