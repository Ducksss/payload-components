import { Accent, CaseHeading, Chapter } from '@/components/site/case-study/parts'
import { componentEntries } from '@/lib/site'

/* Chapter 05: type. One glyph from each face at poster scale — Geist Sans solid,
 * Instrument Serif as an outline, Geist Mono in the accent — then two ribbons of
 * real install commands that slide against each other as the chapter scrolls
 * (.cs-ribbon-track). The ribbons repeat the catalog's own slugs, so they are
 * decorative duplicates and stay aria-hidden. */

const faces = [
  { name: 'Geist Sans', role: 'Does the work: prose, headings, controls.' },
  { name: 'Instrument Serif', role: 'One italic word per heading. Never a paragraph.' },
  { name: 'Geist Mono', role: 'Anything you might copy: commands, paths, versions.' },
] as const

const slugs = componentEntries.map((entry) => entry.slug)
const ribbons = [slugs.slice(0, 18), slugs.slice(18, 36)] as const

function Ribbon({ reverse = false, items }: { items: readonly string[]; reverse?: boolean }) {
  return (
    <div
      className="cs-ribbon-track flex w-max gap-10 whitespace-nowrap font-mono text-[clamp(1.4rem,3.6vw,3.25rem)] tracking-snug text-foreground"
      data-reverse={reverse ? '' : undefined}
    >
      {items.map((slug) => (
        <span key={slug}>
          <span className="text-brand">add</span> {slug}
        </span>
      ))}
    </div>
  )
}

export function CaseType() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="05">Type</Chapter>
        <CaseHeading className="mt-8">
          Three faces, one <Accent>voice</Accent>.
        </CaseHeading>

        <svg
          aria-hidden="true"
          className="mt-16 h-auto w-full overflow-visible lg:mt-24"
          focusable="false"
          viewBox="0 0 1200 660"
        >
          <path className="stroke-foreground/25" d="M0 470.5H1200" strokeWidth={1} />
          <text
            className="fill-foreground font-sans"
            fontSize={560}
            fontWeight={500}
            letterSpacing={-30}
            x={-8}
            y={470}
          >
            A
          </text>
          <text
            className="fill-none stroke-foreground font-serif italic"
            fontSize={660}
            strokeWidth={2}
            x={380}
            y={470}
          >
            g
          </text>
          <text className="fill-brand font-mono" fontSize={290} x={790} y={400}>
            {'{}'}
          </text>
        </svg>

        <dl className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
          {faces.map((face) => (
            <div key={face.name} className="flex flex-col gap-2">
              <dt className="font-mono text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
                {face.name}
              </dt>
              <dd className="max-w-xs text-sm leading-6 text-muted-foreground">{face.role}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        aria-hidden="true"
        className="cs-ribbon flex flex-col gap-4 border-t border-border py-12 lg:py-16"
      >
        <Ribbon items={ribbons[0]} />
        <Ribbon items={ribbons[1]} reverse />
      </div>
    </section>
  )
}
