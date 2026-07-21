import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TemplateDetailView } from '@/components/site/templates/TemplateAnalytics'
import { TemplateContribution } from '@/components/site/templates/TemplateContribution'
import { TemplateDetailPreview } from '@/components/site/templates/TemplateDetailPreview'
import { TemplatePagesGrid } from '@/components/site/templates/TemplatePagesGrid'
import { TemplateRecipe } from '@/components/site/templates/TemplateRecipe'
import { TemplateVisualSystem } from '@/components/site/templates/TemplateVisualSystem'
import {
  siteUrl,
  templateCategoryLabels,
  templatesContribution,
  templatesRecipeIntro,
} from '@/lib/site'
import {
  getTemplateShowcase,
  templateDetailHref,
  templateShowcases,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '@/lib/templates/types'
import { breadcrumbNode, graph } from '@/lib/structured-data'

/* /templates/[slug] detail — the indexable editorial page for one full-site
 * concept. Contract: canonical, one H1, concept status + disclosure impossible
 * to miss, exactly one iframe (TemplateDetailPreview), pages-included posters,
 * the ordered block recipe linking every chip to /docs/components/<slug>, the
 * visual-system summary, public contribution links, 404 on unknown slugs. */

export function generateStaticParams() {
  return templateShowcases.map((template) => ({ slug: template.slug }))
}

type DetailParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: DetailParams }): Promise<Metadata> {
  const { slug } = await params
  const template = getTemplateShowcase(slug)
  if (!template) return {}

  const title = `${template.title} template`

  return {
    alternates: { canonical: templateDetailHref(template.slug) },
    description: template.summary,
    openGraph: {
      description: template.summary,
      title,
      type: 'website',
      url: templateDetailHref(template.slug),
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description: template.summary,
      title,
    },
  }
}

export default async function TemplateDetailPage({ params }: { params: DetailParams }) {
  const { slug } = await params
  const template = getTemplateShowcase(slug)
  if (!template) notFound()

  const blockCount = uniqueTemplateBlockSlugs(template).length
  const structuredData = graph(
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Templates', path: '/templates' },
      { name: template.title, path: templateDetailHref(template.slug) },
    ]),
    {
      '@id': `${siteUrl}${templateDetailHref(template.slug)}#template`,
      '@type': 'WebPage',
      description: template.summary,
      inLanguage: 'en',
      name: `${template.title} template`,
      url: `${siteUrl}${templateDetailHref(template.slug)}`,
    },
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader activePath="/templates" />
      <TemplateDetailView revision={template.revision} template={template.slug} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-5 py-10 sm:py-14">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-eyebrow">
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Templates
              </Link>
              <span aria-hidden="true" className="text-muted-foreground/50">
                /
              </span>
              <span className="text-brand">{templateCategoryLabels[template.category]}</span>
              <span className="ml-1 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-brand">
                {TEMPLATE_CONCEPT_STATUS_LABEL}
              </span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-balance text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                {template.title}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {template.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ul className="flex flex-wrap items-center gap-1.5" aria-label="Visual tone">
                {template.visualTone.map((tone) => (
                  <li
                    key={tone}
                    className="rounded-full border border-border bg-background/85 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tone}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-xs text-muted-foreground sm:ml-2">
                {template.pages.length} pages · {blockCount} unique blocks
              </p>
            </div>
          </div>
        </section>

        <section aria-label={`${template.title} live preview`}>
          <div className="container py-10 sm:py-12">
            <TemplateDetailPreview template={template} />
          </div>
        </section>

        <Section containerClassName="py-12 sm:py-14 lg:py-16">
          <SectionHeading
            eyebrow="Pages"
            heading="Every page in the concept"
            accentWord="concept"
            intro={`${template.title} spans ${template.pages.length} pages. Each poster opens that page in the raw full preview — the same route the live frame above renders.`}
          />
          <div className="mt-10">
            <TemplatePagesGrid template={template} />
          </div>
        </Section>

        <Section className="bg-muted/40" containerClassName="py-12 sm:py-14 lg:py-16">
          <SectionHeading
            eyebrow="Recipe"
            heading="The block recipe, page by page"
            accentWord="recipe"
            intro={templatesRecipeIntro}
          />
          <div className="mt-10">
            <TemplateRecipe template={template} />
          </div>
        </Section>

        <Section containerClassName="py-12 sm:py-14 lg:py-16">
          <SectionHeading
            eyebrow="Visual system"
            heading="One theme, carried across every block"
            accentWord="theme"
          />
          <div className="mt-10">
            <TemplateVisualSystem template={template} />
          </div>
        </Section>

        <Section className="bg-muted/40" containerClassName="py-12 sm:py-14 lg:py-16">
          <div className="mb-10 flex max-w-2xl flex-col gap-3 rounded-card border border-border bg-background/85 p-4 sm:flex-row sm:items-start sm:gap-4">
            <span className="w-fit shrink-0 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
              {TEMPLATE_CONCEPT_STATUS_LABEL}
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              {TEMPLATE_CONCEPT_DISCLOSURE}
            </p>
          </div>

          <SectionHeading
            accentWord="open"
            eyebrow="Community"
            heading={templatesContribution.heading}
            intro={templatesContribution.intro}
          />
          <div className="mt-10">
            <TemplateContribution
              revision={template.revision}
              source="detail"
              template={template.slug}
            />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
