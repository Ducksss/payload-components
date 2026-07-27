'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Ilse Renko's masthead — one thin deck, aligned to the same 64rem measure the
 * sections use, so the wordmark sits exactly above the content edge.
 *
 * Deliberately still: no entrance animation, no scroll behaviour, no second
 * deck. The only moving part in the whole shell is the footer sign-off. The one
 * mark of state is a slate hairline under the current page — the accent's first
 * of about five appearances per page.
 *
 * Interactive semantics live here, never inside the visual canvas. The mobile
 * disclosure follows the house pattern from src/components/site/SiteHeader.tsx:
 * a real <button> carrying aria-expanded + aria-controls, Escape closes and
 * returns focus to the trigger, pointerdown outside closes, route changes
 * close. Its panel is a full-width sheet flush under the masthead rather than a
 * floating card — chrome-free, like the rest of the site. */

export function RenkoHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-ir-menu]'))
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
    <header
      data-ir-menu
      className="sticky top-0 z-40 border-b border-border bg-background"
    >
      <nav
        aria-label="Ilse Renko site navigation"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-12"
      >
        <Link
          href={templatePreviewHref(template.slug)}
          className="flex items-baseline gap-3 text-foreground"
        >
          <span className="text-sm font-medium tracking-tight">Ilse Renko</span>
          <span aria-hidden="true" className="hidden text-muted-foreground sm:inline">
            ·
          </span>
          <span className="hidden font-mono text-xs lowercase text-muted-foreground sm:inline">
            designer &amp; developer
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {template.navigation.map((item) => {
            const active = activePath === item.path

            return (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-1 text-sm transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    data-ir-nav-rule
                    className="absolute inset-x-0 -bottom-0.5 h-px"
                  />
                ) : null}
              </Link>
            )
          })}
        </div>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="portfolio-solo-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-8 items-center border border-border px-2.5 font-mono text-xs lowercase text-foreground transition-colors hover:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          {open ? 'close' : 'menu'}
        </button>
      </nav>

      <div
        id="portfolio-solo-navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background md:hidden"
      >
        {template.navigation.map((item, index) => {
          const active = activePath === item.path

          return (
            <Link
              key={item.path}
              href={templatePreviewHref(template.slug, item.path)}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-t border-border px-6 py-3.5 text-sm transition-colors first:border-t-0 sm:px-8',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
