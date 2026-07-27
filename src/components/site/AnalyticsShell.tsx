'use client'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { AnalyticsPageview } from './AnalyticsPageview'
import { useConsent } from './useConsent'

export function AnalyticsShell() {
  const pathname = usePathname()
  const consent = useConsent()
  // Chrome-free iframe targets: embedding pages already carry analytics, so
  // mounting the general stream here would double-count every embedded view.
  // Template previews emit their own explicit template_* events instead.
  if (pathname.startsWith('/components/preview/')) return null
  if (/^\/templates\/[^/]+\/preview(\/|$)/.test(pathname)) return null
  // Nothing that writes to the visitor's device loads before an explicit opt-in.
  // That includes GA4, which sets its own cookies and auto-collects page views,
  // so gating only our own events here would be privacy theatre.
  if (consent !== 'granted') return null
  return <><Script src="https://www.googletagmanager.com/gtag/js?id=G-EMGRZ0H9R9" strategy="afterInteractive" /><Script id="google-tag" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EMGRZ0H9R9');`}</Script><AnalyticsPageview /><Analytics /><SpeedInsights /></>
}
