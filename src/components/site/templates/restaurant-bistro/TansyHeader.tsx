'use client'

import Link from '@/i18n/Link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Tansy's masthead — a menu cover, not an app bar.
 *
 * Two strips: the night-ink utility line (the hours in tracked caps, the
 * booking number in candle amber — the most important string on the site, at
 * the highest point of every page), then a cream masthead with the serif
 * wordmark, small-caps navigation, and the one copper action. The active page
 * carries a copper diamond, the same fleuron the canvas eyebrows use, so the
 * chrome and the composed pages speak one language. Nothing in this header
 * animates — an unhurried room holds still, and a still header is always
 * complete in a capture (theme.css also nets hover transitions under
 * reduced motion).
 *
 * The interaction contract is final and survives this restyle: a real
 * <button> trigger with aria-expanded + aria-controls, Escape closes the
 * disclosure AND returns focus to the trigger, pointerdown outside closes,
 * route changes close, and every interactive element lives in this chrome,
 * never inside the aria-hidden visual canvas. Pattern follows
 * src/components/site/SiteHeader.tsx via the shipped template headers. */

export function TansyHeader({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-tansy-menu]'))
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
    <header data-tansy-menu className="tansy-header sticky top-0 z-40">
      <div className="tansy-utility">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2 sm:px-8">
          <span className="tansy-utility-fact">Dinner from six · Wednesday to Sunday</span>
          <span className="ms-auto inline-flex items-baseline gap-2">
            <span className="tansy-utility-fact">Bookings</span>
            <span className="tansy-utility-phone">01632 960 447</span>
          </span>
        </div>
      </div>

      <div className="tansy-masthead">
        <nav
          aria-label="Tansy site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="tansy-focus rounded-md py-1 pe-2"
          >
            <span className="tansy-wordmark">
              <span className="tansy-wordmark-name">Tansy</span>
              <span className="tansy-wordmark-place">Porthmere · Est. ten years</span>
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
                  data-tansy-active={active ? '' : undefined}
                  className="tansy-focus tansy-nav-link inline-flex min-h-11 items-center rounded-md px-3.5"
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, 'visit')}
            className="tansy-action tansy-focus ms-2 hidden min-h-12 items-center px-6 text-sm font-medium lg:inline-flex"
          >
            Book a table
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="restaurant-bistro-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="tansy-focus tansy-trigger ms-auto inline-flex min-h-12 items-center gap-2.5 px-4 text-sm font-medium lg:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="tansy-trigger-bar" />
              <span className="tansy-trigger-bar" />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="restaurant-bistro-navigation"
        hidden={!open}
        className="tansy-sheet absolute inset-x-0 top-full lg:hidden"
      >
        {template.navigation.map((item) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              data-tansy-active={active ? '' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'tansy-focus tansy-sheet-link flex min-h-14 items-center px-5 text-xl text-foreground sm:px-8',
                active && 'font-medium',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="tansy-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Bookings 01632 960 447 — Joan answers from three each afternoon we cook.
        </p>
      </div>
    </header>
  )
}
