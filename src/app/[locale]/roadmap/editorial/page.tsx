import type { Metadata } from 'next'

import { ArrowDown, ArrowLeft, ArrowUpRight, CircleDashed } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow, Section } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import Link from '@/i18n/Link'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import { siteOpenGraphDefaults, upcomingComponents } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

const roadmapBenefits = [
  { key: 'system' },
  { key: 'implementation' },
  { key: 'maintained' },
] as const

const contributionHref =
  'https://github.com/Ducksss/payload-components/issues/new?template=feature_request.yml&area=New%20component'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const publication = getPublication('/roadmap/editorial', locale)
  const t = await getTranslations({
    locale: publication.contentLocale,
    namespace: 'EditorialRoadmap',
  })

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
    },
    description: t('metadataDescription'),
    openGraph: {
      ...siteOpenGraphDefaults,
      description: t('metadataDescription'),
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      title: t('metadataTitle'),
      type: 'website',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    title: t('metadataTitle'),
    twitter: {
      card: 'summary_large_image',
      description: t('metadataDescription'),
      title: t('metadataTitle'),
    },
  }
}

export default async function EditorialRoadmapPage() {
  const locale = await getSiteLocale()
  const publication = getPublication('/roadmap/editorial', locale)
  const [t, commonT] = await Promise.all([
    getTranslations({
      locale: publication.contentLocale,
      namespace: 'EditorialRoadmap',
    }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const structuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      { name: t('eyebrow'), path: localizeHref('/roadmap/editorial', locale) },
    ]),
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader />
      <TranslationNotice pathname="/roadmap/editorial" />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden border-b border-foreground/15 bg-foreground text-background">
          <div
            aria-hidden="true"
            className="absolute -right-24 top-16 size-96 rounded-full border border-background/10"
          />
          <div
            aria-hidden="true"
            className="absolute right-12 top-32 size-72 rounded-full border border-brand/20"
          />
          <div className="container relative py-16 sm:py-20 lg:py-28">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-background/15 pb-5 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-background/60">
              <span>{t('eyebrow')}</span>
              <span>{t('status')}</span>
            </div>

            <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-7">
                <h1 className="max-w-4xl text-balance text-5xl font-medium leading-none tracking-title text-background sm:text-6xl lg:text-7xl xl:text-8xl">
                  {t.rich('headline', {
                    editorial: (chunks) => (
                      <span className="font-serif font-normal italic tracking-heading text-brand-200">
                        {chunks}
                      </span>
                    ),
                  })}
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-background/65 sm:text-lg">
                  {t('intro')}
                </p>
                <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                  <a
                    href="#collection"
                    className="inline-flex cursor-pointer items-center gap-2 border-b border-background/30 pb-1 text-sm font-semibold text-background transition-colors hover:border-brand-200 hover:text-brand-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-4 focus-visible:ring-offset-foreground"
                  >
                    {t('seeCollection')}
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </a>
                  <Link
                    href="/components?type=posts"
                    className="inline-flex cursor-pointer items-center gap-2 border-b border-background/20 pb-1 text-sm text-background/65 transition-colors hover:border-background/60 hover:text-background focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-4 focus-visible:ring-offset-foreground"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {t('backToCatalog')}
                  </Link>
                </div>
              </div>

              <aside className="relative bg-background p-6 text-foreground sm:p-8 lg:col-span-5 lg:p-10">
                <div className="flex items-center justify-between gap-4 border-b border-foreground/15 pb-5">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                    <CircleDashed className="size-3.5 text-brand" aria-hidden="true" />
                    {t('suiteEyebrow')}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground">
                    01 — 08
                  </span>
                </div>
                <div className="py-14 sm:py-16">
                  <p aria-hidden="true" className="font-serif text-7xl leading-none text-brand">
                    01
                  </p>
                  <h2 className="mt-6 max-w-sm font-serif text-4xl font-normal leading-none text-foreground sm:text-5xl">
                    {t('suiteTitle')}
                  </h2>
                  <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
                    {t('suiteDescription')}
                  </p>
                </div>
                <div className="grid grid-cols-4 border-y border-foreground/15 py-4">
                  {upcomingComponents.map((component, index) => (
                    <span
                      key={component.slug}
                      title={component.title}
                      className="text-center font-mono text-[10px] text-foreground/60"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Section id="collection" className="scroll-mt-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <Eyebrow>{t('collectionEyebrow')}</Eyebrow>
              <h2 className="mt-5 max-w-3xl font-serif text-4xl font-normal leading-none text-foreground sm:text-5xl lg:text-6xl">
                {t('collectionTitle')}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:col-span-5">
              {t('collectionIntro')}
            </p>
          </div>

          <ol className="mt-12 border-y border-foreground/15">
            {upcomingComponents.map((component, index) => (
              <li
                id={component.slug}
                key={component.slug}
                className="grid scroll-mt-24 grid-cols-12 gap-x-4 gap-y-3 border-b border-foreground/10 py-7 last:border-b-0 sm:gap-x-6 lg:items-baseline"
              >
                <span className="col-span-2 font-mono text-[10px] font-medium tracking-eyebrow text-brand-600 sm:col-span-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="col-span-10 font-serif text-2xl font-normal leading-none text-foreground sm:col-span-4 sm:text-3xl">
                  {component.title}
                </h3>
                <p className="col-span-10 col-start-3 text-sm leading-6 text-muted-foreground sm:col-span-5 sm:col-start-auto">
                  {component.description}
                </p>
                <span className="col-span-10 col-start-3 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground sm:col-span-2 sm:col-start-auto sm:text-right">
                  {component.target}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section className="bg-muted/35">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <Eyebrow>{t('benefitsEyebrow')}</Eyebrow>
              <h2 className="mt-5 max-w-3xl font-serif text-4xl font-normal leading-none text-foreground sm:text-5xl lg:text-6xl">
                {t('benefitsTitle')}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:col-span-5">
              {t('benefitsIntro')}
            </p>
          </div>
          <div className="mt-12 grid border-y border-foreground/15 md:grid-cols-3 md:divide-x md:divide-foreground/15">
            {roadmapBenefits.map(({ key }, index) => (
              <article
                key={key}
                className="border-b border-foreground/15 py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
              >
                <span className="font-mono text-[10px] font-medium tracking-eyebrow text-brand-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-10 font-serif text-2xl font-normal leading-none text-foreground sm:text-3xl">
                  {t(`benefits.${key}Title`)}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {t(`benefits.${key}Description`)}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <section className="border-t border-border">
          <div className="container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('contributionNote')}
            </p>
            <a
              href={contributionHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-sm text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            >
              {t('contribute')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
