'use client'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { AnalyticsPageview } from './AnalyticsPageview'

export function AnalyticsShell() {
  const pathname = usePathname()
  if (pathname.startsWith('/components/preview/')) return null
  return <><Script src="https://www.googletagmanager.com/gtag/js?id=G-EMGRZ0H9R9" strategy="lazyOnload" /><Script id="google-tag" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EMGRZ0H9R9');`}</Script><AnalyticsPageview /><Analytics /><SpeedInsights /></>
}
