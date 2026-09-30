import { MARK, markCoverage } from '@/components/site/case-study/geometry'
import {
  Accent,
  CaseHeading,
  Chapter,
  KeyedMark,
  RetiredMark,
} from '@/components/site/case-study/parts'

/* Chapter 03: the mark. A size specimen on one baseline (the mark was chosen
 * at tab size, not poster size), the retired prompt-and-cursor mark for
 * contrast, and a pixel study: the 16px rasterization, magnified, with the
 * vector drawn over it. The coverage map is computed from the real geometry at
 * build time, so it cannot drift from the shipping mark. */

const specimens = [
  { className: 'size-36 sm:size-48', label: '192' },
  { className: 'size-24', label: '96' },
  { className: 'size-12', label: '48' },
  { className: 'size-6', label: '24' },
  { className: 'size-4', label: '16' },
] as const

const PIXELS = 16
const coverage = markCoverage(PIXELS)
const scale = PIXELS / MARK.grid

function PixelStudy() {
  return (
    <svg
      aria-hidden="true"
      className="aspect-square h-auto w-full max-w-[30rem]"
      focusable="false"
      viewBox={`-0.5 -0.5 ${PIXELS + 1} ${PIXELS + 1}`}
    >
      {coverage.flatMap((row, y) =>
        row.map((value, x) =>
          value > 0 ? (
            <rect
              className="fill-brand"
              fillOpacity={value}
              height={1}
              key={`${x}-${y}`}
              width={1}
              x={x}
              y={y}
            />
          ) : null,
        ),
      )}
      <g className="stroke-foreground/15" strokeWidth={0.03}>
        {Array.from({ length: PIXELS + 1 }, (_, line) => (
          <path d={`M${line} 0V${PIXELS}M0 ${line}H${PIXELS}`} key={line} />
        ))}
      </g>
      {/* The vector, over its own raster. */}
      <g className="stroke-foreground" fill="none" strokeWidth={0.05}>
        <rect height={PIXELS} rx={MARK.containerRadius * scale} width={PIXELS} />
        <rect
          height={MARK.block * scale}
          rx={MARK.blockRadius * scale}
          width={MARK.block * scale}
          x={MARK.keyA * scale}
          y={MARK.keyA * scale}
        />
        <rect
          height={MARK.block * scale}
          rx={MARK.blockRadius * scale}
          strokeDasharray="0.18 0.14"
          width={MARK.block * scale}
          x={MARK.keyB * scale}
          y={MARK.keyB * scale}
        />
      </g>
    </svg>
  )
}

export function CaseIdentity() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="03">Identity</Chapter>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <CaseHeading className="lg:col-span-7">
            Two blocks, <Accent>keyed</Accent>.
          </CaseHeading>
          <p className="max-w-md text-pretty text-lg leading-8 text-muted-foreground lg:col-span-4 lg:col-start-9">
            Two equal squares overlap on the diagonal: separate pieces fitted into one shape, which
            is what the installer does. It replaced a prompt-and-cursor mark that stopped reading as
            a prompt at tab size, so candidates were judged at 16 pixels, not at poster size.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-12">
          <figure className="lg:col-span-7">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-8 border-b border-foreground/25 pb-5">
              {specimens.map((specimen) => (
                <div key={specimen.label} className="flex flex-col items-start gap-3">
                  <KeyedMark className={specimen.className} />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {specimen.label}px
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
              <div className="flex items-end gap-4">
                <RetiredMark className="size-12" />
                <RetiredMark className="size-6" />
                <RetiredMark className="size-4" />
              </div>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                <span className="me-2 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
                  Retired
                </span>
                The prompt-and-cursor mark, at the three sizes where it failed.
              </p>
            </div>
            <figcaption className="mt-10 max-w-lg font-mono text-[11px] leading-5 text-muted-foreground">
              Specimen — the shipping mark from 192px to a 16px browser tab, on one baseline. The
              union has no seam to lose, so the silhouette survives every step down.
            </figcaption>
          </figure>

          <figure className="flex flex-col items-start gap-6 lg:col-span-5">
            <PixelStudy />
            <div className="flex items-center gap-4">
              <KeyedMark className="size-4" />
              <span className="font-mono text-[11px] text-muted-foreground">actual size</span>
            </div>
            <figcaption className="max-w-sm font-mono text-[11px] leading-5 text-muted-foreground">
              Pixel study — the mark rasterized at 16 × 16. Each cell is the share of that pixel the
              emerald covers; the outline is the vector it came from.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
