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

  test('docs pages expose article metadata and searchable headings', async ({ page }) => {
    await page.goto(`${baseURL}/docs/installation`)

    await expect(page).toHaveTitle(/Installation/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /supported Payload v3 project/,
    )
    await expect(page.getByRole('heading', { level: 1, name: 'Installation' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'What the CLI does' })).toBeVisible()
  })
})
