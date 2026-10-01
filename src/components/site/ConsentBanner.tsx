'use client'

import Link from '@/i18n/Link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { isChromeFreePreviewPath, localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { consentBannerRevealScript, setConsent, takeQueuedConsentChoice } from '@/lib/consent'

import { useConsent } from './useConsent'

/* Shown only while consent is undecided. Fixed to the viewport rather than
 * placed in flow, so appearing and dismissing it costs zero layout shift on the
 * landing page's LCP content. A browser privacy signal resolves to 'denied'
 * before this renders, so GPC/DNT visitors are never prompted at all. */
export function ConsentBanner() {
  const pathname = usePathname()
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Consent')

  /* A click made before hydration, recorded by the inline script below, which
   * has already hidden the banner. Applied here through setConsent(), the one
   * place consent is written. Declared before useConsent so this effect runs
   * first and the hook's first read already sees the stored choice. */
  useEffect(() => {
    const queued = takeQueuedConsentChoice()

    if (queued) setConsent(queued)
  }, [])

  const consent = useConsent()

  // Chrome-free iframe targets never carry site chrome; a banner inside an
  // embedded preview would be both wrong and unreachable.
  if (isChromeFreePreviewPath(pathname)) return null
  if (consent === 'granted' || consent === 'denied') return null

  /* `undefined` is the server render and the first client render, before
   * useConsent has read storage. Rendering the banner then puts it in the static
   * HTML, so a first visit paints it without waiting for hydration. Waiting made
   * it the late LCP element on phones, where its paragraph outsizes the H1.
   * The HTML is the same for everyone, so this pending copy stays hidden unless
   * the inline script below marks the visitor undecided. Anyone who already
   * chose, or whose browser sends a privacy signal, never sees it paint. Its
   * buttons work from the first paint: the script records a click for the
   * effect above, so a choice made before hydration is never lost. */
  const pending = consent === undefined

  return (
    <>
      <div
        aria-labelledby="consent-banner-title"
        className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
        data-consent-banner={pending ? 'pending' : ''}
        role="region"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground" id="consent-banner-title">
              {t('title')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('description')}{' '}
              <Link
                className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
                href={localizeHref('/privacy', locale)}
              >
                {t('privacy')}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-consent-choice="denied"
              onClick={() => setConsent('denied')}
              type="button"
            >
              {t('decline')}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-consent-choice="granted"
              onClick={() => setConsent('granted')}
              type="button"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
      {/* Runs as the parser reaches it, so the banner can paint with the page
          once its font is ready. It comes after the markup rather than in
          <head> because an inline script waits for the stylesheets before it,
          and in <head> that would hold up parsing the entire page. */}
      {pending ? <script dangerouslySetInnerHTML={{ __html: consentBannerRevealScript }} /> : null}
    </>
  )
}
