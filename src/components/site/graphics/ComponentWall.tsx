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

/* Curated from measured heights, not by eye. Every twin here renders between
 * ~150px and ~212px inside the 215px frame at the wall's zoom, so each card is
 * COMPLETE and nearly full: no block is guillotined mid-sentence, and none
 * floats in a half-empty card. That constraint is what makes the wall read as
 * range instead of repetition — a pricing table, an orbit diagram and a
 * testimonial grid are unmistakably different shapes only when you can see all
 * of each one.
 *
 * The blocks left out are excluded on geometry, not quality: logo clouds are
 * far too short to fill a card, and faq-accordion / pricing-cards /
 * feature-bento / team-grid are all tall enough to need cropping.
 *
 * Rows mix families deliberately — six FAQs in a row would be repetition again.
 * `speed` is percent of the (doubled) track per second: ~1.0 is about 48px/s,
 * slow enough to read as drift rather than a carousel in a hurry. */
const BANDS: { reverse?: boolean; slugs: string[]; speed: number }[] = [
  {
    slugs: [
      'hero-basic',
      'integration-marquee',
      'content-stats',
      'testimonials-spotlight',
      'feature-steps',
      'pricing-enterprise',
    ],
    speed: 1.15,
  },
  {
    reverse: true,
    slugs: [
      'testimonials-bento',
      'feature-grid-basic',
      'content-quote',
      'integration-orbit',
      'faq-split',
      'content-feature-split',
    ],
    speed: 0.88,
  },
  {
    slugs: [
      'feature-split',
      'testimonials-grid',
      'integration-connect',
      'hero-video',
      'integration-list',
      'content-feature-media',
    ],
    speed: 1.02,
  },
]

function WallCard({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]
  if (!Demo) return null

  /* Widths are 231 / 330 / 384 rather than round numbers because each divides
     exactly by the 0.3 zoom below (770 / 1100 / 1280), so every twin lays out at
     an INTEGER width. At 230 and 380 the layout width came out fractional
     (766.67 / 1266.67), and sub-pixel text layout at a fractional width made the
     rendered card height flip by 1px between otherwise identical runs. On mobile
     the wall sits above ~17,000px of page, so that 1px relayouts everything
     below it and blows the visual-regression tolerance.

     Narrow on phones on purpose: at 340px a 390px-wide viewport shows one card
     and two slivers, which reads as a cropped carousel rather than a wall.
     ~230px keeps three cards in frame so the rows still say "many".
     shadow-frame, not shadow-card: at this size a 1px hairline reads as a
     wireframe, and the lift is what makes each block a physical thing on a
     surface rather than an outline drawn on the page. */
  return (
    <div className="w-[231px] shrink-0 sm:w-[330px] lg:w-[384px]">
      {/* Caption, not chrome. Wrapping each twin in a bordered card put a frame
          around a block that already draws its own — the doubled edge is what
          made the rows read as screenshots in widgets. The label sits outside
          the block now, and stays smaller than the type inside it. */}
      <p className="mb-2 flex items-center gap-1.5 pl-0.5">
        <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-brand/70" />
        <span className="truncate font-mono text-[9px] tracking-tight text-muted-foreground/70">
          {titleBySlug.get(slug) ?? slug}
        </span>
      </p>
      {/* Zoomed far enough out that the WHOLE block fits, which is the entire
          point of the wall: a pricing table has to look nothing like a
          testimonial grid. Cropped to their top thirds (the earlier 0.5) every
          twin showed the same eyebrow → headline → paragraph anatomy, and a
          wall built to prove range read as repetition. `zoom` (not transform)
          so percentage widths resolve against the scaled box and the block
          lays out at real desktop proportions before shrinking. */}
      {/* Fixed height, not natural. Letting the box follow its content means the
          page height depends on how each twin happens to wrap, and on mobile
          that sits above ~17,000px of page. A constant box makes the page height
          independent of the cards entirely — belt and braces alongside the
          integer widths above. Content is centred so shorter blocks read as
          deliberately framed rather than stranded at the top of dead space. */}
      <div className="relative flex h-[152px] items-center overflow-hidden rounded-[0.7rem] bg-background shadow-frame sm:h-[186px] lg:h-[216px]">
        <div className="w-full [zoom:0.3]">
          <Demo />
        </div>
      </div>
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
    </div>
  )
}
