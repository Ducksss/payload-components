'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

/* Category filter for the /templates gallery. The cards themselves stay
 * server-rendered (all concepts ship in the initial HTML for SEO and work with
 * JS disabled); this client wrapper only toggles the visibility of the
 * server-rendered card slots by their data-template-category, and mirrors the
 * choice into the URL (?category=) via the History API — the same
 * progressive-enhancement idiom as the component catalog. No analytics event is
 * emitted here: the approved template vocabulary has no filter event, and the
 * choice carries no PII worth capturing. */

export type TemplateFilterCategory = { count: number; label: string; value: string }

const ALL = 'all'

export function TemplateGalleryFilter({
  categories,
  children,
}: {
  categories: readonly TemplateFilterCategory[]
  children: ReactNode
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(ALL)

  const total = categories.reduce((sum, category) => sum + category.count, 0)
  const options: TemplateFilterCategory[] = [
    { count: total, label: 'All concepts', value: ALL },
    ...categories,
  ]

  const isKnown = useCallback(
    (value: string | null): value is string =>
      value === ALL || categories.some((category) => category.value === value),
    [categories],
  )

  /* Hydrate the active chip from the URL, then keep it in sync with
     back/forward navigation. Server + first client render both start at ALL
     (every card visible), so there is no hydration mismatch — filtering is
     applied in the effect below. */
  useEffect(() => {
    const readFromUrl = () => {
      const param = new URLSearchParams(window.location.search).get('category')
      setActive(isKnown(param) ? (param as string) : ALL)
    }
    readFromUrl()
    window.addEventListener('popstate', readFromUrl)
    return () => window.removeEventListener('popstate', readFromUrl)
  }, [isKnown])

  /* Toggle the server-rendered card slots. `hidden` also drops filtered-out
     cards from the accessibility tree. */
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    for (const slot of grid.querySelectorAll<HTMLElement>('[data-template-category]')) {
      slot.hidden = active !== ALL && slot.dataset.templateCategory !== active
    }
  }, [active])

  const select = useCallback((value: string) => {
    setActive(value)
    const params = new URLSearchParams(window.location.search)
    if (value === ALL) params.delete('category')
    else params.set('category', value)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [])

  return (
    <>
      <div
        role="group"
        aria-label="Filter concepts by category"
        className="flex flex-wrap items-center gap-2"
      >
        {options.map((option) => {
          const selected = active === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => select(option.value)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {option.label}
              <span
                className={cn(
                  'font-mono text-[11px] tabular-nums',
                  selected ? 'text-background/70' : 'text-muted-foreground/70',
                )}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      <div ref={gridRef} className="mt-8 grid gap-8 lg:grid-cols-2">
        {children}
      </div>
    </>
  )
}
