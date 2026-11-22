"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const DESKTOP = "(min-width: 1024px) and (pointer: fine)"

function subscribe(callback: () => void) {
  const query = window.matchMedia(DESKTOP)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function canStart() {
  return window.matchMedia(DESKTOP).matches && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia
}

export function GazeLab() {
  const available = useSyncExternalStore(subscribe, canStart, () => false)
  if (!available) {
    return <p className="mt-5 text-sm text-muted-foreground">Gaze tracking requires a desktop browser with a webcam. You can still open the reading cards below.</p>
  }
  return <Launcher />
}

function Launcher() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState("")
  const [Session, setSession] = useState<ComponentType<{ onStop: (message: string) => void }> | null>(null)
  const generation = useRef(0)
  const trigger = useRef<HTMLButtonElement>(null)
  const entering = useRef(false)

  useEffect(() => () => { generation.current++ }, [])

  const stop = useCallback((message: string) => {
    setSession(null)
    setNotice(message)
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }))
  }, [])

  async function accept() {
    const attempt = ++generation.current
    setLoading(true)
    setNotice("")
    try {
      const { GazeSession } = await import("./session")
      if (generation.current !== attempt) return
      entering.current = true
      setOpen(false)
      setSession(() => GazeSession)
    } catch {
      if (generation.current === attempt) setNotice("The gaze lab could not load. Close this dialog and try again.")
    } finally {
      if (generation.current === attempt) setLoading(false)
    }
  }

  function changeOpen(value: boolean) {
    generation.current++
    setLoading(false)
    setOpen(value)
    if (value) setNotice("")
  }

  return (
    <div className="mt-6">
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogTrigger asChild>
          <Button ref={trigger} disabled={!!Session}>Start gaze lab</Button>
        </DialogTrigger>
        <DialogContent onCloseAutoFocus={event => {
          if (entering.current) event.preventDefault()
          entering.current = false
        }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Camera and privacy</DialogTitle>
            <DialogDescription>
              Face tracking runs 100% on-device. Video frames, landmarks, gaze estimates, and calibration data never leave your browser.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">
            The lab uses video only and keeps calibration in memory for this session. Stop, Esc, leaving the page, or hiding the tab turns off the camera.
          </p>
          {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => changeOpen(false)}>Cancel</Button>
            <Button onClick={() => void accept()} disabled={loading}>{loading ? "Loading…" : "Continue to camera"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!open && notice && <p role="status" className="mt-3 text-sm text-muted-foreground">{notice}</p>}
      {Session && <Session onStop={stop} />}
    </div>
  )
}
