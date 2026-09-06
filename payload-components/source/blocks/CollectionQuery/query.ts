import configPromise from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { getPayload, type TypedLocale, type Where } from 'payload'

import type { CollectionQueryBlock, Post } from '@/payload-types'
import type { PostCardData } from '@/blocks/shared/PostCard'
import type { CollectionRequest } from './navigation'

export type CollectionOptions = Pick<
  CollectionQueryBlock,
  | 'categories'
  | 'enableFilters'
  | 'enablePagination'
  | 'limit'
  | 'populateBy'
  | 'selectedDocs'
  | 'sort'
> & { locale?: TypedLocale }
export type CollectionResult = {
  category?: string
  docs: Array<PostCardData & Pick<Post, 'id'>>
  page: number
  totalDocs: number
  totalPages: number
}

const sortOptions = new Set(['-publishedAt', 'publishedAt', 'title', '-title'])
const relationId = (value: { id: number | string } | number | string) =>
  typeof value === 'object' ? value.id : value

async function queryContext() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  const { isEnabled } = await draftMode()
  // A preview cookie alone never grants access to drafts.
  return { payload, user, draft: Boolean(isEnabled && user) }
}

export async function queryCategories(options: CollectionOptions) {
  if (!options.enableFilters || options.populateBy === 'selection') return []
  const { payload, user } = await queryContext()
  const ids = (options.categories ?? []).map(relationId)
  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    locale: options.locale,
    overrideAccess: false,
    user,
    select: { title: true },
    sort: ['title', 'id'],
    where: ids.length ? { id: { in: ids } } : undefined,
  })
  return result.docs.map(({ id, title }) => ({ id: String(id), title }))
}

export async function queryPosts(
  options: CollectionOptions,
  request: CollectionRequest = {},
): Promise<CollectionResult> {
  const { payload, user, draft } = await queryContext()
  const selection = options.populateBy === 'selection'
  const selectedIds = [...new Set((options.selectedDocs ?? []).map(relationId))]
  const categoryIds = (options.categories ?? []).map(relationId)
  const page =
    !selection && options.enablePagination && Number.isSafeInteger(request?.page)
      ? Math.min(Math.max(request.page ?? 1, 1), 10000)
      : 1
  // Treat server-function arguments as untrusted. A visitor can narrow the
  // editor's selection, but cannot expand it or change its limit/sort/locale.
  const category =
    !selection &&
    options.enableFilters &&
    typeof request?.category === 'string' &&
    request.category.length <= 128 &&
    request.category.length > 0
      ? request.category
      : undefined
  const clauses: Where[] = []
  if (!draft) clauses.push({ _status: { equals: 'published' } })
  if (selection) clauses.push({ id: { in: selectedIds } })
  if (!selection && categoryIds.length) clauses.push({ categories: { in: categoryIds } })
  if (category) clauses.push({ categories: { equals: category } })
  if (selection && selectedIds.length === 0)
    return { docs: [], page: 1, totalDocs: 0, totalPages: 1 }

  const limit = selection
    ? selectedIds.length
    : Math.min(Math.max(Math.trunc(options.limit || 6), 1), 24)
  const find = (requestedPage: number) =>
    payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit,
      locale: options.locale,
      overrideAccess: false,
      user,
      page: requestedPage,
      pagination: !selection && Boolean(options.enablePagination),
      select: { categories: true, meta: true, publishedAt: true, slug: true, title: true },
      sort: [options.sort && sortOptions.has(options.sort) ? options.sort : '-publishedAt', 'id'],
      where: { and: clauses },
    })
  let result = await find(page)
  // Content removal or an old bookmarked URL can move the last page. Clamp and
  // query once more so the visitor sees the last available page instead of a void.
  if (!selection && options.enablePagination && page > Math.max(result.totalPages, 1)) {
    result = await find(Math.max(result.totalPages, 1))
  }
  const docs = selection
    ? selectedIds.flatMap((id) => result.docs.filter((post) => String(post.id) === String(id)))
    : result.docs
  return {
    category,
    docs: docs.map(({ id, categories, meta, publishedAt, slug, title }) => ({
      id,
      categories,
      meta,
      publishedAt,
      slug,
      title,
    })),
    page: result.page || 1,
    totalDocs: result.totalDocs,
    totalPages: Math.max(result.totalPages, 1),
  }
}
