import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { WallBand } from '@/components/site/graphics/WallBand'
import { componentEntries } from '@/lib/site'

/* The component wall — the hero's proof.
 *
 * Not a mockup and not a screenshot: three rows of the REAL catalog twins,
 * rendered from the same registry the docs and /components render from, drifting
 * past at different speeds and directions. The claim the hero makes in words
 * ("a registry of wired Payload blocks") is answered by simply showing the
 * registry, alive.
 *
 * Everything here is server-rendered and visible with JavaScript off — only the
 * drift is client-side (WallBand). The rows are decorative duplicates of the
 * catalog, so the whole wall is aria-hidden and the twins stay presentational;
 * the counter line beneath it carries the same fact for assistive tech and for
 * anyone with motion disabled. */

/* Widened to string keys on purpose: componentEntries is const-asserted, so an
   inferred Map would only accept the literal slug union as a lookup key. */
const titleBySlug = new Map<string, string>(
  componentEntries.map((entry) => [entry.slug, entry.title]),
)

/* Curated per row so each band mixes families — a row of six FAQs would read as
   repetition rather than range. Six cards fill the widest supported viewport
   with room to spare, which keeps the duplicated track (and the DOM) modest. */
const BANDS: { reverse?: boolean; slugs: string[]; speed: number }[] = [
  {
    slugs: [
      'hero-basic',
      'logo-cloud-inline',
      'faq-accordion',
      'content-stats',
      'call-to-action-centered',
      'testimonials-quote',
    ],
    speed: 3.1,
  },
  {
    reverse: true,
    slugs: [
      'pricing-cards',
      'testimonials-rating',
      'content-quote',
      'integration-orbit',
      'feature-grid-basic',
      'content-columns',
    ],
    speed: 2.4,
  },
  {
    slugs: [
      'feature-bento',
      'testimonials-spotlight',
      'content-feature-split',
      'integration-marquee',
      'faq-grid',
      'team-grid',
    ],
    speed: 2.8,
  },
]

function WallCard({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]
  if (!Demo) return null

  /* Narrow on phones on purpose: at 340px a 390px-wide viewport shows one card
     and two slivers, which reads as a cropped carousel rather than a wall.
     ~215px keeps three cards in frame so the rows still say "many". */
  return (
    <div className="w-[215px] shrink-0 overflow-hidden rounded-2xl border border-border bg-background shadow-card sm:w-[340px] lg:w-[380px]">
      <div className="flex items-center gap-2 border-b border-border/70 px-3 py-2 sm:px-4 sm:py-2.5">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
        <span className="truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
          {titleBySlug.get(slug) ?? slug}
        </span>
      </div>
      <DemoFitFrame className="h-[130px] sm:h-[170px] lg:h-[190px]">
        <div className="p-3 sm:p-4">
          <Demo />
        </div>
      </DemoFitFrame>
    </div>
  )
}

export function ComponentWall() {
  return (
    <div aria-hidden="true" className="component-wall relative">
      {/* Tilted and over-wide so the rows read as a continuous surface passing
          behind the page rather than three lists that start and stop. */}
      <div className="-mx-[8vw] flex rotate-[-1.4deg] scale-[1.06] flex-col gap-3 sm:-mx-[6vw] sm:rotate-[-2deg] sm:scale-[1.04] sm:gap-5">
        {BANDS.map((band, index) => (
          <div
            key={band.slugs[0]}
            className="wall-band"
            style={{ '--wall-delay': `${index * 110}ms` } as React.CSSProperties}
          >
            <WallBand reverse={band.reverse} speed={band.speed}>
              {band.slugs.map((slug) => (
                <WallCard key={slug} slug={slug} />
              ))}
            </WallBand>
          </div>
        ))}
      </div>

      {/* One-shot emerald sweep on load — the wall "powering on". */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[26%] overflow-hidden">
        <div className="wall-sweep absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-brand/12 to-transparent" />
      </div>

      {/* Edge fades so the wall dissolves into the page instead of being cropped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />
    </div>
  )
}

export const componentWallCount = componentEntries.length
