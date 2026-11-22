"use client"

import { Menu } from "lucide-react"
import Link from "next/link"

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
  { label: "Research", href: "/#research" },
  { label: "Publications", href: "/#publications" },
  { label: "Philosophy", href: "/#philosophy" },
  { label: "CV", href: "/#cv" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/75 bg-background/88 backdrop-blur-md">
      <div className="site-shell flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/#top" className="group flex min-w-0 items-center gap-3" aria-label="Wisdom Benson, home">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-[0.64rem] font-semibold tracking-tight text-primary-foreground transition-transform group-hover:-rotate-2">
            {profile.mark}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-[1.05rem] font-medium tracking-[-0.01em] text-foreground">
              {profile.name}
            </span>
            <span className="hidden truncate text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Physics · Philosophy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary underline-offset-8 hover:underline focus-visible:underline active:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/#contact">Contact</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-border bg-background">
              <SheetHeader className="border-b border-border/80 px-6 py-6">
                <SheetTitle className="font-serif text-xl font-medium">{profile.name}</SheetTitle>
                <SheetDescription>{profile.descriptor}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-3 py-2" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex min-h-12 items-center border-b border-border/60 px-3 text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
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
