import path from 'node:path'

import { expect, test } from '@playwright/test'
import { build } from 'esbuild'

let script: string

test.beforeAll(async () => {
  const compiled = await build({
    bundle: true,
    format: 'iife',
    platform: 'browser',
    write: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    stdin: {
      resolveDir: process.cwd(),
      loader: 'tsx',
      contents: `
        import React from 'react'
        import { createRoot } from 'react-dom/client'
        import { ContactFormBasicBlock } from './payload-components/source/blocks/ContactFormBasic/Component'
        const root = createRoot(document.getElementById('root'))
        const render = (props = {}) => root.render(<ContactFormBasicBlock
          id="original" action="/api/contact" title="Contact us" successMessage="Message accepted."
          {...props} />)
        render()
        window.addEventListener('replace-contact', event => render(event.detail))
      `,
    },
    plugins: [
      {
        name: 'consumer-primitives',
        setup(builder) {
          builder.onResolve({ filter: /^@\/blocks\/shared\// }, (args) => ({
            path: path.join(
              process.cwd(),
              'payload-components/source/blocks/shared',
              `${args.path.split('/').at(-1)}.ts`,
            ),
          }))
          builder.onResolve({ filter: /^@\/utilities\/ui$/ }, () => ({
            path: path.join(process.cwd(), 'src/utilities/ui.ts'),
          }))
        },
      },
    ],
  })
  script = compiled.outputFiles[0].text
})

test.beforeEach(async ({ page }) => {
  await page.route('https://contact.test/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<div id="root"></div>',
    }),
  )
  await page.goto('https://contact.test/contact')
  await page.addScriptTag({ content: script })
})

test('focuses invalid fields, sends multipart once, and preserves input for retry', async ({
  page,
}) => {
  const requests: string[] = []
  let succeed = false
  await page.route('https://contact.test/api/contact', async (route) => {
    requests.push(route.request().postData() || '')
    expect(route.request().method()).toBe('POST')
    expect(route.request().headers()['content-type']).toContain('multipart/form-data; boundary=')
    await route.fulfill({
      status: succeed ? 200 : 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByLabel('Name *', { exact: true })).toBeFocused()
  await expect(page.getByText('Enter your name.')).toBeVisible()
  expect(requests).toHaveLength(0)
  await page.getByLabel('Name *', { exact: true }).fill('Sam')
  await page.getByLabel('Email *', { exact: true }).fill('sam@example.com')
  await page.getByLabel('Message *', { exact: true }).fill('Hello from the browser')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toContainText('We could not confirm delivery.')
  await expect(page.getByLabel('Message *', { exact: true })).toHaveValue('Hello from the browser')
  expect(requests).toHaveLength(1)
  for (const name of ['name', 'email', 'organization', 'message'])
    expect(requests[0]).toContain(`name="${name}"`)
  succeed = true
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toHaveText('Message accepted.')
  await expect(page.getByLabel('Message *', { exact: true })).toHaveValue('')
  expect(requests).toHaveLength(2)
})

for (const outcome of ['success', 'failure'] as const) {
  test(`ignores stale ${outcome} after replacing the destination, including catch and finally`, async ({
    page,
  }) => {
    const held: Array<() => void> = []
    let requests = 0
    await page.route('https://contact.test/api/**', async (route) => {
      requests += 1
      const original = route.request().url().endsWith('/contact')
      await new Promise<void>((resolve) => held.push(resolve))
      await route.fulfill({
        status: original && outcome === 'failure' ? 500 : 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    const fill = async (message: string) => {
      await page.getByLabel('Name *', { exact: true }).fill('Sam')
      await page.getByLabel('Email *', { exact: true }).fill('sam@example.com')
      await page.getByLabel('Message *', { exact: true }).fill(message)
    }
    await fill('Original message')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect.poll(() => held.length).toBe(1)
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent('replace-contact', {
          detail: {
            action: '/api/another',
            title: 'Another form',
            successMessage: 'Another form accepted.',
          },
        }),
      ),
    )
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('Another form')
    await expect(page.getByLabel('Message *', { exact: true })).toHaveValue('')
    await fill('Replacement message')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect.poll(() => held.length).toBe(2)
    const originalResponse = page.waitForResponse('https://contact.test/api/contact')
    held[0]()
    await originalResponse
    await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
    await expect(page.getByRole('status')).toHaveText('')
    await expect(page.getByLabel('Message *', { exact: true })).toHaveValue('Replacement message')
    // Synthetic duplicate submissions must stay blocked even after the old
    // request's finally has completed.
    await page.locator('form').evaluate((form) => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    held[1]()
    await expect(page.getByRole('status')).toHaveText('Another form accepted.')
    expect(requests).toBe(2)
  })
}

test('a replacement block ID also starts fresh at the same endpoint', async ({ page }) => {
  await page.getByLabel('Message *', { exact: true }).fill('Previous block input')
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent('replace-contact', { detail: { id: 'replacement' } })),
  )
  await expect(page.getByLabel('Message *', { exact: true })).toHaveValue('')
})
