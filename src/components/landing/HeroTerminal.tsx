'use client'

import { useEffect, useState } from 'react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import {
  primaryInstallCommand,
  terminalFinalLine,
  terminalSteps,
} from '@/lib/site'

const STEP_BASE_DELAY = 0.6
const STEP_INTERVAL = 0.55
const REPLAY_INTERVAL_MS = 9500

export function HeroTerminal() {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const id = window.setInterval(() => setCycle((current) => current + 1), REPLAY_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_60px_-24px_rgb(9_9_11/0.45)]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </div>
        <CommandCopyButton command={primaryInstallCommand} variant="dark" />
      </div>
      <div className="px-4 py-4 font-mono text-[0.8125rem] leading-7 sm:px-5" key={cycle}>
        <p className="flex gap-2 whitespace-nowrap">
          <span className="text-zinc-500">$</span>
          <span className="text-white">{primaryInstallCommand}</span>
        </p>
        {terminalSteps.map((step, index) => (
          <p
            key={step}
            className="terminal-line flex gap-2 whitespace-nowrap text-zinc-400"
            style={{ '--stagger': `${STEP_BASE_DELAY + index * STEP_INTERVAL}s` } as React.CSSProperties}
          >
            <span className="text-emerald-400">✓</span>
            {step}
          </p>
        ))}
        <p
          className="terminal-line flex items-center gap-2 whitespace-nowrap text-white"
          style={
            {
              '--stagger': `${STEP_BASE_DELAY + terminalSteps.length * STEP_INTERVAL + 0.3}s`,
            } as React.CSSProperties
          }
        >
          {terminalFinalLine}
          <span className="terminal-caret inline-block h-3.5 w-[7px] bg-zinc-500" aria-hidden="true" />
        </p>
      </div>
    </div>
  )
}
