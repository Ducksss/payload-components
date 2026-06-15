// @vitest-environment node

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

type HeaderRule = {
  has?: Array<{ key: string; type: string; value?: string }>
  headers: Array<{ key: string; value: string }>
  source: string
}

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
    expect(packageJson.scripts?.prebuild).toContain('pnpm source:build')
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

  it('keeps the Fumadocs app router integration wired', async () => {
    const [
      workflow,
      sourceConfig,
      nextConfig,
      rootLayout,
      globals,
      sourceFile,
      docsPage,
      searchRoute,
      llmsFullRoute,
      pageMarkdownRoute,
      docsImageRoute,
      proxy,
    ] = await Promise.all([
      readFile(path.join(repoRoot, '.github', 'workflows', 'registry-verification.yml'), 'utf8'),
      readFile(path.join(repoRoot, 'source.config.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'next.config.mjs'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'layout.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'globals.css'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'lib', 'source.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'docs', '[[...slug]]', 'page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'api', 'search', 'route.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'llms-full.txt', 'route.ts'), 'utf8'),
      readFile(
        path.join(repoRoot, 'src', 'app', 'llms.mdx', 'docs', '[[...slug]]', 'route.ts'),
        'utf8',
      ),
      readFile(path.join(repoRoot, 'src', 'app', 'og', 'docs', '[...slug]', 'route.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'proxy.ts'), 'utf8'),
    ])

    expect(workflow).toContain('- dev')
    expect(workflow).toContain('- prod')
    expect(workflow).not.toContain('- main')
    expect(sourceConfig).toContain('pageSchema')
    expect(sourceConfig).toContain('metaSchema')
    expect(nextConfig).toContain('createMDX')
    expect(rootLayout).toContain('RootProvider')
    expect(rootLayout).toContain("defaultTheme: 'light'")
    expect(globals).toContain("@import 'fumadocs-ui/css/preset.css'")
    expect(sourceFile).toContain('lucideIconsPlugin')
    expect(sourceFile).toContain("baseUrl: docsRoute")
    expect(sourceFile).toContain('getPageMarkdownUrl')
    expect(sourceFile).toContain('getPageImage')
    expect(docsPage).toContain('MarkdownCopyButton')
    expect(docsPage).toContain('ViewOptionsPopover')
    expect(docsPage).toContain('createRelativeLink')
    expect(searchRoute).toContain('createFromSource')
    expect(llmsFullRoute).toContain('getLLMText')
    expect(pageMarkdownRoute).toContain('text/markdown')
    expect(docsImageRoute).toContain('ImageResponse')
    expect(proxy).toContain('isMarkdownPreferred')
    expect(proxy).toContain('rewritePath')
  })

  it('cache-busts deploy-sensitive app responses without touching hashed assets', async () => {
    const { default: nextConfig } = (await import(
      pathToFileURL(path.join(repoRoot, 'next.config.mjs')).href
    )) as { default: { headers?: () => Promise<HeaderRule[]> } }

    const cacheRules = (await nextConfig.headers?.())?.filter((rule) =>
      rule.headers.some((header) => header.key === 'Cache-Control'),
    )

    expect(cacheRules).toEqual([
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: '.*text/html.*' }],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, stale-while-revalidate=30',
          },
        ],
      },
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'rsc', value: '1' }],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, stale-while-revalidate=30',
          },
        ],
      },
    ])
  })

  it('does not reintroduce Payload CMS runtime app surfaces', async () => {
    const appRoot = path.join(repoRoot, 'src', 'app')
    const forbiddenNames = new Set([
      '(payload)',
      'admin',
      'collections',
      'globals',
      'payload.config.ts',
      'payload.config.mts',
    ])
    const found: string[] = []

    async function scan(directory: string) {
      const entries = await readdir(directory, { withFileTypes: true })

      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name)

        if (forbiddenNames.has(entry.name)) {
          found.push(path.relative(repoRoot, entryPath))
        }

        if (entry.isDirectory()) {
          await scan(entryPath)
        }
      }
    }

    await scan(appRoot)

    expect(found).toEqual([])
  })
})
