"use client"

import { ArrowUpRight, Menu } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { profile } from "@/content/profile"

const navigation = [
  { label: "Research", href: "#research" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Publications", href: "#publications" },
  { label: "CV", href: "#cv" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/78 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="site-shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label="Wisdom Benson, home">
          <span className="grid size-9 place-items-center rounded-lg bg-foreground font-mono text-[0.66rem] font-bold tracking-tight text-background transition-transform group-hover:-rotate-3">
            {profile.mark}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-[-0.02em]">{profile.name}</span>
            <span className="hidden truncate font-mono text-[0.61rem] uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Models · Materials · Meaning
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button className="hidden sm:inline-flex" size="sm" asChild>
            <a href={`mailto:${profile.email}`}>
              Collaborate <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/96 backdrop-blur-xl">
              <SheetHeader className="border-b px-6 py-6">
                <SheetTitle>{profile.name}</SheetTitle>
                <SheetDescription>{profile.descriptor}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-3" aria-label="Mobile navigation">
                {navigation.map((item, index) => (
                  <SheetClose key={item.href} asChild>
                    <a
                      href={item.href}
                      className="flex min-h-14 items-center justify-between border-b px-3 text-base font-medium"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
