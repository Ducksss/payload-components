import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/utilities/ui'

/* The visual-language plates on /docs/design. Each paints with the live tokens
 * from globals.css (utilities, never copied values), so a token change repaints
 * the plate. The palette and shape plates share one composition: Josef Albers'
 * nested, bottom-weighted squares, used here because the system itself is a set
 * of nested surfaces with a single accent at the centre. Everything a plate
 * shows is also said in text beside it. */

export type DesignStudyKind = 'motion' | 'palette' | 'shape' | 'type'

/* Albers' proportions: each square steps in one unit at the sides and 1.5 at
   the top, so the bottom margin is always a third of the top. */
const palette = [
  {
    fill: 'fill-background stroke-border',
    note: 'Almost every surface',
    role: 'Paper',
    swatch: 'bg-background',
    token: '--background',
  },
  {
    fill: 'fill-muted',
    note: 'Tonal bands and code wells',
    role: 'Quiet',
    swatch: 'bg-muted',
    token: '--muted',
  },
  {
    fill: 'fill-border',
    note: 'Every divider on this page',
    role: 'Hairline',
    swatch: 'bg-border',
    token: '--border',
  },
  {
    fill: 'fill-muted-foreground',
    note: '46% lightness, AA on white',
    role: 'Second ink',
    swatch: 'bg-muted-foreground',
    token: '--muted-foreground',
  },
  {
    fill: 'fill-foreground',
    note: 'Headlines and primary actions',
    role: 'Ink',
    swatch: 'bg-foreground',
    token: '--foreground',
  },
  {
    fill: 'fill-brand',
    note: 'Active, installed, linked',
    role: 'The accent',
    swatch: 'bg-brand',
    token: '--brand',
  },
] as const

function PalettePlate() {
  return (
    <div className="@container">
      <div className="grid items-center gap-8 @lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
        <svg aria-hidden="true" className="w-full max-w-60" focusable="false" viewBox="0 0 240 240">
          {palette.map((layer, index) => (
            <rect
              className={layer.fill}
              height={index === 0 ? 239 : 240 - index * 40}
              key={layer.token}
              rx={28 - index * 4}
              width={index === 0 ? 239 : 240 - index * 40}
              x={index === 0 ? 0.5 : index * 20}
              y={index === 0 ? 0.5 : index * 30}
            />
          ))}
        </svg>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {palette.map((layer) => (
            <li key={layer.token} className="flex items-center gap-3 py-2.5">
              <span
                aria-hidden="true"
                className={cn('size-4 shrink-0 rounded-sm border border-border', layer.swatch)}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{layer.role}</span>
                <span className="block text-xs leading-5 text-muted-foreground">{layer.note}</span>
              </span>
              <code className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {layer.token}
              </code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const faces = [
  {
    className: 'font-sans font-medium tracking-title',
    name: 'Geist Sans',
    role: 'Prose, headings, controls',
  },
  { className: 'font-mono tracking-snug', name: 'Geist Mono', role: 'Anything you might copy' },
  { className: 'font-serif italic', name: 'Instrument Serif', role: 'One word per heading' },
] as const

function TypePlate() {
  return (
    <div className="grid grid-cols-3">
      {faces.map((face) => (
        <div key={face.name} className="flex min-w-0 flex-col">
          <span
            aria-hidden="true"
            className={cn(
              'border-b border-foreground/25 pb-1 text-[clamp(2.75rem,7vw,5.5rem)] leading-none text-foreground',
              face.className,
            )}
          >
            Ag
          </span>
          <span className="mt-3 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
            {face.name}
          </span>
          <span className="mt-1 pe-2 text-xs leading-5 text-muted-foreground">{face.role}</span>
        </div>
      ))}
    </div>
  )
}

/* Outside in, the way surfaces nest on the site: a frame holds a panel holds a
   card holds an inset holds a control. */
const radii = [
  { className: 'rounded-frame', name: 'frame', value: '2rem' },
  { className: 'rounded-panel', name: 'panel', value: '1.5rem' },
  { className: 'rounded-card', name: 'card', value: '1.25rem' },
  { className: 'rounded-inset', name: 'inset', value: '1rem' },
  { className: 'rounded-lg', name: 'base', value: '0.625rem' },
] as const

function ShapePlate() {
  const innermost = radii.length - 1

  return radii.reduceRight<ReactNode>(
    (inner, radius, index) => (
      <div
        className={cn(
          'border px-2.5 pb-2.5 pt-7 @sm:px-3.5 @sm:pb-3.5',
          radius.className,
          index === innermost
            ? 'border-brand/35 bg-brand-50 pt-3 @sm:pt-3.5'
            : 'relative border-border bg-background',
        )}
      >
        <span
          className={cn(
            'font-mono text-[10px] font-medium text-muted-foreground',
            index === innermost ? 'text-brand-600' : 'absolute start-3.5 top-2.5 @sm:start-4.5',
          )}
        >
          {radius.name} · {radius.value}
        </span>
        {inner}
      </div>
    ),
    null,
  )
}

/* cubic-bezier(0.2, 0.8, 0.2, 1) over a 300ms axis: fast out, long settle. The
   curve draws as it scrolls into view where scroll timelines exist. */
function MotionPlate() {
  return (
    <svg
      aria-hidden="true"
      className="w-full max-w-md"
      fill="none"
      focusable="false"
      viewBox="0 0 320 196"
    >
      <rect className="fill-brand-50" height={132} width={90.7} x={205.3} y={36} />
      <g className="stroke-foreground/25" strokeWidth={1}>
        <path d="M24 168.5h272M24.5 36v133" />
        <path d="M205.3 168v6M296 168v6M114.7 168v6" />
      </g>
      <path
        className="wire-draw-scroll stroke-foreground"
        d="M24 168C78.4 65.6 78.4 40 296 40"
        pathLength={100}
        strokeLinecap="round"
        strokeWidth={1.75}
        style={{ '--wire-len': 100 } as CSSProperties}
      />
      <circle className="fill-brand" cx={296} cy={40} r={5} />
      <g className="fill-muted-foreground font-mono" fontSize={10}>
        <text x={20} y={188}>
          0
        </text>
        <text textAnchor="middle" x={114.7} y={188}>
          100
        </text>
        <text textAnchor="middle" x={205.3} y={188}>
          200
        </text>
        <text textAnchor="end" x={300} y={188}>
          300ms
        </text>
      </g>
      <text className="fill-foreground font-mono" fontSize={10} x={212} y={58}>
        settles here
      </text>
    </svg>
  )
}

const plates: Record<DesignStudyKind, () => ReactNode> = {
  motion: MotionPlate,
  palette: PalettePlate,
  shape: ShapePlate,
  type: TypePlate,
}

export function DesignStudy({
  children,
  kind,
  plate,
}: {
  children: ReactNode
  kind: DesignStudyKind
  /* The plate's catalogue line, e.g. "plate ii — homage to one accent". */
  plate?: string
}) {
  const Plate = plates[kind]

  return (
    <div className="my-0 grid items-center gap-x-14 gap-y-8 border-t border-border py-12 @4xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <div className="min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>h3]:mb-3 [&>h3]:text-2xl [&>h3]:font-medium [&>h3]:tracking-snug [&>p]:leading-7 [&>p]:text-muted-foreground">
        {children}
      </div>
      <figure className="not-prose m-0 min-w-0">
        <Plate />
        {plate ? (
          <figcaption className="mt-5 font-mono text-[11px] text-muted-foreground">
            {plate}
          </figcaption>
        ) : null}
      </figure>
    </div>
  )
}
