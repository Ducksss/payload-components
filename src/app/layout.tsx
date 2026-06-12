import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Instrument_Serif } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { siteDescription, siteUrl } from '@/lib/site'

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
  openGraph: {
    description: siteDescription,
    siteName: 'Payload Kits',
    title: 'Payload Kits — Payload blocks, fully wired',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    description: siteDescription,
    title: 'Payload Kits — Payload blocks, fully wired',
  },
}

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
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
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
