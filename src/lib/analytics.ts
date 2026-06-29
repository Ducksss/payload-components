'use client'

import { track as trackVercelEvent } from '@vercel/analytics'

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
  if (!sessionDistinctId) {
    sessionDistinctId = `pc_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
  }

  return sessionDistinctId
}

function isAnalyticsHost() {
  const { hostname } = window.location

  return siteHostnames.has(hostname) || hostname === 'localhost' || hostname === '127.0.0.1'
}

function trackPostHogEvent(eventName: string, properties: AnalyticsProperties) {
  const host = managedPostHogHost.replace(/\/$/, '')
  const event = {
    event: eventName,
    properties,
  }

  window.__posthogEvents?.push(event)

  if (
    window.__disablePostHogNetwork ||
    !managedPostHogApiKey ||
    !host ||
    !isAnalyticsHost()
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

export function trackPageView() {
  trackEvent('page_view', {
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

export function trackPrimaryLinkClick(link: HTMLAnchorElement) {
  const href = link.getAttribute('href')
  if (!href) return

  const url = new URL(href, window.location.href)
  const normalized = normalizeDestination(url)
  if (!normalized) return

  trackEvent('primary_link_click', {
    destination: normalized.destination,
    href: normalized.href,
    source_path: getSourcePath(),
  })
}
