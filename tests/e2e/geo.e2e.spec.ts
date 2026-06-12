import { expect, test } from '@playwright/test'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3000'}`
const githubRepoUrl = 'https://github.com/Ducksss/payload-components'

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
})
