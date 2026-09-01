// @vitest-environment node

import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

/* Many assertions below pin exact substrings of source files, and prettier owns
   the line breaks in every one of those files. A pin that spans more than a
   single token is therefore a pin on the FORMATTING as much as on the code: when
   the twitter literal in blog/[slug]/page.tsx crossed 100 columns it was split
   across lines, and the assertion failed while the metadata it guards was
   untouched. Collapsing whitespace on both sides keeps the assertion about the
   code. Use it for anything spanning a brace, an arrow, or a ternary; bare
   identifiers cannot wrap and are fine matched raw. */
const collapse = (source: string) => source.replace(/\s+/g, ' ')

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
    vi.doUnmock('@/lib/source')
    vi.doUnmock(path.join(repoRoot, 'src/lib/source.ts'))
    vi.doUnmock('@/lib/blog-source')
    vi.doUnmock(path.join(repoRoot, 'src/lib/blog-source.ts'))
    vi.doUnmock('collections/server')
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

  it('keeps evergreen about and blog copy free of numeric catalog counts', async () => {
    const [aboutPage, helloPost] = await Promise.all([
      readFile(path.join(repoRoot, 'src', 'app', 'about', 'page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'blog', 'hello.mdx'), 'utf8'),
    ])

    expect(aboutPage).not.toMatch(/\b\d+\s+page blocks?\b/i)
    expect(helloPost).not.toMatch(/\b\d+\s+page blocks?\b/i)
  })

  it('keeps the install CTA community-owned and reduced-motion safe', async () => {
    const [footer, copyButton, { heroSubheadline }] = await Promise.all([
      readFile(path.join(repoRoot, 'src', 'components', 'site', 'SiteFooter.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'components', 'site', 'CommandCopyButton.tsx'), 'utf8'),
      import('../../src/lib/site'),
    ])

    expect(`${footer}\n${copyButton}`).not.toContain('tin.computer')
    expect(`${footer}\n${copyButton}`).not.toContain('Growth by Tin')
    expect(`${footer}\n${copyButton}`).not.toContain('66DC9D')
    expect(copyButton).toContain('data-[copied=true]:text-brand-foreground')
    expect(copyButton).toContain('motion-reduce:transform-none')
    expect(heroSubheadline).toBe(
      'For Payload CMS developers, one command installs the block, wires it into Payload, and lands a reviewable git diff.',
    )
  })

  it('renders external footer resources as native anchors', async () => {
    const footer = await readFile(
      path.join(repoRoot, 'src', 'components', 'site', 'SiteFooter.tsx'),
      'utf8',
    )

    expect(collapse(footer)).toContain('external ? ( <a href={link.href}')
    expect(footer).toContain('rel="noreferrer"')
    expect(footer).toContain('target="_blank"')
  })

  it('connects the block troubleshooting article to the installation guide', async () => {
    const [troubleshootingPost, installationGuide] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'blog', 'anatomy-of-an-install.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
    ])

    expect(troubleshootingPost).toContain('Payload CMS block not showing?')
    expect(troubleshootingPost).toContain('[installation guide](/docs/installation)')
    expect(troubleshootingPost).toContain('The block is missing from the Pages editor')
    expect(troubleshootingPost).toContain(
      'The editor saves the block, but the page renders nothing',
    )
    expect(troubleshootingPost.match(/<RunnableCommand\b/g)).toHaveLength(4)
    expect(troubleshootingPost).toContain('command="pnpm payload generate:types"')
    expect(troubleshootingPost).toContain('command="pnpm payload generate:importmap"')
    expect(troubleshootingPost).toContain('command="npx payload-components doctor"')
    expect(troubleshootingPost).toContain('command="npx payload-components add hero-basic"')
    expect(troubleshootingPost).toMatch(
      /command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b/,
    )
    expect(installationGuide).toMatch(
      /command="npx payload-components add hero-basic"[\s\S]*label="Copy the hero-basic install command"[\s\S]*\btrackInstall\b/,
    )
    expect(installationGuide).toContain(
      '[four-step Payload block troubleshooting checklist](/blog/anatomy-of-an-install)',
    )
  })

  it('keeps the Payload 3 types guide distinct, discoverable, and actionable', async () => {
    const [guide, docsMeta, installationGuide, sitemap] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'payload-types-errors.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
    ])

    expect(guide).toContain('Fix Payload 3 payload-types errors')
    expect(guide).toContain("Cannot find module '@/payload-types'")
    expect(guide).toContain('typescript.outputFile')
    expect(guide).toContain('blocks: [HeroBasic]')
    expect(guide).toContain('command="pnpm payload generate:types"')
    expect(guide).toContain(
      '"generate:types": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload generate:types"',
    )
    expect(guide).toMatch(/command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b/)
    expect(guide).toContain('[installation guide](/docs/installation)')
    expect(docsMeta).toContain('"payload-types-errors"')
    expect(installationGuide).toContain(
      '[Payload 3 generated-types repair guide](/docs/payload-types-errors)',
    )
    expect(sitemap).toContain("source.getPages('en')")
  })

  it('keeps the Payload import-map reference separate from the foundations essay', async () => {
    const [guide, essay, docsMeta, installationGuide, sitemap] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'payload-generate-importmap.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'blog', 'payload-types-and-import-map.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
    ])

    expect(guide).toContain('title: "Payload generate:importmap: command, output, and fixes"')
    expect(guide).toContain('seoTitle: "Payload generate:importmap command and fixes"')
    expect(guide).toContain('command="pnpm payload generate:importmap"')
    expect(guide).toContain('src/app/(payload)/admin/importMap.js')
    expect(guide).toContain('admin.importMap.baseDir')
    expect(guide).toContain('admin.importMap.importMapFile')
    expect(guide).toContain('[installation guide](/docs/installation)')
    expect(docsMeta).toContain('"payload-generate-importmap"')
    expect(installationGuide).toContain(
      '[Payload `generate:importmap` reference](/docs/payload-generate-importmap)',
    )
    expect(sitemap).toContain("source.getPages('en')")

    expect(essay).toContain('title: Why Payload Types and the Admin Import Map Must Stay in Sync')
    expect(essay).toContain('author: Ducksss')
    expect(essay).toContain('series: foundations')
    expect(essay).toContain('publicationOrder: 7')
    expect(essay).toContain(
      'Payload has two generated artifacts that are easy to mention in the same breath and easy to confuse:',
    )
  })

  it('keeps the Payload npm guide distinct, discoverable, and version-safe', async () => {
    const [guide, docsMeta, docsIndex, installationGuide, sitemap] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'payload-cms-npm.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'index.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
    ])

    expect(guide).toContain('seoTitle: "Payload CMS npm install: packages, setup, and fixes"')
    expect(guide).toContain('command="npx create-payload-app@latest"')
    expect(guide).toContain('npm install --save-exact payload @payloadcms/next')
    expect(guide).toContain('@payloadcms/db-postgres')
    expect(guide).toContain('@payloadcms/db-mongodb')
    expect(guide).toContain('@payloadcms/db-sqlite')
    expect(guide).toContain('npm ls payload @payloadcms/next @payloadcms/ui react react-dom')
    expect(guide).toContain('npm dedupe')
    expect(guide).toContain('command="npx payload-components add hero-basic"')
    expect(guide).toMatch(/command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b/)
    expect(guide).toContain('[generated-types repair guide](/docs/payload-types-errors)')
    expect(guide).toContain(
      '[`generate:importmap` command reference](/docs/payload-generate-importmap)',
    )
    expect(guide).toContain('[Payload Components installation guide](/docs/installation)')
    expect(docsMeta).toContain('"payload-cms-npm"')
    expect(docsIndex).toContain('href="/docs/payload-cms-npm"')
    expect(installationGuide).toContain('[Payload CMS npm setup guide](/docs/payload-cms-npm)')
    expect(sitemap).toContain("source.getPages('en')")
  })

  it('keeps the Payload configuration guide distinct, discoverable, and actionable', async () => {
    const [guide, docsMeta, docsIndex, installationGuide, sitemap] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'payload-configuration.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'index.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
    ])

    expect(guide).toContain('title: "Payload configuration: payload.config.ts setup and structure"')
    expect(guide).toContain('seoTitle: "Payload configuration: payload.config.ts setup guide"')
    expect(guide).toContain("import { buildConfig } from 'payload'")
    expect(guide).toContain('collections: [Users, Media, Pages]')
    expect(guide).toContain('admin.importMap.baseDir')
    expect(guide).toContain('typescript: {')
    expect(guide).toContain("outputFile: path.resolve(dirname, 'payload-types.ts')")
    expect(guide).toContain('serverURL')
    expect(guide).toContain('cors')
    expect(guide).toContain('csrf')
    expect(guide).toContain('command="pnpm payload generate:types"')
    expect(guide).toContain('command="pnpm payload generate:importmap"')
    expect(guide).toMatch(/command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b/)
    expect(guide).toContain('[Payload CMS blocks guide](/docs/payload-blocks)')
    expect(guide).not.toContain('blockComponents =')
    expect(guide).not.toContain('npx create-payload-app')
    expect(docsMeta).toContain('"payload-configuration"')
    expect(docsIndex).toContain('href="/docs/payload-configuration"')
    expect(installationGuide).toContain(
      '[Payload configuration guide](/docs/payload-configuration)',
    )
    expect(sitemap).toContain("source.getPages('en')")
  })

  it('keeps the Payload blocks guide implementation-led, discoverable, and product-true', async () => {
    const [
      guide,
      docsMeta,
      installationGuide,
      sitemap,
      heroConfig,
      heroComponent,
      heroManifest,
      rootReadme,
    ] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'payload-blocks.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
      readFile(
        path.join(repoRoot, 'payload-components', 'source', 'blocks', 'HeroBasic', 'config.ts'),
        'utf8',
      ),
      readFile(
        path.join(repoRoot, 'payload-components', 'source', 'blocks', 'HeroBasic', 'Component.tsx'),
        'utf8',
      ),
      readFile(path.join(repoRoot, 'payload-components', 'manifests', 'hero-basic.json'), 'utf8'),
      readFile(path.join(repoRoot, 'README.md'), 'utf8'),
    ])

    expect(guide).toContain('title: "Payload CMS blocks: create, register, type, and render in v3"')
    expect(guide).toContain('seoTitle: "Payload CMS blocks: create, register, type, and render"')
    expect(guide).toContain(
      'description: Build Payload CMS blocks in v3 from Block config through collection registration, generated types, rendering, the admin import map, and a live page.',
    )
    expect(guide).toContain('Payload CMS blocks in v3 become live through one chain:')
    expect(guide).toContain("slug: 'heroBasic'")
    expect(guide).toContain("interfaceName: 'HeroBasicBlock'")
    expect(guide).toContain("singular: 'Hero Basic'")
    expect(guide).toContain("import { HeroBasic } from '../../blocks/HeroBasic/config'")
    expect(guide).toContain('blocks: [/* existing blocks */, HeroBasic]')
    expect(guide).toContain("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'")
    expect(guide).toContain('heroBasic: HeroBasicBlock')
    expect(guide).toContain(
      "import type { HeroBasicBlock as HeroBasicBlockData } from '@/payload-types'",
    )
    expect(guide).toContain('pnpm payload generate:types')
    expect(guide).toContain('pnpm payload generate:importmap')
    expect(guide).toContain('src/app/(payload)/admin/importMap.js')
    expect(guide).toContain('<ComponentPreview slug="hero-basic" />')
    expect(guide).toMatch(/command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b/)
    expect(guide).toMatch(
      /command="npx payload-components add hero-basic"[\s\S]*\btrackInstall\b[\s\S]*emphasis="primary"/,
    )
    expect(guide).toContain('command="npx payload-components add hero-basic --dry-run"')
    expect(guide).toContain('label="Copy the hero-basic dry-run command"')
    expect(guide).toContain('It does not write')
    expect(guide).toContain('[What is a Payload component?](/docs/what-is-a-payload-component)')
    expect(guide).toContain('[Use your first block](/docs/first-block)')
    expect(heroConfig).toContain("slug: 'heroBasic'")
    expect(heroConfig).toContain("interfaceName: 'HeroBasicBlock'")
    expect(heroConfig).toContain("singular: 'Hero Basic'")
    expect(collapse(heroComponent)).toContain(
      "import type { HeroBasicBlock as HeroBasicBlockData } from '@/payload-types'",
    )
    expect(heroManifest).toContain('"blockSlug": "heroBasic"')
    expect(heroManifest).toContain('"blockName": "HeroBasic"')
    expect(heroManifest).toContain('"postInstall": ["generate:types", "generate:importmap"]')
    expect(docsMeta).toContain('"payload-blocks"')
    expect(installationGuide).toContain(
      '[`hero-basic` implementation from Block config through live rendering](/docs/payload-blocks)',
    )
    expect(rootReadme).toContain(
      '[Payload blocks][payload-blocks-guide-url] are not live when their files land.',
    )
    expect(rootReadme).toContain(
      '[payload-blocks-guide-url]: https://www.payload-components.xyz/docs/payload-blocks',
    )
    expect(sitemap).toContain("source.getPages('en')")
  })

  it('keeps the GitHub mark independent from removed Lucide brand icons', async () => {
    const githubLinkSources = await Promise.all(
      [
        'src/app/docs/layout.tsx',
        'src/components/site/SiteFooter.tsx',
        'src/components/site/SiteHeader.tsx',
        'src/components/site/sections/CommunityCta.tsx',
        'src/components/site/sections/HeroSection.tsx',
      ].map((filePath) => readFile(path.join(repoRoot, filePath), 'utf8')),
    )

    for (const source of githubLinkSources) {
      expect(source).toContain("import { GitHubMark } from '@/components/site/GitHubMark'")
      expect(source).not.toMatch(/import\s+\{[^}]*\bGithub\b[^}]*\}\s+from\s+'lucide-react'/)
    }
  })

  it('keeps docs content in the Fumadocs source directory', async () => {
    const [sourceConfig, docsIndex, architecture] = await Promise.all([
      readFile(path.join(repoRoot, 'source.config.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'index.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'architecture.mdx'), 'utf8'),
    ])

    expect(sourceConfig).toContain("dir: 'content/docs'")
    expect(docsIndex).toContain('This site is intentionally not a Payload CMS site.')
    expect(architecture).toContain('No Payload admin, collection config, global config')
  })

  it('keeps the canonical shadcn guide scoped, actionable, and free of a duplicate route', async () => {
    const [guide, docsMeta, sitemap] = await Promise.all([
      readFile(path.join(repoRoot, 'content', 'docs', 'shadcn-vs-payload-components.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'meta.json'), 'utf8'),
      readFile(path.join(repoRoot, 'src', 'app', 'sitemap.ts'), 'utf8'),
    ])

    expect(guide).toContain('current [`hero-basic` registry item]')
    expect(guide).toContain('| Block source | copied | copied |')
    expect(guide).toContain('| Collection schema | — | patched |')
    expect(guide).toContain('| Render mapping | — | patched |')
    expect(guide).toContain('| Generated types | — | regenerated |')
    expect(guide).toContain('| Admin import map | — | regenerated |')
    expect(guide).toContain('diff --git a/src/collections/Pages/index.ts')
    expect(guide).toContain('diff --git a/src/blocks/RenderBlocks.tsx')
    expect(guide).toContain('command="npx payload-components add hero-basic"')
    expect(guide).toContain('label="Copy install command"')
    expect(docsMeta).toContain('"shadcn-vs-payload-components"')
    expect(sitemap).toContain("source.getPages('en')")
    await expect(
      pathExists(
        path.join(repoRoot, 'src', 'app', 'compare', 'shadcn-vs-payload-components', 'page.tsx'),
      ),
    ).resolves.toBe(false)
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
      readFile(
        path.join(repoRoot, 'src', 'components', 'site', 'CommandCopyController.tsx'),
        'utf8',
      ),
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
    expect(collapse(docsLayout)).toContain('themeSwitch={{ enabled: false }}')
    expect(docsLayout).not.toContain('defaultTheme')
    expect(docsLayout).not.toContain('forcedTheme')
    expect(docsLayout).toContain('activePath="/docs"')
    expect(docsCss).toContain("@import 'tailwindcss'")
    expect(docsCss).toContain("@import 'fumadocs-ui/css/preset.css'")
    expect(globals).not.toContain("@import 'fumadocs-ui/css/preset.css'")
    expect(siteHeader).toContain("'use client'")
    expect(siteHeader).toContain('usePathname')
    expect(siteHeader).toContain('aria-expanded')
    expect(siteHeader).not.toContain('role="menu"')
    expect(siteHeader).not.toContain('role="menuitem"')
    expect(siteHeader).toContain('rel="noreferrer"')
    expect(siteHeader).toContain('activePath')
    expect(commandCopyButton).not.toContain("'use client'")
    expect(commandCopyButton).toContain('data-copy-command')
    expect(commandCopyController).toContain("'use client'")
    expect(sourceFile).toContain('lucideIconsPlugin')
    expect(sourceFile).toContain('baseUrl: docsRoute')
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
    )) as {
      default: { headers?: () => Promise<HeaderRule[]>; redirects?: () => Promise<RedirectRule[]> }
    }

    const headerRules = await nextConfig.headers?.()
    const cacheRules = headerRules?.filter((rule) =>
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
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/feed.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/blog/rss.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
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

    expect(
      headerRules?.find((rule) =>
        rule.headers.some((header) => header.key === 'Strict-Transport-Security'),
      ),
    ).toEqual({
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
        },
      ],
    })

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

  it('turns the top search component pages into distinct tracked install entries', async () => {
    const pages = [
      {
        description:
          'Install a typed Payload CMS content-list block with a serif heading and labeled terms. The CLI wires it into your Pages layout, renderer, types, and import map.',
        seoTitle: 'Content List Block for Payload CMS',
        slug: 'content-list',
      },
      {
        description:
          'Install a typed Payload CMS content block with a full-width lead image, two-column copy, and CTA. The CLI wires it into your Pages layout and renderer.',
        seoTitle: 'Image-led Content Block for Payload CMS',
        slug: 'content-image-lead',
      },
      {
        description:
          'Install a typed Payload CMS feature-media block with body copy, two icon features, and a framed image. The CLI wires it into your Pages layout and renderer.',
        seoTitle: 'Feature Media Block for Payload CMS',
        slug: 'content-feature-media',
      },
    ] as const

    for (const page of pages) {
      const source = await readFile(
        path.join(repoRoot, 'content', 'docs', 'components', `${page.slug}.mdx`),
        'utf8',
      )

      expect(source).toContain(`seoTitle: ${page.seoTitle}`)
      expect(source).toContain(`description: ${page.description}`)
      expect(source).toContain(`command="npx payload-components add ${page.slug}"`)
      expect(source).toContain(`label="Copy the ${page.slug} install command"`)
      expect(source).toContain('trackInstall')
      expect(source).toContain('emphasis="primary"')
      expect(source).toContain(
        `pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/${page.slug}.json`,
      )
      expect(source).toContain(`<ComponentWiring slug="${page.slug}" />`)
      expect(source.trim().endsWith(`<ComponentFamily slug="${page.slug}" />`)).toBe(true)
    }
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

  it('lists every component page in the docs sidebar', async () => {
    const componentsDir = path.join(repoRoot, 'content', 'docs', 'components')
    const [meta, files] = await Promise.all([
      readJson<MetaFile>(path.join(componentsDir, 'meta.json')),
      readdir(componentsDir),
    ])
    const pages = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''))
      .sort()

    /* The existing meta check only proves entries resolve to files. Without this
       reverse direction a new component page can exist, build, and never appear
       in the sidebar — which is exactly how hero-aurora and hero-kinetic went
       missing. */
    expect([...(meta.pages ?? [])].sort()).toEqual(pages)
  })

  it('keeps docs navigation metadata pointed at real pages', async () => {
    await expectMetaEntriesResolve(path.join(repoRoot, 'content', 'docs'))
  })

  it('keeps blog routes wired to shared chrome and complete metadata', async () => {
    const [layoutSource, indexSource, postSource, sitemapSource] = await Promise.all([
      readFile(path.join(repoRoot, 'src/app/blog/layout.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/blog/page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/blog/[slug]/page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/sitemap.ts'), 'utf8'),
    ])
    const { blogDescription, blogTitle } = await import('../../src/lib/site')

    expect(layoutSource).toContain('<SiteFooter />')
    expect(indexSource).toContain("namespace: 'Blog'")
    expect(indexSource).toContain("t('metadataTitle')")
    expect(indexSource).toContain("t('metadataDescription')")
    expect(indexSource).toContain('blogSource.getPages(locale)')
    expect(indexSource).not.toContain(blogDescription)
    expect(blogTitle).toBe('Payload CMS block and installer guides')
    expect(blogDescription).toContain('Payload CMS v3 guides')
    expect(indexSource).toContain('href="/components"')
    expect(indexSource).toContain("href: '/docs/installation'")
    expect(indexSource).toContain("href: '/docs/payload-blocks'")
    expect(indexSource).toContain("href: '/blog/anatomy-of-an-install'")
    expect(indexSource).toContain('data-guide-gateway')
    expect(indexSource).toContain("localeAlternates('/blog')")
    expect(collapse(indexSource)).toContain("twitter: { card: 'summary_large_image'")
    expect(postSource).toContain("type: 'article'")
    expect(postSource).toContain('publishedTime:')
    expect(collapse(postSource)).toContain("twitter: { card: 'summary_large_image'")
    expect(sitemapSource).toContain("blogSource.getPages('en')")
  })

  it('publishes truthful sitemap freshness and a canonical RSS feed', async () => {
    const blogPages = [
      {
        data: {
          author: 'Ducksss',
          date: '2026-06-18',
          description: 'A quick hello & source-backed introduction.',
          title: 'Hello — and why I built Payload Components',
        },
        url: '/blog/hello',
      },
      {
        data: {
          author: 'Ducksss',
          date: '2026-06-19',
          description: 'The pipeline, patching, and reviewable diff.',
          title: 'Anatomy of an install',
        },
        url: '/blog/anatomy-of-an-install',
      },
    ]
    const sourceMock = () => ({
      source: { getPages: () => [{ url: '/docs' }] },
    })
    const blogSourceMock = () => ({
      blogSource: { getPages: () => blogPages },
      getBlogPages: () => [...blogPages].reverse(),
    })

    vi.doMock('@/lib/source', sourceMock)
    vi.doMock(path.join(repoRoot, 'src/lib/source.ts'), sourceMock)
    vi.doMock('@/lib/blog-source', blogSourceMock)
    vi.doMock(path.join(repoRoot, 'src/lib/blog-source.ts'), blogSourceMock)

    const [{ default: sitemap }, feedModule] = await Promise.all([
      import('../../src/app/sitemap'),
      import('../../src/app/feed.xml/route'),
    ])
    const { siteUrl } = await import('../../src/lib/site')

    const entries = sitemap()
    const home = entries.find((entry) => entry.url === `${siteUrl}/`)
    const docs = entries.find((entry) => entry.url === `${siteUrl}/docs`)
    const blogPost = entries.find((entry) => entry.url === `${siteUrl}/blog/hello`)

    expect(home?.lastModified).toBeUndefined()
    expect(docs?.lastModified).toBeUndefined()
    expect(blogPost?.lastModified).toEqual(new Date('2026-06-18'))

    expect(feedModule.escapeXml(`<tag attr="value">Tom & Jerry's</tag>`)).toBe(
      '&lt;tag attr=&quot;value&quot;&gt;Tom &amp; Jerry&apos;s&lt;/tag&gt;',
    )

    const response = feedModule.GET()
    const body = await response.text()

    expect(response.headers.get('content-type')).toContain('application/rss+xml')
    expect(body).toContain('<rss version="2.0"')
    expect(body).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"')
    expect(body).toContain(`<link>${siteUrl}/blog</link>`)
    expect(body).toContain(`<atom:link href="${siteUrl}/feed.xml" rel="self"`)
    expect(body).toContain(`<guid isPermaLink="true">${siteUrl}/blog/hello</guid>`)
    expect(body).toContain('<dc:creator>Ducksss</dc:creator>')
    expect(body.indexOf('/blog/anatomy-of-an-install')).toBeLessThan(body.indexOf('/blog/hello'))
    expect(body).toContain(`<lastBuildDate>${new Date('2026-06-19').toUTCString()}</lastBuildDate>`)
  })

  it('keeps AI-readable source maps aligned with blog and feed surfaces', async () => {
    const [llmsModule, llmsFullSource] = await Promise.all([
      import('../../src/app/llms.txt/route'),
      readFile(path.join(repoRoot, 'src/app/llms-full.txt/route.ts'), 'utf8'),
    ])
    const { siteUrl } = await import('../../src/lib/site')

    const llmsBody = await (await llmsModule.GET()).text()

    expect(llmsBody).toContain(`- [Blog](${siteUrl}/blog)`)
    expect(llmsBody).toContain(`- [Updates feed](${siteUrl}/feed.xml)`)
    expect(llmsBody).toContain(`- [AI discovery guide](${siteUrl}/docs/ai-discovery)`)
    expect(llmsFullSource).toContain("'## Blog'")
    expect(llmsFullSource).toContain('getBlogLLMText')
  })

  it('builds canonical Blog and BlogPosting structured data', async () => {
    const [{ blogNode, blogPostingNode }, { blogTitle, siteUrl }] = await Promise.all([
      import('../../src/lib/structured-data'),
      import('../../src/lib/site'),
    ])

    expect(blogNode()).toMatchObject({
      '@id': `${siteUrl}/blog#blog`,
      '@type': 'Blog',
      name: blogTitle,
      url: `${siteUrl}/blog`,
    })

    expect(
      blogPostingNode({
        author: 'Ducksss',
        date: new Date('2026-06-18'),
        description: 'A source-backed introduction.',
        title: 'Hello',
        url: '/blog/hello',
      }),
    ).toMatchObject({
      '@id': `${siteUrl}/blog/hello#article`,
      '@type': 'BlogPosting',
      author: expect.objectContaining({ '@type': 'Person', name: 'Ducksss' }),
      datePublished: '2026-06-18T00:00:00.000Z',
      headline: 'Hello',
      isPartOf: { '@id': `${siteUrl}/blog#blog` },
      mainEntityOfPage: `${siteUrl}/blog/hello`,
    })
  })

  it('keeps the family navigator as the final section on component docs', async () => {
    const componentDocsDir = path.join(repoRoot, 'content', 'docs', 'components')
    const componentDocs = (await readdir(componentDocsDir)).filter((entry) =>
      entry.endsWith('.mdx'),
    )

    for (const entry of componentDocs) {
      const source = await readFile(path.join(componentDocsDir, entry), 'utf8')
      if (!source.includes('<ComponentFamily')) continue

      expect(source.trim(), entry).toMatch(/<ComponentFamily slug="[^"]+" \/>$/)
    }
  })

  it('keeps catalog search local and docs copy factual', async () => {
    const catalog = await readFile(
      path.join(repoRoot, 'src/components/site/ComponentCatalogBrowser.tsx'),
      'utf8',
    )
    const catalogPage = await readFile(path.join(repoRoot, 'src/app/components/page.tsx'), 'utf8')
    const registry = await readFile(path.join(repoRoot, 'content/docs/registry.mdx'), 'utf8')
    const {
      catalogBlocksGuideLinkLabel,
      catalogDescription,
      catalogInstallationLinkLabel,
      catalogMetadataDescription,
      catalogMetadataTitle,
      catalogTitle,
    } = await import('../../src/lib/site')
    expect(catalog).toContain('value={localQuery}')
    expect(catalog).toContain('window.history.replaceState')
    expect(catalog).toContain("window.addEventListener('popstate'")
    expect(registry).not.toContain('sample content for docs and testing')
    expect(catalogTitle).toBe('77 Payload CMS components and typed blocks')
    expect(catalogDescription).toMatch(
      /heroes.*features.*pricing.*integrations.*stats.*FAQs.*content.*teams.*embeds.*footers/,
    )
    expect(catalogDescription).toContain('Browse all 77')
    expect(catalogDescription).toContain('installable Payload CMS components')
    expect(catalogDescription).toContain('One CLI command')
    expect(catalogMetadataTitle).toContain('Payload CMS Components')
    expect(catalogMetadataTitle).toContain('77')
    expect(catalogMetadataDescription).toContain('npx payload-components add <component>')
    expect(catalogMetadataDescription).toContain('collection')
    expect(catalogMetadataDescription).toContain('renderer')
    expect(catalogMetadataDescription).toContain('generated types')
    expect(catalogMetadataDescription).toContain('admin import map')
    expect(catalogPage).toContain('href="/docs/installation"')
    expect(catalogPage).toContain("{t('installation')}")
    expect(catalogInstallationLinkLabel).toContain('one-command installation')
    expect(catalogPage).toContain('href="/docs/payload-blocks"')
    expect(catalogPage).toContain("{t('blocksGuide')}")
    expect(catalogBlocksGuideLinkLabel).toContain('config to live page')
  })

  it('gives nearby search surfaces distinct jobs and routes catalog intent to components', async () => {
    const [aboutPage, blogPage, docsIndex, installationGuide, homepage] = await Promise.all([
      readFile(path.join(repoRoot, 'src/app/about/page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/blog/page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'content/docs/index.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content/docs/installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/lib/site.ts'), 'utf8'),
    ])
    const { blogTitle, catalogMetadataTitle, homeMetadataTitle } =
      await import('../../src/lib/site')

    expect(homeMetadataTitle).toBe('Payload Components: Wired Payload CMS Blocks in One Command')
    expect(blogTitle).toBe('Payload CMS block and installer guides')
    expect(catalogMetadataTitle).toBe('77 Payload CMS Components & Blocks | Catalog')
    expect(docsIndex).toContain('seoTitle: CLI setup and architecture')
    expect(docsIndex).toContain('title="Build and wire a block" href="/docs/payload-blocks"')

    for (const source of [aboutPage, blogPage, docsIndex, installationGuide, homepage]) {
      expect(source).toContain('/components')
    }
  })

  it('keeps catalog page-block count copy aligned with installable components', async () => {
    const { componentFamilies, componentsIntro } = await import('../../src/lib/site')
    const aboutPage = await readFile(path.join(repoRoot, 'src', 'app', 'about', 'page.tsx'), 'utf8')

    expect(componentFamilies.pages.countLabel).toBe('Installable')
    expect(componentFamilies.posts.countLabel).toBe('In development')
    expect(componentsIntro).toContain('No screenshots')
    expect(`${componentsIntro}\n${aboutPage}`).not.toContain('Fifty-three page blocks')
  })

  it('does not export stale numeric catalog counts from public site data', async () => {
    const site = await import('../../src/lib/site')

    expect('installablePageCount' in site).toBe(false)
    expect('upcomingPostCount' in site).toBe(false)
  })

  it('makes the first-block guide a specific Payload CMS v3 install entry', async () => {
    const firstBlock = await readFile(path.join(repoRoot, 'content/docs/first-block.mdx'), 'utf8')

    expect(firstBlock).toContain('title: Use your first Payload CMS v3 block')
    expect(firstBlock).toContain('seoTitle: Build your first Payload CMS v3 block')
    expect(firstBlock).toContain(
      'description: Install a typed Payload CMS v3 block, add it in the admin, publish the page, and verify the first-block workflow from editor to frontend.',
    )
    expect(firstBlock).toContain('command="npx payload-components add feature-grid-basic"')
    expect(firstBlock).toContain('label="Copy the feature-grid-basic install command"')
    expect(firstBlock).toContain('trackInstall')
    expect(firstBlock.indexOf('<RunnableCommand')).toBeLessThan(firstBlock.indexOf('<Steps>'))
  })

  it('keeps product-surface consistency contracts explicit', async () => {
    const [firstBlock, installation, aboutPage, siteSource, docsLayout] = await Promise.all([
      readFile(path.join(repoRoot, 'content/docs/first-block.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'content/docs/installation.mdx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/about/page.tsx'), 'utf8'),
      readFile(path.join(repoRoot, 'src/lib/site.ts'), 'utf8'),
      readFile(path.join(repoRoot, 'src/app/docs/layout.tsx'), 'utf8'),
    ])
    expect(firstBlock).toContain('href="/components"')
    expect(firstBlock).not.toContain('href="/docs/components"')

    const stages = [
      'registry-build',
      'registry-add',
      'dependency-install',
      'fragment-apply',
      'post-install',
    ]
    const stagePositions = stages.map((stage) => installation.indexOf(stage))
    expect(stagePositions.every((position) => position >= 0)).toBe(true)
    expect(stagePositions).toEqual([...stagePositions].sort((a, b) => a - b))
    expect(installation).toContain('seoTitle: Install Payload CMS blocks with the CLI')
    expect(installation).toContain(
      'description: Install typed blocks in Payload CMS v3 with the Payload Components CLI.',
    )
    expect(installation).toContain('Run `npx payload-components add <component>`')
    expect(installation).toContain("direct `shadcn add` only copies the block's source files")
    expect(installation).not.toContain('sample content')

    expect(aboutPage).toContain('pipelineStages.map')
    expect(aboutPage).not.toMatch(/const pipelineStages\s*=/)
    expect(siteSource).toContain('export const pipelineStages')

    const { cliVersion, terminalDemoLines } = await import('../../src/lib/site')
    const packageJson = await readJson<{ version: string }>(path.join(repoRoot, 'package.json'))
    const heroManifest = await readJson<{ version: string }>(
      path.join(repoRoot, 'payload-components', 'manifests', 'hero-basic.json'),
    )
    expect(cliVersion).toBe(packageJson.version)
    expect(
      terminalDemoLines.some((line) => line.text.includes(`hero-basic@${heroManifest.version}`)),
    ).toBe(true)
    if (heroManifest.version !== cliVersion) {
      expect(terminalDemoLines.some((line) => line.text.includes(`hero-basic@${cliVersion}`))).toBe(
        false,
      )
    }
    expect(docsLayout).toContain("t('versionBanner', { version: cliVersion })")
    expect(docsLayout).not.toMatch(/components v\d+\.\d+\.\d+/)
  })

  it('publishes production-safe fallback URLs when no site URL env is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined)
    vi.resetModules()
    const sourceMock = () => ({
      getLLMText: vi.fn(() => '# Mock docs (/docs)'),
      source: {
        getPages: () => [{ url: '/docs' }],
      },
    })
    vi.doMock('@/lib/source', sourceMock)
    vi.doMock(path.join(repoRoot, 'src/lib/source.ts'), sourceMock)
    vi.doMock('collections/server', () => ({
      docs: { toFumadocsSource: () => ({}) },
      blog: [],
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
      const expectedHrefAttribute = renderToStaticMarkup(
        createElement('a', { href: project.url }),
      ).match(/href="[^"]+"/)?.[0]

      expect(markup.split(expectedHrefAttribute ?? '').length - 1).toBe(2)
      expect(markup.split(expectedLabelAttribute ?? '').length - 1).toBe(2)
    }
  })
})
