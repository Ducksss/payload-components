'use client'

/* Consent state for the non-essential third parties the site mounts (GA4,
 * Vercel Analytics/Speed Insights, PostHog). Nothing that writes to a visitor's
 * device may load before `resolveConsent()` returns 'granted'.
 *
 * Three states matter:
 *   'granted'  — the visitor opted in; mount everything.
 *   'denied'   — the visitor opted out, or their browser sent GPC/DNT.
 *   null       — undecided; mount nothing and show the banner.
 *
 * An explicit browser privacy signal is itself a decision, so it resolves to
 * 'denied' without ever showing the banner. Global Privacy Control is legally
 * binding under the CCPA; Do Not Track is advisory but cheap to respect. */

export type ConsentState = 'denied' | 'granted'

export const consentStorageKey = 'pc_consent'
export const consentChangeEvent = 'pc-consent-change'
/* Lives here rather than in analytics.ts so withdrawing consent can erase the
 * identifier without importing the analytics module (which imports this one). */
export const distinctIdStorageKey = 'pc_distinct_id'

export function privacySignalOptOut() {
  if (typeof navigator === 'undefined') return false

  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }

  return (
    nav.globalPrivacyControl === true ||
    navigator.doNotTrack === '1' ||
    (window as Window & { doNotTrack?: string }).doNotTrack === '1'
  )
}

function readStoredConsent(): ConsentState | null {
  try {
    const stored = window.localStorage.getItem(consentStorageKey)

    return stored === 'granted' || stored === 'denied' ? stored : null
  } catch {
    // localStorage unavailable (private mode / disabled). Treat as undecided;
    // the choice simply will not persist across page loads.
    return null
  }
}

/* Returns null when the visitor has not decided yet — callers must treat that
 * as "no consent" for mounting purposes, and as "show the banner" for UI. */
export function resolveConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  if (privacySignalOptOut()) return 'denied'

  return readStoredConsent()
}

export function setConsent(state: ConsentState) {
  const previous = readStoredConsent()

  try {
    window.localStorage.setItem(consentStorageKey, state)

    // Opting out must also erase what the opt-in created, not merely stop
    // adding to it — otherwise the visitor stays re-identifiable on return.
    if (state === 'denied') window.localStorage.removeItem(distinctIdStorageKey)
  } catch {
    // Persisting is best-effort; the notification below still applies the
    // choice for this page view.
  }

  window.dispatchEvent(new CustomEvent(consentChangeEvent, { detail: state }))

  /* Unmounting AnalyticsShell does not unload a third party that is already
   * running: gtag stays initialised on window, the injected <script> tags stay
   * in the document, and GA4 keeps auto-collecting page views. Withdrawal is
   * only real after a reload, so force one. Going undecided -> denied needs no
   * reload, because nothing was ever mounted. */
  if (previous === 'granted' && state === 'denied') window.location.reload()
}

export function subscribeToConsent(listener: () => void) {
  window.addEventListener(consentChangeEvent, listener)

  // A choice made in another tab should apply here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === consentStorageKey) listener()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(consentChangeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}
