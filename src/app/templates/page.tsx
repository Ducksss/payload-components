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
 * Contract: one H1, the concept disclosure up top, compact navigation to the
 * component catalog, the installation guide, and the official Payload website
 * template, poster-led cards linking to detail + full preview, a community
 * close, and hard absences: no iframes, no install command, no price, no
 * capture. Category filtering stays client-side and URL-synced, while every
 * rendered card still ships in the initial server HTML. */

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

        <section aria-label="Choose a starting point" className="border-b border-border">
          <div className="container grid gap-5 py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <p className="max-w-3xl text-pretty text-sm leading-6 text-muted-foreground">
              {templatesDescription}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/components"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                Browse installable components
              </Link>
              <Link
                href="/docs/installation"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                Read the installation guide
              </Link>
              <a
                href="https://github.com/payloadcms/payload/tree/main/templates/website"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                rel="noreferrer"
                target="_blank"
              >
                Start from the official Payload template
              </a>
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
