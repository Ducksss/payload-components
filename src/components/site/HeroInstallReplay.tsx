'use client'

import { useState, type ReactNode } from 'react'

import { RotateCcw } from 'lucide-react'

/* Replay control for the install-replay frame. The frame's choreography
 * is pure CSS (animation delays), so replaying is a subtree remount:
 * bumping the key recreates the DOM and every animation restarts from
 * t=0. `children` is the server-rendered <HeroProductFrame/> — children
 * of a client component stay RSC, so the frame itself never hydrates.
 * Under reduced motion a replay does nothing visible, so the control
 * hides rather than lying. */
export function HeroInstallReplay({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0)

  return (
    <div className="relative">
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
