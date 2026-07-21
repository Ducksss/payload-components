'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import './theme.css'

/* Relay (saas-launch) template shell — the fictional site's real chrome.
 *
 * Contract: everything renders under data-template-theme='saas-launch'; the
 * header/footer navigate internally via templatePreviewHref; the active page
 * carries aria-current='page'; the mobile menu is keyboard-operable (Escape
 * closes and returns focus to the trigger, outside pointerdown closes, no
 * focus trap — the SiteHeader house pattern); page rhythm between sections is
 * owned here + theme.css, never inside the visual canvas. */

function RelayMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground',
        className,
      )}
    >
      <svg
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 16 16"
      >
        {/* A relayed signal: a step passing between two nodes. */}
        <path d="M2.5 10.5h3l2-5 2 5h3.5" />
        <circle cx="2.5" cy="10.5" fill="currentColor" r="1" stroke="none" />
        <circle cx="13.5" cy="10.5" fill="currentColor" r="1" stroke="none" />
      </svg>
    </span>
  )
}

export function SaasLaunchShell({ activePath, children, template }: TemplateShellProps) {
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
      if (!(event.target instanceof Element) || !event.target.closest('[data-relay-menu]'))
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
    <div
      data-template-theme="saas-launch"
      className="relay-root flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <header className="relay-header sticky top-0 z-40 border-b border-border">
        <nav
          aria-label="Relay site navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <Link
            href={templatePreviewHref(template.slug)}
            className="flex items-center gap-2.5 text-foreground"
            aria-label="Relay home"
          >
            <RelayMark />
            <span className="text-base font-semibold tracking-heading">Relay</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {template.navigation.map((item) => (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={activePath === item.path ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  activePath === item.path
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={templatePreviewHref(template.slug, 'pricing')}
              className="hidden h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:inline-flex"
            >
              Get started
            </Link>

            <div className="relative md:hidden" data-relay-menu>
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls="relay-mobile-navigation"
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                >
                  {open ? (
                    <path d="M3 3l10 10M13 3L3 13" />
                  ) : (
                    <path d="M2 4.5h12M2 8h12M2 11.5h12" />
                  )}
                </svg>
              </button>

              <div
                id="relay-mobile-navigation"
                hidden={!open}
                className="absolute right-0 top-12 z-50 flex w-56 flex-col gap-1 rounded-lg border border-border bg-popover p-2 shadow-lg"
              >
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm transition-colors',
                      activePath === item.path
                        ? 'bg-secondary font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={templatePreviewHref(template.slug, 'pricing')}
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="relay-main flex-1">{children}</main>

      <footer className="relay-footer">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="flex max-w-sm flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <RelayMark />
                <span className="text-base font-semibold tracking-heading text-foreground">
                  Relay
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Product analytics for teams that ship — one governed number for every decision,
                from the first dashboard to the board deck.
              </p>
            </div>

            <nav aria-label="Relay product pages" className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                Product
              </span>
              {template.navigation
                .filter((item) => item.path === 'product' || item.path === 'pricing')
                .map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>

            <nav aria-label="Relay company pages" className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                Company
              </span>
              {template.navigation
                .filter((item) => item.path === 'about' || item.path === 'contact')
                .map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>© 2026 Relay Systems — a fictional company for this concept preview.</span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
