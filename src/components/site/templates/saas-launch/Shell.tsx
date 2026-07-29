'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { Transition } from 'motion/react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react'

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
 * owned here + theme.css, never inside the visual canvas.
 *
 * Choreography (all transform/opacity, reduced-motion safe): the header slides
 * in once on load and solidifies after scroll via an opacity-faded veil layer
 * (its backdrop blur is constant, never animated); a 2px cobalt scroll-progress
 * hairline scales along the top; the "Get started" CTA is gently magnetic on
 * hover-capable pointers; footer columns reveal once in view. Elements tagged
 * data-relay-reveal are forced to their final frame by a scoped
 * prefers-reduced-motion net in theme.css, so captures and reduce users always
 * see the finished chrome — even before hydration. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const footerReveal = (reduceMotion: boolean, delay: number) => ({
  initial: { opacity: 0, y: 18 },
  transition: reduceMotion ? { duration: 0 } : { delay, duration: 0.6, ease: EASE_OUT },
  viewport: { margin: '0px 0px -10% 0px', once: true },
  whileInView: { opacity: 1, y: 0 },
})

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

/* The header CTA leans toward a fine pointer within ~12px — a springed
 * translate only, gated off for touch and reduced motion so the link is a
 * plain stationary button everywhere else. */
function MagneticCta({ href }: { href: string }) {
  const reduceMotion = useReducedMotion() ?? false
  const [pointerFine, setPointerFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setPointerFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const magnetic = pointerFine && !reduceMotion

  const pullX = useMotionValue(0)
  const pullY = useMotionValue(0)
  const x = useSpring(pullX, { damping: 18, mass: 0.35, stiffness: 240 })
  const y = useSpring(pullY, { damping: 18, mass: 0.35, stiffness: 240 })

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!magnetic || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    pullX.set(clamp(event.clientX - (rect.left + rect.width / 2), -34, 34) * 0.35)
    pullY.set(clamp(event.clientY - (rect.top + rect.height / 2), -20, 20) * 0.4)
  }
  const handlePointerLeave = () => {
    pullX.set(0)
    pullY.set(0)
  }

  return (
    <motion.div
      className="hidden md:block"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={magnetic ? { x, y } : undefined}
    >
      <Link
        href={href}
        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Get started
      </Link>
    </motion.div>
  )
}

export function SaasLaunchShell({ activePath, children, template }: TemplateShellProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion() ?? false

  /* Scroll-aware chrome: the veil solidifies once the page moves, and the
   * hairline tracks reading progress (springed unless motion is reduced). */
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 24))
  const springProgress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.4,
    stiffness: 180,
  })
  const progress = reduceMotion ? scrollYProgress : springProgress

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
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  return (
    <div
      data-template-theme="saas-launch"
      className="relay-root flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      {/* Transform-only entrance: an opacity fade alpha-composites the cobalt
          CTA toward white mid-animation, transiently dropping it below AA
          (axe scans catch it). Sliding from behind the top edge reads the
          same without ever washing out the button. */}
      <motion.header
        animate={{ y: 0 }}
        className="relay-header sticky top-0 z-40"
        data-relay-reveal
        initial={{ y: -14 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
      >
        {/* Solid state, faded in after the page starts moving. Opacity-only:
            the blur beneath it lives on .relay-header and never animates. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
          data-relay-header-veil
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-brand"
          data-relay-progress
          style={{ scaleX: progress }}
        />
        <nav
          aria-label="Relay site navigation"
          className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
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
            <MagneticCta href={templatePreviewHref(template.slug, 'pricing')} />

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
      </motion.header>

      <main className="relay-main flex-1">{children}</main>

      <footer className="relay-footer">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <motion.div
              className="flex max-w-sm flex-col gap-4"
              data-relay-reveal
              {...footerReveal(reduceMotion, 0)}
            >
              <div className="flex items-center gap-2.5">
                <RelayMark />
                <span className="text-base font-semibold tracking-heading text-foreground">
                  Relay
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Product analytics for teams that ship — one governed number for every decision, from
                the first dashboard to the board deck.
              </p>
            </motion.div>

            <motion.nav
              aria-label="Relay product pages"
              className="flex flex-col gap-3"
              data-relay-reveal
              {...footerReveal(reduceMotion, 0.08)}
            >
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
            </motion.nav>

            <motion.nav
              aria-label="Relay company pages"
              className="flex flex-col gap-3"
              data-relay-reveal
              {...footerReveal(reduceMotion, 0.16)}
            >
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
            </motion.nav>
          </div>

          <motion.div
            className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row"
            data-relay-reveal
            {...footerReveal(reduceMotion, 0.22)}
          >
            <span>© 2026 Relay Systems — a fictional company for this concept preview.</span>
            <span>Composed from open-source Payload blocks.</span>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
