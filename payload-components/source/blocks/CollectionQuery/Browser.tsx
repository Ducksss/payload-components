'use client'

import React, { startTransition, useEffect, useRef, useState } from 'react'

import { PostCard } from '@/blocks/shared/PostCard'
import { cn } from '@/utilities/ui'

import { collectionHref, readCollectionRequest, type CollectionRequest } from './navigation'
import type { CollectionResult } from './query'

type Props = {
  categories: { id: string; title: string }[]
  disableInnerContainer?: boolean
  emptyMessage: string
  initial: CollectionResult
  initialSearch: string
  layout: 'featured' | 'grid' | 'list'
  load: (request: CollectionRequest) => Promise<CollectionResult>
  pagination: boolean
  queryKey: string
}

const navigationEvent = 'payload-collection-navigation'
const linkClass =
  'rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function CollectionBrowser({
  categories,
  disableInnerContainer,
  emptyMessage,
  initial,
  initialSearch,
  layout,
  load,
  pagination,
  queryKey,
}: Props) {
  const [result, setResult] = useState(initial)
  const [previousInitial, setPreviousInitial] = useState(initial)
  const [search, setSearch] = useState(initialSearch)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const retry = useRef<() => void>(() => {})

  // A new server render (including live preview) supersedes the old result.
  if (initial !== previousInitial) {
    setPreviousInitial(initial)
    setResult(initial)
    setPending(false)
    setError(false)
  }

  useEffect(() => {
    let active = true
    let sequence = 0
    let previous = JSON.stringify({ category: initial.category, page: initial.page })
    const sync = (force = false) => {
      const currentSearch = window.location.search
      setSearch(currentSearch)
      const request = readCollectionRequest(new URLSearchParams(currentSearch), queryKey)
      if (!pagination) request.page = 1
      if (!categories.length) request.category = undefined
      const signature = JSON.stringify(request)
      if (!force && previous === signature) return
      previous = signature
      const ticket = ++sequence
      setPending(true)
      setError(false)
      startTransition(async () => {
        try {
          const next = await load(request)
          if (!active || ticket !== sequence) return
          setResult(next)
          // Replace stale page numbers without adding a history entry.
          if (next.page !== request.page || next.category !== request.category) {
            const href = collectionHref(window.location.search, queryKey, next)
            window.history.replaceState(window.history.state, '', href)
            setSearch(window.location.search)
          }
        } catch {
          if (active && ticket === sequence) setError(true)
        } finally {
          if (active && ticket === sequence) setPending(false)
        }
      })
    }
    const onNavigation = () => sync()
    retry.current = () => sync(true)
    sync()
    window.addEventListener('popstate', onNavigation)
    window.addEventListener(navigationEvent, onNavigation)
    return () => {
      active = false
      window.removeEventListener('popstate', onNavigation)
      window.removeEventListener(navigationEvent, onNavigation)
    }
  }, [categories, initial, load, pagination, queryKey])

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    window.history.pushState(window.history.state, '', event.currentTarget.href)
    window.dispatchEvent(new Event(navigationEvent))
  }

  return (
    <div
      className={cn('space-y-6 scroll-mt-24', !disableInnerContainer && 'mx-auto max-w-6xl')}
      id={queryKey}
    >
      {categories.length > 0 ? (
        <nav aria-label="Filter posts by category" className="flex flex-wrap gap-2">
          {[{ id: '', title: 'All posts' }, ...categories].map((category) => (
            <a
              aria-current={(result.category || '') === category.id ? 'true' : undefined}
              className={cn(
                linkClass,
                (result.category || '') === category.id &&
                  'border-foreground bg-foreground text-background hover:bg-foreground',
              )}
              href={collectionHref(search, queryKey, {
                category: category.id || undefined,
                page: 1,
              })}
              key={category.id}
              onClick={navigate}
            >
              {category.title}
            </a>
          ))}
        </nav>
      ) : null}
      <div aria-busy={pending}>
        {result.docs.length > 0 ? (
          <div
            className={cn('gap-6', {
              'flex flex-col': layout === 'list',
              'grid md:grid-cols-2 lg:grid-cols-3': layout === 'grid',
              'grid lg:grid-cols-2': layout === 'featured',
            })}
          >
            {result.docs.map((post, index) => (
              <PostCard
                className={cn({ 'lg:col-span-2': layout === 'featured' && index === 0 })}
                key={post.id}
                post={post}
                variant={
                  layout === 'list'
                    ? 'list'
                    : layout === 'featured' && index === 0
                      ? 'featured'
                      : 'grid'
                }
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>
      <div aria-atomic="true" aria-live="polite" className="text-sm text-muted-foreground">
        {pending
          ? 'Loading posts…'
          : error
            ? 'Posts could not be loaded. Please try again.'
            : `${result.totalDocs} ${result.totalDocs === 1 ? 'post' : 'posts'}`}
      </div>
      {error ? (
        <button className={linkClass} onClick={() => retry.current()} type="button">
          Try again
        </button>
      ) : null}
      {pagination && result.totalPages > 1 ? (
        <nav
          aria-label="Posts pagination"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          {result.page > 1 ? (
            <a
              className={linkClass}
              href={collectionHref(search, queryKey, {
                category: result.category,
                page: result.page - 1,
              })}
              onClick={navigate}
            >
              Previous
            </a>
          ) : (
            <span className="px-3 py-2 text-sm text-muted-foreground">Previous</span>
          )}
          <span className="text-sm text-muted-foreground">
            Page {result.page} of {result.totalPages}
          </span>
          {result.page < result.totalPages ? (
            <a
              className={linkClass}
              href={collectionHref(search, queryKey, {
                category: result.category,
                page: result.page + 1,
              })}
              onClick={navigate}
            >
              Next
            </a>
          ) : (
            <span className="px-3 py-2 text-sm text-muted-foreground">Next</span>
          )}
        </nav>
      ) : null}
    </div>
  )
}
