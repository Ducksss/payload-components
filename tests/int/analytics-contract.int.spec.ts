import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const analyticsPath = path.join(repoRoot, 'src', 'lib', 'analytics.ts')
const contributingPath = path.join(repoRoot, 'content', 'docs', 'contributing.mdx')
const envExamplePath = path.join(repoRoot, '.env.example')

const eventFields = {
  $pageview: ['page_path', 'source_path'],
  copy_install_command: ['command', 'component', 'source_path'],
  primary_link_click: ['destination', 'href', 'source_path'],
} as const

const documentedEventRows = {
  $pageview:
    '| `$pageview` | A public route loads or changes | `page_path`, `source_path`, optional `verification_run` |',
  copy_install_command:
    '| `copy_install_command` | A visitor copies a supported install command | `command`, `component`, `source_path`, optional `verification_run` |',
  primary_link_click:
    '| `primary_link_click` | A visitor follows a repository, docs, or components link | `destination`, `href`, `source_path`, optional `verification_run` |',
} as const

const eventCallPattern = (eventName: string) => {
  const escapedName = eventName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return new RegExp(`track(?:PostHog)?Event\\('${escapedName}', \\{([\\s\\S]*?)\\n  \\}\\)`)
}

const getPropertyKeys = (source: string, eventName: string) => {
  const properties = source.match(eventCallPattern(eventName))?.[1]

  if (!properties) {
    throw new Error(`Could not find the ${eventName} analytics payload.`)
  }

  return [...properties.matchAll(/^\s{4}([a-z_$][\w$]*)(?::|,)/gm)].map(([, property]) => property)
}

describe('public anonymous analytics contract', () => {
  it('matches the three general-site event payloads', async () => {
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

  it('keeps the privacy boundary and deployment opt-out public', async () => {
    const [contributingDocs, envExample] = await Promise.all([
      readFile(contributingPath, 'utf8'),
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
    expect(contributingDocs).toContain('Leaving `NEXT_PUBLIC_POSTHOG_KEY` unset')
    expect(envExample).toContain('Leave unset to disable PostHog capture')
  })

  it('marks only explicit controlled verification runs', async () => {
    const analyticsSource = await readFile(analyticsPath, 'utf8')

    expect(analyticsSource).toContain(
      "new URLSearchParams(window.location.search).get('verification_run') !== '1'",
    )
    expect(analyticsSource).toContain('verification_run: true')
    expect(analyticsSource).not.toContain('verification_run: false')
  })
})
