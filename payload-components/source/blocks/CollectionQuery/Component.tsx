import React from 'react'
import type { TypedLocale } from 'payload'

import type { CollectionQueryBlock as CollectionQueryBlockData } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { CollectionBrowser } from './Browser'
import { queryCategories, queryPosts, type CollectionOptions } from './query'
import {
  readCollectionRequest,
  type CollectionRequest,
  type CollectionSearchParams,
} from './navigation'

type Props = CollectionQueryBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
  locale?: TypedLocale
  searchParams?: CollectionSearchParams
}

export const CollectionQueryBlock: React.FC<Props> = async ({
  className,
  disableInnerContainer,
  id,
  layout = 'grid',
  emptyMessage = 'No posts found. Try another category or check back soon.',
  locale,
  searchParams,
  ...data
}) => {
  const options: CollectionOptions = {
    categories: data.categories?.map((category) =>
      typeof category === 'object' ? category.id : category,
    ),
    enableFilters: data.enableFilters,
    enablePagination: data.enablePagination,
    limit: data.limit,
    populateBy: data.populateBy,
    selectedDocs: data.selectedDocs?.map((post) => (typeof post === 'object' ? post.id : post)),
    sort: data.sort,
    locale,
  }
  const key = `collection-${id || data.queryKey || 'posts'}`
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(searchParams ?? {})) {
    for (const entry of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      params.append(name, entry)
    }
  }
  const request = readCollectionRequest(params, key)
  const [initial, categories] = await Promise.all([
    queryPosts(options, request),
    queryCategories(options),
  ])

  async function load(request: CollectionRequest) {
    'use server'
    return queryPosts(options, request)
  }

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="contents">
        <CollectionBrowser
          categories={categories}
          disableInnerContainer={disableInnerContainer}
          emptyMessage={emptyMessage || 'No posts found.'}
          initial={initial}
          initialSearch={params.toString()}
          layout={layout || 'grid'}
          load={load}
          pagination={data.populateBy !== 'selection' && Boolean(data.enablePagination)}
          queryKey={key}
        />
      </div>
    </section>
  )
}
