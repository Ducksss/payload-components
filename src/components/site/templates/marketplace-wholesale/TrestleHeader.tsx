'use client'

import Link from '@/i18n/Link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Transition } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Trestle's masthead — the crate edge, stuck to the top of the screen.
 *
 * A spruce-ink topline prints the three terms in mono caps (the line stencilled
 * along a crate's edge), then an opaque kraft masthead under a ledger foot rule
 * carries the postmark roundel, the mono wordmark, the page index, and the one
 * filled action. Opaque on purpose: the masthead is sticky, and a translucent
 * bar would composite the spruce action toward whatever scrolls beneath it.
 *
 * The interaction contract is final and must survive any restyle: a real
 * <button> trigger with aria-expanded + aria-controls whose accessible name
 * says "menu", Escape closes the disclosure AND returns focus to the trigger,
 * pointerdown outside closes, route changes close, internal navigation goes
 * through templatePreviewHref, and the active page carries aria-current.
 *
 * Choreography is TRANSFORM ONLY (the chrome carries a filled CTA — an opacity
 * fade would alpha-composite the spruce block toward the kraft mid-entrance
 * and transiently drop its label below AA, which axe catches): the header
 * drops in from behind the top edge. useReducedMotion only ever swaps the
 * transition value — never the tree — so SSR and reduce clients hydrate the
 * same markup, and theme.css pins [data-tr-reveal] to its final frame before
 * hydration. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

export function TrestleHeader({
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

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-trestle-menu]'))
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
      className="sticky top-0 z-40"
      data-tr-reveal
      data-trestle-menu
      initial={{ y: -14 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
    >
      <div className="tr-topline">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-1.5 sm:px-8">
          <span className="leading-6">
            <span className="tr-topline-lead">Sixty days to pay</span> · Makers paid on dispatch
          </span>
          <span className="tr-topline-end ms-auto leading-6">One flat commission</span>
        </div>
      </div>

      <div className="tr-masthead">
        <nav
          aria-label="Trestle site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 pb-4 sm:px-8"
        >
          <Link
            aria-label={`${template.title} home`}
            href={templatePreviewHref(template.slug)}
            className="tr-focus flex items-center gap-3 rounded-md py-1"
          >
            <span aria-hidden="true" className="tr-postmark">
              T
            </span>
            <span className="flex flex-col gap-1">
              <span className="tr-wordmark-name">Trestle</span>
              <span className="tr-wordmark-trade">Makers × shops · Ellsworth</span>
            </span>
          </Link>

          <div className="ms-auto hidden items-center gap-1 lg:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  data-tr-active={active ? '' : undefined}
                  className="tr-focus tr-nav-link inline-flex min-h-11 items-center rounded-md px-3"
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, 'buyers')}
            className="tr-action tr-focus ms-2 hidden min-h-11 items-center px-5 lg:inline-flex"
          >
            Open a shop account
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="marketplace-wholesale-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="tr-focus tr-trigger ms-auto inline-flex min-h-11 items-center gap-2.5 px-4 lg:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="tr-trigger-bar" />
              <span className="tr-trigger-bar" />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="marketplace-wholesale-navigation"
        hidden={!open}
        className="tr-sheet absolute inset-x-0 top-full lg:hidden"
      >
        {template.navigation.map((item) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              data-tr-active={active ? '' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'tr-focus tr-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
                active && 'font-medium',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="tr-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Two desks, one door — shops@trestle.example · makers@trestle.example
        </p>
      </div>
    </motion.header>
  )
}
