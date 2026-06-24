import { expect, test, type Page } from '@playwright/test'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const githubRepoUrl = 'https://github.com/Ducksss/payload-components'

type StructuredDataNode = Record<string, unknown>

function isStructuredDataNode(value: unknown): value is StructuredDataNode {
  return typeof value === 'object' && value !== null
}

async function getStructuredData(page: Page) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? '').filter(Boolean))

  return scripts.flatMap((script) => {
    const value = JSON.parse(script) as unknown

    if (!isStructuredDataNode(value)) {
      return []
    }

    const graph = value['@graph']

    return Array.isArray(graph) ? graph.filter(isStructuredDataNode) : [value]
  })
}

function findStructuredData(
  nodes: StructuredDataNode[],
  type: string,
  matches: (node: StructuredDataNode) => boolean = () => true,
) {
  return nodes.find((node) => node['@type'] === type && matches(node))
}

test.describe('AI-readable documentation surfaces', () => {
  test('publishes crawl metadata, canonical URL, and JSON-LD', async ({ page, request }) => {
    const robots = await request.get(`${baseURL}/robots.txt`)

    expect(robots.ok()).toBe(true)
    expect(robots.headers()['content-type']).toContain('text/plain')

    const robotsBody = await robots.text()

    expect(robotsBody).toContain('Allow: /')
    expect(robotsBody).toContain('Disallow: /api/')
    expect(robotsBody).toContain(`Sitemap: ${baseURL}/sitemap.xml`)

    const sitemap = await request.get(`${baseURL}/sitemap.xml`, {
      headers: { 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
    })

    expect(sitemap.ok()).toBe(true)
    expect(sitemap.headers()['content-type']).toContain('application/xml')

    const sitemapBody = await sitemap.text()

    expect(sitemapBody).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/,
    )
    expect(sitemapBody).toContain(`<loc>${baseURL}/</loc>`)
    expect(sitemapBody).toContain(`<loc>${baseURL}/components</loc>`)
    expect(sitemapBody).toContain(`<loc>${baseURL}/payload-custom-components</loc>`)
    expect(sitemapBody).toContain(`<loc>${baseURL}/docs/installation</loc>`)

    await page.goto(baseURL)

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', baseURL)

    const jsonLdTexts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const schemaTypes = new Set<string>()

    for (const text of jsonLdTexts) {
      const jsonLd = JSON.parse(text) as {
        '@graph'?: Array<{ '@type'?: string | string[] }>
        '@type'?: string | string[]
      }
      const nodes = jsonLd['@graph'] ?? [jsonLd]

      for (const node of nodes) {
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]

        for (const type of types) {
          if (type) schemaTypes.add(type)
        }
      }
    }

    expect(schemaTypes.has('WebSite')).toBe(true)
    expect(schemaTypes.has('Organization')).toBe(true)
    expect(schemaTypes.has('SoftwareApplication')).toBe(true)
    expect(schemaTypes.has('FAQPage')).toBe(true)
  })

  test('/llms.txt publishes a concise text/plain source map', async ({ request }) => {
    const response = await request.get(`${baseURL}/llms.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Components')
    expect(body).toContain('Fumadocs')
    expect(body).toContain(`- [Home](${baseURL}/)`)
    expect(body).toContain(`- [Docs](${baseURL}/docs)`)
    expect(body).toContain(`- [Component catalog](${baseURL}/components)`)
    expect(body).toContain(`- [Payload custom components guide](${baseURL}/payload-custom-components)`)
    expect(body).toContain('A Payload custom component is installable when its source')
    expect(body).toContain(`- [Public registry](${baseURL}/r/registry.json)`)
    expect(body).toContain(`- [GitHub repository](${githubRepoUrl})`)
    expect(body).toContain('Hero Basic: npx payload-components add hero-basic')
  })

  test('/llms-full.txt includes compiled docs content', async ({ request }) => {
    const response = await request.get(`${baseURL}/llms-full.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Components')
    expect(body).toContain('# Introduction')
    expect(body).toContain('# Architecture')
    expect(body).toContain('## Payload custom components guide')
    expect(body).toContain('AI-readable surfaces')
    expect(body).toContain('The v2 app is intentionally not a Payload CMS site.')
    expect(body).toContain('npx payload-components add feature-grid-basic')
  })

  test('/api/search returns docs results', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/search?query=hero`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/json')

    const body = await response.text()

    expect(body).toContain('/docs/components/hero-basic')
  })

  test('docs expose per-page markdown and markdown negotiation', async ({ request }) => {
    const direct = await request.get(`${baseURL}/llms.mdx/docs/installation/content.md`)

    expect(direct.ok()).toBe(true)
    expect(direct.headers()['content-type']).toContain('text/markdown')
    await expect(direct.text()).resolves.toContain('# Installation (/docs/installation)')

    const suffix = await request.get(`${baseURL}/docs/installation.md`)

    expect(suffix.ok()).toBe(true)
    expect(suffix.headers()['content-type']).toContain('text/markdown')
    await expect(suffix.text()).resolves.toContain('Payload Components currently targets Payload v3')

    const negotiated = await request.get(`${baseURL}/docs/architecture`, {
      headers: {
        accept: 'text/markdown',
      },
    })

    expect(negotiated.ok()).toBe(true)
    expect(negotiated.headers()['content-type']).toContain('text/markdown')
    await expect(negotiated.text()).resolves.toContain('# Architecture (/docs/architecture)')
  })

  test('docs pages expose generated open graph images', async ({ request }) => {
    const response = await request.get(`${baseURL}/og/docs/installation/image.png`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('image/png')
    expect((await response.body()).byteLength).toBeGreaterThan(1000)
  })

  test('root open graph image renders as a non-empty PNG', async ({ request }) => {
    const response = await request.get(`${baseURL}/opengraph-image`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('image/png')
    expect((await response.body()).byteLength).toBeGreaterThan(1000)
  })

  test('docs pages expose article metadata and searchable headings', async ({ page }) => {
    await page.goto(`${baseURL}/docs/installation`)

    await expect(page).toHaveTitle(/Installation/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /supported Payload v3 project/,
    )
    await expect(page.getByRole('heading', { level: 1, name: 'Installation' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'What the CLI does' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Copy Markdown/ })).toBeVisible()
    await expect(page.getByRole('button', { exact: true, name: 'Open' })).toBeVisible()
  })

  test('landing page exposes site and FAQ structured data', async ({ page }) => {
    await page.goto(`${baseURL}/`)

    const nodes = await getStructuredData(page)

    expect(findStructuredData(nodes, 'WebSite')).toMatchObject({
      '@type': 'WebSite',
      name: 'Payload Components',
      url: `${baseURL}/`,
    })
    expect(findStructuredData(nodes, 'SoftwareApplication')).toMatchObject({
      '@type': 'SoftwareApplication',
      isAccessibleForFree: true,
      name: 'payload-components',
    })
    expect(findStructuredData(nodes, 'FAQPage')?.mainEntity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'What exactly does an install change in my repo?',
        }),
      ]),
    )
  })

  test('catalog page exposes component collection structured data', async ({ page }) => {
    await page.goto(`${baseURL}/components`)

    const collection = findStructuredData(
      await getStructuredData(page),
      'CollectionPage',
      (node) => node.url === `${baseURL}/components`,
    )

    expect(collection).toMatchObject({
      '@type': 'CollectionPage',
      name: 'Component catalog',
      url: `${baseURL}/components`,
    })
    const itemList = collection?.mainEntity as StructuredDataNode | undefined

    expect(itemList).toMatchObject({
      '@type': 'ItemList',
    })
    expect(Number(itemList?.numberOfItems)).toBeGreaterThanOrEqual(2)
    expect(JSON.stringify(itemList)).toContain('Hero Basic')
    expect(JSON.stringify(itemList)).toContain('Feature Grid Basic')
  })

  test('docs pages expose TechArticle structured data', async ({ page }) => {
    await page.goto(`${baseURL}/docs/installation`)

    expect(findStructuredData(await getStructuredData(page), 'TechArticle')).toMatchObject({
      '@type': 'TechArticle',
      headline: 'Installation',
      mainEntityOfPage: `${baseURL}/docs/installation`,
      url: `${baseURL}/docs/installation`,
    })
  })

  test('Payload custom components guide exposes TechArticle structured data', async ({ page }) => {
    await page.goto(`${baseURL}/payload-custom-components`)

    expect(findStructuredData(await getStructuredData(page), 'TechArticle')).toMatchObject({
      '@type': 'TechArticle',
      headline: 'Payload custom components guide',
      mainEntityOfPage: `${baseURL}/payload-custom-components`,
      url: `${baseURL}/payload-custom-components`,
    })
  })
})
