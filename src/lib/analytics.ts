'use client'

import { track as trackVercelEvent } from '@vercel/analytics'

type AnalyticsProperties = Record<string, string | number | boolean>

type Gtag = (
  command: 'event',
  eventName: string,
  parameters?: AnalyticsProperties,
) => void

declare global {
  interface Window {
    gtag?: Gtag
  }
}

const installCommandPattern = /\bpayload-components\s+add\s+([a-z0-9-]+)\b/i
const siteHostnames = new Set(['payload-components.xyz', 'www.payload-components.xyz'])

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
}

function getSourcePath() {
  return `${window.location.pathname}${window.location.hash}`
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
