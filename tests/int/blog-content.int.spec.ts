import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const blogRoot = path.join(repoRoot, 'content', 'blog')

const expectedSlugs = [
  'hello',
  'anatomy-of-an-install',
  'what-is-a-payload-cms-block',
  'build-first-payload-v3-landing-page',
  'production-ready-payload-block-config',
  'how-renderblocks-works',
  'payload-types-and-import-map',
  'payload-block-not-rendering',
  'copying-is-not-installing',
  'shadcn-registry-for-payload-cms',
  'manifest-wiring-contract',
  'text-anchors-vs-ast',
  'idempotent-code-installer',
  'payload-components-doctor',
  'component-variants-without-prop-explosion',
  'shared-fields-across-component-families',
  'choosing-payload-hero',
  'editor-friendly-feature-sections',
  'modeling-pricing-pages',
  'social-proof-sections',
  'build-saas-homepage',
  'build-payload-blog-frontend',
  'accessible-faq-blocks',
  'safe-links-forms-embeds',
  'motion-without-performance-cost',
  'type-safe-block-rendering',
  'demo-twins',
  'visual-regression-component-registry',
  'contribute-payload-component',
  'reproducible-shadcn-registry',
  'open-source-provenance',
  'community-driven-roadmap',
  'templates-are-here',
] as const

const newPostMinimumWords: Readonly<Record<string, number>> = {
  'what-is-a-payload-cms-block': 1200,
  'build-first-payload-v3-landing-page': 1200,
  'production-ready-payload-block-config': 1000,
  'how-renderblocks-works': 1000,
  'payload-types-and-import-map': 1000,
  'payload-block-not-rendering': 1200,
  'copying-is-not-installing': 1000,
  'shadcn-registry-for-payload-cms': 1000,
  'manifest-wiring-contract': 1000,
  'text-anchors-vs-ast': 1000,
  'idempotent-code-installer': 1000,
  'payload-components-doctor': 1000,
  'component-variants-without-prop-explosion': 1000,
  'shared-fields-across-component-families': 1000,
  'choosing-payload-hero': 1200,
  'editor-friendly-feature-sections': 1200,
  'modeling-pricing-pages': 1200,
  'social-proof-sections': 1200,
  'build-saas-homepage': 1200,
  'build-payload-blog-frontend': 1200,
  'accessible-faq-blocks': 1200,
  'safe-links-forms-embeds': 1200,
  'motion-without-performance-cost': 1200,
  'type-safe-block-rendering': 1200,
  'demo-twins': 800,
  'visual-regression-component-registry': 800,
  'contribute-payload-component': 1000,
  'reproducible-shadcn-registry': 800,
  'open-source-provenance': 800,
  'community-driven-roadmap': 800,
  'templates-are-here': 800,
}

const allowedSeries = new Set([
  'project-notes',
  'foundations',
  'installer-internals',
  'component-design',
  'production-guides',
  'open-source',
])

type BlogMetadata = {
  author?: unknown
  cover?: { alt?: unknown; src?: unknown }
  date?: unknown
  publicationOrder?: unknown
  series?: unknown
  tags?: unknown
}

type BlogFile = {
  metadata: BlogMetadata
  slug: string
  source: string
}

function scalar(frontmatter: string, name: string) {
  return frontmatter
    .match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '')
}

function parseBlogFile(slug: string, source: string): BlogFile {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const coverBlock = frontmatter.match(/^cover:\s*\r?\n((?:\s{2}.+\r?\n?)+)/m)?.[1] ?? ''
  const tagsBlock = frontmatter.match(/^tags:\s*\r?\n((?:\s{2}-\s+.+\r?\n?)+)/m)?.[1] ?? ''

  return {
    slug,
    source,
    metadata: {
      author: scalar(frontmatter, 'author'),
      cover: {
        alt: scalar(coverBlock.replace(/^\s{2}/gm, ''), 'alt'),
        src: scalar(coverBlock.replace(/^\s{2}/gm, ''), 'src'),
      },
      date: scalar(frontmatter, 'date'),
      publicationOrder: Number(scalar(frontmatter, 'publicationOrder')),
      series: scalar(frontmatter, 'series'),
      tags: tagsBlock
        .split(/\r?\n/)
        .map((line) =>
          line
            .match(/^\s{2}-\s+(.+)$/)?.[1]
            ?.trim()
            .replace(/^['"]|['"]$/g, ''),
        )
        .filter(Boolean),
    },
  }
}

async function getBlogFiles() {
  const filenames = (await readdir(blogRoot)).filter((filename) => filename.endsWith('.mdx'))
  return Promise.all(
    filenames.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      return parseBlogFile(slug, await readFile(path.join(blogRoot, filename), 'utf8'))
    }),
  )
}

function articleBody(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function wordCount(source: string) {
  return articleBody(source)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[`*_>#|{}\[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function getAttribute(source: string, attribute: string) {
  return source.match(new RegExp(`\\b${attribute}="([^"]+)"`))?.[1]
}

function webpDimensions(buffer: Buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Not a WebP image')
  }

  let offset = 12
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString('ascii', offset, offset + 4)
    const length = buffer.readUInt32LE(offset + 4)
    const data = offset + 8

    if (chunk === 'VP8X') {
      return {
        width: buffer.readUIntLE(data + 4, 3) + 1,
        height: buffer.readUIntLE(data + 7, 3) + 1,
      }
    }
    if (chunk === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      }
    }
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(data + 1)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }

    offset = data + length + (length % 2)
  }

  throw new Error('WebP dimensions not found')
}

async function expectAsset(assetPath: string, kind: 'cover' | 'figure') {
  const absolutePath = path.join(repoRoot, 'public', assetPath.replace(/^\//, ''))
  const info = await stat(absolutePath)
  const extension = path.extname(absolutePath)

  if (extension === '.webp') {
    const dimensions = webpDimensions(await readFile(absolutePath))
    expect(dimensions, assetPath).toEqual(
      kind === 'cover' ? { height: 630, width: 1200 } : { height: 900, width: 1600 },
    )
    expect(info.size, assetPath).toBeLessThanOrEqual(kind === 'cover' ? 250 * 1024 : 350 * 1024)
    return
  }

  expect(extension, assetPath).toBe('.svg')
  const source = await readFile(absolutePath, 'utf8')
  expect(source, assetPath).toMatch(/viewBox="0 0 1200 675"/)
  expect(info.size, assetPath).toBeLessThanOrEqual(150 * 1024)
}

function internalLinks(source: string) {
  const links = [...source.matchAll(/(?:\]\(|href=")((?:\/(?!\/)|#)[^\s"\)]*)/g)].map(
    (match) => match[1],
  )
  return [...new Set(links)]
}

async function expectInternalLinkToResolve(link: string) {
  if (link.startsWith('#') || link.startsWith('/r/')) return

  const pathname = link.split(/[?#]/)[0]
  if (pathname === '/' || ['/about', '/brand-guide', '/components'].includes(pathname)) return

  if (pathname.startsWith('/blog/')) {
    expect(expectedSlugs, link).toContain(pathname.slice('/blog/'.length))
    return
  }

  if (pathname === '/templates') return
  if (pathname.startsWith('/templates/')) {
    const slug = pathname.slice('/templates/'.length)
    expect(slug, link).toMatch(/^[a-z0-9-]+$/)
    await expect(
      stat(path.join(repoRoot, 'src', 'lib', 'templates', `${slug}.ts`)),
      link,
    ).resolves.toBeTruthy()
    return
  }

  if (pathname === '/docs') return
  if (pathname.startsWith('/docs/')) {
    const relative = pathname.slice('/docs/'.length)
    const candidates = [
      path.join(repoRoot, 'content', 'docs', `${relative}.mdx`),
      path.join(repoRoot, 'content', 'docs', relative, 'index.mdx'),
    ]
    const resolved = await Promise.all(
      candidates.map((candidate) =>
        stat(candidate)
          .then(() => true)
          .catch(() => false),
      ),
    )
    expect(resolved.some(Boolean), link).toBe(true)
    return
  }

  throw new Error(`Unhandled internal link: ${link}`)
}

describe('blog editorial contract', () => {
  it('publishes the approved 33-post library in deterministic order', async () => {
    const files = await getBlogFiles()
    const slugs = files.map((file) => file.slug)
    const metadata = files.map((file) => file.metadata)

    expect(new Set(slugs)).toEqual(new Set(expectedSlugs))
    expect(
      metadata.map((entry) => entry.publicationOrder).sort((a, b) => Number(a) - Number(b)),
    ).toEqual(Array.from({ length: 33 }, (_, index) => index + 1))

    for (const entry of metadata) {
      expect(entry.author).toBe('Ducksss')
      expect(entry.date).toBeTruthy()
      expect(allowedSeries.has(String(entry.series))).toBe(true)
      expect(entry.tags).toEqual(expect.any(Array))
      expect((entry.tags as unknown[]).length).toBeGreaterThanOrEqual(2)
      expect((entry.tags as unknown[]).length).toBeLessThanOrEqual(4)
      expect(entry.cover?.src).toEqual(expect.stringMatching(/^\/blog\/[a-z0-9-]+\/cover\.webp$/))
      expect(String(entry.cover?.alt).trim().length).toBeGreaterThanOrEqual(20)
    }

    for (const file of files) {
      const order = Number(file.metadata.publicationOrder)
      const expectedDate =
        order === 1
          ? '2026-06-18'
          : order === 2
            ? '2026-06-19'
            : order === 33
              ? '2026-07-27'
              : '2026-07-14'
      expect(file.metadata.date, file.slug).toBe(expectedDate)
    }
  })

  it('ships every cover and exactly 36 captioned inline visuals', async () => {
    const files = await getBlogFiles()
    const referencedAssets = new Set<string>()
    let figureCount = 0

    for (const file of files) {
      const metadata = file.metadata
      referencedAssets.add(String(metadata.cover?.src).replace(/^\/blog\//, ''))
      await expectAsset(String(metadata.cover?.src), 'cover')

      const source = file.source
      const figures = [...source.matchAll(/<BlogFigure\s+([\s\S]*?)\/>/g)].map((match) => match[1])
      figureCount += figures.length

      expect(figures.length, file.slug).toBeGreaterThanOrEqual(1)
      for (const figure of figures) {
        const src = getAttribute(figure, 'src')
        expect(src, file.slug).toMatch(
          /^\/blog\/[a-z0-9-]+\/figure-\d{2}-[a-z0-9-]+\.(?:svg|webp)$/,
        )
        expect(getAttribute(figure, 'alt')?.trim().length, src).toBeGreaterThanOrEqual(20)
        expect(getAttribute(figure, 'caption')?.trim().length, src).toBeGreaterThanOrEqual(20)
        referencedAssets.add(String(src).replace(/^\/blog\//, ''))
        await expectAsset(String(src), 'figure')
      }
    }

    expect(figureCount).toBe(36)
    const committedAssets = (
      await readdir(path.join(repoRoot, 'public', 'blog'), { recursive: true })
    )
      .filter((entry) => /\.(?:svg|webp)$/.test(entry))
      .map((entry) => entry.replaceAll(path.sep, '/'))
    expect(new Set(committedAssets)).toEqual(referencedAssets)
  })

  it('keeps the closest block articles linked once to the implementation guide', async () => {
    const guidePath = '/docs/payload-blocks'
    const articleSlugs = [
      'what-is-a-payload-cms-block',
      'build-first-payload-v3-landing-page',
      'how-renderblocks-works',
    ]

    for (const slug of articleSlugs) {
      const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
      const guideLinks = [...source.matchAll(/\]\(\/docs\/payload-blocks\)/g)]

      expect(guideLinks, slug).toHaveLength(1)
      expect(internalLinks(source), slug).toContain(guidePath)
    }
  })

  it('keeps every new post substantial, linked, and community-first', async () => {
    const registry = JSON.parse(
      await readFile(path.join(repoRoot, 'payload-components', 'registry.json'), 'utf8'),
    ) as { items: Array<{ name: string }> }
    const registryItems = new Set(registry.items.map((item) => item.name))

    for (const [slug, minimumWords] of Object.entries(newPostMinimumWords)) {
      const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
      const links = internalLinks(source)
      const installItems = [...source.matchAll(/npx payload-components add ([a-z0-9-]+)/g)].map(
        (match) => match[1],
      )

      expect(wordCount(source), slug).toBeGreaterThanOrEqual(minimumWords)
      expect(links.filter((link) => link.startsWith('/')).length, slug).toBeGreaterThanOrEqual(3)
      expect(installItems.length, slug).toBeGreaterThanOrEqual(1)
      expect(source, slug).not.toMatch(
        /\b(?:design partner|early access|paid tier|premium tier|buy now)\b/i,
      )

      for (const item of installItems)
        expect(registryItems.has(item), `${slug}: ${item}`).toBe(true)
      for (const link of links) await expectInternalLinkToResolve(link)
    }
  })
})
