import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { grantConsent } from './consent'

import { blogTitle } from '../../src/lib/site'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const blogRoot = path.resolve(import.meta.dirname, '../../content/blog')

type Post = {
  cover: string
  date: string
  figures: string[]
  order: number
  series: string
  slug: string
  title: string
}

const scalar = (frontmatter: string, name: string) =>
  frontmatter
    .match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '') ?? ''

const posts: Post[] = readdirSync(blogRoot)
  .filter((filename) => filename.endsWith('.mdx'))
  .map((filename) => {
    const source = readFileSync(path.join(blogRoot, filename), 'utf8')
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    const cover = frontmatter.match(/^cover:\s*\r?\n(?:\s{2}.+\r?\n?)+/m)?.[0] ?? ''
    return {
      cover: scalar(cover.replace(/^\s{2}/gm, ''), 'src'),
      date: scalar(frontmatter, 'date'),
      figures: [...source.matchAll(/<BlogFigure[\s\S]*?src="([^"]+)"[\s\S]*?\/>/g)].map(
        (match) => match[1],
      ),
      order: Number(scalar(frontmatter, 'publicationOrder')),
      series: scalar(frontmatter, 'series'),
      slug: filename.replace(/\.mdx$/, ''),
      title: scalar(frontmatter, 'title'),
    }
  })
  .sort((a, b) => {
    const dateDifference = new Date(b.date).getTime() - new Date(a.date).getTime()
    return dateDifference || a.order - b.order
  })

/* Analytics consent granted for the whole file: these specs interact with the
   page, and the undecided-state banner is fixed to the bottom of the viewport
   where it could intercept clicks. The banner has its own spec, and the axe
   suites deliberately run without consent so it is still held to the a11y bar. */
test.beforeEach(async ({ context }) => grantConsent(context))

test.describe('Blog editorial library', () => {
  test('the index publishes all posts in deterministic order', async ({ page }) => {
    await page.goto(`${baseURL}/blog`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(blogTitle)
    await expect(page).toHaveTitle(new RegExp(blogTitle))
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Practical Payload CMS v3 guides/,
    )

    const cards = page.locator('[data-blog-card]')
    await expect(cards).toHaveCount(33)
    await expect(cards.locator('h2')).toHaveText(posts.map((post) => post.title))
    await expect(cards.locator('img').nth(2)).not.toHaveAttribute('loading', 'lazy')
    await expect(cards.locator('img').nth(3)).toHaveAttribute('loading', 'lazy')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/blog`)

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true)
  })

  test('every article renders complete shared chrome, metadata, figures, and related reading', async ({
    page,
  }) => {
    for (const post of posts) {
      await page.goto(`${baseURL}/blog/${post.slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${baseURL}/blog/${post.slug}`,
      )
      await expect(page.locator('[data-blog-cover]')).toHaveAttribute('src', /cover\.webp/)
      await expect(page.locator('[data-blog-cover]')).toHaveJSProperty('complete', true)

      const figures = page.locator('article [data-blog-figure]')
      await expect(figures).toHaveCount(post.figures.length)
      await expect(figures.locator('figcaption')).toHaveCount(post.figures.length)
      await expect(page.getByRole('heading', { level: 2, name: 'Related reading' })).toBeVisible()
      const relatedSection = page.locator('[aria-labelledby="related-posts-title"]')
      const relatedCards = relatedSection.locator('[data-blog-card]')
      const availableInSeries = posts.filter(
        (candidate) => candidate.slug !== post.slug && candidate.series === post.series,
      ).length
      await expect(relatedCards).toHaveCount(3)
      await expect(
        relatedSection.locator(`[data-blog-card][data-blog-series="${post.series}"]`),
      ).toHaveCount(Math.min(3, availableInSeries))

      const socialImage = `${baseURL}/og/blog/${post.slug}/image.png`
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        socialImage,
      )
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        socialImage,
      )

      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
      const nodes = jsonLd.flatMap((source) => {
        const parsed = JSON.parse(source) as { '@graph'?: Array<Record<string, unknown>> }
        return parsed['@graph'] ?? [parsed]
      })
      const posting = nodes.find((node) => node['@type'] === 'BlogPosting')
      expect(posting).toMatchObject({
        datePublished: new Date(post.date).toISOString(),
        headline: post.title,
        url: `${baseURL}/blog/${post.slug}`,
      })

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true)
    }
  })

  test('every committed blog image responds successfully', async ({ request }) => {
    const assets = posts.flatMap((post) => [post.cover, ...post.figures])
    expect(new Set(assets).size).toBe(69)

    for (const asset of assets) {
      const response = await request.get(`${baseURL}${asset}`)
      expect(response.ok(), asset).toBe(true)
      expect(response.headers()['content-type'], asset).toMatch(/^image\/(?:svg\+xml|webp)/)
    }
  })

  test('RSS contains 33 unique canonical entries in publication order', async ({ request }) => {
    const response = await request.get(`${baseURL}/blog/rss.xml`)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/rss+xml')

    const body = await response.text()
    const guids = [...body.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/g)].map(
      (match) => match[1],
    )
    const dates = [...body.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((match) => match[1])
    const enclosures = [
      ...body.matchAll(/<enclosure url="([^"]+)" length="(\d+)" type="image\/webp" \/>/g),
    ]

    expect(guids).toEqual(posts.map((post) => `${baseURL}/blog/${post.slug}`))
    expect(new Set(guids).size).toBe(33)
    expect(dates).toEqual(posts.map((post) => new Date(post.date).toUTCString()))
    expect(enclosures).toHaveLength(33)
  })

  test('every post-specific Open Graph endpoint returns a 1200 by 630 PNG', async ({ request }) => {
    for (const post of posts) {
      const response = await request.get(`${baseURL}/og/blog/${post.slug}/image.png`)
      expect(response.ok(), post.slug).toBe(true)
      expect(response.headers()['content-type'], post.slug).toContain('image/png')

      const body = await response.body()
      expect(body.subarray(1, 4).toString('ascii'), post.slug).toBe('PNG')
      expect(body.readUInt32BE(16), post.slug).toBe(1200)
      expect(body.readUInt32BE(20), post.slug).toBe(630)
    }
  })
})
