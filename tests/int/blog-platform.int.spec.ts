import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { maintainerNote } from '../../src/lib/site'
import { blogPostingNode } from '../../src/lib/structured-data'

const repoRoot = path.resolve(import.meta.dirname, '../..')

async function read(relativePath: string) {
  return readFile(path.join(repoRoot, relativePath), 'utf8').catch(() => '')
}

describe('blog delivery platform', () => {
  it('links BlogPosting authors to the canonical maintainer profile', () => {
    const node = blogPostingNode({
      author: maintainerNote.name,
      datePublished: '2026-07-14',
      image: '/blog/hello/cover.webp',
      tags: ['community', 'Payload CMS'],
      title: 'Hello',
      url: '/blog/hello',
    })

    expect(node.author).toEqual({
      '@type': 'Person',
      name: maintainerNote.name,
      url: maintainerNote.href,
    })
  })

  it('defines the editorial frontmatter and deterministic related-post interfaces', async () => {
    const [sourceConfig, blog] = await Promise.all([
      read('source.config.ts'),
      read('src/lib/blog.ts'),
    ])

    for (const field of ['series', 'publicationOrder', 'cover', 'tags']) {
      expect(sourceConfig).toContain(`${field}:`)
    }

    expect(blog).toContain('export const blogSeries')
    expect(blog).toContain('export function sortBlogPages')
    expect(blog).toContain('export function getRelatedPosts')
    expect(blog).toContain('limit = 3')
  })

  it('renders image-led cards, captioned figures, and related posts', async () => {
    const [index, post, mdx, card, figure, related] = await Promise.all([
      read('src/app/[locale]/blog/page.tsx'),
      read('src/app/[locale]/blog/[slug]/page.tsx'),
      read('src/components/mdx.tsx'),
      read('src/components/blog/BlogCard.tsx'),
      read('src/components/blog/BlogFigure.tsx'),
      read('src/components/blog/RelatedPosts.tsx'),
    ])

    expect(index).toContain('<BlogCard')
    expect(post).toContain('<RelatedPosts')
    expect(post).toContain('page.data.cover')
    expect(mdx).toContain('BlogFigure')
    expect(card).toContain('next/image')
    expect(figure).toContain('<figcaption')
    expect(related).toContain('getRelatedPosts')
  })

  it('publishes post-specific social cards, BlogPosting JSON-LD, RSS, and discovery links', async () => {
    const [post, structuredData, og, rss, llms, sitemap] = await Promise.all([
      read('src/app/[locale]/blog/[slug]/page.tsx'),
      read('src/lib/structured-data.ts'),
      read('src/app/[locale]/og/blog/[slug]/image.png/route.tsx'),
      read('src/app/blog/rss.xml/route.ts'),
      read('src/app/llms.txt/route.ts'),
      read('src/app/sitemap.ts'),
    ])

    expect(post).toContain('blogPostingNode')
    expect(post).toContain('<JsonLd')
    expect(post).toContain('images: [')
    expect(structuredData).toContain('export function blogPostingNode')
    expect(structuredData).toContain("'@type': 'BlogPosting'")
    expect(og).toContain('new ImageResponse')
    expect(og).toContain('size = { height: 630, width: 1200 }')
    expect(rss).toContain("'content-type': 'application/rss+xml; charset=utf-8'")
    expect(rss).toContain('<enclosure')
    expect(llms).toContain('`- [Blog](${siteUrl}${blogRoute})`')
    expect(llms).toContain('`- [Blog RSS](${siteUrl}${blogRoute}/rss.xml)`')
    expect(sitemap).toContain('sortBlogPages')
  })
})
