"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function SampleCard({ label, title, summary, children }: {
  label: string
  title: string
  summary: string
  children: React.ReactNode
}) {
  return (
    <Collapsible asChild>
      <Card data-gaze-target="" className="min-h-[240px] justify-between gap-6 px-2">
        <CardHeader>
          <p className="eyebrow text-primary">{label}</p>
          <CardTitle className="font-serif text-2xl font-normal">
            <h3>{title}</h3>
          </CardTitle>
          <CardDescription className="mt-1 max-w-[38ch] leading-6">{summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <CollapsibleTrigger asChild>
            <Button data-gaze-expand="" size="sm" variant="outline" aria-label={"Reading notes for " + title}>
              Reading notes
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            {children}
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
