'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Rivermouth's chrome: a light gauge band carrying the river's reading and the
 * date of the next work party (it scrolls away), over a sticky paper header
 * holding the staff-gauge mark, the wordmark with its catchment line, the page
 * index in plain sentence case, and one river-green Donate action.
 *
 * All real interactive semantics live here, never inside the visual canvas:
 * internal links go through templatePreviewHref, the active page carries
 * aria-current, and the mobile disclosure follows the house pattern from
 * src/components/site/SiteHeader.tsx — Escape closes and returns focus to the
 * trigger, pointerdown outside closes, route changes close, no focus trap.
 *
 * Choreography (transform/opacity only, reduced-motion gated by
 * useReducedMotion AND the scoped CSS net in theme.css so the pre-hydration
 * frame is already final): the gauge band slides down from behind the top edge,
 * the header settles down after it, the water line rises across the gauge mark
 * once, and the active index item draws its water-level rule.
 *
 * Every chrome entrance is transform-only on purpose — an opacity fade would
 * alpha-composite the green Donate action toward the paper mid-animation and
 * transiently drop its label below AA, which axe catches. The only opacity move
 * is the veil beneath the nav, which brings the river hairline and the shelf
 * shadow once the reader starts moving; the surface under it is already opaque. */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* A river staff gauge: the post, its tick marks, and the numbered plate. The
 * water line itself is a separate animated bar in the mark below, so the glyph
 * stays a static, legible outline at 20px. */
function RivermouthGaugeMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M9.5 3.2h5v17.6h-5z" />
      <path d="M9.5 7.4h2.4M9.5 11.2h2.4M9.5 15h2.4M9.5 18.8h2.4" />
    </svg>
  )
}

function RivermouthWordmark({ href, reduce }: { href: string; reduce: boolean }) {
  return (
    <Link href={href} aria-label="Rivermouth Trust home" className="flex items-center gap-3">
      <span className="rivermouth-mark relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md text-brand">
        <RivermouthGaugeMark className="size-5" />
        {/* The water rising up the gauge: one transform-only pass. */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-2 h-[3px] origin-left bg-brand/45 motion-reduce:transform-none!"
          data-rivermouth-reveal
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.4, duration: 0.8, ease: EASE }}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-semibold tracking-heading text-foreground">
          Rivermouth Trust
        </span>
        <span className="mt-1 text-xs text-muted-foreground">The Corrow catchment</span>
      </span>
    </Link>
  )
}

export function RivermouthHeader({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion() ?? false

  const donateHref = templatePreviewHref(template.slug, 'donate')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-rivermouth-menu]'))
        setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // Route changes close the disclosure; this state update is intentionally tied to navigation.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false) }, [pathname])

  // The veil is state-driven and rendered by a CSS opacity transition, so
  // reduced motion simply lands the final state (see the net in theme.css).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="rivermouth-gauge overflow-hidden">
        <motion.div
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-xs sm:px-8 motion-reduce:transform-none!"
          data-rivermouth-reveal
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-[3px] shrink-0 bg-brand" />
            Corrow gauge at Ferney Ford — 0.41 m, falling
          </span>
          <span className="hidden sm:inline">Next work party: first Saturday, half past eight</span>
        </motion.div>
      </div>

      <motion.header
        className="rivermouth-header sticky top-0 z-40"
        data-rivermouth-reveal
        initial={{ y: -14 }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      >
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
          data-rivermouth-veil
        />

        <nav
          aria-label="Rivermouth Trust site navigation"
          className="relative mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8"
        >
          <RivermouthWordmark href={templatePreviewHref(template.slug)} reduce={reduce} />

          <div className="hidden items-center gap-7 md:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative pb-1.5 text-sm transition-colors',
                    active
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand motion-reduce:transform-none!"
                      data-rivermouth-reveal
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={
                        reduce ? { duration: 0 } : { delay: 0.42, duration: 0.55, ease: EASE }
                      }
                    />
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={donateHref}
              className="hidden h-10 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-600 lg:inline-flex"
            >
              Donate
            </Link>

            <div className="relative md:hidden" data-rivermouth-menu>
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls="rivermouth-mobile-navigation"
                aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex size-10 items-center justify-center rounded-sm border border-border bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.75"
                  viewBox="0 0 16 16"
                >
                  {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2.5 5h11M2.5 11h11" />}
                </svg>
              </button>

              <div
                id="rivermouth-mobile-navigation"
                hidden={!open}
                className="absolute right-0 top-12 z-50 flex w-60 flex-col gap-0.5 rounded-md border border-border bg-popover p-2 shadow-lg"
              >
                {template.navigation.map((item) => {
                  const active = activePath === item.path

                  return (
                    <Link
                      key={item.path}
                      href={templatePreviewHref(template.slug, item.path)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-secondary font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn('h-3.5 w-[3px] shrink-0', active ? 'bg-brand' : 'bg-border')}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>
      </motion.header>
    </>
  )
}
