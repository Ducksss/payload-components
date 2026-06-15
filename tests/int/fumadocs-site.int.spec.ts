// @vitest-environment node

import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const repoRoot = process.cwd()

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

type HeaderRule = {
  has?: Array<{ key: string; type: string; value?: string }>
  headers: Array<{ key: string; value: string }>
  source: string
}

type MetaFile = {
  pages?: Array<string | { pages?: string[]; title?: string }>
  title?: string
}

const isSeparator = (entry: string) => entry.startsWith('---') && entry.endsWith('---')

async function pathExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function expectMetaEntriesResolve(directory: string) {
  const meta = await readJson<MetaFile>(path.join(directory, 'meta.json'))

  for (const entry of meta.pages ?? []) {
    if (typeof entry !== 'string' || isSeparator(entry)) continue

    const pagePath = path.join(directory, `${entry}.mdx`)
    const childMetaPath = path.join(directory, entry, 'meta.json')

    expect(
      (await pathExists(pagePath)) || (await pathExists(childMetaPath)),
      `${path.relative(repoRoot, directory)}/meta.json references missing page "${entry}"`,
    ).toBe(true)

    if (await pathExists(childMetaPath)) {
      await expectMetaEntriesResolve(path.join(directory, entry))
    }
  }
}

describe('Fumadocs site shell', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses Fumadocs as the site runtime instead of Payload CMS', async () => {
    const packageJson = await readJson<{
      dependencies?: Record<string, string>
      engines?: Record<string, string>
      scripts?: Record<string, string>
    }>(path.join(repoRoot, 'package.json'))

    expect(packageJson.dependencies?.['fumadocs-ui']).toBeTruthy()
    expect(packageJson.dependencies?.['fumadocs-mdx']).toBeTruthy()
    expect(packageJson.dependencies?.['fumadocs-core']).toBeTruthy()

    expect(packageJson.dependencies?.payload).toBeUndefined()
    expect(packageJson.dependencies?.['@payloadcms/next']).toBeUndefined()
    expect(packageJson.engines?.node).toBe('^20.19.0 || >=22.12.0')
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
    expect(workflow).toContain('- main')
    expect(workflow).not.toContain('- prod')
    expect(workflow).toContain('- 20.19.0')
    expect(workflow).toContain('- 22')
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

  it('keeps docs navigation metadata pointed at real pages', async () => {
    await expectMetaEntriesResolve(path.join(repoRoot, 'content', 'docs'))
  })

  it('publishes production-safe fallback URLs when no site URL env is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined)
    vi.resetModules()
    vi.doMock('../../src/lib/source', () => ({
      getLLMText: vi.fn(() => '# Mock docs (/docs)'),
      source: {
        getPages: () => [{ url: '/docs' }],
      },
    }))

    const [{ siteUrl }, robotsModule, sitemapModule, llmsModule, llmsFullModule] =
      await Promise.all([
        import('../../src/lib/site'),
        import('../../src/app/robots'),
        import('../../src/app/sitemap'),
        import('../../src/app/llms.txt/route'),
        import('../../src/app/llms-full.txt/route'),
      ])

    expect(siteUrl).toBe('https://payload-components.xyz')

    const robots = robotsModule.default()
    const sitemap = sitemapModule.default()
    const llmsBody = await (await llmsModule.GET()).text()
    const llmsFullBody = await (await llmsFullModule.GET()).text()

    expect(robots.host).toBe(siteUrl)
    expect(robots.sitemap).toBe(`${siteUrl}/sitemap.xml`)
    expect(sitemap).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: `${siteUrl}/` }),
        expect.objectContaining({ url: `${siteUrl}/docs` }),
      ]),
    )
    expect(llmsBody).toContain(`- [Home](${siteUrl}/)`)
    expect(llmsFullBody).toContain(`Home: ${siteUrl}/`)

    const combinedOutput = [
      robots.host,
      robots.sitemap,
      ...sitemap.map((entry) => entry.url),
      llmsBody,
      llmsFullBody,
    ].join('\n')

    expect(combinedOutput).not.toContain('localhost')
  })

  it('keeps showcase metadata, assets, and capture script in sync', async () => {
    const [siteSource, captureSource] = await Promise.all([
      readFile(path.join(repoRoot, 'src', 'lib', 'site.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'tools', 'showcase', 'capture.ts'), 'utf8'),
    ])
    const { clientProjects, showcaseSetupTaxLabel } = await import('../../src/lib/site')
    const { ProjectShowcaseCard } = await import('../../src/components/site/ProjectShowcaseCard')

    expect(siteSource).toContain('public/showcase/<slug>.jpg')
    expect(captureSource).not.toMatch(/\bnetworkidle\b/)
    expect(captureSource).toMatch(/waitUntil:\s*['"]domcontentloaded['"]/)
    expect(showcaseSetupTaxLabel).toBe('Setup tax paid by hand')

    for (const project of clientProjects) {
      await expect(
        pathExists(path.join(repoRoot, 'public', 'showcase', `${project.slug}.jpg`)),
      ).resolves.toBe(true)

      const markup = renderToStaticMarkup(createElement(ProjectShowcaseCard, { project }))
      const accessibleName = `Visit ${project.name} (opens in a new tab)`
      const expectedLabelAttribute = renderToStaticMarkup(
        createElement('a', { 'aria-label': accessibleName }),
      ).match(/aria-label="[^"]+"/)?.[0]
      const expectedHrefAttribute = renderToStaticMarkup(createElement('a', { href: project.url }))
        .match(/href="[^"]+"/)?.[0]

      expect(markup.split(expectedHrefAttribute ?? '').length - 1).toBe(2)
      expect(markup.split(expectedLabelAttribute ?? '').length - 1).toBe(2)
    }
  })
})
