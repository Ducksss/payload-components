import { ArrowDown } from 'lucide-react'

import { MARK, sparklePath } from '@/components/site/case-study/geometry'
import { Accent } from '@/components/site/case-study/parts'

/* The cover plate: the project name at poster scale beside the logomark drawn
 * monumental, on its 24-unit construction grid. The second block keys home
 * once on load (.cs-key-home), leaving a dashed trace of where it started —
 * the whole product in one gesture. The <h1> never animates: it is the LCP. */

const lines = [MARK.keyA, MARK.keyB, MARK.keyA + MARK.block, MARK.keyB + MARK.block]
const START = 5 /* where the second block starts, in grid units — matches .cs-key-home */

const facts = [
  { label: 'Year', value: '2026' },
  { label: 'Scope', value: 'Identity, CLI, docs, components' },
  { label: 'Stack', value: 'Payload v3 · Next.js · shadcn' },
  { label: 'License', value: 'MIT, end to end' },
] as const

function CoverMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full overflow-visible"
      focusable="false"
      viewBox="-1 -3 34 34"
    >
      <rect className="fill-brand" height={MARK.grid} rx={MARK.containerRadius} width={MARK.grid} />
      <g className="stroke-brand-foreground/25" fill="none" strokeWidth={0.05}>
        {lines.map((line) => (
          <path d={`M${line} 0.25V23.75M0.25 ${line}H23.75`} key={line} />
        ))}
      </g>

      {/* The trace: where the second block began before it keyed. */}
      <rect
        className="stroke-foreground/40"
        fill="none"
        height={MARK.block}
        rx={MARK.blockRadius}
        strokeDasharray="0.45 0.45"
        strokeWidth={0.07}
        width={MARK.block}
        x={MARK.keyB + START}
        y={MARK.keyB + START}
      />
      <path
        className="stroke-foreground/40"
        d={`M${MARK.keyB + MARK.block + START * 0.2} ${MARK.keyB + MARK.block + START * 0.2}L${MARK.keyB + MARK.block + START * 0.8} ${MARK.keyB + MARK.block + START * 0.8}`}
        strokeLinecap="round"
        strokeWidth={0.07}
      />

      <rect
        className="fill-brand-foreground"
        height={MARK.block}
        rx={MARK.blockRadius}
        width={MARK.block}
        x={MARK.keyA}
        y={MARK.keyA}
      />
      <rect
        className="cs-key-home fill-brand-foreground"
        height={MARK.block}
        rx={MARK.blockRadius}
        width={MARK.block}
        x={MARK.keyB}
        y={MARK.keyB}
      />

      <g className="fill-brand">
        <path d={sparklePath(27.2, 1.4, 1.3)} />
        <path d={sparklePath(29.8, 4.6, 0.7)} />
      </g>
      <text
        className="fill-muted-foreground font-mono max-sm:hidden"
        fontSize={0.72}
        letterSpacing={0.12}
        x={0}
        y={27.4}
      >
        FIG. 1 — THE MARK, ON ITS 24-UNIT GRID
      </text>
    </svg>
  )
}

export function CaseCover() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_72%_42%,black_18%,transparent_70%)]"
      />

      <div className="container relative flex min-h-[calc(100svh-3.5rem)] flex-col gap-10 py-8 sm:py-10">
        <div className="flex items-center justify-between gap-6 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            Case study
          </span>
          <span>Payload Components · 2026</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-end gap-10 lg:justify-center">
          <div className="cs-cover-mark ms-auto w-[min(78vw,26rem)] lg:absolute lg:end-[-7%] lg:top-1/2 lg:w-[min(64svh,44vw)] lg:-translate-y-1/2">
            <CoverMark />
          </div>

          <div className="relative max-w-[62rem]">
            <h1 className="text-[clamp(3.6rem,12.4vw,12.75rem)] font-medium leading-[0.84] tracking-display text-foreground">
              Payload{' '}
              <span className="block">
                <Accent>Components</Accent>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              An open-source registry and CLI that installs Payload CMS blocks — wired, not pasted.
              This is how it was designed, from the mark down to the last hairline.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1.5">
                <dt className="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
            Scroll
            <ArrowDown aria-hidden="true" className="size-3.5" />
          </p>
        </div>
      </div>
    </section>
  )
}
