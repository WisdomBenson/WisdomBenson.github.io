"use client"

import { ArrowUpRight, ZoomIn } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function FigureZoom({ src, alt, title, height }: { src: string; alt: string; title: string; height: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-quantum-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ZoomIn className="size-3.5" aria-hidden="true" />
          Enlarge figure
        </button>
      </DialogTrigger>
      <DialogContent className="editorial-panel max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card sm:max-w-4xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="font-serif text-xl font-medium leading-snug">{title}</DialogTitle>
          <DialogDescription className="sr-only">{alt}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-card p-2">
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={height}
            sizes="(max-width: 900px) 100vw, 850px"
            className="mx-auto h-auto max-h-[calc(100dvh-13rem)] w-auto max-w-full object-contain"
          />
        </div>
        <Button variant="outline" size="sm" className="justify-self-center rounded-full" asChild>
          <a href={src} target="_blank" rel="noreferrer">
            Open full-resolution image <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
