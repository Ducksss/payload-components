import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { CaseCover } from '@/components/site/case-study/CaseCover'
import { CaseDetails } from '@/components/site/case-study/CaseDetails'
import { CaseIdentity } from '@/components/site/case-study/CaseIdentity'
import { CaseInstall } from '@/components/site/case-study/CaseInstall'
import { CaseCredits, CaseNumbers } from '@/components/site/case-study/CaseOutro'
import { CasePalette } from '@/components/site/case-study/CasePalette'
import { CaseBrief, CaseIdea } from '@/components/site/case-study/CaseStory'
import { CaseType } from '@/components/site/case-study/CaseType'
import { CaseWork } from '@/components/site/case-study/CaseWork'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import { feedMetadataAlternates, siteOpenGraphDefaults } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

import './case-study.css'

/* The design case study, written like a portfolio piece: the project told as
 * brief → idea → identity → color → type → system → work → details → outcomes.
 * Server-rendered end to end with no client JavaScript of its own; every moving
 * plate is a CSS scroll timeline (case-study.css) that falls back to its
 * finished frame. The /docs/design essay is the text-first companion. */

const pathname = '/about/case-study'

/* English-only editorial page, like the docs and the blog: its prose lives in the
   plates, so its metadata lives beside them. A message key would oblige every
   draft locale catalog to carry a translation (crowdin-sync.int.spec.ts). */
const caseStudyMetadata = {
  description:
    'How Payload Components was designed: the brief, the keyed-block mark, one emerald accent, three typefaces, and an install that wires five artifacts in one command.',
  openGraphTitle: 'Payload Components: a design case study',
  title: 'Design case study',
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const publication = getPublication(pathname, locale)
  const { description, openGraphTitle, title } = caseStudyMetadata

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
      ...feedMetadataAlternates,
    },
    title,
    description,
    openGraph: {
      ...siteOpenGraphDefaults,
      description,
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      title: openGraphTitle,
      type: 'article',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    twitter: {
      card: 'summary_large_image',
      description,
      title: openGraphTitle,
    },
  }
}

export default async function CaseStudyPage() {
  const locale = await getSiteLocale()
  const publication = getPublication(pathname, locale)
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const structuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      { name: commonT('about'), path: localizeHref('/about', locale) },
      { name: caseStudyMetadata.title, path: localizeHref(pathname, locale) },
    ]),
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader activePath="/about" />
      <TranslationNotice pathname={pathname} />

      <main {...publicationContentAttributes(publication)} id="main" className="flex-1">
        <CaseCover />
        <CaseBrief />
        <CaseIdea />
        <CaseIdentity />
        <CasePalette />
        <CaseType />
        <CaseInstall />
        <CaseWork />
        <CaseDetails />
        <CaseNumbers />
        <CaseCredits />
      </main>

      <SiteFooter />
    </>
  )
}
