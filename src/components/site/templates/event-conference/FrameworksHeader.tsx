'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Transition } from 'motion/react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import {
  FRAMEWORKS_CITY,
  FRAMEWORKS_DATES,
  FRAMEWORKS_EDITION,
  FRAMEWORKS_VENUE,
  FRAMEWORKS_WAVE,
  FrameworksWordmark,
} from './lockup'

/* Frameworks ’26 masthead — a two-deck poster header. A monospace dateline
 * strip (edition, dates, venue, wave status) sits above the wordmark and a
 * wide-tracked room index, and the whole thing stays stuck to the top so the
 * dates never leave the screen.
 *
 * Contract: real links through templatePreviewHref, aria-current on the active
 * page, and a keyboard-operable disclosure at mobile widths following the house
 * pattern in src/components/site/SiteHeader.tsx — Escape closes and returns
 * focus to the trigger, outside pointerdown closes, route changes close. The
 * trigger is a <button> whose accessible name says "navigation", carrying
 * aria-expanded and aria-controls pointing at the menu.
 *
 * Choreography, all reduced-motion safe: the header slides down from behind the
 * top edge (TRANSFORM ONLY — an opacity fade would alpha-composite the filled
 * violet ticket button toward the background mid-animation and transiently drop
 * it below AA, which axe catches), the dateline items step in, the active room
 * draws a violet bar, and a violet reading-progress hairline tracks the top
 * edge. The scroll veil is opacity-only over a constant backdrop blur — the
 * blur itself is never animated. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

const datelineItems = [
  FRAMEWORKS_EDITION,
  FRAMEWORKS_DATES,
  `${FRAMEWORKS_VENUE} · ${FRAMEWORKS_CITY}`,
  FRAMEWORKS_WAVE,
] as const

export function FrameworksHeader({
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
  const reduceMotion = useReducedMotion() ?? false

  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 20))
  const springProgress = useSpring(scrollYProgress, { damping: 30, mass: 0.4, stiffness: 180 })
  const progress = reduceMotion ? scrollYProgress : springProgress

  const ticketHref = templatePreviewHref(template.slug, 'tickets')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-fw-menu]'))
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

  return (
    <motion.header
      animate={{ y: 0 }}
      className="fw-header sticky top-0 z-40"
      data-fw-reveal
      initial={{ y: -18 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
    >
      {/* Solid state, faded in once the page moves. Opacity-only: the blur on
          .fw-header underneath is constant. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
        data-fw-header-veil
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-brand"
        style={{ scaleX: progress }}
      />

      <div className="fw-dateline relative">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6">
          {datelineItems.map((item, index) => (
            <motion.span
              animate={{ y: 0 }}
              className={cn(
                'fw-dateline-item',
                index === 0 && 'fw-dateline-item-lead',
                index === 3 && 'hidden sm:inline-flex',
              )}
              data-fw-reveal
              initial={{ y: -6 }}
              key={item}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { delay: 0.05 * index, duration: 0.5, ease: EASE_OUT }
              }
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>

      <nav
        aria-label="Frameworks ’26 site navigation"
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          aria-label="Frameworks ’26 home"
          className="shrink-0"
          href={templatePreviewHref(template.slug)}
        >
          <FrameworksWordmark />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {template.navigation.map((item) => {
            const active = activePath === item.path

            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn('fw-nav-link', active && 'fw-nav-link-active')}
                href={templatePreviewHref(template.slug, item.path)}
                key={item.path}
              >
                {item.label}
                {active ? (
                  <motion.span
                    animate={{ scaleX: 1 }}
                    aria-hidden="true"
                    className="fw-nav-bar motion-reduce:transform-none!"
                    initial={{ scaleX: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { delay: 0.25, duration: 0.55, ease: EASE_OUT }
                    }
                  />
                ) : null}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link className="fw-cta hidden md:inline-flex" href={ticketHref}>
            Get your ticket
          </Link>

          <div className="relative md:hidden" data-fw-menu>
            <button
              aria-controls="frameworks-mobile-navigation"
              aria-expanded={open}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              className="fw-menu-trigger"
              onClick={() => setOpen((value) => !value)}
              ref={triggerRef}
              type="button"
            >
              {open ? 'Close' : 'Rooms'}
            </button>

            <div className="fw-menu-panel" hidden={!open} id="frameworks-mobile-navigation">
              {template.navigation.map((item) => {
                const active = activePath === item.path

                return (
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn('fw-menu-link', active && 'fw-menu-link-active')}
                    href={templatePreviewHref(template.slug, item.path)}
                    key={item.path}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link className="fw-cta fw-menu-cta" href={ticketHref} onClick={() => setOpen(false)}>
                Get your ticket
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
