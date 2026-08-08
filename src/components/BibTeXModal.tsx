"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Publication } from "@/data/publications"

type BibTeXModalProps = {
  publication: Publication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BibTeXModal({ publication, open, onOpenChange }: BibTeXModalProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")

  async function copyBibTeX() {
    if (!publication) return

    try {
      await navigator.clipboard.writeText(publication.bibtex)
      setCopyState("copied")
    } catch {
      setCopyState("error")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setCopyState("idle")
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>BibTeX citation</DialogTitle>
          <DialogDescription>{publication?.title}</DialogDescription>
        </DialogHeader>

        <pre
          data-slot="bibtex-code"
          className="max-h-[55vh] overflow-auto rounded-lg border bg-muted p-4 font-mono text-xs leading-6"
          tabIndex={0}
          aria-label="BibTeX entry"
        >
          <code>{publication?.bibtex}</code>
        </pre>

        <DialogFooter>
          <Button onClick={copyBibTeX} disabled={!publication}>
            {copyState === "copied" ? (
              <Check data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Copy data-icon="inline-start" aria-hidden="true" />
            )}
            {copyState === "copied"
              ? "Copied!"
              : copyState === "error"
                ? "Copy failed"
                : "Copy BibTeX"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
