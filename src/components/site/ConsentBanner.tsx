'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { setConsent } from '@/lib/consent'

import { useConsent } from './useConsent'

/* Shown only while consent is undecided. Fixed to the viewport rather than
 * placed in flow, so appearing and dismissing it costs zero layout shift on the
 * landing page's LCP content. A browser privacy signal resolves to 'denied'
 * before this renders, so GPC/DNT visitors are never prompted at all. */
export function ConsentBanner() {
  const pathname = usePathname()
  const consent = useConsent()

  // Chrome-free iframe targets never carry site chrome; a banner inside an
  // embedded preview would be both wrong and unreachable.
  if (pathname.startsWith('/components/preview/')) return null
  if (/^\/templates\/[^/]+\/preview(\/|$)/.test(pathname)) return null
  // `undefined` is the pre-hydration state — render nothing so server and first
  // client render agree; the effect in useConsent supplies the real value.
  if (consent !== null) return null

  return (
    <div
      aria-labelledby="consent-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
      data-consent-banner=""
      role="region"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground" id="consent-banner-title">
            Analytics cookies
          </p>
          <p className="text-sm text-muted-foreground">
            We use Google Analytics, Vercel Analytics, and PostHog to see which components
            and docs people actually use. Decline and none of them load.{' '}
            <Link
              className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
              href="/privacy"
            >
              Privacy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setConsent('denied')}
            type="button"
          >
            Decline
          </button>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setConsent('granted')}
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
