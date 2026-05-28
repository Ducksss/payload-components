import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  docsNavigation,
  getDocsPageByPath,
  getDocsPagePaths,
} from '@/content/docs'

const repoRoot = process.cwd()

const readProjectFile = (filePath: string) =>
  fs.readFileSync(path.join(repoRoot, filePath), 'utf8')

const readMdxFrontmatter = (filePath: string) => {
  const source = readProjectFile(filePath)
  const frontmatter = source.match(/^---\n(?<body>[\s\S]*?)\n---/)

  expect(frontmatter?.groups?.body).toBeDefined()

  return Object.fromEntries(
    frontmatter!.groups!.body
      .split('\n')
      .map((line) => {
        const separatorIndex = line.indexOf(':')

        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1).trim()]
      }),
  ) as Record<string, string>
}

describe('documentation content contract', () => {
  it('publishes the core docs routes that explain the Payload kit install surface', () => {
    expect(getDocsPagePaths()).toEqual([
      '/docs',
      '/docs/getting-started',
      '/docs/kits/hero-basic',
      '/docs/kits/feature-grid-basic',
      '/docs/kits/post-card',
      '/docs/kits/post-archive',
      '/docs/kits/post-hero',
      '/docs/kits/featured-post',
      '/docs/kits/post-list',
      '/docs/kits/author-card',
      '/docs/kits/newsletter-callout',
      '/docs/kits/related-posts',
      '/docs/reference/registry-contract',
      '/docs/reference/shadcn-directory',
    ])
  })

  it('keeps kit documentation tied to the actual install commands and source files', () => {
    expect(getDocsPageByPath('/docs/kits/hero-basic')).toMatchObject({
      description: expect.stringContaining('hero-basic'),
      sourceFile: 'content/docs/kits/hero-basic.mdx',
      title: 'Hero Basic',
    })

    expect(getDocsPageByPath('/docs/kits/hero-basic')?.answerReadyFacts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('payload-kit add hero-basic'),
        expect.stringContaining('HeroBasic'),
      ]),
    )

    expect(getDocsPageByPath('/docs/kits/feature-grid-basic')).toMatchObject({
      description: expect.stringContaining('feature-grid-basic'),
      sourceFile: 'content/docs/kits/feature-grid-basic.mdx',
      title: 'Feature Grid Basic',
    })

    expect(getDocsPageByPath('/docs/kits/post-card')).toMatchObject({
      description: expect.stringContaining('post-card'),
      sourceFile: 'content/docs/kits/post-card.mdx',
      title: 'Post Card',
    })

    expect(getDocsPageByPath('/docs/kits/post-card')?.answerReadyFacts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('shadcn@latest add https://payload-components.xyz/r/post-card.json'),
        expect.stringContaining('shadcn-native'),
      ]),
    )
  })

  it('keeps every public docs metadata entry backed by a Fumadocs MDX source file', () => {
    for (const docsPath of getDocsPagePaths()) {
      const page = getDocsPageByPath(docsPath)

      expect(page?.sourceFile).toMatch(/^content\/docs\/.+\.mdx$/)
      expect(fs.existsSync(path.join(repoRoot, page?.sourceFile ?? ''))).toBe(true)
    }
  })

  it('keeps Fumadocs MDX frontmatter aligned with the SEO and LLM metadata source', () => {
    for (const docsPath of getDocsPagePaths()) {
      const page = getDocsPageByPath(docsPath)
      expect(page).toBeDefined()

      const frontmatter = readMdxFrontmatter(page!.sourceFile)

      expect(frontmatter.title).toBe(page!.title)
      expect(frontmatter.description).toBe(page!.description)
    }
  })

  it('uses Fumadocs as the docs route renderer and source loader', () => {
    expect(readProjectFile('source.config.ts')).toContain("defineDocs")
    expect(readProjectFile('src/lib/source.ts')).toContain("docs.toFumadocsSource()")
    expect(readProjectFile('src/components/mdx.tsx')).toContain("fumadocs-ui/mdx")
    expect(readProjectFile('src/lib/layout.shared.tsx')).toContain("BaseLayoutProps")

    expect(readProjectFile('src/app/(frontend)/docs/layout.tsx')).toContain(
      "fumadocs-ui/layouts/docs",
    )
    expect(readProjectFile('src/app/(frontend)/docs/[[...slug]]/page.tsx')).toContain(
      "fumadocs-ui/layouts/docs/page",
    )
    expect(readProjectFile('next.config.ts')).toContain("fumadocs-mdx/next")
  })

  it('keeps the Fumadocs page tree ordered for humans and shadcn review context', () => {
    const rootMeta = JSON.parse(readProjectFile('content/docs/meta.json')) as {
      pages: string[]
      title: string
    }

    expect(rootMeta).toEqual({
      pages: [
        'index',
        'getting-started',
        '---Kits---',
        'kits/hero-basic',
        'kits/feature-grid-basic',
        'kits/post-card',
        'kits/post-archive',
        'kits/post-hero',
        'kits/featured-post',
        'kits/post-list',
        'kits/author-card',
        'kits/newsletter-callout',
        'kits/related-posts',
        '---Reference---',
        'reference/registry-contract',
        'reference/shadcn-directory',
      ],
      title: 'Payload Kits Docs',
    })
  })

  it('groups pages into a concise public documentation navigation model', () => {
    expect(docsNavigation).toEqual([
      {
        pages: ['/docs', '/docs/getting-started'],
        title: 'Start',
      },
      {
        pages: [
          '/docs/kits/hero-basic',
          '/docs/kits/feature-grid-basic',
          '/docs/kits/post-card',
          '/docs/kits/post-archive',
          '/docs/kits/post-hero',
          '/docs/kits/featured-post',
          '/docs/kits/post-list',
          '/docs/kits/author-card',
          '/docs/kits/newsletter-callout',
          '/docs/kits/related-posts',
        ],
        title: 'Kits',
      },
      {
        pages: ['/docs/reference/registry-contract', '/docs/reference/shadcn-directory'],
        title: 'Reference',
      },
    ])
  })
})
