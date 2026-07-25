'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import { LedgerlineMark } from './LedgerlineMark'

/* Ledgerline chrome — a dense, opaque, two-deck institutional header.
 *
 * Deck one is a mono status rail carrying live rail state and the two figures an
 * operator checks first; it scrolls away. Deck two is the sticky bar: the ruled
 * mark, the wordmark, mono index navigation, and one filled action.
 *
 * Deliberately static: no translucency, no backdrop blur, no scroll-reactive
 * veil or progress hairline. Restraint is the art direction — the chrome should
 * read as bolted-on infrastructure, so the whole motion budget is one entrance,
 * one drawn mark, one live-state pulse, and the active-item rule.
 *
 * The header slides down from behind the top edge rather than fading: an opacity
 * entrance alpha-composites the filled teal action toward the ink beneath it and
 * transiently drops the button below AA (axe scans catch exactly this).
 *
 * The mobile disclosure follows the house pattern from
 * src/components/site/SiteHeader.tsx — Escape closes and returns focus to the
 * trigger, pointerdown outside closes, route changes close, no focus trap. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const railFigures = 'Ledger p99 38ms · Trailing 24-month uptime 99.995%'

export function LedgerlineHeader({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion() ?? false
  const contactHref = templatePreviewHref(template.slug, 'contact')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-ledgerline-menu]'))
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

  return (
    <>
      <div className="ledgerline-rail">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground sm:px-6">
          <span className="inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="relative flex size-1.5 shrink-0">
              <span className="ledgerline-pulse absolute inline-flex h-full w-full rounded-full bg-brand" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
            </span>
            Rails operational
          </span>
          <span className="hidden sm:inline">{railFigures}</span>
        </div>
      </div>

      <motion.header
        animate={{ y: 0 }}
        className="ledgerline-header sticky top-0 z-40"
        data-ledgerline-reveal
        initial={{ y: -12 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
      >
        <nav
          aria-label="Ledgerline site navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <Link
            aria-label="Ledgerline home"
            className="flex shrink-0 items-center gap-2.5 text-foreground"
            href={templatePreviewHref(template.slug)}
          >
            <LedgerlineMark />
            <span className="text-base font-semibold tracking-heading">Ledgerline</span>
          </Link>

          <div className="hidden items-center md:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative px-2.5 py-2 font-mono text-xs uppercase tracking-eyebrow transition-colors lg:px-3',
                    active ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                  )}
                  href={templatePreviewHref(template.slug, item.path)}
                  key={item.path}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      animate={{ scaleX: 1 }}
                      aria-hidden="true"
                      className="absolute inset-x-2.5 bottom-0 h-0.5 origin-left bg-brand lg:inset-x-3"
                      data-ledgerline-reveal
                      initial={{ scaleX: 0 }}
                      transition={
                        reduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.5, ease: EASE_OUT }
                      }
                    />
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="hidden h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-600 lg:inline-flex"
              href={contactHref}
            >
              Contact the desk
            </Link>

            <div className="relative md:hidden" data-ledgerline-menu>
              <button
                aria-controls="ledgerline-mobile-navigation"
                aria-expanded={open}
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setOpen((value) => !value)}
                ref={triggerRef}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  viewBox="0 0 16 16"
                >
                  {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 8h12M2 11.5h12" />}
                </svg>
              </button>

              <div
                className="absolute right-0 top-12 z-50 flex w-60 flex-col border border-border bg-popover p-1.5 shadow-lg"
                hidden={!open}
                id="ledgerline-mobile-navigation"
              >
                {template.navigation.map((item) => {
                  const active = activePath === item.path

                  return (
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-eyebrow transition-colors',
                        active
                          ? 'bg-secondary text-brand'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                      href={templatePreviewHref(template.slug, item.path)}
                      key={item.path}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <Link
                  className="mt-1.5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                  href={contactHref}
                  onClick={() => setOpen(false)}
                >
                  Contact the desk
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>
    </>
  )
}
