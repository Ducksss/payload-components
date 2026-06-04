import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

describe('Fumadocs site shell', () => {
  it('uses Fumadocs as the site runtime instead of Payload CMS', async () => {
    const packageJson = await readJson<{
      dependencies?: Record<string, string>
      scripts?: Record<string, string>
    }>(path.join(repoRoot, 'package.json'))

    expect(packageJson.dependencies?.['fumadocs-ui']).toBeTruthy()
    expect(packageJson.dependencies?.['fumadocs-mdx']).toBeTruthy()
    expect(packageJson.dependencies?.['fumadocs-core']).toBeTruthy()

    expect(packageJson.dependencies?.payload).toBeUndefined()
    expect(packageJson.dependencies?.['@payloadcms/next']).toBeUndefined()
    expect(packageJson.scripts?.payload).toBeUndefined()
    expect(packageJson.scripts?.['generate:types']).toBeUndefined()
    expect(packageJson.scripts?.['generate:importmap']).toBeUndefined()
  })

  it('keeps docs content in the Fumadocs source directory', async () => {
    const [sourceConfig, docsIndex, architecture] = await Promise.all([
      readFile(path.join(repoRoot, 'source.config.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'index.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'architecture.mdx'), 'utf8'),
    ])

    expect(sourceConfig).toContain("dir: 'content/docs'")
    expect(docsIndex).toContain('The v2 app is intentionally not a Payload CMS site.')
    expect(architecture).toContain('No Payload admin, collection config, global config')
  })
})
