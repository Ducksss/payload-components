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

type RedirectRule = {
  destination: string
  permanent: boolean
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
      devDependencies?: Record<string, string>
      engines?: Record<string, string>
      scripts?: Record<string, string>
    }>(path.join(repoRoot, 'package.json'))

    expect(packageJson.devDependencies?.['fumadocs-ui']).toBeTruthy()
    expect(packageJson.devDependencies?.['fumadocs-mdx']).toBeTruthy()
    expect(packageJson.devDependencies?.['fumadocs-core']).toBeTruthy()

    expect(packageJson.dependencies?.payload).toBeUndefined()
    expect(packageJson.dependencies?.['@payloadcms/next']).toBeUndefined()
    expect(packageJson.devDependencies?.payload).toBeUndefined()
    expect(packageJson.devDependencies?.['@payloadcms/next']).toBeUndefined()
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
      docsCss,
      docsLayout,
      rootLayout,
      globals,
      siteHeader,
      commandCopyButton,
      commandCopyController,
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
      readFile(path.join(repoRoot, 'src', 'app', 'docs', 'docs.css'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'docs', 'layout.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'layout.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'globals.css'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'components', 'site', 'SiteHeader.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'components', 'site', 'CommandCopyButton.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'components', 'site', 'CommandCopyController.tsx'), 'utf8'),
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

    // The push gate is main-only: PRs into dev already run the full gate, so the
    // deployed branch is the only one worth re-gating on its squash-merge commit.
    expect(workflow).toContain('- main')
    expect(workflow).not.toContain('- prod')
    expect(workflow).toContain('node-version: 22')
    expect(workflow).toContain('node-version: 20.19.0')
    expect(workflow).toContain('quick-checks:')
    expect(workflow).toContain('release-gate:')
    expect(workflow).toContain('node-20-compat:')
    expect(workflow).toContain('needs:')
    expect(workflow).toContain('- quick-checks')
    expect(workflow).toContain('- release-gate')
    expect(workflow).toContain('- node-20-compat')
    expect(sourceConfig).toContain('pageSchema')
    expect(sourceConfig).toContain('metaSchema')
    expect(nextConfig).toContain('createMDX')
    expect(rootLayout).not.toContain('RootProvider')
    expect(rootLayout).toContain('CommandCopyController')
    expect(docsLayout).toContain('RootProvider')
    expect(docsLayout).toContain('enabled: false')
    expect(docsLayout).toContain('themeSwitch={{ enabled: false }}')
    expect(docsLayout).not.toContain('defaultTheme')
    expect(docsLayout).not.toContain('forcedTheme')
    expect(docsLayout).toContain('activePath="/docs"')
    expect(docsCss).toContain("@import 'tailwindcss'")
    expect(docsCss).toContain("@import 'fumadocs-ui/css/preset.css'")
    expect(globals).not.toContain("@import 'fumadocs-ui/css/preset.css'")
    expect(siteHeader).not.toContain("'use client'")
    expect(siteHeader).not.toContain('usePathname')
    expect(siteHeader).toContain('activePath')
    expect(commandCopyButton).not.toContain("'use client'")
    expect(commandCopyButton).toContain('data-copy-command')
    expect(commandCopyController).toContain("'use client'")
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
    )) as { default: { headers?: () => Promise<HeaderRule[]>; redirects?: () => Promise<RedirectRule[]> } }

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
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ])

    await expect(nextConfig.redirects?.()).resolves.toEqual([
      { source: '/docs/kits', destination: '/components', permanent: true },
      { source: '/docs/kits/:slug', destination: '/docs/components/:slug', permanent: true },
      {
        source: '/docs/what-is-a-payload-kit',
        destination: '/docs/what-is-a-payload-component',
        permanent: true,
      },
      {
        source: '/docs/shadcn-vs-payload-kit',
        destination: '/docs/shadcn-vs-payload-components',
        permanent: true,
      },
    ])
  })

  it('loads component docs data from the component registry tree', async () => {
    const [{ getComponentManifest, getComponentRegistryDependencies }, { getComponentSources }] =
      await Promise.all([
        import('../../src/lib/component-manifest'),
        import('../../src/lib/component-source'),
      ])

    await expect(getComponentManifest('hero-basic')).resolves.toMatchObject({
      files: expect.arrayContaining(['src/blocks/HeroBasic/config.ts']),
      name: 'hero-basic',
    })
    await expect(getComponentRegistryDependencies('hero-basic')).resolves.toContain('badge')

    const sources = await getComponentSources('hero-basic')

    expect(sources.map((source) => source.title)).toEqual([
      'src/blocks/HeroBasic/config.ts',
      'src/blocks/HeroBasic/Component.tsx',
      'src/blocks/shared/heroFields.ts',
    ])
    expect(sources[0]?.code).toContain("slug: 'heroBasic'")
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

  it('keeps catalog page-block count copy aligned with installable components', async () => {
    const { componentEntries, componentFamilies, componentsIntro, upcomingComponents } =
      await import('../../src/lib/site')
    const pageCount = componentEntries.filter((component) => component.family === 'pages').length
    const aboutPage = await readFile(path.join(repoRoot, 'src', 'app', 'about', 'page.tsx'), 'utf8')

    expect(pageCount).toBe(53)
    expect(componentFamilies.pages.countLabel).toBe(`${pageCount} installable`)
    expect(componentFamilies.posts.countLabel).toBe(`${upcomingComponents.length} in development`)
    expect(componentsIntro).toContain('Fifty-three page blocks install today')
    expect(aboutPage).toContain('Fifty-three page blocks install today')
    expect(`${componentsIntro}\n${aboutPage}`).not.toContain('Forty-seven page blocks')
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

    expect(siteUrl).toBe('https://www.payload-components.xyz')

    const robots = robotsModule.default()
    const sitemap = sitemapModule.default()
    const llmsBody = await (await llmsModule.GET()).text()
    const llmsFullBody = await (await llmsFullModule.GET()).text()

    expect(robots.host).toBeUndefined()
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
      robots.sitemap,
      ...sitemap.map((entry) => entry.url),
      llmsBody,
      llmsFullBody,
    ].join('\n')

    expect(combinedOutput).not.toContain('localhost')
  })

  it('normalizes stale apex site URL env values to the canonical www host', async () => {
    for (const envValue of ['https://payload-components.xyz', 'https://payload-components.xyz/']) {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', envValue)
      vi.resetModules()

      const { siteUrl } = await import('../../src/lib/site')

      expect(siteUrl).toBe('https://www.payload-components.xyz')
    }
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
