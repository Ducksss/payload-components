'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Transition } from 'motion/react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import {
  HALLORAN_COVERAGE,
  HALLORAN_EMERGENCY,
  HALLORAN_NO_FEE,
  HALLORAN_PHONE,
  HALLORAN_PHONE_TEL,
  HALLORAN_SATURDAY,
  HALLORAN_WEEKDAYS,
  HalloranWordmark,
} from './lockup'

/* Halloran & Sons masthead — a van door, stuck to the top of the screen.
 *
 * A steel facts strip (no callout fee, the patch, the hours, the out-of-hours
 * promise) sits above the wordmark, the page index, and the one thing this whole
 * concept exists to deliver: a safety-orange block with the phone number in it,
 * present at every width. It is sticky so the number never leaves the screen,
 * which is the only genuinely useful piece of interaction design on a trade site.
 *
 * Contract: real links through templatePreviewHref, aria-current on the active
 * page, and a keyboard-operable disclosure at mobile widths following the house
 * pattern in src/components/site/SiteHeader.tsx — Escape closes and returns
 * focus to the trigger, outside pointerdown closes, route changes close. The
 * trigger is a <button> whose accessible name says "navigation", carrying
 * aria-expanded and aria-controls pointing at the menu.
 *
 * Choreography, all reduced-motion safe and TRANSFORM ONLY: the header drops in
 * from behind the top edge and the facts step in from above. An opacity fade
 * here would alpha-composite the filled orange call block toward the paper
 * mid-animation and transiently drop its label below AA, which axe catches. The
 * scroll state is an opacity-only veil over an already-opaque surface — nothing
 * is blurred, because nothing on a plumber's site should be. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

const factItems: { emphasis?: boolean; hideOnMobile?: boolean; label: string }[] = [
  { emphasis: true, label: HALLORAN_NO_FEE },
  { label: HALLORAN_COVERAGE },
  { label: `${HALLORAN_WEEKDAYS} · ${HALLORAN_SATURDAY}` },
  { hideOnMobile: true, label: HALLORAN_EMERGENCY },
]

export function HalloranHeader({
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

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 16))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-hs-menu]'))
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
      className="hs-header sticky top-0 z-40"
      data-hs-reveal
      initial={{ y: -16 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
    >
      <div className="hs-facts relative">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6">
          {factItems.map((item, index) => (
            <motion.span
              animate={{ y: 0 }}
              className={cn(
                'hs-fact',
                item.emphasis && 'hs-fact-lead',
                item.hideOnMobile && 'hidden sm:inline-flex',
              )}
              data-hs-reveal
              initial={{ y: -5 }}
              key={item.label}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { delay: 0.04 * index, duration: 0.45, ease: EASE_OUT }
              }
            >
              {item.label}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="hs-header-bar relative">
        {/* Solid state once the page moves. Opacity-only over an opaque paper
            surface, so the orange call block never composites. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-200',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
          data-hs-header-veil
        />

        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            aria-label={`${template.title} home`}
            className="hs-wordmark-link shrink-0"
            href={templatePreviewHref(template.slug)}
          >
            <HalloranWordmark />
          </Link>

          <nav
            aria-label="Halloran & Sons site navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={cn('hs-nav-link', active && 'hs-nav-link-active')}
                  href={templatePreviewHref(template.slug, item.path)}
                  key={item.path}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      animate={{ scaleX: 1 }}
                      aria-hidden="true"
                      className="hs-nav-bar"
                      data-hs-reveal
                      initial={{ scaleX: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { delay: 0.2, duration: 0.45, ease: EASE_OUT }
                      }
                    />
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              aria-label={`Call Halloran & Sons on ${HALLORAN_PHONE}`}
              className="hs-call"
              href={HALLORAN_PHONE_TEL}
            >
              <span aria-hidden="true" className="hs-call-word">
                Call
              </span>
              <span aria-hidden="true" className="hs-call-number">
                {HALLORAN_PHONE}
              </span>
            </a>

            <div className="relative lg:hidden" data-hs-menu>
              <button
                aria-controls="halloran-mobile-navigation"
                aria-expanded={open}
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                className="hs-menu-trigger"
                onClick={() => setOpen((value) => !value)}
                ref={triggerRef}
                type="button"
              >
                <span aria-hidden="true" className="hs-menu-bars">
                  <span />
                  <span />
                  <span />
                </span>
              </button>

              <div className="hs-menu-panel" hidden={!open} id="halloran-mobile-navigation">
                {template.navigation.map((item) => {
                  const active = activePath === item.path

                  return (
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn('hs-menu-link', active && 'hs-menu-link-active')}
                      href={templatePreviewHref(template.slug, item.path)}
                      key={item.path}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <span className="hs-menu-note">{HALLORAN_EMERGENCY}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
