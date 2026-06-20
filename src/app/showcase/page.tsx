import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowUpRight, Sparkles } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  communityShowcase,
  communityShowcaseEmptyState,
  communityShowcaseEyebrow,
  communityShowcaseHeading,
  communityShowcaseIntro,
  showAndTellUrl,
} from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

/* The community showcase: sites built WITH payload-components, the concrete
   payoff of the landing page's "early installs get featured" invite. Distinct
   from the /about ClientShowcase (origin-story freelance work that predates the
   CLI). Starts empty with an honest empty state — no fabricated entries. */

const description =
  'Real sites built with Payload Components — blocks installed straight from the registry, wired not pasted. Shipped something? Open a show-and-tell issue to get featured.'

export const metadata: Metadata = {
  alternates: { canonical: '/showcase' },
  title: 'Showcase',
  description,
  openGraph: {
    description,
    title: 'Showcase — Built with Payload Components',
    type: 'website',
    url: '/showcase',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'Showcase — Built with Payload Components',
  },
}

const showcaseStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Showcase', path: '/showcase' },
  ]),
)

export default function ShowcasePage() {
  return (
    <>
      <JsonLd data={showcaseStructuredData} />
      {/* No activePath — /showcase isn't a top-nav item (keeping it out of the
          header preserves the homepage visual-regression baseline). */}
      <SiteHeader />

      <main className="flex-1">
        <Section>
          <SectionHeading
            accentWord="Components"
            eyebrow={communityShowcaseEyebrow}
            heading={communityShowcaseHeading}
            intro={communityShowcaseIntro}
          />

          {communityShowcase.length === 0 ? (
            <div className="mt-12 flex flex-col items-start gap-5 rounded-[1.25rem] border border-dashed border-border bg-muted/30 p-8 sm:p-10">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="size-4 text-brand" aria-hidden="true" />
                Open for submissions
              </span>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {communityShowcaseEmptyState}
              </p>
              <Link
                href={showAndTellUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit your build
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {communityShowcase.map((project) => (
                  <article
                    key={project.slug}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-frame"
                  >
                    <div className="flex w-fit items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1">
                      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="truncate font-mono text-[11px] text-muted-foreground">
                        {project.displayUrl}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p>
                    {project.blocksUsed.length ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.blocksUsed.map((block) => (
                          <span
                            key={block}
                            className="inline-flex items-center rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {block}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${project.name} (opens in a new tab)`}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
                    >
                      Visit
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <Link
                  href={showAndTellUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Built something with it? Get featured — open a show-and-tell issue
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
