'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Fieldnote's shopfront chrome: an espresso notice strip (the chalkboard above
 * the counter — it scrolls away) over a sticky cream counter carrying the bean
 * mark, the wordmark, the shop index, and one espresso pill action. All real
 * interactive semantics live here, never inside the visual canvas: internal
 * links go through templatePreviewHref, the active page carries aria-current,
 * and the mobile disclosure follows the house pattern from
 * src/components/site/SiteHeader.tsx — Escape closes and returns focus to the
 * trigger, pointerdown outside closes, route changes close, no focus trap.
 *
 * Choreography (transform/opacity only, reduced-motion gated by
 * useReducedMotion AND the scoped CSS net in theme.css so the pre-hydration
 * frame is already final): the notice strip slides down from off-screen, the
 * counter settles from behind the top edge, the mark's ember ring blooms once,
 * and the active index item plants an ember dot. The counter's entrance is
 * transform-only on purpose — an opacity fade would alpha-composite the
 * espresso pill toward the paper mid-animation and transiently drop it below
 * AA, which axe catches. The only opacity move is the veil layer beneath the
 * nav, which brings the ember hairline and the shelf shadow once the reader
 * starts moving. */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function FieldnoteBean({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
    >
      {/* A coffee bean: a narrow ellipse and its centre seam, tipped off-axis
          so the shape reads as a bean rather than a circle at 20px. */}
      <g transform="rotate(-32 12 12)">
        <path d="M12 2.9c2.8 0 5 4.1 5 9.1s-2.2 9.1-5 9.1-5-4.1-5-9.1 2.2-9.1 5-9.1Z" />
        <path d="M12 2.9c-1.7 2.7-1.7 6.4 0 9.1s1.7 6.4 0 9.1" />
      </g>
    </svg>
  )
}

function FieldnoteWordmark({ href, reduce }: { href: string; reduce: boolean }) {
  return (
    <Link href={href} aria-label="Fieldnote home" className="flex items-center gap-3">
      <span className="fieldnote-mark relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-brand">
        <motion.span
          aria-hidden="true"
          className="fieldnote-mark-bloom absolute inset-0 rounded-full motion-reduce:transform-none!"
          data-fieldnote-reveal
          initial={{ scale: 0.62 }}
          animate={{ scale: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.35, duration: 0.9, ease: EASE }}
        />
        <FieldnoteBean className="size-5" />
      </span>
      <span className="text-lg font-medium tracking-heading text-foreground">Fieldnote</span>
    </Link>
  )
}

export function FieldnoteCounter({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion() ?? false

  const shopHref = templatePreviewHref(template.slug, 'collection')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-fieldnote-menu]'))
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

  // The veil is state-driven and rendered by a CSS opacity transition, so
  // reduced motion simply lands the final state (see the net in theme.css).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="fieldnote-bench overflow-hidden">
        <motion.div
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8 motion-reduce:transform-none!"
          data-fieldnote-reveal
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
        >
          <span className="flex items-center gap-2.5 text-xs uppercase tracking-eyebrow">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
            Roasted to order, Tuesdays
          </span>
          <span className="hidden text-xs uppercase tracking-eyebrow sm:inline">
            Public cupping, Wednesdays at eight
          </span>
        </motion.div>
      </div>

      <motion.header
        className="fieldnote-header sticky top-0 z-40"
        data-fieldnote-reveal
        initial={{ y: -16 }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      >
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
          data-fieldnote-header-veil
        />

        <nav
          aria-label="Fieldnote site navigation"
          className="relative mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8"
        >
          <FieldnoteWordmark href={templatePreviewHref(template.slug)} reduce={reduce} />

          <div className="hidden items-center gap-7 md:flex">
            {template.navigation.map((item) => {
              const active = activePath === item.path

              return (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative text-sm transition-colors',
                    active
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    >
                      <motion.span
                        className="block size-1.5 rounded-full bg-brand motion-reduce:transform-none!"
                        data-fieldnote-reveal
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={
                          reduce ? { duration: 0 } : { delay: 0.45, duration: 0.5, ease: EASE }
                        }
                      />
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={shopHref}
              className="hidden h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
            >
              Browse the coffees
            </Link>

            <div className="relative md:hidden" data-fieldnote-menu>
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls="fieldnote-mobile-navigation"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.75"
                  viewBox="0 0 16 16"
                >
                  {open ? (
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                  ) : (
                    <path d="M2.5 5h11M2.5 11h11" />
                  )}
                </svg>
              </button>

              <div
                id="fieldnote-mobile-navigation"
                hidden={!open}
                className="absolute right-0 top-12 z-50 flex w-60 flex-col gap-1 rounded-panel border border-border bg-popover p-3 shadow-lg"
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
                        'flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-secondary font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      {active ? (
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                      ) : null}
                      {item.label}
                    </Link>
                  )
                })}
                <Link
                  href={shopHref}
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  Browse the coffees
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>
    </>
  )
}
