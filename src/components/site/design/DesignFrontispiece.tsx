import type { CSSProperties, ReactNode } from 'react'

/* Plate I on /docs/design: the keying sequence.
 *
 * A Payload block is live only once five artifacts exist. The plate draws them
 * as five stages of one pair of rounded squares closing on the logomark's own
 * geometry: two 8.4-unit blocks offset 6 units on a 24-unit grid, so they
 * overlap by 2.4. Each early stage carries a dashed ghost where its second
 * block will key; the last stage is the mark itself (Logomark.tsx), with its
 * construction lines. Every coordinate below derives from those numbers.
 *
 * The drawing is decorative. The stage list under it and the MDX caption carry
 * the meaning, so the SVG stays aria-hidden. Blocks settle once on load
 * (.design-key in docs.css); reduced motion shows the finished drawing. */

const KEYED = 6 / 8.4
const RADIUS = 1.9 / 8.4

/* Pair bottoms sit on the y=400 baseline, centred on x = 100/300/500/700 so the
   HTML stage list below (1fr ×4 + 2.2fr) lines up with them at every width. */
const stages = [
  { a: [42, 284], b: [118, 360], size: 40 },
  { a: [237, 274], b: [311, 348], size: 52 },
  { a: [432, 264], b: [502, 334], size: 66 },
  { a: [625, 250], b: [691, 316], size: 84 },
] as const

/* The mark: a 280-unit square is 24 grid units at 280/24 each. */
const MARK = { size: 280, x: 880, y: 120 } as const
const unit = MARK.size / 24
const markA = { x: MARK.x + 4.8 * unit, y: MARK.y + 4.8 * unit }
const markB = { x: MARK.x + 10.8 * unit, y: MARK.y + 10.8 * unit }
const markBlock = 8.4 * unit
const markRadius = 1.9 * unit
const gridLines = [4.8, 10.8, 13.2, 19.2].map((line) => line * unit)

const artifacts = [
  { file: 'src/blocks/', label: 'Source' },
  { file: 'Pages/index.ts', label: 'Schema' },
  { file: 'RenderBlocks.tsx', label: 'Renderer' },
  { file: 'payload-types.ts', label: 'Types' },
  { file: 'importMap.js', label: 'Import map' },
] as const

function sparkle(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`
}

function keyStyle(distance: number, delay: number): CSSProperties {
  return {
    '--key-delay': `${delay}ms`,
    '--key-x': `${distance}px`,
    '--key-y': `${distance}px`,
  } as CSSProperties
}

export function DesignFrontispiece({ children }: { children?: ReactNode }) {
  return (
    <figure className="not-prose @container my-12">
      <div className="bg-dots border-y border-border">
        <svg
          aria-hidden="true"
          className="block h-auto w-full"
          fill="none"
          focusable="false"
          viewBox="0 0 1240 420"
        >
          <defs>
            <clipPath id="design-plate-mark">
              <rect height={MARK.size} rx={6 * unit} width={MARK.size} x={MARK.x} y={MARK.y} />
            </clipPath>
            <clipPath id="design-plate-key-a">
              <rect height={markBlock} rx={markRadius} width={markBlock} x={markA.x} y={markA.y} />
            </clipPath>
            <clipPath id="design-plate-key-b">
              <rect height={markBlock} rx={markRadius} width={markBlock} x={markB.x} y={markB.y} />
            </clipPath>
          </defs>

          {/* Crop marks and plate labels. */}
          <g className="stroke-foreground/50" strokeWidth={1}>
            <path d="M8 26V8h18M1214 8h18v18M8 394v18h18M1214 412h18v-18" />
          </g>
          <text
            className="hidden fill-muted-foreground font-mono @xl:inline"
            fontSize={13}
            x={40}
            y={40}
          >
            plate i — the keying sequence
          </text>

          {/* Baseline and stage ticks. */}
          <g className="stroke-foreground/25" strokeWidth={1}>
            <path d="M24 400.5h1192" />
            {[100, 300, 500, 700, 1020].map((x) => (
              <path d={`M${x} 400.5v12`} key={x} />
            ))}
          </g>

          {/* Stages one to four: A, the ghost of where B keys, then B itself. */}
          {stages.map(({ a, b, size }, index) => {
            const radius = size * RADIUS
            const ghost = size * KEYED

            return (
              <g key={size} strokeWidth={1.5}>
                <rect
                  className="stroke-muted-foreground/70"
                  height={size}
                  rx={radius}
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  width={size}
                  x={a[0] + ghost}
                  y={a[1] + ghost}
                />
                <rect
                  className="fill-muted stroke-foreground"
                  height={size}
                  rx={radius}
                  width={size}
                  x={a[0]}
                  y={a[1]}
                />
                <rect
                  className="design-key fill-background stroke-foreground"
                  height={size}
                  rx={radius}
                  style={keyStyle(22, 120 + index * 90)}
                  width={size}
                  x={b[0]}
                  y={b[1]}
                />
              </g>
            )
          })}

          {/* Stage five is the mark: emerald square, two keyed blocks. */}
          <rect
            className="fill-brand"
            height={MARK.size}
            rx={6 * unit}
            width={MARK.size}
            x={MARK.x}
            y={MARK.y}
          />
          <g clipPath="url(#design-plate-mark)" className="stroke-brand-foreground/30">
            {gridLines.map((line) => (
              <g key={line} strokeWidth={1}>
                <path d={`M${MARK.x + line} ${MARK.y}v${MARK.size}`} />
                <path d={`M${MARK.x} ${MARK.y + line}h${MARK.size}`} />
              </g>
            ))}
          </g>
          <rect
            className="fill-brand-foreground"
            height={markBlock}
            rx={markRadius}
            width={markBlock}
            x={markA.x}
            y={markA.y}
          />
          <rect
            className="design-key fill-brand-foreground"
            height={markBlock}
            rx={markRadius}
            style={keyStyle(34, 520)}
            width={markBlock}
            x={markB.x}
            y={markB.y}
          />
          {/* Hidden edges: each block's outline inside the other — the 2.4 overlap. */}
          <g className="design-key-reveal stroke-brand" strokeDasharray="5 4" strokeWidth={1.5}>
            <rect
              clipPath="url(#design-plate-key-b)"
              height={markBlock}
              rx={markRadius}
              width={markBlock}
              x={markA.x}
              y={markA.y}
            />
            <rect
              clipPath="url(#design-plate-key-a)"
              height={markBlock}
              rx={markRadius}
              width={markBlock}
              x={markB.x}
              y={markB.y}
            />
          </g>

          {/* Construction annotations — hidden where the plate is too small to read them. */}
          <g className="hidden @2xl:inline">
            <g className="stroke-foreground/45" strokeWidth={1}>
              <path d={`M${MARK.x} 70h${MARK.size}M${MARK.x} 63v14M${MARK.x + MARK.size} 63v14`} />
              <path
                d={`M${markA.x} 100h${markBlock}M${markA.x} 93v14M${markA.x + markBlock} 93v14`}
              />
              <path d={`M${MARK.x} 80v34M${MARK.x + MARK.size} 80v34`} strokeDasharray="2 3" />
              <circle
                cx={markA.x + markRadius}
                cy={markA.y + markRadius}
                r={markRadius}
                strokeDasharray="2 3"
              />
            </g>
            <g className="stroke-foreground/70" strokeWidth={1}>
              <path d="M1020 260L866 226H856" />
              <path
                d={`M${markA.x + markRadius * 0.29} ${markA.y + markRadius * 0.29}L866 150H856`}
              />
            </g>
            <circle className="fill-foreground" cx={1020} cy={260} r={3} />
            <g className="fill-muted-foreground font-mono" fontSize={13}>
              <text textAnchor="middle" x={MARK.x + MARK.size / 2} y={58}>
                24
              </text>
              <text textAnchor="middle" x={markA.x + markBlock / 2} y={88}>
                8.4
              </text>
              <text textAnchor="end" x={850} y={230}>
                2.4 overlap
              </text>
              <text textAnchor="end" x={850} y={154}>
                r 1.9
              </text>
            </g>
          </g>

          <g className="fill-brand">
            <path d={sparkle(1196, 138, 11)} />
            <path d={sparkle(1215, 166, 6)} />
          </g>
        </svg>
      </div>

      <ol className="grid grid-cols-[1fr_1fr_1fr_1fr_2.2fr] pt-4">
        {artifacts.map((artifact, index) => (
          <li
            key={artifact.label}
            className="flex min-w-0 flex-col items-center gap-0.5 px-1 text-center"
          >
            <span className="font-mono text-[11px] font-medium text-brand">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-foreground @lg:text-sm">
              {artifact.label}
            </span>
            <span className="hidden font-mono text-[11px] text-muted-foreground @3xl:block">
              {artifact.file}
            </span>
          </li>
        ))}
      </ol>

      {children ? (
        <figcaption className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground">
          {children}
        </figcaption>
      ) : null}
    </figure>
  )
}
