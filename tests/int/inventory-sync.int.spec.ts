import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readRegistryNames = async (): Promise<string[]> => {
  const registry = JSON.parse(
    await readFile(path.join(repoRoot, 'payload-components', 'registry.json'), 'utf8'),
  ) as { items: Array<{ name: string }> }
  return registry.items.map((item) => item.name)
}

// Pull the indented list under the CLI help "Current components:" heading.
const extractCliHelpNames = (source: string): string[] => {
  const marker = 'Current components:\n'
  const start = source.indexOf(marker)
  if (start === -1) throw new Error('CLI usage is missing the "Current components:" section.')
  const rest = source.slice(start + marker.length)
  const names: string[] = []
  for (const line of rest.split('\n')) {
    const match = /^ {2}([a-z0-9-]+)$/.exec(line)
    if (!match) break
    names.push(match[1])
  }
  return names
}

// Pull backtick-quoted component slugs from the marker-delimited README table.
const extractReadmeInventoryNames = (source: string): string[] => {
  const start = source.indexOf('<!-- COMPONENT-INVENTORY:START -->')
  const end = source.indexOf('<!-- COMPONENT-INVENTORY:END -->')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('README is missing the COMPONENT-INVENTORY markers.')
  }
  const block = source.slice(start, end)
  const names: string[] = []
  for (const line of block.split('\n')) {
    // Rows look like: | `name` | `npx payload-components add name` |
    const match = /^\|\s*`([a-z0-9-]+)`\s*\|/.exec(line)
    if (match) names.push(match[1])
  }
  return names
}

describe('documented component inventory stays in sync with the registry', () => {
  it('lists every registry item, in order, in the CLI help output', async () => {
    const [registryNames, cliSource] = await Promise.all([
      readRegistryNames(),
      readFile(path.join(repoRoot, 'tools', 'payload-components', 'cli.ts'), 'utf8'),
    ])

    expect(extractCliHelpNames(cliSource)).toEqual(registryNames)
  })

  it('lists every registry item, in order, in the README inventory table', async () => {
    const [registryNames, readmeSource] = await Promise.all([
      readRegistryNames(),
      readFile(path.join(repoRoot, 'README.md'), 'utf8'),
    ])

    expect(extractReadmeInventoryNames(readmeSource)).toEqual(registryNames)
  })
})
