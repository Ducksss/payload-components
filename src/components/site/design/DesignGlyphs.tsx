import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

/* Line-art glyphs for the /docs/design principles, drawn from the same two
 * primitives as the logomark and Plate I: a rounded square and a hairline.
 * Zinc carries the drawing; each glyph spends emerald on exactly one idea.
 * Hover motion lives in docs.css (.design-glyph-*) and only ever nudges a
 * part a few units, so there is nothing to lose under reduced motion. */

export const designGlyphNames = [
  'wired',
  'source',
  'diff',
  'proven',
  'catalog',
  'receipts',
] as const

export type DesignGlyphName = (typeof designGlyphNames)[number]

const satellites = [0, 60, 120, 180, 240, 300].map((degrees) => {
  const radians = (degrees * Math.PI) / 180

  return { x: 48 + Math.cos(radians) * 36, y: 48 + Math.sin(radians) * 36 }
})

const glyphs: Record<DesignGlyphName, ReactNode> = {
  /* Two blocks keyed together, a wire running in and out. */
  wired: (
    <>
      <path className="stroke-brand" d="M0 34h14M82 62h14" />
      <rect className="fill-muted stroke-foreground" height={40} rx={9} width={40} x={14} y={14} />
      <rect
        className="design-glyph-key fill-background stroke-foreground"
        height={40}
        rx={9}
        width={40}
        x={42}
        y={42}
      />
      <circle className="fill-brand" cx={14} cy={34} r={3} />
      <circle className="fill-brand" cx={82} cy={62} r={3} />
    </>
  ),
  /* Readable source with a live caret: yours to edit. */
  source: (
    <>
      <rect
        className="fill-background stroke-foreground"
        height={64}
        rx={12}
        width={72}
        x={12}
        y={16}
      />
      <path className="stroke-muted-foreground" d="M24 34h30M24 46h42M32 58h22M24 70h14" />
      <path className="design-glyph-caret stroke-brand" d="M60 52v12" strokeWidth={2} />
    </>
  ),
  /* A diff: one line out, two in. */
  diff: (
    <>
      <path className="stroke-border" d="M16 14v68" />
      <path className="stroke-muted-foreground" d="M22 26h8M38 26h38M38 78h26" />
      <path className="stroke-brand" d="M22 44h8M26 40v8M38 44h32M22 62h8M26 58v8M38 62h42" />
    </>
  ),
  /* One proof at the centre, inherited by every install around it. */
  proven: (
    <>
      <g className="stroke-border">
        {satellites.map((point) => (
          <path d={`M48 48L${point.x} ${point.y}`} key={`${point.x}-${point.y}`} />
        ))}
      </g>
      {satellites.map((point) => (
        <rect
          className="fill-background stroke-foreground"
          height={10}
          key={`${point.x}-${point.y}-block`}
          rx={3}
          width={10}
          x={point.x - 5}
          y={point.y - 5}
        />
      ))}
      <rect
        className="fill-background stroke-foreground"
        height={28}
        rx={7}
        width={28}
        x={34}
        y={34}
      />
      <path className="stroke-brand" d="M41 48l5 5 9-10" strokeWidth={2} />
    </>
  ),
  /* A shelf of variants; you pick one up by looking at it. */
  catalog: (
    <>
      <path className="stroke-foreground" d="M8 78h80" />
      <rect className="fill-muted stroke-foreground" height={32} rx={5} width={22} x={12} y={46} />
      <path className="stroke-border" d="M40 72h18" />
      <rect
        className="design-glyph-lift fill-background stroke-brand"
        height={42}
        rx={5}
        width={22}
        x={38}
        y={22}
      />
      <rect className="fill-muted stroke-foreground" height={24} rx={5} width={22} x={62} y={54} />
    </>
  ),
  /* A receipt with the stamp that makes it one. */
  receipts: (
    <>
      <path
        className="fill-background stroke-foreground"
        d="M20 12h48v72l-6-5-6 5-6-5-6 5-6-5-6 5-6-5-6 5z"
      />
      <path className="stroke-muted-foreground" d="M30 28h28M30 40h24M30 52h16" />
      <g className="design-glyph-stamp">
        <circle className="fill-background stroke-brand" cx={66} cy={66} r={15} />
        <path className="stroke-brand" d="M59 66l5 5 9-10" strokeWidth={2} />
      </g>
    </>
  ),
}

export function DesignGlyph({ className, name }: { className?: string; name: DesignGlyphName }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('design-glyph overflow-visible', className)}
      fill="none"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 96 96"
    >
      {glyphs[name]}
    </svg>
  )
}
