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
  onCloseAutoFocus: (event: Event) => void
}

export function BibTeXModal({ publication, open, onOpenChange, onCloseAutoFocus }: BibTeXModalProps) {
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
      <DialogContent
        className="editorial-panel min-w-0 bg-card p-6 sm:max-w-2xl"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-medium">BibTeX citation</DialogTitle>
          <DialogDescription>{publication?.title}</DialogDescription>
        </DialogHeader>

        <pre
          data-slot="bibtex-code"
          className="max-h-[50dvh] min-w-0 overflow-y-auto whitespace-pre-wrap wrap-anywhere rounded-xl border border-foreground/10 bg-foreground p-4 font-mono text-xs leading-6 text-background"
          tabIndex={0}
          aria-label="BibTeX entry"
        >
          <code>{publication?.bibtex}</code>
        </pre>

        <DialogFooter className="-mx-6 -mb-6 p-6">
          <Button
            onClick={copyBibTeX}
            disabled={!publication}
            className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          >
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
