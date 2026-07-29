'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Northline masthead — an editorial double-deck header: a monospace studio
 * strip that scrolls away above a sticky serif wordmark + wide-tracked index
 * navigation (the newspaper pattern: the dateline leaves, the nameplate
 * stays). Interactive semantics (real links, aria-current, the keyboard-
 * operable disclosure) live here, never inside the visual canvas. The mobile
 * menu follows the house pattern from src/components/site/SiteHeader.tsx:
 * Escape closes and returns focus to the trigger, pointerdown outside closes,
 * route changes close.
 *
 * Choreography (reduced-motion gated by useReducedMotion + motion-reduce
 * pins, so the pre-hydration frame is already final): the studio strip and
 * wordmark stagger in once on load, the active index item draws a rust
 * underline (scaleX), and — the one scroll detail — the masthead's bottom
 * hairline tints rust once the reader is into the page. */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function NorthlineHeader({
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

  const enter = (delay: number) => (reduce ? { duration: 0 } : { delay, duration: 0.7, ease: EASE })

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-northline-menu]'))
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
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  // The scroll detail is state-driven (a CSS transform transition renders it),
  // so reduced motion simply skips the transition and lands the final state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="border-b border-border/60 bg-background">
        <motion.div
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground sm:px-8 motion-reduce:opacity-100! motion-reduce:transform-none!"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0)}
        >
          <span>Amsterdam — New York</span>
          <span className="hidden sm:inline">Brand &amp; Digital Studio, est. 2017</span>
        </motion.div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <nav
          aria-label="Northline site navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="font-serif text-3xl italic leading-none text-foreground"
          >
            <motion.span
              className="inline-block motion-reduce:opacity-100! motion-reduce:transform-none!"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0.12)}
            >
              Northline<span className="text-brand">.</span>
            </motion.span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative pb-1 font-mono text-xs uppercase tracking-eyebrow transition-colors',
                    active
                      ? 'text-brand'
                      : "text-muted-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-border after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:text-foreground hover:after:scale-x-100 motion-reduce:after:transition-none",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left bg-brand motion-reduce:transform-none!"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={
                        reduce ? { duration: 0 } : { delay: 0.3, duration: 0.6, ease: EASE }
                      }
                    />
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="relative md:hidden" data-northline-menu>
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-controls="northline-mobile-navigation"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-9 items-center justify-center border border-border px-3 font-mono text-xs uppercase tracking-eyebrow text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {open ? 'Close' : 'Index'}
            </button>
            <div
              id="northline-mobile-navigation"
              hidden={!open}
              className="absolute right-0 top-11 z-50 flex w-52 flex-col border border-border bg-background shadow-lg"
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
                      'border-b border-border/60 px-4 py-3 font-mono text-xs uppercase tracking-eyebrow transition-colors last:border-b-0',
                      active
                        ? 'bg-secondary text-brand'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* The one scroll detail: the masthead hairline tints rust once the
            reader is into the page. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-brand transition-transform duration-500 ease-out motion-reduce:transition-none',
            scrolled ? 'scale-x-100' : 'scale-x-0',
          )}
        />
      </header>
    </>
  )
}
