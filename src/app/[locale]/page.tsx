import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { ParallaxController } from '@/components/site/ParallaxController'
import { BenchSection } from '@/components/site/sections/BenchSection'
import { CommunityCta } from '@/components/site/sections/CommunityCta'
import { FaqSection } from '@/components/site/sections/FaqSection'
import { TemplatesSection } from '@/components/site/sections/TemplatesSection'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { localeDetails } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
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
/* The landing is one scene and three footnotes: the bench (claim, then one
 * block installed as you scroll, then the catalog), whole-site templates,
 * questions, and the open-source close. */
export default async function HomePage() {
  const locale = await getSiteLocale()
  const publication = getPublication('/', locale)
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

      {/* data-brand: the landing wears the Datasheet brand; every demo twin in
          it renders inside .preview-scope (globals.css section 4). */}
      <main
        {...publicationContentAttributes(publication)}
        data-brand="datasheet"
        id="main"
        className="flex-1"
      >
        <BenchSection />
        <TemplatesSection />
        <FaqSection />
        <CommunityCta />
      </main>

      <SiteFooter />
    </>
  )
}
