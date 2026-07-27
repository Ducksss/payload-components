'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import { NorthfieldMark } from './NorthfieldMark'

/* Northfield chrome — a masthead over a term strip.
 *
 * Deck one is the masthead: the specimen mark, the wordmark, the page index, and
 * one filled action. Deck two is the term strip, which is the shell's share of
 * the concept's information architecture: the six modules as six ticks, with the
 * one currently in session marked in highlighter. It is static — no pulse, no
 * infinite animation — and hidden below md, where the sticky masthead has to stay
 * short.
 *
 * The masthead slides down from behind the top edge rather than fading. An
 * opacity entrance would alpha-composite the filled ink action toward the chalk
 * beneath it and transiently drop it below AA, which axe scans catch.
 *
 * The mobile disclosure follows the house pattern from
 * src/components/site/SiteHeader.tsx — a real <button> carrying aria-expanded and
 * aria-controls, Escape closes and returns focus to the trigger, pointerdown
 * outside closes, route changes close, no focus trap. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* Six modules; the third is the one in session this term. Fictional, like every
   other figure in the concept. */
const MODULE_TICKS = [
  { state: 'done' },
  { state: 'done' },
  { state: 'now' },
  { state: 'ahead' },
  { state: 'ahead' },
  { state: 'ahead' },
] as const

export function NorthfieldHeader({
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
  const enrollHref = templatePreviewHref(template.slug, 'enroll')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-nf-menu]'))
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
    <motion.header
      animate={{ y: 0 }}
      className="nf-header sticky top-0 z-40"
      data-nf-reveal
      initial={{ y: -12 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
    >
      <nav
        aria-label="Northfield School site navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link
          aria-label="Northfield School home"
          className="flex shrink-0 items-baseline gap-2.5 text-foreground"
          href={templatePreviewHref(template.slug)}
        >
          <NorthfieldMark />
          <span className="text-base font-medium tracking-title">Northfield School</span>
          <span aria-hidden="true" className="nf-masthead-sub hidden xl:inline">
            School of practical typography
          </span>
        </Link>

        <div className="hidden items-baseline gap-1 md:flex">
          {template.navigation.map((item, index) => {
            const active = activePath === item.path

            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'nf-nav-item relative px-2 py-1.5 text-sm transition-colors lg:px-3',
                  active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
                href={templatePreviewHref(template.slug, item.path)}
                key={item.path}
              >
                <span aria-hidden="true" className="nf-nav-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
                {active ? (
                  <motion.span
                    animate={{ scaleX: 1 }}
                    aria-hidden="true"
                    className="nf-nav-mark absolute inset-x-2 bottom-1 origin-left lg:inset-x-3"
                    data-nf-reveal
                    initial={{ scaleX: 0 }}
                    transition={
                      reduceMotion ? { duration: 0 } : { delay: 0.28, duration: 0.5, ease: EASE_OUT }
                    }
                  />
                ) : null}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="nf-action hidden h-9 items-center px-4 text-sm font-medium lg:inline-flex"
            href={enrollHref}
          >
            Enroll
          </Link>

          <div className="relative md:hidden" data-nf-menu>
            <button
              aria-controls="education-course-navigation"
              aria-expanded={open}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              className="nf-trigger inline-flex h-9 items-center gap-2 px-2.5 text-xs uppercase tracking-eyebrow text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen((value) => !value)}
              ref={triggerRef}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
              >
                {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 8h12M2 11.5h12" />}
              </svg>
              {open ? 'Close' : 'Menu'}
            </button>

            <div
              className="nf-menu absolute right-0 top-11 z-50 flex w-64 flex-col"
              hidden={!open}
              id="education-course-navigation"
            >
              {template.navigation.map((item, index) => {
                const active = activePath === item.path

                return (
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'nf-menu-item flex items-baseline gap-3 px-4 py-3 text-sm transition-colors',
                      active ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                    href={templatePreviewHref(template.slug, item.path)}
                    key={item.path}
                    onClick={() => setOpen(false)}
                  >
                    <span aria-hidden="true" className="nf-nav-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </Link>
                )
              })}
              <Link
                className="nf-action m-2 inline-flex h-9 items-center justify-center px-3 text-sm font-medium"
                href={enrollHref}
                onClick={() => setOpen(false)}
              >
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="nf-term-strip hidden md:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-6 px-5 text-xs uppercase tracking-eyebrow text-muted-foreground sm:px-8">
          <span className="inline-flex items-center gap-3">
            Michaelmas term
            <span aria-hidden="true" className="inline-flex items-center gap-1">
              {MODULE_TICKS.map((tick, index) => (
                <span className="nf-tick" data-state={tick.state} key={index} />
              ))}
            </span>
            <span className="hidden lg:inline">Module three in session</span>
          </span>
          <span>Enrolment for the next cohort closes 12 September</span>
        </div>
      </div>
    </motion.header>
  )
}
