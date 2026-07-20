import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('Dependabot update groups', () => {
  it('keeps coupled framework, test, and documentation tooling together', async () => {
    const config = await readFile(path.join(process.cwd(), '.github', 'dependabot.yml'), 'utf8')
    const patternsFor = (group: string) => {
      const match = config.match(
        new RegExp(`^      ${group}:\\n        patterns:\\n((?:          - .+\\n)+)`, 'm'),
      )

      expect(match, `missing Dependabot group ${group}`).not.toBeNull()

      return match?.[1]
        .trim()
        .split('\n')
        .map((line) => line.replace(/^\s*- ['"]?|['"]?$/g, ''))
    }

    expect(patternsFor('next-react')).toEqual([
      'eslint-config-next',
      'next',
      'react',
      'react-dom',
    ])
    expect(patternsFor('test-tooling')).toEqual([
      '@playwright/*',
      'vite',
      'vite-tsconfig-paths',
      'vitest',
    ])
    expect(patternsFor('documentation-tooling')).toEqual(['fumadocs-*'])
  })
})
