import type { Metadata } from 'next'
import Link from '@/i18n/Link'

import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { ComponentCatalogBrowser } from '@/components/site/ComponentCatalogBrowser'
import { Eyebrow } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
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
  const publication = getPublication('/components', locale)
  const t = await getTranslations({ locale, namespace: 'Catalog' })

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
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
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    twitter: {
      card: 'summary_large_image',
      description: t('metadataDescription'),
      title: t('metadataTitle', { count: componentEntries.length }),
    },
  }
}

export default async function ComponentsPage() {
  const locale = await getSiteLocale()
  const publication = getPublication('/components', locale)
  const t = await getTranslations({ locale, namespace: 'Catalog' })
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const browserT = await getTranslations({ locale, namespace: 'CatalogBrowser' })
  const componentT = await getTranslations({ locale, namespace: 'Components' })
  const translateComponent = <T extends { slug: string }>(entry: T) => ({
    ...entry,
    title: componentT(`${entry.slug}.title`),
    description: componentT(`${entry.slug}.description`),
    target: componentT(`${entry.slug}.target`),
  })
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
      { name: commonT('home'), path: localizeHref('/', locale) },
      {
        name: commonT('componentCatalog'),
        path: localizeHref('/components', locale),
      },
    ]),
    catalogCollectionPageNode(),
  )

  return (
    <>
      <JsonLd data={catalogStructuredData} />
      <SiteHeader activePath="/components" />
      <TranslationNotice pathname="/components" />

      <main {...publicationContentAttributes(publication)} id="main" className="flex-1">
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
            pages={componentEntries.map(translateComponent)}
            posts={upcomingComponents.map(translateComponent)}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  )
}
