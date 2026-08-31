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
/* Session-scoped because this is an entry path for the current browser visit,
 * not a durable profile. Kept here so withdrawing consent can erase it without
 * importing analytics.ts (which already imports this module). */
export const organicEntryPageStorageKey = 'pc_organic_entry_page'
/* GA4's own cookies. `_ga` and `_ga_<measurement-id>` are the current pair;
 * `_gid` / `_gat*` are legacy but cheap to sweep in case an older tag ran. */
const analyticsCookiePrefixes = ['_ga', '_gid', '_gat'] as const

/* Withdrawing consent has to remove what the opt-in wrote, not just stop adding
 * to it. Unmounting the tag leaves `_ga` in place, so the visitor stays
 * identifiable to GA on their next visit even though nothing is collecting.
 *
 * A cookie can only be deleted by re-setting it with a matching domain and path,
 * and script cannot read which domain a cookie came from — GA sets `_ga` on the
 * registrable domain. So try each plausible domain; the misses are inert.
 *
 * Which parent IS the registrable domain needs a public-suffix list the browser
 * does not expose, so enumerate every parent instead of assuming the last two
 * labels. Taking two would send `www.example.co.uk` to `co.uk` and never
 * `example.co.uk`, leaving the real cookie alive; the extra invalid attempts
 * (a bare public suffix, or a TLD) are rejected and cost nothing. The bare TLD
 * is skipped only because no host can ever set a cookie there. */
function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return

  try {
    const { hostname } = document.location
    const labels = hostname.split('.')
    const domains = new Set<string>(['', hostname, `.${hostname}`])

    for (let index = 1; index < labels.length - 1; index += 1) {
      const parent = labels.slice(index).join('.')
      domains.add(parent)
      domains.add(`.${parent}`)
    }

    const names = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) =>
        analyticsCookiePrefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}_`)),
      )

    for (const name of names) {
      for (const domain of domains) {
        document.cookie = `${name}=; path=/; max-age=0${domain ? `; domain=${domain}` : ''}`
      }
    }
  } catch {
    // document.cookie can throw in sandboxed contexts; consent is denied regardless.
  }
}

function clearAnalyticsStorage() {
  try {
    window.localStorage.removeItem(distinctIdStorageKey)
  } catch {
    // localStorage may be unavailable; consent is denied regardless.
  }

  try {
    window.sessionStorage.removeItem(organicEntryPageStorageKey)
  } catch {
    // sessionStorage may be unavailable; consent is denied regardless.
  }
}

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

  if (privacySignalOptOut()) {
    /* The signal may arrive after an earlier opt-in, which would leave a
     * pc_distinct_id behind: not sent while denied, but enough to re-link the
     * visitor to their old identity if they ever opt back in. Treat the signal
     * the same way as an explicit withdrawal and erase it. */
    clearAnalyticsStorage()

    clearAnalyticsCookies()

    return 'denied'
  }

  return readStoredConsent()
}

export function setConsent(state: ConsentState) {
  const previous = readStoredConsent()

  try {
    window.localStorage.setItem(consentStorageKey, state)
  } catch {
    // Persisting is best-effort; the notification below still applies the
    // choice for this page view.
  }

  // Opting out must also erase what the opt-in created, not merely stop adding
  // to it — otherwise the visitor stays re-identifiable on return.
  if (state === 'denied') clearAnalyticsStorage()

  // Same reasoning, for GA4's cookies rather than our own identifier. Runs
  // before the reload below so the tag cannot re-set them on the way out.
  if (state === 'denied') clearAnalyticsCookies()

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
    if (event.key !== consentStorageKey) return

    /* Same reasoning as the reload in setConsent: this tab may already have GA4
     * running, and notifying React only unmounts the component while gtag keeps
     * collecting. A withdrawal elsewhere has to tear this tab down as well. */
    if (event.oldValue === 'granted' && event.newValue === 'denied') {
      window.location.reload()
      return
    }

    listener()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(consentChangeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}
