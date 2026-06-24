'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { RotateCcw } from 'lucide-react'

/* Replay control for the install-replay frame. The frame's choreography
 * is pure CSS (animation delays), so replaying is a subtree remount:
 * bumping the key recreates the DOM and every animation restarts from
 * t=0. `children` is the server-rendered <HeroProductFrame/> — children
 * of a client component stay RSC, so the frame itself never hydrates.
 * Under reduced motion a replay does nothing visible, so the control
 * hides rather than lying.
 *
 * The frame also auto-replays when it scrolls back into view (it plays
 * once on load via CSS). This is deliberately NOT an idle loop — it only
 * re-triggers on a fresh re-entry, stays still while sitting in view, and
 * is disabled under reduced motion — so it adds life without the always-on
 * hero animation the perf budget rules out. */
export function HeroInstallReplay({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /* Visible on mount — the CSS choreography is already playing, so only
       replay on a later re-entry (visible after having left the viewport). */
    let wasVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false
        if (visible && !wasVisible) setRun((count) => count + 1)
        wasVisible = visible
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div key={run}>{children}</div>
      <button
        type="button"
        onClick={() => setRun((count) => count + 1)}
        aria-label="Replay the install animation"
        className="absolute right-4 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/12 px-3 py-1 text-xs font-medium text-background/80 transition-colors hover:bg-background/20 motion-reduce:hidden sm:right-5"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Replay
      </button>
    </div>
  )
}
