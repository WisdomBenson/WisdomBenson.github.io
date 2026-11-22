"use client"

import { ArrowUpRight, ZoomIn } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function FigureZoom({ src, alt, title }: { src: string; alt: string; title: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-3">
          <ZoomIn data-icon="inline-start" aria-hidden="true" /> Enlarge figure
        </Button>
      </DialogTrigger>
      <DialogContent className="editorial-panel max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="leading-snug">{title}</DialogTitle>
          <DialogDescription className="sr-only">{alt}</DialogDescription>
        </DialogHeader>
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={1572}
          sizes="(max-width: 900px) 100vw, 850px"
          className="mx-auto h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full object-contain"
        />
        <Button variant="outline" size="sm" className="justify-self-center" asChild>
          <a href={src} target="_blank" rel="noreferrer">
            Open full-resolution image <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
