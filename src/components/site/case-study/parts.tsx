import type { ReactNode } from 'react'

import { MARK, RETIRED_MARK } from '@/components/site/case-study/geometry'
import { cn } from '@/utilities/ui'

/* Small shared pieces for the case study: the chapter line every plate opens
   with, the heading idiom (one serif word, inline so the accessible name is the
   full sentence), and the two marks drawn from the shared geometry. */

export function Chapter({ children, index }: { children: ReactNode; index: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
      <span className="text-brand">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-border" />
      {children}
    </p>
  )
}

export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="script-aware-serif-accent font-serif font-normal italic tracking-micro">
      {children}
    </span>
  )
}

export function CaseHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'text-balance text-[clamp(2.5rem,6.4vw,6.25rem)] font-medium leading-[0.92] tracking-display text-foreground',
        className,
      )}
    >
      {children}
    </h2>
  )
}

/* The shipping mark on its 24-unit grid. `keyed` adds the load animation that
   slides the second block home; `grid` draws the construction lines. */
export function KeyedMark({
  className,
  grid = false,
  keyed = false,
}: {
  className?: string
  grid?: boolean
  keyed?: boolean
}) {
  const lines = [MARK.keyA, MARK.keyB, MARK.keyA + MARK.block, MARK.keyB + MARK.block]

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox={`0 0 ${MARK.grid} ${MARK.grid}`}
    >
      <rect className="fill-brand" height={MARK.grid} rx={MARK.containerRadius} width={MARK.grid} />
      {grid ? (
        /* Inset a quarter unit so the lines at 4.8 and 19.2 stay inside the
           square's rounded corners without needing a clip path per instance. */
        <g className="stroke-brand-foreground/25" fill="none" strokeWidth={0.06}>
          {lines.map((line) => (
            <path d={`M${line} 0.25V23.75M0.25 ${line}H23.75`} key={line} />
          ))}
        </g>
      ) : null}
      <rect
        className="fill-brand-foreground"
        height={MARK.block}
        rx={MARK.blockRadius}
        width={MARK.block}
        x={MARK.keyA}
        y={MARK.keyA}
      />
      <rect
        className={cn('fill-brand-foreground', keyed && 'cs-key-home')}
        height={MARK.block}
        rx={MARK.blockRadius}
        width={MARK.block}
        x={MARK.keyB}
        y={MARK.keyB}
      />
    </svg>
  )
}

export function RetiredMark({ className }: { className?: string }) {
  const { cursor } = RETIRED_MARK

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox={`0 0 ${MARK.grid} ${MARK.grid}`}
    >
      <rect
        className="fill-muted-foreground"
        height={MARK.grid}
        rx={MARK.containerRadius}
        width={MARK.grid}
      />
      <polyline
        className="stroke-background"
        fill="none"
        points={RETIRED_MARK.chevron}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={RETIRED_MARK.chevronWidth}
      />
      <rect
        className="fill-background"
        height={cursor.height}
        rx={cursor.radius}
        width={cursor.width}
        x={cursor.x}
        y={cursor.y}
      />
    </svg>
  )
}
