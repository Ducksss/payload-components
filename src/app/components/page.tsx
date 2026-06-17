import type { Metadata } from 'next'

import { Suspense } from 'react'

import { JsonLd } from '@/components/seo/JsonLd'
import { KitCatalogBrowser } from '@/components/site/KitCatalogBrowser'
import { Eyebrow } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  catalogDescription,
  catalogTitle,
  githubRepoUrl,
  kitCategories,
  kitEntries,
  kitFamilies,
  upcomingKits,
} from '@/lib/site'
import { breadcrumbNode, catalogCollectionPageNode, graph } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: '/components' },
  title: 'Kit Catalog',
  description: catalogDescription,
  openGraph: {
    description: catalogDescription,
    title: catalogTitle,
    type: 'website',
    url: '/components',
  },
  twitter: {
    card: 'summary_large_image',
    description: catalogDescription,
    title: catalogTitle,
  },
}

const catalogStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Kit catalog', path: '/components' },
  ]),
  catalogCollectionPageNode(),
)

export default function ComponentsPage() {
  return (
    <>
      <JsonLd data={catalogStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="container relative py-16 lg:py-20">
            <Eyebrow>Registry</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              {catalogTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {catalogDescription}
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {kitEntries.length} installable · {upcomingKits.length} in development · MIT
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="container py-12 lg:py-16" />}>
          <KitCatalogBrowser
            categories={kitCategories}
            families={kitFamilies}
            githubRepoUrl={githubRepoUrl}
            pages={[...kitEntries]}
            posts={[...upcomingKits]}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  )
}
