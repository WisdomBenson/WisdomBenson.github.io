"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentType } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const DESKTOP = "(min-width: 1024px) and (pointer: fine)"
const STATUS_NOTICE = "gaze-mode-status"

function subscribe(callback: () => void) {
  const media = window.matchMedia(DESKTOP)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function supported() {
  return window.isSecureContext && !!navigator.mediaDevices?.getUserMedia &&
    navigator.maxTouchPoints === 0 && window.matchMedia(DESKTOP).matches
}

export function GazeMode() {
  const pathname = usePathname()
  const available = useSyncExternalStore(subscribe, supported, () => false)
  if (!available || (pathname !== "/" && !/^\/thought-lab(?:\/|$)/.test(pathname))) return null
  return <GazeLauncher key={pathname} />
}

function GazeLauncher() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [Session, setSession] = useState<ComponentType<{ onStop: (message?: string) => void }> | null>(null)
  const generation = useRef(0)
  const trigger = useRef<HTMLButtonElement>(null)
  const starting = useRef(false)

  useEffect(() => () => { generation.current++ }, [])

  const stop = useCallback((notice = "Gaze mode stopped. The camera is off.") => {
    setSession(null)
    toast.info(notice, { id: STATUS_NOTICE })
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }))
  }, [])

  async function accept() {
    const attempt = ++generation.current
    toast.dismiss(STATUS_NOTICE)
    setLoading(true)
    setMessage("")
    try {
      const { GazeSession } = await import("./session")
      if (attempt !== generation.current) return
      starting.current = true
      setOpen(false)
      setSession(() => GazeSession)
    } catch {
      if (attempt === generation.current) setMessage("Gaze mode could not load. Try again.")
    } finally {
      if (attempt === generation.current) setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={value => {
        if (!value) {
          generation.current++
          setLoading(false)
        }
        setOpen(value)
      }}>
        <DialogTrigger asChild>
          <button
            type="button"
            ref={trigger}
            aria-disabled={Session !== null}
            onClick={event => {
              if (Session) event.preventDefault()
              else setMessage("")
            }}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Gaze mode
          </button>
        </DialogTrigger>
        <DialogContent className="bg-card p-6 sm:max-w-lg" onCloseAutoFocus={event => {
          if (starting.current) {
            event.preventDefault()
            starting.current = false
          }
        }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Try gaze mode</DialogTitle>
            <DialogDescription>
              Your webcam helps you scroll and open large card details. Tracking runs entirely in this browser.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <p>Video frames and gaze coordinates stay on this device and are never sent to a server. Calibration stays in memory for this session. Use Clear calibration to erase it in one click.</p>
            <p>Press Esc or use Stop at any time to turn off the camera. Links and navigation still need a mouse or keyboard.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { generation.current++; setLoading(false); setOpen(false) }}>Cancel</Button>
            <Button onClick={() => void accept()} disabled={loading}>{loading ? "Loading…" : "Continue to camera"}</Button>
          </DialogFooter>
          {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
        </DialogContent>
      </Dialog>
      {Session && <Session onStop={stop} />}
    </>
  )
}
