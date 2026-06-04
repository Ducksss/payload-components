import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { siteDescription, siteUrl } from '@/lib/site'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Payload Kits',
    template: '%s | Payload Kits',
  },
  description: siteDescription,
  openGraph: {
    description: siteDescription,
    siteName: 'Payload Kits',
    title: 'Payload Kits',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    description: siteDescription,
    title: 'Payload Kits',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <RootProvider
          search={{ enabled: true }}
          theme={{
            defaultTheme: 'light',
            enableSystem: false,
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
