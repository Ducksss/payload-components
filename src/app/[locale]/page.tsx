import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { ParallaxController } from '@/components/site/ParallaxController'
import { CatalogSection } from '@/components/site/sections/CatalogSection'
import { CommunityCta } from '@/components/site/sections/CommunityCta'
import { FaqSection } from '@/components/site/sections/FaqSection'
import { HeroSection } from '@/components/site/sections/HeroSection'
import { StackBand } from '@/components/site/sections/StackBand'
import { WiringSection } from '@/components/site/sections/WiringSection'
import { WorkflowSection } from '@/components/site/sections/WorkflowSection'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { localeDetails } from '@/i18n/config'
import { getPublication, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import { componentEntries, feedMetadataAlternates } from '@/lib/site'
import { faqNode, graph, softwareApplicationNode } from '@/lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const publication = getPublication('/', locale)
  const t = await getTranslations({ locale, namespace: 'HomeMetadata' })

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
      ...feedMetadataAlternates,
    },
    description: t('description'),
    openGraph: {
      description: t('description'),
      locale: localeDetails[locale].openGraphLocale,
      siteName: 'Payload Components',
      title: t('title'),
      type: 'website',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    title: t('title'),
    twitter: {
      card: 'summary_large_image',
      description: t('description'),
      title: t('title'),
    },
  }
}

/* SoftwareApplication answers "what is Payload Components" for AI engines; FAQPage
   mirrors the on-page FAQ (both read from faqEntries) for rich results. */
/* Landing arc: claim → stack → the install boundary (problem + proof) → how it
 * works → the catalog live → questions → open-source close. */
export default async function HomePage() {
  const locale = await getSiteLocale()
  const faqT = await getTranslations({ locale, namespace: 'FaqContent' })
  const entries = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'].map((key) => ({
    answer: faqT(`entries.${key}.answer`, { count: componentEntries.length }),
    question: faqT(`entries.${key}.question`),
  }))
  const homeStructuredData = graph(softwareApplicationNode(), faqNode({ entries, locale }))

  return (
    <>
      <JsonLd data={homeStructuredData} />
      <ParallaxController />
      <SiteHeader />
      <TranslationNotice pathname="/" />

      <main id="main" className="flex-1">
        <HeroSection />
        <StackBand />
        <WiringSection />
        <WorkflowSection />
        <CatalogSection />
        <FaqSection />
        <CommunityCta />
      </main>

      <SiteFooter />
    </>
  )
}
