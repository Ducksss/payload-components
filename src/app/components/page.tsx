import type { Metadata } from 'next'

import { ArrowUpRight } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { KitCard } from '@/components/site/KitCard'
import { KitFamilyHeader, UpcomingKitCard } from '@/components/site/KitGrid'
import { Eyebrow } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  catalogDescription,
  catalogTitle,
  githubRepoUrl,
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

        <section>
          <div className="container py-12 lg:py-16">
            <KitFamilyHeader
              countLabel={kitFamilies.pages.countLabel}
              description={kitFamilies.pages.description}
              name={kitFamilies.pages.name}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {kitEntries.map((kit) => (
                <KitCard key={kit.slug} kit={kit} />
              ))}

              <a
                href={`${githubRepoUrl}/issues`}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-48 flex-col items-start justify-center gap-3 rounded-xl border border-dashed border-border bg-transparent p-6 transition-colors hover:border-foreground/25"
              >
                <span className="font-mono text-sm text-muted-foreground">your-kit-here</span>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  The catalog grows deliberately — source, manifest, docs, and installer coverage
                  ship together. Propose the next kit.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                  Open an issue
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="container py-12 lg:py-16">
            <KitFamilyHeader
              countLabel={kitFamilies.posts.countLabel}
              description={kitFamilies.posts.description}
              name={kitFamilies.posts.name}
            />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingKits.map((kit) => (
                <UpcomingKitCard key={kit.slug} kit={kit} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
