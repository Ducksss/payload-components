import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TemplateGalleryView } from '@/components/site/templates/TemplateAnalytics'
import { TemplateCard } from '@/components/site/templates/TemplateCard'
import { TemplateContribution } from '@/components/site/templates/TemplateContribution'
import {
  siteUrl,
  templatesContribution,
  templatesDescription,
  templatesEyebrow,
  templatesMetadataDescription,
  templatesMetadataTitle,
  templatesTitle,
} from '@/lib/site'
import { templateShowcases } from '@/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '@/lib/templates/types'
import { breadcrumbNode, graph, websiteId } from '@/lib/structured-data'

/* /templates gallery — indexable editorial index of the full-site concepts.
 * Contract: one H1, the concept disclosure up top, two poster-led cards
 * linking to detail + full preview, a community close, and hard absences: no
 * iframes, no filters, no install command, no price, no capture. */

export const metadata: Metadata = {
  alternates: { canonical: '/templates' },
  description: templatesMetadataDescription,
  openGraph: {
    description: templatesMetadataDescription,
    title: templatesMetadataTitle,
    type: 'website',
    url: '/templates',
  },
  title: 'Templates',
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
            <div className="grid gap-8 lg:grid-cols-2">
              {templateShowcases.map((template, index) => (
                <TemplateCard key={template.slug} priority={index === 0} template={template} />
              ))}
            </div>
          </div>
        </section>

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
