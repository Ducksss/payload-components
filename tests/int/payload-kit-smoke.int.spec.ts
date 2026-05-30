import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { getPayloadLayoutManifests, parseSmokeArgs } from '../../tools/payload-kit/smoke/fresh-payload-repo'
import type { KitManifest } from '../../tools/payload-kit/types'

const repoRoot = process.cwd()

describe('payload-kit shadcn smoke configuration', () => {
  it('direct shadcn smoke covers every public registry item by default', () => {
    expect(parseSmokeArgs([]).kits).toEqual([
      'hero-basic',
      'feature-grid-basic',
      'post-card',
      'post-archive',
      'post-hero',
      'featured-post',
      'post-list',
      'author-card',
      'newsletter-callout',
      'related-posts',
    ])
  })

  it('parses direct-only smoke mode without enabling the fresh Payload app run', () => {
    expect(parseSmokeArgs(['--direct-only', '--kits', 'hero-basic', '--registry-url', 'https://example.com/r/{name}.json'])).toMatchObject({
      directOnly: true,
      kits: ['hero-basic'],
      registryUrl: 'https://example.com/r/{name}.json',
    })
  })

  it('exposes test:shadcn as the focused direct registry compatibility gate', async () => {
    const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.['test:shadcn']).toBe(
      'cross-env NODE_OPTIONS=--no-deprecation tsx tools/payload-kit/smoke/fresh-payload-repo.ts --direct-only',
    )
    expect(packageJson.scripts?.['test:release']).toContain('pnpm test:shadcn')
  })

  it('only waits for Payload layout block kits in the fresh route render assertion', () => {
    const manifests = [
      {
        name: 'hero-basic',
        sampleContent: {
          blockType: 'heroBasic',
          title: 'Payload-native hero',
        },
      },
      {
        name: 'post-card',
        sampleContent: {
          title: 'Build a reusable Payload component workflow',
        },
      },
    ] as unknown as KitManifest[]

    expect(getPayloadLayoutManifests(manifests).map((manifest) => manifest.name)).toEqual(['hero-basic'])
  })
})
