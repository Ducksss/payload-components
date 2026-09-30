import { ArrowRight } from 'lucide-react'

import { Accent, CaseHeading, Chapter } from '@/components/site/case-study/parts'
import { demosBySlug } from '@/components/site/demos/registry'
import Link from '@/i18n/Link'
import { componentEntries } from '@/lib/site'

/* Chapter 07: the work itself. Sixteen real demo twins — the same specimens the
 * catalog and docs render, held to their source class by class — laid on a
 * tilted plane that drifts as the chapter scrolls (.cs-plane). Twins are
 * decorative duplicates of the catalog, so the plane is aria-hidden; the
 * heading and the link carry the fact.
 *
 * Cards reuse the component wall's measured recipe: a 1280px layout scaled with
 * a transform (never zoom, which WebKit's text autosizer inflates) into a fixed
 * frame, so no twin's wrapping can move the page. */

const titleBySlug = new Map<string, string>(
  componentEntries.map((entry) => [entry.slug, entry.title]),
)

const plane = [
  'hero-basic',
  'testimonials-bento',
  'pricing-enterprise',
  'integration-orbit',
  'feature-steps',
  'content-stats',
  'faq-split',
  'integration-marquee',
  'testimonials-spotlight',
  'feature-grid-basic',
  'content-quote',
  'integration-connect',
  'feature-split',
  'hero-video',
  'testimonials-grid',
  'integration-list',
] as const

function PlaneCard({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]
  if (!Demo) return null

  return (
    <div className="w-[384px] shrink-0">
      <p className="mb-2 flex items-center gap-1.5 ps-0.5">
        <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-brand" />
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {titleBySlug.get(slug) ?? slug}
        </span>
      </p>
      <div className="wall-card-frame relative flex h-[216px] items-center overflow-hidden rounded-lg bg-background shadow-frame">
        <div className="w-[1280px] shrink-0 origin-left scale-[0.3]">
          <Demo />
        </div>
      </div>
    </div>
  )
}

export function CaseWork() {
  const count = componentEntries.length

  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container pt-24 lg:pt-36">
        <Chapter index="07">The work</Chapter>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <CaseHeading className="lg:col-span-8">
            {count} components, none of them <Accent>mockups</Accent>.
          </CaseHeading>
          <div className="flex flex-col items-start gap-6 lg:col-span-4">
            <p className="max-w-md text-pretty text-lg leading-8 text-muted-foreground">
              Every preview is the real block&apos;s demo twin, rendered from the same registry the
              docs use and held to its source class by class.
            </p>
            <Link
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              href="/components"
            >
              Browse the catalog
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* A tonal band behind the plane, so white twins read as objects with
          weight rather than dissolving into the page. */}
      <div
        aria-hidden="true"
        className="cs-plane-frame relative mt-14 h-[34rem] overflow-clip bg-muted/70 sm:h-[42rem] lg:mt-20 lg:h-[48rem]"
      >
        <div className="cs-plane absolute left-1/2 top-1/2 grid w-max grid-cols-4 gap-x-6 gap-y-8">
          {plane.map((slug) => (
            <PlaneCard key={slug} slug={slug} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="pb-24 lg:pb-36" />
    </section>
  )
}
