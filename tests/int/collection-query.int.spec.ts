import { readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  collectionHref,
  readCollectionRequest,
} from '../../payload-components/source/blocks/CollectionQuery/navigation'

// Execute the shipped query module against a controlled Local API boundary.
// Transpilation avoids resolving the consumer-only @payload-config alias here.
const find = vi.fn()
const auth = vi.fn()
const draftMode = vi.fn()
const source = readFileSync(
  path.join(process.cwd(), 'payload-components/source/blocks/CollectionQuery/query.ts'),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const exports: Record<string, (...args: unknown[]) => Promise<unknown>> = {}
new Function('require', 'exports', compiled)((id: string) => {
  if (id === '@payload-config') return { default: {} }
  if (id === 'next/headers') return { headers: async () => new Headers(), draftMode }
  if (id === 'payload') return { getPayload: async () => ({ find, auth }) }
  throw new Error(`Unexpected runtime dependency: ${id}`)
}, exports)
const { queryPosts, queryCategories } = exports
const result = (overrides = {}) => ({
  docs: [],
  page: 1,
  totalDocs: 0,
  totalPages: 1,
  ...overrides,
})

beforeEach(() => {
  find.mockReset().mockResolvedValue(result())
  auth.mockReset().mockResolvedValue({ user: null })
  draftMode.mockReset().mockResolvedValue({ isEnabled: false })
})

describe('Collection Query navigation', () => {
  it('isolates each block while preserving repeated unrelated parameters', () => {
    const href = collectionHref(
      'locale=zh&tag=a&tag=b&collection-two-page=4&collection-one-page=3',
      'collection-one',
      { category: 'News & events', page: 1 },
    )
    const url = new URL(href, 'https://example.com/zh/blog')
    expect(url.pathname).toBe('/zh/blog')
    expect(url.searchParams.getAll('tag')).toEqual(['a', 'b'])
    expect(url.searchParams.get('collection-two-page')).toBe('4')
    expect(url.searchParams.get('locale')).toBe('zh')
    expect(url.searchParams.has('collection-one-page')).toBe(false)
    expect(readCollectionRequest(url.searchParams, 'collection-one')).toEqual({
      category: 'News & events',
      page: 1,
    })
    expect(url.hash).toBe('#collection-one')
  })

  it('normalizes malformed, zero, fractional and oversized page parameters', () => {
    for (const page of ['-1', '0', '1.5', 'NaN', 'Infinity', '9007199254740992']) {
      expect(readCollectionRequest(new URLSearchParams(`x-page=${page}`), 'x').page).toBe(1)
    }
    expect(readCollectionRequest(new URLSearchParams('x-page=999999'), 'x').page).toBe(10000)
  })
})

describe('Collection Query Local API contract', () => {
  it('combines editor and visitor filters while enforcing published status, locale and access', async () => {
    await queryPosts(
      {
        categories: [1, { id: 2 }],
        enableFilters: true,
        enablePagination: true,
        limit: 99,
        sort: 'title',
        locale: 'zh',
      },
      { category: '2', page: 3 },
    )
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'posts',
        draft: false,
        overrideAccess: false,
        user: null,
        locale: 'zh',
        limit: 24,
        page: 3,
        pagination: true,
        sort: ['title', 'id'],
        where: {
          and: [
            { _status: { equals: 'published' } },
            { categories: { in: [1, 2] } },
            { categories: { equals: '2' } },
          ],
        },
      }),
    )
  })

  it('does not grant draft access from the preview cookie alone', async () => {
    draftMode.mockResolvedValue({ isEnabled: true })
    await queryPosts({})
    expect(find.mock.calls[0][0]).toMatchObject({
      draft: false,
      overrideAccess: false,
      where: { and: [{ _status: { equals: 'published' } }] },
    })
    auth.mockResolvedValue({ user: { id: 'editor' } })
    await queryPosts({})
    expect(find.mock.calls[1][0]).toMatchObject({
      draft: true,
      overrideAccess: false,
      user: { id: 'editor' },
      where: { and: [] },
    })
  })

  it('retains manual order, removes duplicates and ignores visitor paging/filtering', async () => {
    find.mockResolvedValue(
      result({
        docs: [
          { id: 1, title: 'One', content: 'not returned' },
          { id: 3, title: 'Three' },
        ],
        totalDocs: 2,
      }),
    )
    const loaded = await queryPosts(
      {
        populateBy: 'selection',
        selectedDocs: [3, 1, 3, 2],
        enableFilters: true,
        enablePagination: true,
      },
      { page: 5, category: 'x' },
    )
    expect(loaded).toMatchObject({ docs: [{ id: 3 }, { id: 1 }], page: 1 })
    expect(JSON.stringify(loaded)).not.toContain('not returned')
    expect(find.mock.calls[0][0]).toMatchObject({
      pagination: false,
      page: 1,
      limit: 3,
      where: { and: [{ _status: { equals: 'published' } }, { id: { in: [3, 1, 2] } }] },
    })
  })

  it('returns a proper empty result for empty manual selections without querying posts', async () => {
    expect(await queryPosts({ populateBy: 'selection' })).toEqual(result())
    expect(find).not.toHaveBeenCalled()
  })

  it('clamps a stale page to the last available page and refetches once', async () => {
    find
      .mockResolvedValueOnce(result({ page: 9, totalPages: 2, totalDocs: 7 }))
      .mockResolvedValueOnce(result({ page: 2, totalPages: 2, totalDocs: 7, docs: [{ id: 7 }] }))
    expect(await queryPosts({ enablePagination: true }, { page: 9 })).toMatchObject({
      page: 2,
      docs: [{ id: 7 }],
    })
    expect(find.mock.calls.map(([options]) => options.page)).toEqual([9, 2])
  })

  it('rejects malformed action input and ignores disabled controls', async () => {
    await queryPosts(
      { enablePagination: true, enableFilters: true, sort: 'malicious' },
      { page: Infinity, category: { equals: 'secret' } },
    )
    expect(find.mock.calls[0][0]).toMatchObject({
      page: 1,
      sort: ['-publishedAt', 'id'],
      where: { and: [{ _status: { equals: 'published' } }] },
    })
    await queryPosts({}, { page: 4, category: 'secret' })
    expect(find.mock.calls[1][0]).toMatchObject({
      pagination: false,
      page: 1,
      where: { and: [{ _status: { equals: 'published' } }] },
    })
  })

  it('loads only accessible category options inside the editor constraint', async () => {
    find.mockResolvedValue(result({ docs: [{ id: 7, title: 'Guides' }] }))
    expect(await queryCategories({ enableFilters: true, categories: [7] })).toEqual([
      { id: '7', title: 'Guides' },
    ])
    expect(find.mock.calls[0][0]).toMatchObject({
      collection: 'categories',
      overrideAccess: false,
      depth: 0,
      limit: 100,
      where: { id: { in: [7] } },
    })
    find.mockClear()
    expect(await queryCategories({ enableFilters: true, populateBy: 'selection' })).toEqual([])
    expect(find).not.toHaveBeenCalled()
  })
})
