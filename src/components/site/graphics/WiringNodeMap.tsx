import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'
import { Braces, Check, Database, FileCode2, Layers, Map } from 'lucide-react'

import { wiringLedger, type WiringLedgerRow } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* The signature diagram: one command → five wired artifacts. Reads
 * wiringLedger.rows so it can never drift from the ledger (the `baseline`
 * column = what a plain paste/shadcn covers, the `component` column = what
 * payload-components wires). Three presentations:
 *   unwired  — the problem: a paste lands the source, four edits dangle.
 *   wired    — the answer: one command connects all five.
 *   boundary — the install boundary: one node a paste covers (neutral), four
 *              payload-components wires (emerald) — used on the landing.
 *
 * Decorative connectors (aria-hidden SVG); the labelled nodes carry the
 * meaning. Emerald wires draw on scroll-entry via .wire-draw-scroll, which
 * falls back to fully drawn without scroll timelines and under reduced
 * motion. */

type NodeKind = 'todo' | 'copied' | 'wired'

/* One icon per ledger row, in row order. */
const NODE_ICONS: readonly LucideIcon[] = [FileCode2, Database, Layers, Braces, Map]

/* Node centres in the 0–100 viewBox (preserveAspectRatio="none" stretches to
 * the connector column), evenly spread so wires fan from the command node. */
const NODE_Y = [10, 30, 50, 70, 90]
const wirePath = (y: number) => `M0 50 C 4 50 6 ${y} 10 ${y}`

type WireStyle = CSSProperties & { '--wire-len'?: string }

/* baseline === null means the artifact is your TODO after a plain paste; the
 * one non-null row (Block source, 'copied') is what any paste already covers. */
function nodeKind(state: 'unwired' | 'wired' | 'boundary', row: WiringLedgerRow): NodeKind {
  if (state === 'wired') return 'wired'
  if (row.baseline !== null) return 'copied'
  return state === 'boundary' ? 'wired' : 'todo'
}

function ArtifactNode({ icon: Icon, kind, row }: { icon: LucideIcon; kind: NodeKind; row: WiringLedgerRow }) {
  const wired = kind === 'wired'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3.5 py-3',
        wired
          ? 'border-brand/30 bg-brand-50/60'
          : kind === 'copied'
            ? 'border-border bg-background'
            : 'border border-dashed border-border bg-background',
      )}
    >
      <Icon
        className={cn('size-4 shrink-0', wired ? 'text-brand' : 'text-muted-foreground/70')}
        aria-hidden="true"
      />
      <p
        className={cn(
          'min-w-0 flex-1 truncate text-sm font-medium',
          kind === 'todo' ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {row.artifact}
      </p>
      {kind === 'todo' ? (
        <span className="shrink-0 rounded-full border border-dashed border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          to&nbsp;do
        </span>
      ) : (
        <Check
          className={cn('size-4 shrink-0', wired ? 'text-brand' : 'text-muted-foreground')}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

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
  state: 'unwired' | 'wired' | 'boundary'
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
        <div className="flex flex-col gap-3 rounded-[1.25rem] border border-border bg-muted/40 p-4 md:self-center">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'grid size-10 shrink-0 place-items-center rounded-xl border font-mono text-sm font-semibold',
                branded
                  ? 'border-brand/30 bg-brand-50 text-brand'
                  : 'border-border bg-background text-muted-foreground',
              )}
            >
              &gt;_
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {state === 'unwired' ? 'After the paste' : 'One command'}
            </p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">{command.summary}</p>
        </div>

        {/* Connector fan — its own column so the wires anchor at any width. */}
        <div className="relative hidden md:block">
          <Connector kinds={kinds} />
        </div>

        {/* Artifact nodes. */}
        <ol className="flex flex-col gap-2.5">
          {rows.map((row, index) => (
            <li key={row.artifact}>
              <ArtifactNode icon={NODE_ICONS[index]} kind={kinds[index]} row={row} />
            </li>
          ))}
        </ol>
      </div>

      {caption ? (
        <p className="mt-5 text-xs leading-5 text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  )
}
