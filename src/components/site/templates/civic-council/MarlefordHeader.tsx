'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Marleford District Council's masthead — WAVE 0 SCAFFOLD for the
 * art-direction wave to rework.
 *
 * The interaction contract is final even where the visuals are not: the mobile
 * disclosure is a real <button> carrying aria-expanded + aria-controls, Escape
 * closes it and returns focus to the trigger, pointerdown outside closes, and
 * route changes close. Internal navigation goes through templatePreviewHref and
 * the active page carries aria-current. A civic site's chrome should be still
 * and obvious: no entrance animation belongs here. */

export function MarlefordHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-marleford-menu]'))
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
    <header data-marleford-menu className="mdc-header sticky top-0 z-40">
      <div className="mdc-crownbar">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2 text-sm sm:px-8">
          <span className="leading-6">A fictional district council · Concept preview</span>
          <span className="ms-auto font-medium leading-6">01632 960 700 · 8:30–5</span>
        </div>
      </div>

      <div className="mdc-masthead">
        <nav
          aria-label="Marleford District Council site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="mdc-focus flex flex-col rounded-md py-1 text-foreground"
          >
            <span className="text-lg font-bold tracking-heading">Marleford District Council</span>
            <span className="text-sm text-muted-foreground">
              Marleford · Netherfield · Combe Ash · Priors Halt · Whitmoor
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
                  className={cn(
                    'mdc-focus mdc-nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-base',
                    active
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="civic-council-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="mdc-focus mdc-trigger ms-auto inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-base font-medium lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="civic-council-navigation"
        hidden={!open}
        className="mdc-sheet absolute inset-x-0 top-full lg:hidden"
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
                'mdc-focus mdc-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
                active && 'font-semibold',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="mdc-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Ring 01632 960 700, weekdays 8:30 to 5. In an emergency, contact your local emergency
          number.
        </p>
      </div>
    </header>
  )
}
