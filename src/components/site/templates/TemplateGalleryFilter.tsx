'use client'

import { useCallback, useEffect, useState } from 'react'

import type { ReactNode } from 'react'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/utilities/ui'

import './template-surface-motion.css'

/* Category filter for the /templates gallery.
 *
 * The cards are still rendered on the server — the page passes them in as
 * already-rendered elements, so every concept ships in the initial HTML for SEO
 * and the registry never reaches the client bundle. This component owns which
 * of them are mounted, mirrors the choice into the URL (?category=) via the
 * History API, and animates the difference.
 *
 * Motion is the point of the filter, not decoration: exiting cards fade and
 * scale away, survivors physically glide to their new grid slots, and arrivals
 * pop in — so the visitor sees WHAT changed rather than a snap. No analytics
 * event is emitted: the approved template vocabulary has no filter event.
 *
 * Layout-animation pitfalls handled here:
 * - stable identity — the key is the template slug, never the array index;
 * - `layout="position"` (not plain `layout`) so motion animates the card's
 *   position and never scale-distorts its text or poster;
 * - the entrance/exit transforms live on a NESTED motion element, so the
 *   layout projection on the outer wrapper is never fighting an `animate`
 *   transform on the same node;
 * - `mode="popLayout"` pulls exiting cards out of flow immediately (the grid
 *   gets `relative` so their absolute placement is measured against it),
 *   otherwise survivors would wait for the exit before reflowing.
 *
 * Accessibility / capture contract:
 * - the chips are plain buttons with aria-pressed and keep focus through the
 *   reflow (they live outside the animated grid);
 * - a role="status" line announces the new result count;
 * - the first paint is TRANSFORM-ONLY. The cards contain a filled primary CTA,
 *   and axe scans mid-animation: an opacity fade alpha-composites that button
 *   toward the page background and fails AA transiently. Fading is reserved for
 *   post-interaction enter/exit, which axe never observes.
 * - reduced motion zeroes every transition and template-surface-motion.css
 *   pins the finished frame before hydration. */

export type TemplateFilterCategory = { count: number; label: string; value: string }
export type TemplateFilterItem = { card: ReactNode; category: string; slug: string }

const ALL = 'all'

/* Quick and confident — this is a catalog, not a splash screen. Six cards at
   45ms apart on a near-critically-damped spring: the last one starts at 225ms
   and the whole set is settled inside ~500ms (measured in Chromium). */
const STAGGER_STEP = 0.045
const ENTER_SPRING = { damping: 26, mass: 0.6, stiffness: 340, type: 'spring' } as const
const LAYOUT_SPRING = { damping: 30, mass: 0.9, stiffness: 280, type: 'spring' } as const
const EXIT_TWEEN = { duration: 0.16, ease: 'easeOut' } as const
const INSTANT = { duration: 0 } as const

export function TemplateGalleryFilter({
  categories,
  items,
}: {
  categories: readonly TemplateFilterCategory[]
  items: readonly TemplateFilterItem[]
}) {
  const reduceMotion = useReducedMotion() ?? false
  const [active, setActive] = useState<string>(ALL)
  /* Before the first chip click the gallery is arriving, not changing — that
     entrance is a rise. Afterwards, cards genuinely appear and disappear, so
     they fade. */
  const [interacted, setInteracted] = useState(false)

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
     (every card mounted), so there is no hydration mismatch — a deep link's
     filter applies in this effect and animates, which reads as the filter
     being applied for you. */
  useEffect(() => {
    const readFromUrl = () => {
      const param = new URLSearchParams(window.location.search).get('category')
      setActive(isKnown(param) ? (param as string) : ALL)
    }
    readFromUrl()
    window.addEventListener('popstate', readFromUrl)
    return () => window.removeEventListener('popstate', readFromUrl)
  }, [isKnown])

  const select = useCallback((value: string) => {
    setInteracted(true)
    setActive(value)
    const params = new URLSearchParams(window.location.search)
    if (value === ALL) params.delete('category')
    else params.set('category', value)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [])

  const visible = active === ALL ? items : items.filter((item) => item.category === active)

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-4 sm:justify-between">
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

        {/* Announces the reflow for anyone who cannot see it happen. */}
        <p role="status" className="font-mono text-xs tabular-nums text-muted-foreground">
          Showing {visible.length} of {items.length} concepts
        </p>
      </div>

      <div className="relative mt-8 grid gap-8 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((item, index) => (
            <motion.div
              key={item.slug}
              data-template-category={item.category}
              data-template-motion
              layout="position"
              exit={
                reduceMotion
                  ? { opacity: 0, transition: INSTANT }
                  : { opacity: 0, scale: 0.94, transition: EXIT_TWEEN }
              }
              transition={reduceMotion ? INSTANT : LAYOUT_SPRING}
            >
              <motion.div
                data-template-motion
                initial={interacted ? { opacity: 0, scale: 0.96 } : { y: 26 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? INSTANT
                    : { ...ENTER_SPRING, delay: interacted ? 0 : index * STAGGER_STEP }
                }
              >
                {item.card}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
