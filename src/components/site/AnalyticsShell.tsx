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

  /* Two tiers, split by what each provider writes to the visitor's device.
   *
   * Vercel Analytics and Speed Insights are cookieless and store no identifier,
   * so they carry no consent requirement and mount for everyone. That keeps Core
   * Web Vitals measured across all traffic, which is the point of measuring them.
   *
   * GA4 sets its own cookies and auto-collects page views, and the PostHog
   * stream in AnalyticsPageview persists a pc_distinct_id. Both wait for an
   * explicit opt-in — gating our own events while GA4 loaded anyway would be
   * privacy theatre. */
  const optedIn = consent === 'granted'

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {optedIn ? (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-EMGRZ0H9R9"
            strategy="afterInteractive"
          />
          <Script id="google-tag" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EMGRZ0H9R9');`}</Script>
          <AnalyticsPageview />
        </>
      ) : null}
    </>
  )
}
