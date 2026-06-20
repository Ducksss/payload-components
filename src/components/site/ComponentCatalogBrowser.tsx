'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { ArrowUpRight, Search, X } from 'lucide-react'

import { ComponentCard } from '@/components/site/ComponentCard'
import { UpcomingComponentCard } from '@/components/site/ComponentGrid'
import type { ComponentEntry, UpcomingComponent } from '@/lib/site'
import { cn } from '@/utilities/ui'

type FamilyKey = 'pages' | 'posts'

type FamilyMeta = { countLabel: string; description: string; name: string }
type CategoryMeta = { family: FamilyKey; label: string }

type ComponentCatalogBrowserProps = {
  categories: Record<string, CategoryMeta>
  families: { pages: FamilyMeta; posts: FamilyMeta }
  githubRepoUrl: string
  pages: ComponentEntry[]
  posts: UpcomingComponent[]
}

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

export function ComponentCatalogBrowser({
  categories,
  families,
  githubRepoUrl,
  pages,
  posts,
}: ComponentCatalogBrowserProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawType = searchParams.get('type')
  const type: FamilyKey | 'all' = rawType === 'pages' || rawType === 'posts' ? rawType : 'all'
  const rawCategory = searchParams.get('category') ?? ''
  const category = rawCategory in categories ? rawCategory : ''
  const query = searchParams.get('q') ?? ''
  const activeFamily: FamilyKey | 'all' = category ? categories[category].family : type

  const queriedPages = useMemo(
    () =>
      pages.filter((component) =>
        matches(query, component.title, component.slug, component.description, component.target),
      ),
    [pages, query],
  )
  const queriedPosts = useMemo(
    () =>
      posts.filter((component) =>
        matches(query, component.title, component.slug, component.description, component.target),
      ),
    [posts, query],
  )

  const pagesCounts = useMemo(() => countByCategory(queriedPages), [queriedPages])
  const postsCounts = useMemo(() => countByCategory(queriedPosts), [queriedPosts])

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
  const pagesCards = queriedPages.filter((component) => !category || component.category === category)
  const postsCards = queriedPosts.filter((component) => !category || component.category === category)
  const visibleCount = (showPages ? pagesCards.length : 0) + (showPosts ? postsCards.length : 0)

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
      <div className="container grid gap-x-8 py-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-x-12 lg:py-10">
        {/* Desktop rail: categories only, scrolls within itself so 100+ rows
            never run past the viewport. Hidden below lg — mobile filters live
            in the toolbar chip strip instead of stacking above the wall. */}
        <aside className="hidden lg:sticky lg:top-[4.5rem] lg:block lg:max-h-[calc(100vh-5.5rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <nav aria-label="Filter components" className="flex flex-col gap-1">
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

        <div className="min-w-0">
          {/* Sticky toolbar: the single search input (its sr-only label is the
              e2e anchor), the live result count, and — below lg — a horizontal
              chip strip mirroring the rail tree. */}
          <div className="sticky top-14 z-30 mb-6 flex flex-col gap-3 border-b border-border bg-background/85 py-3 backdrop-blur lg:mb-8">
            <div className="flex items-center gap-3">
              <label className="relative block flex-1">
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
              <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {visibleCount} {visibleCount === 1 ? 'result' : 'results'}
              </p>
            </div>

            <div className="-mb-1 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FilterChip
                active={type === 'all' && !category}
                count={queriedPages.length + queriedPosts.length}
                label="All"
                onClick={() => updateParams({ type: '', category: '' })}
              />
              {familyGroups.flatMap((group) => [
                <FilterChip
                  key={group.key}
                  active={!category && type === group.key}
                  count={group.total}
                  label={group.meta.name}
                  onClick={() => updateParams({ type: group.key, category: '' })}
                />,
                ...group.items.map((slug) => (
                  <FilterChip
                    key={slug}
                    active={category === slug}
                    count={group.counts.get(slug) ?? 0}
                    label={categories[slug].label}
                    onClick={() => updateParams({ type: group.key, category: slug })}
                  />
                )),
              ])}
            </div>
          </div>

          {visibleCount === 0 ? (
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
            <div className="flex flex-col gap-10 lg:gap-12">
              {showPages && pagesCards.length > 0 ? (
                <div>
                  {!category ? (
                    <SectionDivider count={pagesCards.length} name={families.pages.name} />
                  ) : null}
                  <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
                    {pagesCards.map((component) => (
                      <ComponentCard key={component.slug} component={component} />
                    ))}

                    {query === '' && !category ? (
                      <a
                        href={`${githubRepoUrl}/issues`}
                        target="_blank"
                        rel="noreferrer"
                        className="group mb-4 flex break-inside-avoid flex-col items-start gap-2 rounded-xl border border-dashed border-border bg-transparent p-4 transition-colors hover:border-foreground/25"
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          your-component-here
                        </span>
                        <p className="text-xs leading-5 text-muted-foreground">
                          The catalog grows deliberately — source, manifest, docs, and installer
                          coverage ship together. Propose the next one.
                        </p>
                        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground transition-colors group-hover:text-brand">
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
                  {!category ? (
                    <SectionDivider
                      count={postsCards.length}
                      label="in development"
                      name={families.posts.name}
                    />
                  ) : null}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {postsCards.map((component) => (
                      <UpcomingComponentCard key={component.slug} component={component} />
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

/* Lightweight section header: a mono label + count over a hairline rule. It
   replaces the old bordered ComponentFamilyHeader block here (that component is
   left intact for the landing CatalogFamilyTeaser). Hidden when a single category is
   active — the filter already names the scope. */
function SectionDivider({ count, label, name }: { count: number; label?: string; name: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
        {name}
      </h2>
      <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
        {count}
        {label ? ` ${label}` : ''}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
}

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
          ? 'border-brand/30 bg-brand/10 text-brand-600'
          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          'shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums',
          active ? 'bg-brand/15 text-brand-600' : 'bg-muted text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  )
}

/* Pill variant of FilterButton for the mobile horizontal scroller. */
function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean
  count: number
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] transition-colors',
        active
          ? 'border-brand/30 bg-brand/10 text-brand-600'
          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {label}
      <span
        className={cn(
          'font-mono text-[10px] tabular-nums',
          active ? 'text-brand-600' : 'text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  )
}
