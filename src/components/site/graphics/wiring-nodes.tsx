import type { LucideIcon } from 'lucide-react'
import { Braces, Check, Database, FileCode2, Layers, Map } from 'lucide-react'

import type { WiringLedgerRow } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* Shared presentational pieces for the wiring diagram, so the static SSR
 * fallback (WiringNodeMap) and the interactive React Flow canvas
 * (WiringFlowCanvas) render byte-identical, design-token-correct markup. The
 * static map stays the source of truth for crawlers, reduced-motion, mobile,
 * and the visual baselines; React Flow only re-wraps these cards. */

export type NodeKind = 'todo' | 'copied' | 'wired'
export type WiringState = 'unwired' | 'wired' | 'boundary'

/* One icon per ledger row, in row order. */
export const NODE_ICONS: readonly LucideIcon[] = [FileCode2, Database, Layers, Braces, Map]

/* baseline === null means the artifact is your TODO after a plain paste; the
 * one non-null row (Block source, 'copied') is what any paste already covers. */
export function nodeKind(state: WiringState, row: WiringLedgerRow): NodeKind {
  if (state === 'wired') return 'wired'
  if (row.baseline !== null) return 'copied'
  return state === 'boundary' ? 'wired' : 'todo'
}

export function ArtifactNodeCard({
  className,
  icon: Icon,
  kind,
  row,
}: {
  className?: string
  icon: LucideIcon
  kind: NodeKind
  row: WiringLedgerRow
}) {
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
        className,
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

export function CommandNodeCard({
  branded,
  className,
  label,
  summary,
}: {
  branded: boolean
  className?: string
  label: string
  summary: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[1.25rem] border border-border bg-muted/40 p-4',
        className,
      )}
    >
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
          {label}
        </p>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{summary}</p>
    </div>
  )
}
