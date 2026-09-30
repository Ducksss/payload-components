import { MARK } from '@/components/site/case-study/geometry'
import { Accent, CaseHeading, Chapter, KeyedMark } from '@/components/site/case-study/parts'
import { pipelineStages } from '@/lib/site'

/* Chapter 06: the install as a filmstrip. One frame per artifact, straight from
 * the pipeline copy the About page uses (pipelineStages), each drawing the pair
 * of blocks one step closer to keyed; the last frame is the mark. On wide
 * screens with scroll timelines the strip pins and slides sideways as you
 * scroll (.cs-film*); everywhere else the same frames stack as a list. */

const files = [
  'src/blocks/',
  'src/collections/Pages/index.ts',
  'src/blocks/RenderBlocks.tsx',
  'src/payload-types.ts',
  'src/app/(payload)/admin/importMap.js',
] as const

/* Offset between the pair's corners, as a multiple of the block size. Keyed is
   6 / 8.4 ≈ 0.714; the stages close on it and the last frame is the mark. */
const approach = [1.6, 1.25, 1.0, 0.82] as const
const numberWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

function StageArt({ index }: { index: number }) {
  const offsetRatio = approach[index]

  if (offsetRatio === undefined) {
    return <KeyedMark className="h-auto w-[62%]" grid />
  }

  const size = 80
  const offset = size * offsetRatio
  const start = 120 - (size + offset) / 2
  const keyed = (size * (MARK.keyB - MARK.keyA)) / MARK.block
  const radius = size * (MARK.blockRadius / MARK.block)

  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full"
      fill="none"
      focusable="false"
      viewBox="0 0 240 240"
    >
      <rect
        className="stroke-muted-foreground/70"
        height={size}
        rx={radius}
        strokeDasharray="4 4"
        width={size}
        x={start + keyed}
        y={start + keyed}
      />
      <rect
        className="fill-muted stroke-foreground"
        height={size}
        rx={radius}
        strokeWidth={1.5}
        width={size}
        x={start}
        y={start}
      />
      <rect
        className="fill-background stroke-foreground"
        height={size}
        rx={radius}
        strokeWidth={1.5}
        width={size}
        x={start + offset}
        y={start + offset}
      />
    </svg>
  )
}

export function CaseInstall() {
  const count = numberWords[pipelineStages.length] ?? String(pipelineStages.length)

  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container pt-24 lg:pt-36">
        <Chapter index="06">The system</Chapter>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <CaseHeading className="lg:col-span-8">
            {count} artifacts, one <Accent>command</Accent>.
          </CaseHeading>
          <p className="max-w-md text-pretty text-lg leading-8 text-muted-foreground lg:col-span-4">
            <code className="font-mono text-[0.9em] text-foreground">
              npx payload-components add
            </code>{' '}
            runs the whole chain in one pass and lands it as a single diff you review like any pull
            request.
          </p>
        </div>
      </div>

      <div className="cs-film mt-16 lg:mt-20">
        <div className="cs-film-stage">
          <ol className="cs-film-track">
            {pipelineStages.map((stage, index) => (
              <li className="cs-film-frame" key={stage.title}>
                <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
                  <div className="bg-dots flex aspect-square w-full max-w-[24rem] items-center justify-center rounded-frame">
                    <StageArt index={index} />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                      <span className="text-brand">{String(index + 1).padStart(2, '0')}</span> /{' '}
                      {String(pipelineStages.length).padStart(2, '0')}
                    </p>
                    <h3 className="mt-6 text-balance text-[clamp(2rem,3.8vw,3.75rem)] font-medium leading-[1] tracking-title text-foreground">
                      {stage.title}
                    </h3>
                    <p className="mt-5 max-w-md text-pretty text-lg leading-8 text-muted-foreground">
                      {stage.detail}
                    </p>
                    <p className="mt-6 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                      {files[index]}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="cs-film-rail">
            <span className="cs-film-progress" />
          </div>
        </div>
      </div>

      <div className="pb-24 lg:pb-36" />
    </section>
  )
}
