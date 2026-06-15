import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Instrument_Serif } from 'next/font/google'
import Script from 'next/script'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { JsonLd } from '@/components/seo/JsonLd'
import { githubRepoUrl, siteDescription, siteUrl } from '@/lib/site'
import { graph, organizationNode, websiteNode } from '@/lib/structured-data'

import './globals.css'

/* Editorial serif for one italic accent word per major headline — paired
   with Geist for warmth. Loaded here so its CSS variable lands on <html>
   alongside Geist; the @theme --font-serif token references it. */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Payload Kits — Payload blocks, fully wired',
    template: '%s | Payload Kits',
  },
  description: siteDescription,
  applicationName: 'Payload Kits',
  authors: [{ name: 'Ducksss', url: githubRepoUrl }],
  category: 'technology',
  creator: 'Ducksss',
  publisher: 'Payload Kits',
  keywords: [
    'Payload CMS',
    'Payload blocks',
    'Payload CMS components',
    'Payload v3',
    'Next.js',
    'shadcn registry',
    'block registry',
    'payload-kit',
    'CLI',
    'TypeScript',
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
    siteName: 'Payload Kits',
    title: 'Payload Kits — Payload blocks, fully wired',
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
    title: 'Payload Kits — Payload blocks, fully wired',
  },
}

/* Emitted once on every page: the Organization + WebSite identity that
   page-level schema (SoftwareApplication, FAQ, TechArticle…) references by @id. */
const siteStructuredData = graph(organizationNode(), websiteNode())
const googleTagId = 'G-EMGRZ0H9R9'

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      /* Font variables live on <html>: the @theme font tokens reference them
         and custom properties substitute var() at the declaring element. */
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleTagId}');
        `}
      </Script>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <JsonLd data={siteStructuredData} />
        <RootProvider
          search={{ enabled: true }}
          theme={{
            defaultTheme: 'light',
            enableSystem: false,
            forcedTheme: 'light',
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
