'use client'

import Link from '@/i18n/Link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Marleford District Council's masthead.
 *
 * Three strips of chrome, all of them still: the crownbar (the fiction
 * disclosure and the phone line on slate — the most-read line on the site is
 * the first one), the masthead (crest, name, nav) closing on the site's
 * thickest task rule, and the mobile sheet (plain full-width paper rows, no
 * floating card, no animation). The crest is a teal shield with the river
 * Marle crossing it, drawn in scoped CSS — no SVG, no image, no real
 * heraldry. Active states ride the aria-current attribute so the visual mark
 * and the accessible state can never disagree.
 *
 * The interaction contract is final: the mobile disclosure is a real <button>
 * carrying aria-expanded + aria-controls, Escape closes it and returns focus
 * to the trigger, pointerdown outside closes, and route changes close.
 * Internal navigation goes through templatePreviewHref and the active page
 * carries aria-current. A civic site's chrome is deliberately still: no
 * entrance animation belongs here. */

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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-sm sm:px-8">
          <span className="leading-6">A fictional district council · Concept preview</span>
          <span className="mdc-crownline ms-auto leading-6">01632 960 700 · 8:30–5</span>
        </div>
      </div>

      <div className="mdc-masthead">
        <nav
          aria-label="Marleford District Council site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="mdc-focus flex items-center gap-3 py-1 text-foreground"
          >
            <span aria-hidden="true" className="mdc-crest" />
            <span className="flex flex-col">
              <span className="mdc-wordmark-name">Marleford District Council</span>
              <span className="mdc-wordmark-sub">
                Marleford · Netherfield · Combe Ash · Priors Halt · Whitmoor
              </span>
            </span>
          </Link>

          <div className="ms-auto hidden items-center gap-1 lg:flex">
            {template.navigation.map((item) => (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={activePath === item.path ? 'page' : undefined}
                className="mdc-focus mdc-nav-link inline-flex min-h-11 items-center px-3.5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="civic-council-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="mdc-focus mdc-trigger ms-auto inline-flex min-h-11 items-center gap-2 px-4 text-base lg:hidden"
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
        {template.navigation.map((item) => (
          <Link
            key={item.path}
            href={templatePreviewHref(template.slug, item.path)}
            aria-current={activePath === item.path ? 'page' : undefined}
            onClick={() => setOpen(false)}
            className={cn(
              'mdc-focus mdc-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
              activePath === item.path && 'font-semibold',
            )}
          >
            {item.label}
          </Link>
        ))}
        <p className="mdc-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Ring 01632 960 700, weekdays 8:30 to 5. In an emergency, contact your local emergency
          number.
        </p>
      </div>
    </header>
  )
}
