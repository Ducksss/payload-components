'use client'

import { track as trackVercelEvent } from '@vercel/analytics'

import { distinctIdStorageKey, resolveConsent } from '@/lib/consent'

type AnalyticsProperties = Record<string, string | number | boolean>
type PostHogTestEvent = {
  event: string
  properties: AnalyticsProperties
}

type Gtag = (
  command: 'event',
  eventName: string,
  parameters?: AnalyticsProperties,
) => void

declare global {
  interface Window {
    __disablePostHogNetwork?: boolean
    __posthogEvents?: PostHogTestEvent[]
    gtag?: Gtag
  }
}

const managedPostHogApiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const managedPostHogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
const installCommandPattern = /\bpayload-components\s+add\s+([a-z0-9-]+)\b/i
const siteHostnames = new Set(['payload-components.xyz', 'www.payload-components.xyz'])
let sessionDistinctId: string | null = null

function getSessionDistinctId() {
  if (sessionDistinctId) return sessionDistinctId

  try {
    const stored = window.localStorage.getItem(distinctIdStorageKey)
    if (stored) {
      sessionDistinctId = stored
      return sessionDistinctId
    }
  } catch {
    // localStorage unavailable (private mode / disabled) — fall back to an in-memory id.
  }

  sessionDistinctId = `pc_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`

  try {
    window.localStorage.setItem(distinctIdStorageKey, sessionDistinctId)
  } catch {
    // Persisting is best-effort; the in-memory id still works for this session.
  }

  return sessionDistinctId
}

function isAnalyticsHost() {
  const { hostname } = window.location

  // Production hosts only. Local dev and preview deploys must never write into
  // the production dataset or leak unreleased route paths to a third party.
  return siteHostnames.has(hostname)
}

/* AnalyticsShell already withholds every third-party mount until consent, so in
 * practice these helpers are unreachable without it. They are re-checked here
 * anyway: trackEvent is exported and callable from any client component, and a
 * future caller must not be able to route around the gate. resolveConsent()
 * folds in GPC/DNT, so an explicit privacy signal denies without a prompt. */
function analyticsAllowed() {
  return resolveConsent() === 'granted'
}

function trackPostHogEvent(eventName: string, properties: AnalyticsProperties) {
  const host = managedPostHogHost.replace(/\/$/, '')
  const event = {
    event: eventName,
    properties,
  }

  window.__posthogEvents?.push(event)

  // Deliberately after the __posthogEvents push above: the test harness records
  // intent, these gates decide whether anything leaves the browser.
  if (
    window.__disablePostHogNetwork ||
    !managedPostHogApiKey ||
    !host ||
    !isAnalyticsHost() ||
    !analyticsAllowed()
  ) {
    return
  }

  const body = JSON.stringify({
    api_key: managedPostHogApiKey,
    distinct_id: getSessionDistinctId(),
    event: eventName,
    properties: {
      ...properties,
      $current_url: `${window.location.origin}${getSourcePath()}`,
      $pathname: window.location.pathname,
      $lib: 'payload-components-lite',
    },
  })
  const endpoint = `${host}/capture/`

  try {
    const payload = new Blob([body], { type: 'application/json' })

    if (navigator.sendBeacon?.(endpoint, payload)) return
  } catch {
    // Analytics must never block the user action.
  }

  try {
    void fetch(endpoint, {
      body,
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      method: 'POST',
      mode: 'cors',
    })
  } catch {
    // Analytics must never block the user action.
  }
}

function trackEvent(eventName: string, properties: AnalyticsProperties) {
  if (!analyticsAllowed()) return

  try {
    trackVercelEvent(eventName, properties)
  } catch {
    // Analytics must never block the user action.
  }

  try {
    window.gtag?.('event', eventName, properties)
  } catch {
    // Analytics must never block the user action.
  }

  try {
    trackPostHogEvent(eventName, properties)
  } catch {
    // Analytics must never block the user action.
  }
}

function getSourcePath() {
  return `${window.location.pathname}${window.location.hash}`
}

function getStableSourcePath() {
  return window.location.pathname
}

export function trackPageView() {
  /* GA4 (gtag config) and Vercel (<Analytics />) already auto-track page views;
     the SDK-less PostHog integration does not, so send only there — using the
     native $pageview event so PostHog's web-analytics and paths views populate.
     Routing this through trackEvent would double-count GA4 (auto + manual). */
  trackPostHogEvent('$pageview', {
    page_path: window.location.pathname,
    source_path: getSourcePath(),
  })
}

export function getComponentSlugFromCommand(command: string) {
  return command.match(installCommandPattern)?.[1] ?? null
}

export function trackInstallCommandCopy(command: string) {
  const component = getComponentSlugFromCommand(command)

  trackEvent('copy_install_command', {
    command,
    component: component ?? 'unknown',
    source_path: getSourcePath(),
  })
}

function normalizeDestination(url: URL) {
  if (url.hostname === 'github.com' && url.pathname.startsWith('/Ducksss/payload-components')) {
    return {
      destination: 'github',
      href: `https://github.com${url.pathname}`,
    }
  }

  if (url.origin === window.location.origin || siteHostnames.has(url.hostname)) {
    if (url.pathname.startsWith('/docs')) {
      return {
        destination: 'docs',
        href: url.pathname,
      }
    }

    if (url.pathname.startsWith('/components')) {
      return {
        destination: 'components',
        href: url.pathname,
      }
    }
  }

  return null
}

/* Template showcase events — the approved anonymous vocabulary from the
 * templates PRD. Properties never include page content, free text, or PII:
 * only template slug/revision, page slug, source surface, and viewport preset. */
export type TemplateAnalyticsEvent =
  | 'template_contribution_click'
  | 'template_detail_view'
  | 'template_gallery_view'
  | 'template_preview_open'
  | 'template_preview_page_change'
  | 'template_preview_scroll_milestone'
  | 'template_preview_viewport_change'
  | 'template_recipe_click'

export type TemplateAnalyticsProperties = {
  milestone?: 25 | 50 | 75 | 90
  page?: string
  revision?: number
  source?: 'detail' | 'gallery' | 'preview'
  template?: string
  viewport?: 'desktop' | 'mobile' | 'tablet'
}

export function trackTemplateEvent(
  eventName: TemplateAnalyticsEvent,
  properties: TemplateAnalyticsProperties,
) {
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as AnalyticsProperties

  trackEvent(eventName, clean)
}

export function trackPrimaryLinkClick(link: HTMLAnchorElement) {
  const href = link.getAttribute('href')
  if (!href) return

  let url: URL

  try {
    url = new URL(href, window.location.href)
  } catch {
    // Hrefs like "//" or "http://" are unparseable; analytics must never block the user action.
    return
  }

  const normalized = normalizeDestination(url)
  if (!normalized) return

  trackEvent('primary_link_click', {
    destination: normalized.destination,
    href: normalized.href,
    source_path: getStableSourcePath(),
  })
}
