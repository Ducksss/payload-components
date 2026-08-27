'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Trestle's masthead — WAVE 0 SCAFFOLD for the art-direction wave to rework.
 *
 * The interaction contract is final even where the visuals are not: the mobile
 * disclosure is a real <button> carrying aria-expanded + aria-controls, Escape
 * closes it and returns focus to the trigger, pointerdown outside closes, and
 * route changes close. Internal navigation goes through templatePreviewHref and
 * the active page carries aria-current. */

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
    <header data-trestle-menu className="tr-header sticky top-0 z-40">
      <div className="tr-utility">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2 text-sm sm:px-8">
          <span className="leading-6">Sixty days to pay · Makers paid on dispatch</span>
          <span className="ms-auto hidden font-medium leading-6 sm:inline">
            The wholesale market
          </span>
        </div>
      </div>

      <div className="tr-masthead">
        <nav
          aria-label="Trestle site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="tr-focus flex items-baseline gap-2 rounded-md py-1 text-foreground"
          >
            <span className="text-lg font-semibold tracking-heading">Trestle</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Makers × shops · Ellsworth
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
                    'tr-focus tr-nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-base',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, 'buyers')}
            className="tr-action tr-focus ms-2 hidden min-h-11 items-center rounded-md px-5 text-base font-medium lg:inline-flex"
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
            className="tr-focus tr-trigger ms-auto inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-base font-medium lg:hidden"
          >
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
      </div>
    </header>
  )
}
