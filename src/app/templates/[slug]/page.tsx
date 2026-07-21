import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TemplateDetailPreview } from '@/components/site/templates/TemplateDetailPreview'
import { componentEntries } from '@/lib/site'
import {
  getTemplateShowcase,
  templateDetailHref,
  templatePreviewHref,
  templateShowcases,
} from '@/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '@/lib/templates/types'

/* /templates/[slug] detail — FOUNDATION SKELETON. The catalog/detail
 * experience track owns the finished presentation (pages-included poster grid,
 * visual-system summary, structured data, contribution links). Contract to
 * preserve: indexable + canonical, one H1, concept status + disclosure
 * impossible to miss, exactly one iframe (TemplateDetailPreview), ordered
 * per-page recipes linking to /docs/components/<slug>, 404 on unknown slugs. */

export function generateStaticParams() {
  return templateShowcases.map((template) => ({ slug: template.slug }))
}

type DetailParams = Promise<{ slug: string }>

const componentEntryBySlug = new Map(componentEntries.map((entry) => [entry.slug, entry]))

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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="w-fit rounded-full border border-border px-3 py-1 text-xs uppercase tracking-eyebrow text-muted-foreground">
            {TEMPLATE_CONCEPT_STATUS_LABEL}
          </span>
          <h1 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
            {template.title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {template.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {template.pages.length} pages · {template.visualTone.join(' · ')}
          </p>
        </div>

        <TemplateDetailPreview template={template} />

        <section aria-labelledby="template-pages-heading" className="flex flex-col gap-6">
          <h2 id="template-pages-heading" className="text-2xl font-medium">
            Pages included
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {template.pages.map((page) => (
              <div key={page.path} className="flex flex-col gap-2 rounded-frame border border-border bg-card/35 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-medium">{page.label}</span>
                  <Link
                    href={templatePreviewHref(template.slug, page.path)}
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Preview
                  </Link>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{page.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="template-recipe-heading" className="flex flex-col gap-6">
          <h2 id="template-recipe-heading" className="text-2xl font-medium">
            Block recipe
          </h2>
          <div className="flex flex-col gap-6">
            {template.pages.map((page) => (
              <div key={page.path} className="flex flex-col gap-3">
                <h3 className="text-lg font-medium">{page.label}</h3>
                <ol className="flex flex-wrap gap-2">
                  {page.sections.map((section) => {
                    const entry = componentEntryBySlug.get(section.componentSlug)

                    return (
                      <li key={section.id}>
                        <Link
                          href={entry?.href ?? `/docs/components/${section.componentSlug}`}
                          className="inline-flex rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {section.componentSlug}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <p className="max-w-3xl text-sm text-muted-foreground">{TEMPLATE_CONCEPT_DISCLOSURE}</p>
      </main>
      <SiteFooter />
    </>
  )
}
