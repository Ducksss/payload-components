import type { Metadata } from 'next'
import Link from 'next/link'

import { Suspense } from 'react'

import { JsonLd } from '@/components/seo/JsonLd'
import { ComponentCatalogBrowser } from '@/components/site/ComponentCatalogBrowser'
import { Eyebrow } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  catalogBlocksGuideLinkLabel,
  catalogDescription,
  catalogInstallationLinkLabel,
  catalogMetadataDescription,
  catalogMetadataTitle,
  catalogTemplatesLinkLabel,
  catalogTitle,
  componentCategories,
  componentEntries,
  componentFamilies,
  feedMetadataAlternates,
  githubRepoUrl,
  upcomingComponents,
} from '@/lib/site'
import { breadcrumbNode, catalogCollectionPageNode, graph } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: '/components', ...feedMetadataAlternates },
  title: catalogMetadataTitle,
  description: catalogMetadataDescription,
  openGraph: {
    description: catalogMetadataDescription,
    title: catalogMetadataTitle,
    type: 'website',
    url: '/components',
  },
  twitter: {
    card: 'summary_large_image',
    description: catalogMetadataDescription,
    title: catalogMetadataTitle,
  },
}

const catalogStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Component catalog', path: '/components' },
  ]),
  catalogCollectionPageNode(),
)

export default function ComponentsPage() {
  return (
    <>
      <JsonLd data={catalogStructuredData} />
      <SiteHeader activePath="/components" />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
            <div className="max-w-2xl">
              <Eyebrow>Registry</Eyebrow>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                {catalogTitle}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {catalogDescription}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href="/docs/installation"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {catalogInstallationLinkLabel}
                </Link>
                <Link
                  href="/docs/payload-blocks"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {catalogBlocksGuideLinkLabel}
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {catalogTemplatesLinkLabel}
                </Link>
              </div>
            </div>
            <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:pb-1">
              MIT licensed
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="container py-12 lg:py-16" />}>
          <ComponentCatalogBrowser
            categories={componentCategories}
            families={componentFamilies}
            githubRepoUrl={githubRepoUrl}
            pages={[...componentEntries]}
            posts={[...upcomingComponents]}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  )
}
