"use client"

import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function CardDetails({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Collapsible className="border-t border-border/70 pt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 text-muted-foreground hover:text-primary [&[aria-expanded=true]_svg]:rotate-180">
          {label}
          <ChevronDown aria-hidden="true" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-3 pt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
