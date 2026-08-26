'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Moorhouse & Kent's masthead — WAVE 0 SCAFFOLD for the art-direction wave to
 * restyle.
 *
 * The interaction contract is final and must survive any restyle: a real
 * <button> trigger with aria-expanded + aria-controls, Escape closes the
 * disclosure AND returns focus to the trigger, pointerdown outside closes,
 * route changes close, and every interactive element lives in this chrome,
 * never inside the aria-hidden visual canvas. Pattern follows
 * src/components/site/SiteHeader.tsx via the shipped template headers. */

export function MoorhouseHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-mk-menu]'))
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
    <header data-mk-menu className="mk-header sticky top-0 z-40">
      <div className="mk-utility">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2 text-sm sm:px-8">
          <span className="leading-6">12 Sheep Street, Abbotsmoor</span>
          <span className="ms-auto font-medium leading-6">Office 01632 960 233</span>
        </div>
      </div>

      <div className="mk-masthead">
        <nav
          aria-label="Moorhouse & Kent site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="mk-focus flex flex-col rounded-md py-1 text-foreground"
          >
            <span className="text-lg font-semibold tracking-heading">Moorhouse &amp; Kent</span>
            <span className="text-sm text-muted-foreground">Estate agents · Est. 1987</span>
          </Link>

          <div className="ms-auto hidden items-center gap-1 lg:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  data-mk-active={active ? '' : undefined}
                  className={cn(
                    'mk-focus mk-nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-base',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, 'contact')}
            className="mk-action mk-focus ms-2 hidden min-h-12 items-center rounded-md px-6 text-base font-medium lg:inline-flex"
          >
            Book a valuation
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="real-estate-listing-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="mk-focus mk-trigger ms-auto inline-flex min-h-12 items-center gap-2.5 rounded-md px-4 text-base font-medium lg:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="mk-trigger-bar" />
              <span className="mk-trigger-bar" />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="real-estate-listing-navigation"
        hidden={!open}
        className="mk-sheet absolute inset-x-0 top-full lg:hidden"
      >
        {template.navigation.map((item) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              data-mk-active={active ? '' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'mk-focus mk-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
                active ? 'font-medium text-foreground' : 'text-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="mk-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Office 01632 960 233 — weekdays nine to half five, Saturdays nine to one.
        </p>
      </div>
    </header>
  )
}
