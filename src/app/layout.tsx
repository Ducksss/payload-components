import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Instrument_Serif } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { JsonLd } from '@/components/seo/JsonLd'
import { AnalyticsShell } from '@/components/site/AnalyticsShell'
import { CommandCopyController } from '@/components/site/CommandCopyController'
import { ConsentBanner } from '@/components/site/ConsentBanner'
import { feedMetadataAlternates, githubRepoUrl, siteDescription, siteUrl } from '@/lib/site'
import {
  documentationCollectionNode,
  graph,
  organizationNode,
  websiteNode,
} from '@/lib/structured-data'

import './globals.css'

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: feedMetadataAlternates,
  title: {
    default: 'Payload Components — fully-wired blocks for Payload CMS',
    template: '%s | Payload Components',
  },
  description: siteDescription,
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
    description: siteDescription,
    locale: 'en_US',
    siteName: 'Payload Components',
    title: 'Payload Components — fully-wired blocks for Payload CMS',
    type: 'website',
    url: '/',
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  twitter: {
    card: 'summary_large_image',
    description: siteDescription,
    title: 'Payload Components — fully-wired blocks for Payload CMS',
  },
}

/* Emitted once on every page: the Organization + WebSite identity that
   page-level schema (SoftwareApplication, FAQ, TechArticle…) references by @id. */
const siteStructuredData = graph(organizationNode(), websiteNode(), documentationCollectionNode())

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      /* Font variables live on <html>: the @theme font tokens reference them
         and custom properties substitute var() at the declaring element. */
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
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
        <JsonLd data={siteStructuredData} />
        <AnalyticsShell />
        {children}
        <CommandCopyController />
        <ConsentBanner />
      </body>
    </html>
  )
}
