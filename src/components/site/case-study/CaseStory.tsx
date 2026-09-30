import type { CSSProperties } from 'react'

import { MARK } from '@/components/site/case-study/geometry'
import { Accent, CaseHeading, Chapter } from '@/components/site/case-study/parts'

/* Chapters 01 and 02: the problem, then the idea.
 *
 * The brief plate is the problem as a gesture. Five blocks, one per artifact a
 * Payload block needs, arrive tossed and dashed like pasted scraps; as the plate
 * crosses the viewport they straighten into a row, their edges go solid, one
 * wire threads them, and each is checked. Without scroll timelines (or with
 * reduced motion) the plate simply shows the wired row. */

const artifacts = [
  { file: 'src/blocks/', label: 'Source', scatter: [40, -60, -14] },
  { file: 'Pages/index.ts', label: 'Schema', scatter: [-110, 95, 21] },
  { file: 'RenderBlocks.tsx', label: 'Renderer', scatter: [60, -105, -7] },
  { file: 'payload-types.ts', label: 'Types', scatter: [-80, 70, 28] },
  { file: 'importMap.js', label: 'Import map', scatter: [-150, -40, -19] },
] as const

const SIZE = 168
const STEP = 235
const FIRST = 130
const CENTER_Y = 206
const RADIUS = SIZE * (MARK.blockRadius / MARK.block)

function BriefPlate() {
  return (
    <div className="cs-brief-plate">
      <svg
        aria-hidden="true"
        className="h-auto w-full overflow-visible"
        fill="none"
        focusable="false"
        viewBox="0 0 1200 420"
      >
        <path
          className="cs-brief-wire stroke-brand"
          d={`M0 ${CENTER_Y}H1200`}
          pathLength={100}
          strokeWidth={2}
        />
        {artifacts.map((artifact, index) => {
          const cx = FIRST + index * STEP
          const [sx, sy, sr] = artifact.scatter

          return (
            <g
              className="cs-scatter"
              key={artifact.label}
              style={{ '--sr': `${sr}deg`, '--sx': `${sx}px`, '--sy': `${sy}px` } as CSSProperties}
            >
              <rect
                className="cs-scatter-edge fill-background stroke-foreground"
                height={SIZE}
                rx={RADIUS}
                strokeWidth={2}
                width={SIZE}
                x={cx - SIZE / 2}
                y={CENTER_Y - SIZE / 2}
              />
              <circle
                className="fill-background stroke-brand"
                cx={cx - SIZE / 2}
                cy={CENTER_Y}
                r={5}
                strokeWidth={2}
              />
              <circle
                className="fill-background stroke-brand"
                cx={cx + SIZE / 2}
                cy={CENTER_Y}
                r={5}
                strokeWidth={2}
              />
              <text
                className="fill-muted-foreground font-mono"
                fontSize={12}
                textAnchor="middle"
                x={cx}
                y={CENTER_Y - 34}
              >
                {String(index + 1).padStart(2, '0')}
              </text>
              <text
                className="fill-foreground font-sans"
                fontSize={21}
                fontWeight={500}
                textAnchor="middle"
                x={cx}
                y={CENTER_Y + 6}
              >
                {artifact.label}
              </text>
              <text
                className="fill-muted-foreground font-mono"
                fontSize={11.5}
                textAnchor="middle"
                x={cx}
                y={CENTER_Y + 32}
              >
                {artifact.file}
              </text>
              <g className="cs-check">
                <circle
                  className="fill-brand"
                  cx={cx + SIZE / 2 - 24}
                  cy={CENTER_Y - SIZE / 2 + 24}
                  r={13}
                />
                <path
                  className="stroke-brand-foreground"
                  d={`M${cx + SIZE / 2 - 30} ${CENTER_Y - SIZE / 2 + 24}l4.5 4.5 8-9`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function CaseBrief() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="01">The brief</Chapter>
        <CaseHeading className="mt-8 max-w-6xl">
          Copying a block is easy. Making it <Accent>live</Accent> is the job.
        </CaseHeading>
        <div className="mt-16 lg:mt-24">
          <BriefPlate />
        </div>
        <p className="mt-14 max-w-xl text-pretty text-lg leading-8 text-muted-foreground lg:ms-auto">
          A pasted Payload block does nothing until four more edits land — the schema, the renderer,
          the types, the import map. On every project, by hand, then proven by hand. The brief was
          to make all five one step.
        </p>
      </div>
    </section>
  )
}

/* The positioning line as a poster, with the wire drawn through it on scroll. */
export function CaseIdea() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container pt-24 lg:pt-36">
        <Chapter index="02">The idea</Chapter>
      </div>

      <div className="cs-idea-poster relative mt-10 px-[4vw]">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          focusable="false"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1600 500"
        >
          <path
            className="cs-idea-wire stroke-brand"
            d="M-40 318C190 318 250 214 470 238S820 336 1040 286S1310 190 1452 198"
            pathLength={100}
            strokeLinecap="round"
            strokeWidth={4}
          />
          <circle
            className="fill-background stroke-brand"
            cx={-40}
            cy={318}
            r={9}
            strokeWidth={4}
          />
          <g transform="translate(1452 170) scale(2.35)">
            <rect
              className="fill-brand"
              height={MARK.grid}
              rx={MARK.containerRadius}
              width={MARK.grid}
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
              className="fill-brand-foreground"
              height={MARK.block}
              rx={MARK.blockRadius}
              width={MARK.block}
              x={MARK.keyB}
              y={MARK.keyB}
            />
          </g>
        </svg>
        <h2 className="relative text-[clamp(4.25rem,17.5vw,20rem)] font-medium leading-[0.82] tracking-display text-foreground">
          <span className="block">Wired,</span>{' '}
          <span className="block ps-[13vw]">
            <Accent>not pasted.</Accent>
          </span>
        </h2>
      </div>

      <div className="container grid pb-24 pt-16 lg:grid-cols-12 lg:pb-36">
        <p className="max-w-xl text-pretty text-lg leading-8 text-muted-foreground lg:col-span-5 lg:col-start-7">
          Three words carry the whole product. Everything below is those words made visible: blocks
          that key together, one wire, one accent.
        </p>
      </div>
    </section>
  )
}
