import type { CSSProperties, ReactNode } from 'react'

import { wiringLedger } from '@/lib/site'
import { cn } from '@/utilities/ui'

import {
  ArtifactNodeCard,
  CommandNodeCard,
  NODE_ICONS,
  nodeKind,
  type NodeKind,
  type WiringState,
} from './wiring-nodes'

/* The signature diagram: one command → five wired artifacts. Reads
 * wiringLedger.rows so it can never drift from the ledger (the `baseline`
 * column = what a plain paste/shadcn covers, the `component` column = what
 * payload-components wires). Three presentations:
 *   unwired  — the problem: a paste lands the source, four edits dangle.
 *   wired    — the answer: one command connects all five.
 *   boundary — the install boundary: one node a paste covers (neutral), four
 *              payload-components wires (emerald) — used on the landing.
 *
 * This is the static, server-rendered presentation — the source of truth for
 * crawlers, reduced-motion, mobile, and the visual baselines. On motion-enabled
 * desktop it is progressively enhanced into an interactive graph (WiringFlow).
 *
 * Decorative connectors (aria-hidden SVG); the labelled nodes carry the
 * meaning. Emerald wires draw on scroll-entry via .wire-draw-scroll, which
 * falls back to fully drawn without scroll timelines and under reduced
 * motion. */

/* Node centres in the 0–100 viewBox (preserveAspectRatio="none" stretches to
 * the connector column), evenly spread so wires fan from the command node. */
const NODE_Y = [10, 30, 50, 70, 90]
const wirePath = (y: number) => `M0 50 C 4 50 6 ${y} 10 ${y}`

type WireStyle = CSSProperties & { '--wire-len'?: string }

function Connector({ kinds }: { kinds: NodeKind[] }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 10 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {NODE_Y.map((y, index) => {
        const kind = kinds[index]

        if (kind === 'wired') {
          return (
            <path
              key={y}
              d={wirePath(y)}
              className="wire-draw-scroll"
              style={{ '--wire-len': '120' } as WireStyle}
              pathLength={120}
              stroke="var(--brand)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )
        }

        const copied = kind === 'copied'

        return (
          <path
            key={y}
            d={wirePath(y)}
            pathLength={120}
            stroke={copied ? 'var(--muted-foreground)' : 'var(--border)'}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeDasharray={copied ? undefined : '2 5'}
            vectorEffect="non-scaling-stroke"
            opacity={copied ? 0.5 : 0.85}
          />
        )
      })}
    </svg>
  )
}

export function WiringNodeMap({
  caption,
  className,
  state,
}: {
  caption?: ReactNode
  className?: string
  state: WiringState
}) {
  const rows = wiringLedger.rows
  const kinds = rows.map((row) => nodeKind(state, row))
  const command = state === 'unwired' ? wiringLedger.columns.baseline : wiringLedger.columns.component
  const branded = state !== 'unwired'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.5rem] border border-border bg-background p-5 shadow-card sm:p-6',
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,12rem)_2.75rem_minmax(0,1fr)] md:items-stretch md:gap-0">
        {/* Command node. */}
        <CommandNodeCard
          branded={branded}
          className="md:self-center"
          label={state === 'unwired' ? 'After the paste' : 'One command'}
          summary={command.summary}
        />

        {/* Connector fan — its own column so the wires anchor at any width. */}
        <div className="relative hidden md:block">
          <Connector kinds={kinds} />
        </div>

        {/* Artifact nodes. */}
        <ol className="flex flex-col gap-2.5">
          {rows.map((row, index) => (
            <li key={row.artifact}>
              <ArtifactNodeCard icon={NODE_ICONS[index]} kind={kinds[index]} row={row} />
            </li>
          ))}
        </ol>
      </div>

      {caption ? <p className="mt-5 text-xs leading-5 text-muted-foreground">{caption}</p> : null}
    </div>
  )
}
