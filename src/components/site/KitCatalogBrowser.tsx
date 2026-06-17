'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { ArrowUpRight, Search, X } from 'lucide-react'

import { KitCard } from '@/components/site/KitCard'
import { KitFamilyHeader, UpcomingKitCard } from '@/components/site/KitGrid'
import type { KitEntry, UpcomingKit } from '@/lib/site'
import { cn } from '@/utilities/ui'

type FamilyKey = 'pages' | 'posts'

type FamilyMeta = { countLabel: string; description: string; name: string }
type CategoryMeta = { family: FamilyKey; label: string }

type KitCatalogBrowserProps = {
  categories: Record<string, CategoryMeta>
  families: { pages: FamilyMeta; posts: FamilyMeta }
  githubRepoUrl: string
  pages: KitEntry[]
  posts: UpcomingKit[]
}

/* Case-insensitive match across the fields a person would scan for. */
function matches(query: string, ...fields: string[]) {
  if (!query) return true
  const q = query.toLowerCase()
  return fields.some((field) => field.toLowerCase().includes(q))
}

function countByCategory(items: { category: string }[]) {
  const counts = new Map<string, number>()
  for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
  return counts
}

export function KitCatalogBrowser({
  categories,
  families,
  githubRepoUrl,
  pages,
  posts,
}: KitCatalogBrowserProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawType = searchParams.get('type')
  const type: FamilyKey | 'all' = rawType === 'pages' || rawType === 'posts' ? rawType : 'all'
  const rawCategory = searchParams.get('category') ?? ''
  const category = rawCategory in categories ? rawCategory : ''
  const query = searchParams.get('q') ?? ''

  /* A chosen section-type pins the family it lives in; otherwise the Type
     filter decides which sections show. */
  const activeFamily: FamilyKey | 'all' = category ? categories[category].family : type

  const queriedPages = useMemo(
    () => pages.filter((kit) => matches(query, kit.title, kit.slug, kit.description, kit.target)),
    [pages, query],
  )
  const queriedPosts = useMemo(
    () => posts.filter((kit) => matches(query, kit.title, kit.slug, kit.description, kit.target)),
    [posts, query],
  )

  const pagesCounts = useMemo(() => countByCategory(queriedPages), [queriedPages])
  const postsCounts = useMemo(() => countByCategory(queriedPosts), [queriedPosts])

  /* Categories shown per family: registry order, only the non-empty ones. */
  const categorySlugs = useMemo(() => Object.keys(categories), [categories])
  const pagesCategories = categorySlugs.filter(
    (slug) => categories[slug].family === 'pages' && (pagesCounts.get(slug) ?? 0) > 0,
  )
  const postsCategories = categorySlugs.filter(
    (slug) => categories[slug].family === 'posts' && (postsCounts.get(slug) ?? 0) > 0,
  )

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === 'all') params.delete(key)
      else params.set(key, value)
    }
    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  const showPages = activeFamily === 'all' || activeFamily === 'pages'
  const showPosts = activeFamily === 'all' || activeFamily === 'posts'

  const pagesCards = queriedPages.filter((kit) => !category || kit.category === category)
  const postsCards = queriedPosts.filter((kit) => !category || kit.category === category)

  const visibleCount = (showPages ? pagesCards.length : 0) + (showPosts ? postsCards.length : 0)
  const noResults = visibleCount === 0

  const familyGroups: {
    counts: Map<string, number>
    items: string[]
    key: FamilyKey
    meta: FamilyMeta
    total: number
  }[] = [
    {
      counts: pagesCounts,
      items: pagesCategories,
      key: 'pages',
      meta: families.pages,
      total: queriedPages.length,
    },
    {
      counts: postsCounts,
      items: postsCategories,
      key: 'posts',
      meta: families.posts,
      total: queriedPosts.length,
    },
  ]

  return (
    <section>
      <div className="container grid gap-8 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-16">
        {/* Sidebar — search + grouped category rail (tailark-style) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <label className="relative block">
            <span className="sr-only">Search components</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => updateParams({ q: event.target.value })}
              placeholder="Search components"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
            />
          </label>

          <nav aria-label="Filter components" className="mt-6 flex flex-col gap-1">
            <FilterButton
              active={type === 'all' && !category}
              count={queriedPages.length + queriedPosts.length}
              label="All components"
              onClick={() => updateParams({ type: '', category: '' })}
            />

            {familyGroups.map((group) => (
              <div key={group.key} className="mt-5">
                <FilterButton
                  active={!category && type === group.key}
                  count={group.total}
                  label={group.meta.name}
                  onClick={() => updateParams({ type: group.key, category: '' })}
                  weight="medium"
                />
                {group.items.length > 0 ? (
                  <div className="ml-3 mt-1.5 flex flex-col gap-0.5 border-l border-border pl-2">
                    {group.items.map((slug) => (
                      <FilterButton
                        key={slug}
                        active={category === slug}
                        count={group.counts.get(slug) ?? 0}
                        label={categories[slug].label}
                        onClick={() => updateParams({ type: group.key, category: slug })}
                        size="sm"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content — the family sections stay, narrowed by Type + Category */}
        <div className="min-w-0">
          {noResults ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-8">
              <p className="text-sm text-muted-foreground">No components match your filters.</p>
              <button
                type="button"
                onClick={() => updateParams({ type: '', category: '', q: '' })}
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
              >
                <X className="size-3.5" aria-hidden="true" />
                Reset filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12 lg:gap-16">
              {showPages && pagesCards.length > 0 ? (
                <div>
                  <KitFamilyHeader
                    countLabel={`${pagesCards.length} installable`}
                    description={families.pages.description}
                    layout="stack"
                    name={families.pages.name}
                  />
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {pagesCards.map((kit) => (
                      <KitCard key={kit.slug} kit={kit} />
                    ))}

                    {/* The propose-a-kit CTA belongs to the full page-blocks
                        wall — hide it once a search or category narrows it. */}
                    {query === '' && !category ? (
                      <a
                        href={`${githubRepoUrl}/issues`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-h-48 flex-col items-start justify-center gap-3 rounded-xl border border-dashed border-border bg-transparent p-6 transition-colors hover:border-foreground/25"
                      >
                        <span className="font-mono text-sm text-muted-foreground">
                          your-kit-here
                        </span>
                        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                          The catalog grows deliberately — source, manifest, docs, and installer
                          coverage ship together. Propose the next kit.
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          Open an issue
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </span>
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {showPosts && postsCards.length > 0 ? (
                <div>
                  <KitFamilyHeader
                    countLabel={`${postsCards.length} in development`}
                    description={families.posts.description}
                    layout="stack"
                    name={families.posts.name}
                  />
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {postsCards.map((kit) => (
                      <UpcomingKitCard key={kit.slug} kit={kit} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar filter button                                               */
/* ------------------------------------------------------------------ */

function FilterButton({
  active,
  count,
  label,
  onClick,
  size = 'md',
  weight = 'normal',
}: {
  active: boolean
  count: number
  label: string
  onClick: () => void
  size?: 'md' | 'sm'
  weight?: 'medium' | 'normal'
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border px-3 text-left transition-colors',
        size === 'sm' ? 'py-1.5 text-[13px]' : 'py-2 text-sm',
        weight === 'medium' ? 'font-medium' : '',
        active
          ? 'border-brand/30 bg-brand/10 text-brand'
          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          'shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums',
          active ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  )
}
