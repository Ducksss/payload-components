import type { Metadata } from 'next'
import Link from '@/i18n/Link'

import { Suspense } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { ComponentCatalogBrowser } from '@/components/site/ComponentCatalogBrowser'
import { Eyebrow } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { localeAlternates, localeDetails, localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { getSiteLocale } from '@/lib/i18n'
import {
  componentCategories,
  componentEntries,
  componentFamilies,
  feedMetadataAlternates,
  githubRepoUrl,
  upcomingComponents,
  siteOpenGraphDefaults,
} from '@/lib/site'
import { breadcrumbNode, catalogCollectionPageNode, graph } from '@/lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Catalog' })
  const canonical = localizeHref('/components', locale)

  return {
    alternates: {
      canonical,
      languages: localeAlternates('/components'),
      ...feedMetadataAlternates,
    },
    title: t('metadataTitle', { count: componentEntries.length }),
    description: t('metadataDescription'),
    openGraph: {
      ...siteOpenGraphDefaults,
      description: t('metadataDescription'),
      locale: localeDetails[locale].openGraphLocale,
      title: t('metadataTitle', { count: componentEntries.length }),
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      description: t('metadataDescription'),
      title: t('metadataTitle', { count: componentEntries.length }),
    },
  }
}

export default function ComponentsPage() {
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Catalog')
  const browserT = useTranslations('CatalogBrowser')
  const localizedCategories = Object.fromEntries(
    Object.entries(componentCategories).map(([key, value]) => [
      key,
      { ...value, label: browserT(`categories.${key}`) },
    ]),
  ) as typeof componentCategories
  const localizedFamilies = {
    pages: { ...componentFamilies.pages, name: browserT('families.pages') },
    posts: { ...componentFamilies.posts, name: browserT('families.posts') },
  }
  const catalogStructuredData = graph(
    breadcrumbNode([
      { name: locale === 'zh' ? '首页' : 'Home', path: localizeHref('/', locale) },
      {
        name: locale === 'zh' ? '组件目录' : 'Component catalog',
        path: localizeHref('/components', locale),
      },
    ]),
    catalogCollectionPageNode(),
  )

  return (
    <>
      <JsonLd data={catalogStructuredData} />
      <SiteHeader activePath="/components" />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
            <div className="max-w-2xl">
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                {t('title', { count: componentEntries.length })}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {t('description', { count: componentEntries.length })}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href="/docs/installation"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {t('installation')}
                </Link>
                <Link
                  href="/docs/payload-blocks"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {t('blocksGuide')}
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {t('templates')}
                </Link>
              </div>
            </div>
            <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:pb-1">
              {t('license')}
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="container py-12 lg:py-16" />}>
          <ComponentCatalogBrowser
            categories={localizedCategories}
            families={localizedFamilies}
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
