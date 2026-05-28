import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { JsonLd } from '@/components/JsonLd'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/utilities/seo'
import { getSiteURL, siteConfig } from '@/utilities/site'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <RootProvider search={{ enabled: false }} theme={{ enabled: false }}>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </RootProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  description: siteConfig.defaultDescription,
  metadataBase: new URL(getSiteURL()),
  openGraph: mergeOpenGraph(),
  title: siteConfig.defaultTitle,
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.twitterCreator,
    description: siteConfig.defaultDescription,
    images: [
      {
        alt: `${siteConfig.name} social preview`,
        height: 630,
        url: siteConfig.defaultOgImagePath,
        width: 1200,
      },
    ],
    title: siteConfig.defaultTitle,
  },
}
