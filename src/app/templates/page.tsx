import type { Metadata } from 'next'

import Link from 'next/link'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  templateDetailHref,
  templatePreviewHref,
  templateShowcases,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '@/lib/templates/types'

/* /templates gallery — FOUNDATION SKELETON. The catalog/detail experience
 * track owns the finished editorial presentation (poster cards via next/image,
 * community close, structured data). Contract to preserve: indexable, one H1,
 * concept disclosure, two cards linking to detail + full preview, no iframes
 * mounted here, no install/waitlist/price UI. */

const description =
  'Complete site concepts composed from open-source Payload blocks. Explore every page, inspect the recipe, and help decide whether an installer should come next.'

export const metadata: Metadata = {
  alternates: { canonical: '/templates' },
  description,
  openGraph: {
    description,
    title: 'Templates — full-site concepts',
    type: 'website',
    url: '/templates',
  },
  title: 'Templates',
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'Templates — full-site concepts',
  },
}

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
            Full-site concepts, composed from the block registry
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          <p className="text-sm text-muted-foreground">{TEMPLATE_CONCEPT_DISCLOSURE}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {templateShowcases.map((template) => (
            <article
              key={template.slug}
              className="flex flex-col gap-4 rounded-frame border border-border bg-card/35 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-medium">{template.title}</h2>
                <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-eyebrow text-muted-foreground">
                  {TEMPLATE_CONCEPT_STATUS_LABEL}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{template.summary}</p>
              <p className="text-sm text-muted-foreground">
                {template.pages.length} pages · {uniqueTemplateBlockSlugs(template).length} unique
                blocks · {template.visualTone.join(' · ')}
              </p>
              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  href={templateDetailHref(template.slug)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explore template
                </Link>
                <Link
                  href={templatePreviewHref(template.slug)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  Open full preview
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
