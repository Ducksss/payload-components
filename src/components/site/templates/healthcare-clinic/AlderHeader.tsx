'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Alder Practice's masthead. Two decks: a practical strip carrying the address,
 * the hours and the telephone number — the three things a worried person
 * actually came for — and the masthead itself.
 *
 * Deliberately motionless. There is no entrance animation, no scroll veil, no
 * transform anywhere: a clinic's chrome should already be there when the page
 * arrives, and a still header can never be captured half-arrived. The only
 * transitions in this file are hover/focus colour changes, and theme.css zeroes
 * even those under prefers-reduced-motion.
 *
 * Interactive semantics live here, never inside the visual canvas. The mobile
 * disclosure follows the house pattern from src/components/site/SiteHeader.tsx:
 * a real <button> carrying aria-expanded + aria-controls, Escape closes it and
 * returns focus to the trigger, pointerdown outside closes, route changes close.
 * The panel is a plain full-width sheet with 56px rows — big, obvious targets
 * for someone using one thumb. The inline navigation only appears at lg: five
 * page labels plus a booking action cannot sit comfortably in a 768px header,
 * and a cramped nav is worse than a sheet. */

/* The address and the telephone number are the two lines that must survive at
   390px, so the hours only appear once there is room for all three on one line —
   a wrapped practical strip reads as clutter, which is the opposite of the job. */
const utilityLines = [
  { hideBelow: false, text: '18 Alder Road, Fern Hollow' },
  { hideBelow: true, text: 'Weekdays 8:00 – 18:00 · Saturday mornings 9:00 – 12:00' },
] as const

function ArchMark() {
  return (
    <svg
      aria-hidden="true"
      className="alder-mark size-7 shrink-0"
      fill="none"
      viewBox="0 0 24 26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.1 25V11.6a8.9 8.9 0 0 1 17.8 0V25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path d="M12 25V13.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

export function AlderHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-alder-menu]'))
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

  const bookingPath = template.navigation.find((item) => item.path === 'book')?.path ?? ''

  return (
    <header data-alder-menu className="alder-header sticky top-0 z-40">
      <div className="alder-utility">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2.5 text-sm sm:px-8">
          {utilityLines.map((line) => (
            <span key={line.text} className={cn('leading-6', line.hideBelow && 'hidden lg:inline')}>
              {line.text}
            </span>
          ))}
          <span className="ms-auto font-medium leading-6">Reception 555 0118</span>
        </div>
      </div>

      <div className="alder-masthead">
        <nav
          aria-label="Alder Practice site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="alder-focus flex items-center gap-3 rounded-md py-1 text-foreground"
          >
            <ArchMark />
            <span className="flex flex-col">
              <span className="text-lg font-semibold tracking-heading">Alder Practice</span>
              <span className="text-sm text-muted-foreground">Family clinic · Fern Hollow</span>
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
                  data-alder-active={active ? '' : undefined}
                  className={cn(
                    'alder-focus alder-nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-base',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, bookingPath)}
            className="alder-action alder-focus ms-2 hidden min-h-12 items-center rounded-md px-6 text-base font-medium lg:inline-flex"
          >
            Book an appointment
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="healthcare-clinic-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="alder-focus alder-trigger ms-auto inline-flex min-h-12 items-center gap-2.5 rounded-md px-4 text-base font-medium lg:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="alder-trigger-bar" />
              <span className="alder-trigger-bar" />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="healthcare-clinic-navigation"
        hidden={!open}
        className="alder-sheet absolute inset-x-0 top-full lg:hidden"
      >
        {template.navigation.map((item) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              data-alder-active={active ? '' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'alder-focus alder-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
                active ? 'font-medium text-foreground' : 'text-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="alder-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Reception 555 0118 — lines open at 8:00. If this is an emergency, contact your local
          emergency number.
        </p>
      </div>
    </header>
  )
}
