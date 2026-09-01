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
import { localeDetails, localizeHref } from '@/i18n/config'
import { getSiteLocale } from '@/lib/i18n'
import { feedMetadataAlternates } from '@/lib/site'
import { faqNode, graph, softwareApplicationNode } from '@/lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'HomeMetadata' })
  const canonical = localizeHref('/', locale)

  return {
    alternates: {
      canonical,
      languages: { en: '/', 'zh-CN': '/zh', 'x-default': '/' },
      ...feedMetadataAlternates,
    },
    description: t('description'),
    openGraph: {
      description: t('description'),
      locale: localeDetails[locale].openGraphLocale,
      siteName: 'Payload Components',
      title: t('title'),
      type: 'website',
      url: canonical,
    },
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
const homeStructuredData = graph(softwareApplicationNode(), faqNode())

/* Landing arc: claim → stack → the install boundary (problem + proof) → how it
 * works → the catalog live → questions → open-source close. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <ParallaxController />
      <SiteHeader />

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
