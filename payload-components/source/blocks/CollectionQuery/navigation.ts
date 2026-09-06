export type CollectionRequest = { category?: string; page?: number }
export type CollectionSearchParams = Record<string, string | string[] | undefined>

export function readCollectionRequest(search: URLSearchParams, key: string): CollectionRequest {
  const value = search.get(`${key}-page`)
  const page = value && /^\d+$/.test(value) ? Number(value) : 1
  return {
    category: search.get(`${key}-category`) || undefined,
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  }
}

export function collectionHref(search: string, key: string, request: CollectionRequest) {
  const params = new URLSearchParams(search)
  params.delete(`${key}-page`)
  params.delete(`${key}-category`)
  if (request.page && request.page > 1) params.set(`${key}-page`, String(request.page))
  if (request.category) params.set(`${key}-category`, request.category)
  return `?${params.toString()}#${encodeURIComponent(key)}`
}
