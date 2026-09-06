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
        import { CollectionBrowser } from './payload-components/source/blocks/CollectionQuery/Browser'
        const categories = [{ id: 'guides', title: 'Guides' }, { id: 'empty', title: 'Empty' }, { id: 'broken', title: 'Broken' }]
        const data = (page = 1, category) => ({
          category, page, totalDocs: category === 'empty' ? 0 : 6, totalPages: category === 'empty' ? 1 : 3,
          docs: category === 'empty' ? [] : [{ id: page, title: (category || 'All') + ' page ' + page, slug: 'post' }],
        })
        let initial = data()
        const load = async ({ page, category }) => {
          await new Promise(resolve => setTimeout(resolve, 150))
          if (category === 'broken') throw new Error('Network unavailable')
          return data(Math.min(page || 1, 3), category)
        }
        const root = createRoot(document.getElementById('root'))
        const render = () => root.render(<>
          {['first', 'second'].map(key => <CollectionBrowser key={key} queryKey={'collection-' + key}
            categories={categories} initial={initial} initialSearch="" layout="grid" load={load}
            pagination emptyMessage="Nothing here yet." />)}
        </>)
        render()
        window.addEventListener('server-refresh', () => {
          initial = data(Number(new URLSearchParams(location.search).get('collection-first-page') || 1))
          render()
        })
      `,
    },
    plugins: [
      {
        name: 'consumer-primitives',
        setup(builder) {
          builder.onResolve({ filter: /^@\/blocks\/shared\/PostCard$/ }, () => ({
            path: 'card',
            namespace: 'test',
          }))
          builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
            contents: `import React from 'react'; export function PostCard({post}) { return <article>{post.title}</article> }`,
            loader: 'tsx',
            resolveDir: process.cwd(),
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
  // The source is exercised in a browser without making it part of the docs
  // runtime. Only the consumer's PostCard and server-function boundary are mocked.
  await page.route('https://collection.test/**', async (route) =>
    route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }),
  )
  await page.goto('https://collection.test/blog?locale=zh&tag=a&tag=b')
  await page.addScriptTag({ content: script })
})

test('paginates, resets filters and restores independent block state with browser history', async ({
  page,
}) => {
  const first = page.locator('#collection-first')
  const second = page.locator('#collection-second')
  await expect(first.locator('article')).toHaveText('All page 1')
  await first.getByRole('link', { name: 'Next', exact: true }).click()
  await expect(first.locator('article')).toHaveText('All page 2')
  await expect(second.locator('article')).toHaveText('All page 1')
  await first.getByRole('link', { name: 'Guides', exact: true }).click()
  await expect(first.locator('article')).toHaveText('guides page 1')
  await second.getByRole('link', { name: 'Next', exact: true }).click()
  await expect(second.locator('article')).toHaveText('All page 2')
  const url = new URL(page.url())
  expect(url.searchParams.get('locale')).toBe('zh')
  expect(url.searchParams.getAll('tag')).toEqual(['a', 'b'])
  expect(url.searchParams.get('collection-first-category')).toBe('guides')
  expect(url.searchParams.has('collection-first-page')).toBe(false)
  expect(url.searchParams.get('collection-second-page')).toBe('2')
  await page.goBack()
  await expect(second.locator('article')).toHaveText('All page 1')
  await expect(first.locator('article')).toHaveText('guides page 1')
  await page.goBack()
  await expect(first.locator('article')).toHaveText('All page 2')
  await page.goForward()
  await expect(first.locator('article')).toHaveText('guides page 1')
})

test('loads bookmarked state after hydration and exposes empty and error recovery states', async ({
  page,
}) => {
  await page.goto(
    'https://collection.test/blog?collection-first-category=guides&collection-first-page=3',
  )
  await page.addScriptTag({ content: script })
  const first = page.locator('#collection-first')
  await expect(first.locator('article')).toHaveText('guides page 3')
  await first.getByRole('link', { name: 'Empty', exact: true }).click()
  await expect(first.getByText('Nothing here yet.')).toBeVisible()
  await expect(first.getByRole('navigation', { name: 'Posts pagination' })).toHaveCount(0)
  await first.getByRole('link', { name: 'Broken', exact: true }).click()
  await expect(first.getByText('Posts could not be loaded. Please try again.')).toBeVisible()
  await expect(first.getByRole('button', { name: 'Try again' })).toBeVisible()
  await first.getByRole('link', { name: 'All posts', exact: true }).click()
  await expect(first.locator('article')).toHaveText('All page 1')
  await expect(first.getByRole('button', { name: 'Try again' })).toHaveCount(0)
})

test('a server refresh supersedes an in-flight action without retaining loading or error state', async ({
  page,
}) => {
  const first = page.locator('#collection-first')
  await expect(first.locator('article')).toHaveText('All page 1')
  await first.getByRole('link', { name: 'Next', exact: true }).click()
  await expect(first.getByText('Loading posts…')).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event('server-refresh')))
  await expect(first.locator('article')).toHaveText('All page 2')
  await expect(first.getByText('Loading posts…')).toHaveCount(0)
  await expect(first.locator('[aria-busy]')).toHaveAttribute('aria-busy', 'false')
})

test('canonicalizes a stale bookmark across peer blocks before their next navigation', async ({
  page,
}) => {
  await page.goto('https://collection.test/blog?collection-first-page=99&locale=zh')
  await page.addScriptTag({ content: script })
  const first = page.locator('#collection-first')
  const second = page.locator('#collection-second')
  await expect(first.locator('article')).toHaveText('All page 3')
  await expect(page).toHaveURL(/collection-first-page=3/)
  await second.getByRole('link', { name: 'Next', exact: true }).click()
  await expect(second.locator('article')).toHaveText('All page 2')
  expect(new URL(page.url()).searchParams.get('collection-first-page')).toBe('3')
  await page.goBack()
  await expect(first.locator('article')).toHaveText('All page 3')
  await expect(second.locator('article')).toHaveText('All page 1')
})
