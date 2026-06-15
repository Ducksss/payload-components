import { expect, test, type Page } from '@playwright/test'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3000'}`
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
  test('/llms.txt publishes a concise text/plain source map', async ({ request }) => {
    const response = await request.get(`${baseURL}/llms.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Kits')
    expect(body).toContain('Fumadocs')
    expect(body).toContain(`- [Home](${baseURL}/)`)
    expect(body).toContain(`- [Docs](${baseURL}/docs)`)
    expect(body).toContain(`- [Kit catalog](${baseURL}/components)`)
    expect(body).toContain(`- [Public registry](${baseURL}/r/registry.json)`)
    expect(body).toContain(`- [GitHub repository](${githubRepoUrl})`)
    expect(body).toContain('Hero Basic: npx payload-kit add hero-basic')
  })

  test('/llms-full.txt includes compiled docs content', async ({ request }) => {
    const response = await request.get(`${baseURL}/llms-full.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Kits')
    expect(body).toContain('# Start Here')
    expect(body).toContain('# Architecture')
    expect(body).toContain('AI-readable surfaces')
    expect(body).toContain('The v2 app is intentionally not a Payload CMS site.')
    expect(body).toContain('npx payload-kit add feature-grid-basic')
  })

  test('/api/search returns docs results', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/search?query=hero`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/json')

    const body = await response.text()

    expect(body).toContain('/docs/kits/hero-basic')
  })

  test('docs expose per-page markdown and markdown negotiation', async ({ request }) => {
    const direct = await request.get(`${baseURL}/llms.mdx/docs/installation/content.md`)

    expect(direct.ok()).toBe(true)
    expect(direct.headers()['content-type']).toContain('text/markdown')
    await expect(direct.text()).resolves.toContain('# Installation (/docs/installation)')

    const suffix = await request.get(`${baseURL}/docs/installation.md`)

    expect(suffix.ok()).toBe(true)
    expect(suffix.headers()['content-type']).toContain('text/markdown')
    await expect(suffix.text()).resolves.toContain('Payload Kits currently targets Payload v3')

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
      name: 'Payload Kits',
      url: `${baseURL}/`,
    })
    expect(findStructuredData(nodes, 'SoftwareApplication')).toMatchObject({
      '@type': 'SoftwareApplication',
      isAccessibleForFree: true,
      name: 'payload-kit',
    })
    expect(findStructuredData(nodes, 'FAQPage')?.mainEntity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'What exactly does an install change in my repo?',
        }),
      ]),
    )
  })

  test('catalog page exposes kit collection structured data', async ({ page }) => {
    await page.goto(`${baseURL}/components`)

    const collection = findStructuredData(
      await getStructuredData(page),
      'CollectionPage',
      (node) => node.url === `${baseURL}/components`,
    )

    expect(collection).toMatchObject({
      '@type': 'CollectionPage',
      name: 'Kit catalog',
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
})
