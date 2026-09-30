import type { CSSProperties } from 'react'

import { Accent, CaseHeading, Chapter } from '@/components/site/case-study/parts'
import { cn } from '@/utilities/ui'

/* Chapter 04: color, as a monument after Josef Albers' Homage to the Square.
 * The site is a stack of nested surfaces with one accent at the centre, which is
 * exactly his composition: each square steps in one unit at the sides and one
 * and a half at the top, so every bottom margin is a third of its top. Layers
 * drift at different rates as the plate scrolls (.cs-albers-layer), which reads
 * as depth. Painted with live token utilities, never copied values. */

const layers = [
  { className: 'bg-background border border-border rounded-frame', depth: 0 },
  { className: 'bg-muted rounded-frame', depth: 1 },
  { className: 'bg-border rounded-panel', depth: 2 },
  { className: 'bg-muted-foreground rounded-card', depth: 3 },
  { className: 'bg-foreground rounded-inset', depth: 4 },
  { className: 'bg-brand rounded-lg', depth: 5 },
] as const

const legend = [
  { role: 'Paper', swatch: 'bg-background', token: '--background' },
  { role: 'Quiet surface', swatch: 'bg-muted', token: '--muted' },
  { role: 'Hairline', swatch: 'bg-border', token: '--border' },
  { role: 'Second ink', swatch: 'bg-muted-foreground', token: '--muted-foreground' },
  { role: 'Ink', swatch: 'bg-foreground', token: '--foreground' },
  { role: 'The accent', swatch: 'bg-brand', token: '--brand' },
] as const

const UNITS = 12

function AlbersMonument() {
  return (
    <div aria-hidden="true" className="cs-albers relative aspect-square w-full">
      {layers.map((layer, index) => {
        const inset = (index / UNITS) * 100
        const top = ((index * 1.5) / UNITS) * 100
        const size = ((UNITS - index * 2) / UNITS) * 100

        return (
          <div
            className={cn('cs-albers-layer absolute', layer.className)}
            key={layer.depth}
            style={
              {
                '--depth': layer.depth,
                height: `${size}%`,
                left: `${inset}%`,
                top: `${top}%`,
                width: `${size}%`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

export function CasePalette() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="04">Color</Chapter>
        <div className="mt-8 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-12 lg:col-span-5 lg:justify-between">
            <div>
              <CaseHeading>
                One <Accent>accent</Accent>.
              </CaseHeading>
              <p className="mt-8 max-w-md text-pretty text-lg leading-8 text-muted-foreground">
                Zinc builds the structure. Emerald appears only when something means yes — active,
                installed, linked — so color never has to be decoded.
              </p>
            </div>
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {legend.map((entry) => (
                <li key={entry.token} className="flex items-center gap-4 py-3">
                  <span
                    aria-hidden="true"
                    className={cn('size-5 shrink-0 rounded-md border border-border', entry.swatch)}
                  />
                  <span className="flex-1 text-sm font-medium text-foreground">{entry.role}</span>
                  <code className="font-mono text-[11px] text-muted-foreground">{entry.token}</code>
                </li>
              ))}
            </ul>
          </div>

          <figure className="lg:col-span-7">
            <AlbersMonument />
            <figcaption className="mt-6 font-mono text-[11px] leading-5 text-muted-foreground">
              Study after Josef Albers, Homage to the Square (1950–1976): six tokens, nested from
              paper to the accent.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
