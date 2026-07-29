import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TemplateGalleryView } from '@/components/site/templates/TemplateAnalytics'
import { TemplateCard } from '@/components/site/templates/TemplateCard'
import { TemplateContribution } from '@/components/site/templates/TemplateContribution'
import { TemplateGalleryFilter } from '@/components/site/templates/TemplateGalleryFilter'
import {
  siteUrl,
  templateCategoryLabels,
  templatesContribution,
  templatesDescription,
  templatesEyebrow,
  templatesMetadataDescription,
  templatesMetadataTitle,
  templatesTitle,
} from '@/lib/site'
import { templateShowcases } from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_DISCLOSURE, TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'
import { breadcrumbNode, graph, websiteId } from '@/lib/structured-data'

/* /templates gallery — indexable editorial index of the full-site concepts.
 * Contract: one H1, the concept disclosure up top, poster-led cards linking to
 * detail + full preview, a community close, and hard absences: no iframes, no
 * install command, no price, no capture. Category filtering (client, URL-synced,
 * layout-animated) is on now that the gallery holds 6+ concepts; every card is
 * still built here on the server and handed to the filter as a rendered
 * element, so the whole set ships in the initial HTML and the showcase registry
 * never reaches the client bundle. */

/* Category chips in first-appearance (curated registry) order. */
const galleryCategories = (() => {
  const order: string[] = []
  const counts = new Map<string, number>()
  for (const template of templateShowcases) {
    if (!counts.has(template.category)) order.push(template.category)
    counts.set(template.category, (counts.get(template.category) ?? 0) + 1)
  }
  return order.map((value) => ({
    count: counts.get(value) ?? 0,
    label: templateCategoryLabels[value as keyof typeof templateCategoryLabels],
    value,
  }))
})()

export const metadata: Metadata = {
  alternates: { canonical: '/templates' },
  description: templatesMetadataDescription,
  openGraph: {
    description: templatesMetadataDescription,
    title: templatesMetadataTitle,
    type: 'website',
    url: '/templates',
  },
  title: templatesMetadataTitle,
  twitter: {
    card: 'summary_large_image',
    description: templatesMetadataDescription,
    title: templatesMetadataTitle,
  },
}

const templatesStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Templates', path: '/templates' },
  ]),
  {
    '@id': `${siteUrl}/templates#collection`,
    '@type': 'CollectionPage',
    description: templatesMetadataDescription,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    name: templatesMetadataTitle,
    url: `${siteUrl}/templates`,
  },
)

export default function TemplatesPage() {
  return (
    <>
      <JsonLd data={templatesStructuredData} />
      <SiteHeader activePath="/templates" />
      <TemplateGalleryView />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-5 py-12 sm:py-16">
            <div className="max-w-3xl">
              <Eyebrow>{templatesEyebrow}</Eyebrow>
              <h1 className="mt-4 text-balance text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                {templatesTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {templatesDescription}
              </p>
            </div>

            <div className="flex max-w-2xl flex-col gap-3 rounded-card border border-border bg-background/85 p-4 backdrop-blur-sm sm:flex-row sm:items-start sm:gap-4">
              <span className="w-fit shrink-0 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                {TEMPLATE_CONCEPT_STATUS_LABEL}
              </span>
              <p className="text-sm leading-6 text-muted-foreground">
                {TEMPLATE_CONCEPT_DISCLOSURE}
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Template showcases">
          <div className="container py-12 lg:py-16">
            <TemplateGalleryFilter
              categories={galleryCategories}
              items={templateShowcases.map((template, index) => ({
                card: <TemplateCard priority={index === 0} template={template} />,
                category: template.category,
                slug: template.slug,
              }))}
            />
          </div>
        </section>

        <Section containerClassName="py-14 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
            <div>
              <SectionHeading
                accentWord="right"
                eyebrow="Starting point"
                heading="Choose the right starting point for your Payload site"
                intro="A template can mean a ready-made project, a visual direction, or a set of reusable sections. Pick the path that matches what you already have before you commit to a build."
              />

              <div className="mt-10 divide-y divide-border border-y border-border">
                <article className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                    New project
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold tracking-heading text-foreground">
                      Start from the official Payload website template
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      If you need a complete repository with collections, authentication, live
                      preview, search, and a layout builder already configured, Payload’s official
                      website template is the stronger foundation.
                    </p>
                    <a
                      href="https://github.com/payloadcms/payload/tree/main/templates/website"
                      className="mt-3 inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                      rel="noreferrer"
                      target="_blank"
                    >
                      View the official Payload website template
                    </a>
                  </div>
                </article>

                <article className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                    Existing project
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold tracking-heading text-foreground">
                      Add only the blocks your site needs
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      If Payload CMS v3 and Next.js are already running, use the component catalog.
                      Each block stays in your codebase and includes the collection registration,
                      renderer mapping, generated types, and admin import-map work that makes it
                      usable in a real project.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      <Link
                        href="/components"
                        className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                      >
                        Browse the component catalog
                      </Link>
                      <Link
                        href="/docs/installation"
                        className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                      >
                        Read the installation guide
                      </Link>
                    </div>
                  </div>
                </article>

                <article className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                    Planning first
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold tracking-heading text-foreground">
                      Use a concept to plan the full site
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Open any concept when you want to compare complete page systems before writing
                      code. Every concept includes page-level previews, visual tokens, and an
                      ordered block recipe, so you can reuse the composition without pretending the
                      showcase is a packaged starter repository.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <aside className="h-fit rounded-frame border border-border bg-foreground p-7 text-background shadow-frame sm:p-8 lg:sticky lg:top-24">
              <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-200">
                Inside every concept
              </p>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-heading">
                More than a homepage screenshot
              </h2>
              <p className="mt-4 text-sm leading-6 text-background/70">
                The gallery is designed for evaluating a complete system, not copying a single hero
                in isolation.
              </p>
              <ul className="mt-7 space-y-4 text-sm leading-6 text-background/85">
                <li className="border-t border-background/15 pt-4">
                  Multi-page navigation and supporting page designs
                </li>
                <li className="border-t border-background/15 pt-4">
                  Desktop, tablet, and mobile live previews
                </li>
                <li className="border-t border-background/15 pt-4">
                  Ordered block recipes linked to component documentation
                </li>
                <li className="border-t border-background/15 pt-4">
                  Color, type, spacing, and visual-tone decisions
                </li>
              </ul>
              <Link
                href="/templates/saas-launch"
                className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              >
                Explore the SaaS concept
              </Link>
            </aside>
          </div>
        </Section>

        <Section className="bg-muted/40" containerClassName="py-14 sm:py-16 lg:py-20">
          <SectionHeading
            accentWord="questions"
            eyebrow="Questions"
            heading="Payload CMS template questions, answered"
            intro="The concepts are intentionally open about what works today and what remains a design reference."
          />
          <dl className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-3">
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">
                Are these Payload CMS templates installable?
              </dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                No. They are browsable full-site concepts, not packaged starter repositories. The
                individual blocks in each recipe are installable, and every recipe links to the
                relevant component documentation.
              </dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">
                How do these differ from Payload’s official template?
              </dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                The official website template gives a new project a complete application foundation.
                These concepts show how a full marketing site can look and which typed blocks
                compose each page, without replacing that starter-project role.
              </dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">
                Can I use the recipes in an existing Payload project?
              </dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                Yes. Open a concept, inspect its ordered recipe, and choose the sections that fit
                your site. The catalog documents each block’s fields and the supported Payload CMS
                v3 installation path.
              </dd>
            </div>
          </dl>
        </Section>

        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="open"
            eyebrow="Community"
            heading={templatesContribution.heading}
            intro={templatesContribution.intro}
          />
          <div className="mt-10">
            <TemplateContribution source="gallery" />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
