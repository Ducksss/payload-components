'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Northline masthead — an editorial double-deck header: a monospace studio
 * strip above a serif wordmark and wide-tracked index navigation. Interactive
 * semantics (real links, aria-current, the keyboard-operable disclosure) live
 * here, never inside the visual canvas. The mobile menu follows the house
 * pattern from src/components/site/SiteHeader.tsx: Escape closes and returns
 * focus to the trigger, pointerdown outside closes, route changes close. */

export function NorthlineHeader({
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-northline-menu]'))
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
    <header className="border-b border-border bg-background">
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground sm:px-8">
          <span>Amsterdam — New York</span>
          <span className="hidden sm:inline">Brand &amp; Digital Studio, est. 2017</span>
        </div>
      </div>

      <nav
        aria-label="Northline site navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8"
      >
        <Link
          href={templatePreviewHref(template.slug)}
          className="font-serif text-3xl italic leading-none text-foreground"
        >
          Northline<span className="text-brand">.</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {template.navigation.map((item) => {
            const active = activePath === item.path

            return (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'border-b pb-1 font-mono text-xs uppercase tracking-eyebrow transition-colors',
                  active
                    ? 'border-brand text-brand'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="relative md:hidden" data-northline-menu>
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="northline-mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center justify-center border border-border px-3 font-mono text-xs uppercase tracking-eyebrow text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? 'Close' : 'Index'}
          </button>
          <div
            id="northline-mobile-navigation"
            hidden={!open}
            className="absolute right-0 top-11 z-50 flex w-52 flex-col border border-border bg-background shadow-lg"
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
                    'border-b border-border/60 px-4 py-3 font-mono text-xs uppercase tracking-eyebrow transition-colors last:border-b-0',
                    active
                      ? 'bg-secondary text-brand'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}
