'use client'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { AnalyticsPageview } from './AnalyticsPageview'

export function AnalyticsShell() {
  const pathname = usePathname()
  // Chrome-free iframe targets: embedding pages already carry analytics, so
  // mounting the general stream here would double-count every embedded view.
  // Template previews emit their own explicit template_* events instead.
  if (pathname.startsWith('/components/preview/')) return null
  if (/^\/templates\/[^/]+\/preview(\/|$)/.test(pathname)) return null
  return <><Script src="https://www.googletagmanager.com/gtag/js?id=G-EMGRZ0H9R9" strategy="afterInteractive" /><Script id="google-tag" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EMGRZ0H9R9');`}</Script><AnalyticsPageview /><Analytics /><SpeedInsights /></>
}
