'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Pale Meridian's masthead — the top edge of the poster. An amber tape strip
 * runs along the very top (painted by .pm-masthead in theme.css), the
 * wordmark is set at poster weight with the release as an amber sticker that
 * never quite goes on straight, and the nav is small tracked uppercase with
 * an amber underline on the active page.
 *
 * The interaction contract is frozen and survives the restyle unchanged: a
 * real <button> trigger with aria-expanded + aria-controls, Escape closes
 * the disclosure AND returns focus to the trigger, pointerdown outside
 * closes, route changes close, and every interactive element lives in this
 * chrome, never inside the aria-hidden visual canvas. Pattern follows
 * src/components/site/SiteHeader.tsx via the shipped template headers. */

export function PaleMeridianHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-pm-menu]'))
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
    <header data-pm-menu className="pm-header sticky top-0 z-40">
      <div className="pm-masthead">
        <nav
          aria-label="Pale Meridian site navigation"
          className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="pm-focus flex items-center gap-3 rounded-md py-1 text-foreground"
          >
            <span className="pm-wordmark uppercase">Pale Meridian</span>
            <span className="pm-release hidden sm:inline">Sodium Lights · out now</span>
          </Link>

          <div className="ms-auto hidden items-center gap-1 lg:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  data-pm-active={active ? '' : undefined}
                  className={cn(
                    'pm-focus pm-nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-base',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href={templatePreviewHref(template.slug, 'tour')}
            className="pm-action pm-focus ms-2 hidden min-h-12 items-center rounded-md px-6 text-base font-medium lg:inline-flex"
          >
            Tour dates
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-controls="music-artist-navigation"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="pm-focus pm-trigger ms-auto inline-flex min-h-12 items-center gap-2.5 rounded-md px-4 text-base font-medium lg:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="pm-trigger-bar" />
              <span className="pm-trigger-bar" />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </div>

      <div
        id="music-artist-navigation"
        hidden={!open}
        className="pm-sheet absolute inset-x-0 top-full lg:hidden"
      >
        {template.navigation.map((item) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              data-pm-active={active ? '' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'pm-focus pm-sheet-link flex min-h-14 items-center px-5 text-lg sm:px-8',
                active ? 'font-medium text-foreground' : 'text-foreground',
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <p className="pm-sheet-note px-5 py-4 text-base leading-7 sm:px-8">
          Eighteen nights this autumn — tickets from each venue’s own box office.
        </p>
      </div>
    </header>
  )
}
