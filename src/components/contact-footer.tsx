"use client"

import { ArrowUp, ArrowUpRight, Copy, Download, Mail } from "lucide-react"
import { toast } from "sonner"

import { SiteFooterBar } from "@/components/site-footer-bar"
import { Button } from "@/components/ui/button"
import { profile } from "@/content/profile"

const profileLinks = [
  { label: "Google Scholar", href: profile.links.googleScholar },
  { label: "ORCID", href: profile.links.orcid },
  { label: "ResearchGate", href: profile.links.researchGate },
  { label: "PhilPeople", href: profile.links.philPeople },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
]

export function ContactFooter() {
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast.success("Email copied", { description: profile.email })
    } catch {
      toast.error("Could not copy the address. Select the email above to copy it.")
    }
  }

  return (
    <footer id="contact" className="surface-band border-b-0 pt-16 sm:pt-24">
      <div className="site-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-quantum">Contact</p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.015em] text-foreground sm:text-5xl">
              Research collaboration and academic contact
            </h2>
            <p className="mt-5 max-w-[54ch] text-base leading-7 text-muted-foreground">
              Open to computational-materials collaborations, doctoral research conversations, speaking invitations, and carefully framed philosophical exchange.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            <p className="select-all wrap-anywhere text-sm font-medium text-foreground">
              {profile.email}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              <Button
                className="h-11 justify-between rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:col-span-2 lg:col-span-1"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="size-4" aria-hidden="true" />
                    Email me
                  </span>
                  <ArrowUpRight className="size-4 opacity-80" aria-hidden="true" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between rounded-xl border-border bg-card px-4 text-sm font-medium text-foreground shadow-none hover:border-primary/40 hover:bg-card hover:text-primary"
                onClick={copyEmail}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Copy className="size-4" aria-hidden="true" />
                  Copy email
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between rounded-xl border-border bg-card px-4 text-sm font-medium text-foreground shadow-none hover:border-primary/40 hover:bg-card hover:text-primary"
                asChild
              >
                <a href={profile.resume} download>
                  <span className="inline-flex items-center gap-2.5">
                    <Download className="size-4" aria-hidden="true" />
                    CV PDF
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-border/80 py-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
              Find my work elsewhere
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {profileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            <p className="font-medium text-foreground">{profile.affiliation}</p>
            <p className="mt-0.5">{profile.department}</p>
            <a
              href="#top"
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Back to top <ArrowUp className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <SiteFooterBar />
      </div>
    </footer>
  )
}
