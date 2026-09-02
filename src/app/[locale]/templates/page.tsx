import type { Metadata } from 'next'
import Link from '@/i18n/Link'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { TemplateGalleryView } from '@/components/site/templates/TemplateAnalytics'
import { TemplateCard } from '@/components/site/templates/TemplateCard'
import { TemplateContribution } from '@/components/site/templates/TemplateContribution'
import { TemplateGalleryFilter } from '@/components/site/templates/TemplateGalleryFilter'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import { siteUrl, siteOpenGraphDefaults } from '@/lib/site'
import { templateShowcases } from '@/lib/templates/registry'
import { breadcrumbNode, graph, websiteId } from '@/lib/structured-data'

/* /templates gallery — indexable editorial index of the full-site concepts.
 * Contract: one H1, the concept disclosure up top, compact navigation to the
 * component catalog, the installation guide, and the official Payload website
 * template, poster-led cards linking to detail + full preview, a community
 * close, and hard absences: no iframes, no install command, no price, no
 * capture. Category filtering stays client-side and URL-synced, while every
 * rendered card still ships in the initial server HTML. */

/* Category chips in first-appearance (curated registry) order. */
const galleryCategories = (() => {
  const order: string[] = []
  const counts = new Map<string, number>()
  for (const template of templateShowcases) {
    if (!counts.has(template.category)) order.push(template.category)
    counts.set(template.category, (counts.get(template.category) ?? 0) + 1)
  }
  return order.map((value) => ({
    count: counts.get(value) ?? 0,
    label: value,
    value,
  }))
})()

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const publication = getPublication('/templates', locale)
  const t = await getTranslations({ locale, namespace: 'Templates' })

  return {
    alternates: { canonical: publication.canonical, languages: publication.alternates },
    description: t('metadataDescription'),
    openGraph: {
      ...siteOpenGraphDefaults,
      description: t('metadataDescription'),
      locale: localeDetails[locale].openGraphLocale,
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

export default async function TemplatesPage() {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Templates' })
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const localizedCategories = galleryCategories.map((category) => ({
    ...category,
    label: t(`categories.${category.value}`),
  }))
  const templatesStructuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      { name: t('eyebrow'), path: localizeHref('/templates', locale) },
    ]),
    {
      '@id': `${siteUrl}${localizeHref('/templates', locale)}#collection`,
      '@type': 'CollectionPage',
      description: t('metadataDescription'),
      inLanguage: localeDetails[locale].htmlLang,
      isPartOf: { '@id': websiteId },
      name: t('metadataTitle'),
      url: `${siteUrl}${localizeHref('/templates', locale)}`,
    },
  )

  return (
    <>
      <JsonLd data={templatesStructuredData} />
      <SiteHeader activePath="/templates" />
      <TranslationNotice pathname="/templates" />
      <TemplateGalleryView />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-5 py-12 sm:py-16">
            <div className="max-w-3xl">
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <h1 className="mt-4 text-balance text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                {t('title')}
              </h1>
            </div>

            <div className="flex max-w-2xl flex-col gap-3 rounded-card border border-border bg-background/85 p-4 backdrop-blur-sm sm:flex-row sm:items-start sm:gap-4">
              <span className="w-fit shrink-0 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                {t('status')}
              </span>
              <p className="text-sm leading-6 text-muted-foreground">{t('disclosure')}</p>
            </div>
          </div>
        </section>

        <section aria-label={t('startingPoint')} className="border-b border-border">
          <div className="container grid gap-5 py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <p className="max-w-3xl text-pretty text-sm leading-6 text-muted-foreground">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/components"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                {t('components')}
              </Link>
              <Link
                href="/docs/installation"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                {t('installation')}
              </Link>
              <a
                href="https://github.com/payloadcms/payload/tree/main/templates/website"
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                rel="noreferrer"
                target="_blank"
              >
                {t('official')}
              </a>
            </div>
          </div>
        </section>

        <section aria-label={t('showcases')}>
          <div className="container py-12 lg:py-16">
            <TemplateGalleryFilter
              categories={localizedCategories}
              items={templateShowcases.map((template, index) => ({
                card: <TemplateCard priority={index === 0} template={template} />,
                category: template.category,
                slug: template.slug,
              }))}
            />
          </div>
        </section>

        <Section className="bg-muted/40" containerClassName="py-14 sm:py-16 lg:py-20">
          <SectionHeading
            accentWord="questions"
            eyebrow={t('questionsEyebrow')}
            heading={t('questionsHeading')}
            intro={t('questionsIntro')}
          />
          <dl className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-3">
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">{t('q1')}</dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">{t('a1')}</dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">{t('q2')}</dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">{t('a2')}</dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-base font-semibold text-foreground">{t('q3')}</dt>
              <dd className="mt-3 text-sm leading-6 text-muted-foreground">{t('a3')}</dd>
            </div>
          </dl>
        </Section>

        <Section className="bg-muted/40">
          <SectionHeading
            accentWord={locale === 'en' ? 'open' : undefined}
            eyebrow={t('communityEyebrow')}
            heading={t('communityHeading')}
            intro={t('communityIntro')}
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
