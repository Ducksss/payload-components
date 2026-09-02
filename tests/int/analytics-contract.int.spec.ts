import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const analyticsPath = path.join(repoRoot, 'src', 'lib', 'analytics.ts')
const contributingPath = path.join(repoRoot, 'content', 'docs', 'contributing.mdx')
const privacyPath = path.join(repoRoot, 'src', 'app', 'privacy', 'page.tsx')
/* The privacy disclosure is localized, so its prose lives in the message
   catalogue; the event names and field lists stay in the page as identifiers. */
const privacyMessagesPath = path.join(repoRoot, 'messages', 'en.json')
const envExamplePath = path.join(repoRoot, '.env.example')

const eventFields = {
  $pageview: ['page_path', 'source_path', 'traffic_source', 'verification_run'],
  copy_install_command: ['command', 'component', 'source_path', 'entry_page'],
  premium_component_interest: ['component', 'source_path'],
  primary_link_click: ['destination', 'href', 'source_path', 'entry_page'],
} as const

const documentedEventRows = {
  $pageview:
    '| `$pageview` | A public route loads or changes | `page_path`, `source_path`, `traffic_source`, `verification_run` |',
  copy_install_command:
    '| `copy_install_command` | A visitor copies a supported install command | `command`, `component`, `source_path`, `entry_page` |',
  premium_component_interest:
    '| `premium_component_interest` | A visitor opens Premium from a locked post component | `component`, `source_path` |',
  primary_link_click:
    '| `primary_link_click` | A visitor follows a repository, docs, or components link | `destination`, `href`, `source_path`, `entry_page` |',
} as const

const eventCallPattern = (eventName: string) => {
  const escapedName = eventName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return new RegExp(
    `track(?:PostHog|Vercel)?Event\\(\\s*'${escapedName}',\\s*\\{([\\s\\S]*?)\\n\\s*\\}(?:,|\\))`,
  )
}

const getPropertyKeys = (source: string, eventName: string) => {
  const properties = source.match(eventCallPattern(eventName))?.[1]

  if (!properties) {
    throw new Error(`Could not find the ${eventName} analytics payload.`)
  }

  const direct = [...properties.matchAll(/^\s+([a-z_$][\w$]*)(?::|,)/gm)].map(
    ([, property]) => property,
  )
  const conditional = [...properties.matchAll(/\{\s*([a-z_$][\w$]*)\s*:/g)].map(
    ([, property]) => property,
  )

  return [...direct, ...conditional]
}

describe('public anonymous analytics contract', () => {
  it('matches the four general-site event payloads', async () => {
    const [analyticsSource, contributingDocs] = await Promise.all([
      readFile(analyticsPath, 'utf8'),
      readFile(contributingPath, 'utf8'),
    ])

    for (const [eventName, fields] of Object.entries(eventFields)) {
      expect(getPropertyKeys(analyticsSource, eventName), eventName).toEqual(fields)
      expect(contributingDocs, eventName).toContain(
        documentedEventRows[eventName as keyof typeof documentedEventRows],
      )
    }
  })

  it('keeps premium component interest cookieless and Vercel-only', async () => {
    const [analyticsSource, contributingDocs, privacyPage, privacyMessages] = await Promise.all([
      readFile(analyticsPath, 'utf8'),
      readFile(contributingPath, 'utf8'),
      readFile(privacyPath, 'utf8'),
      readFile(privacyMessagesPath, 'utf8'),
    ])
    const start = analyticsSource.indexOf('export function trackPremiumComponentInterest')
    const end = analyticsSource.indexOf('\n}\n\nfunction normalizeDestination', start)
    const interestFunction = analyticsSource.slice(start, end)

    expect(start).toBeGreaterThan(-1)
    expect(end).toBeGreaterThan(start)
    expect(interestFunction).toContain("trackVercelEvent('premium_component_interest'")
    expect(interestFunction).not.toContain('trackEvent(')
    expect(interestFunction).not.toContain('trackPostHogEvent(')
    expect(interestFunction).not.toMatch(/localStorage|sessionStorage|document\.cookie/)
    expect(contributingDocs).toMatch(/goes only to\s+Vercel Analytics, never to GA4 or PostHog/)
    expect(privacyPage).toContain('premium_component_interest')
    expect(privacyMessages).toContain(
      'Vercel Analytics only — cookieless, with no stored identifier.',
    )
  })

  it('keeps the privacy boundary and deployment opt-out public', async () => {
    const [contributingDocs, privacyPage, privacyMessages, envExample] = await Promise.all([
      readFile(contributingPath, 'utf8'),
      readFile(privacyPath, 'utf8'),
      readFile(privacyMessagesPath, 'utf8'),
      readFile(envExamplePath, 'utf8'),
    ])

    for (const prohibitedData of [
      'user-entered content',
      'secrets',
      'account identity',
      'install state',
      'cross-site profiling',
    ]) {
      expect(contributingDocs).toContain(prohibitedData)
    }

    expect(contributingDocs).toContain('low-cardinality event name')
    expect(contributingDocs).toContain('never sends the raw referrer')
    expect(contributingDocs).toContain('never include the query string')
    expect(contributingDocs).toContain('first same-site pathname')
    expect(contributingDocs).toContain('It is absent for direct and referral visits')
    expect(privacyPage).toContain('entry_page')
    expect(privacyMessages).toContain('never contains a query string or raw referrer')
    expect(contributingDocs).toContain('Leaving `NEXT_PUBLIC_POSTHOG_KEY` unset')
    expect(envExample).toContain('Leave unset to disable PostHog capture')
  })
})
