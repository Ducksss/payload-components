import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Archivo, Azeret_Mono, Instrument_Serif } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { AnalyticsShell } from '@/components/site/AnalyticsShell'
import { CommandCopyController } from '@/components/site/CommandCopyController'
import { ConsentBanner } from '@/components/site/ConsentBanner'
import {
  isPublishedSiteLocale,
  localeDetails,
  localizeHref,
  publishedSiteLocales,
  type SiteLocale,
} from '@/i18n/config'
import { getPublication, publicationRobots } from '@/i18n/publication'
import { feedMetadataAlternates, githubRepoUrl, siteDescription, siteUrl } from '@/lib/site'
import {
  documentationCollectionNode,
  graph,
  organizationNode,
  websiteNode,
} from '@/lib/structured-data'

import '../globals.css'

/* Editorial serif for one italic accent word per major headline — paired
   with Geist for warmth. Loaded here so its CSS variable lands on <html>
   alongside Geist; the @theme --font-serif token references it. */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
})

/* The Datasheet brand faces for the site chrome (globals.css section 4).
   Archivo loads its width axis as well as weight: the condensed display type
   is the same file run through font-stretch. Previews and templates never
   paint these — .preview-scope restores Geist around every demo twin. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

/* Not preloaded: it only sets labels and commands, which swap in place with
   no layout shift, so its bytes stay off the headline's critical path. */
const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--font-azeret-mono',
  display: 'swap',
  preload: false,
})

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return publishedSiteLocales.map((locale) => ({ locale }))
}

function requireLocale(value: string): SiteLocale {
  if (!isPublishedSiteLocale(value)) notFound()
  return value
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale)
  setRequestLocale(locale)
  const publication = getPublication('/', locale)
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const canonical = localizeHref('/', locale)
  const description = locale === 'en' ? siteDescription : t('description')
  const title = t('title')

  return {
    metadataBase: new URL(siteUrl),
    alternates: {
      ...feedMetadataAlternates,
      canonical,
    },
    title: {
      default: title,
      template: '%s | Payload Components',
    },
    description,
    applicationName: 'Payload Components',
    authors: [{ name: 'Ducksss', url: githubRepoUrl }],
    category: 'technology',
    creator: 'Ducksss',
    publisher: 'Payload Components',
    keywords: [
      'Payload CMS blocks',
      'Payload blocks',
      'Payload CMS components',
      'Payload block library',
      'Payload hero block',
      'Payload feature grid',
      'copy-paste blocks for Payload CMS',
      'shadcn registry',
      'Payload v3',
      'Next.js',
    ],
    formatDetection: { telephone: false },
    icons: {
      apple: '/favicon.svg',
      icon: [
        { type: 'image/svg+xml', url: '/favicon.svg' },
        { sizes: '48x48', url: '/favicon.ico' },
      ],
      shortcut: '/favicon.ico',
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      description,
      ...(localeDetails[locale].openGraphLocale
        ? { locale: localeDetails[locale].openGraphLocale }
        : {}),
      siteName: 'Payload Components',
      title,
      type: 'website',
      url: canonical,
    },
    robots: publicationRobots(publication),
    twitter: {
      card: 'summary_large_image',
      description,
      title,
    },
  }
}

/* Emitted once on every page: the Organization + WebSite identity that
   page-level schema (SoftwareApplication, FAQ, TechArticle…) references by @id. */
const siteStructuredData = graph(organizationNode(), websiteNode(), documentationCollectionNode())

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const locale = requireLocale((await params).locale)
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={localeDetails[locale].htmlLang}
      dir={localeDetails[locale].direction}
      data-script={localeDetails[locale].script}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      /* Font variables live on <html>: the @theme font tokens reference them
         and custom properties substitute var() at the declaring element. */
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} ${archivo.variable} ${azeretMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        {/* Scroll-reveal elements ship their hidden `initial` state as inline
            opacity:0 in the SSR HTML and are only released once motion
            hydrates. If scripting never runs — JS disabled, or the bundle
            simply fails to arrive — every revealed section would stay blank.
            This pins them to their finished frame in exactly that case; it
            costs nothing when scripting works, because the element is
            inert. */}
        <noscript>
          <style>{`[data-landing-motion]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd data={siteStructuredData} />
          <AnalyticsShell />
          {children}
          <CommandCopyController />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
