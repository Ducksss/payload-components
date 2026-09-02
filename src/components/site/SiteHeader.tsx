'use client'
import Link from '@/i18n/Link'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

import { Menu, X } from 'lucide-react'

import { GitHubMark } from '@/components/site/GitHubMark'
import { LanguageSwitcher } from '@/components/site/LanguageSwitcher'
import { Wordmark } from '@/components/site/Wordmark'
import { localizeHref, normalizeSiteLocale, splitLocalePathname } from '@/i18n/config'
import { githubRepoUrl } from '@/lib/site'
import { cn } from '@/utilities/ui'

const navLinks = [
  { href: '/docs', label: 'docs' },
  { href: '/components', label: 'components' },
  { href: '/templates', label: 'templates' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
] as const

/* Shared by every interactive item in the bar so the keyboard ring is one
   shape across links, the GitHub button and the mobile trigger. */
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function SiteHeader({ activePath }: { activePath?: (typeof navLinks)[number]['href'] }) {
  const [open, setOpen] = useState(false)
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Header')
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  /* Docs is the only full-bleed layout: its brand mark is measured against the
     Fumadocs sidebar rail, not the page container, so the bar runs edge to edge
     there. Every other route centres its content in .container — the bar has to
     ride the same grid or the wordmark floats hundreds of pixels outside it on a
     wide display. */
  const railAligned = splitLocalePathname(pathname || '/').pathname.startsWith('/docs')
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-mobile-menu]'))
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
  /* Fumadocs owns the docs <main> (id="nd-page"); every site page carries
     id="main" on its own landmark. */
  const skipTarget = activePath === '/docs' ? '#nd-page' : '#main'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <a
        href={skipTarget}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-foreground"
      >
        {t('skip')}
      </a>
      <div
        className={cn(
          'flex h-14 items-center justify-between gap-4',
          railAligned ? 'ps-4 pe-5 md:pe-8' : 'container',
        )}
      >
        <Link
          href={localizeHref('/', locale)}
          aria-label={t('home')}
          className={cn('rounded-md', focusRing)}
        >
          <Wordmark mobileIconOnly withBadge />
        </Link>

        {/* The native locale picker sizes itself for the longest of 22 native
            labels. Keep the compact disclosure through tablet widths so those
            names never force the desktop navigation beyond the viewport. */}
        <nav className="hidden items-center gap-1 lg:flex lg:gap-1.5">
          {navLinks.map((item) => {
            const active = activePath === item.href

            return (
              <Link
                key={item.href}
                href={localizeHref(item.href, locale)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  focusRing,
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                {t(`nav.${item.label}`)}
              </Link>
            )
          })}

          <LanguageSwitcher className="ml-1" />

          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t('github')}
            className={cn(
              'ml-1.5 flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
              focusRing,
            )}
          >
            <GitHubMark className="size-4" aria-hidden="true" />
          </a>
        </nav>
        <div className="relative lg:hidden" data-mobile-menu>
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t('closeNavigation') : t('openNavigation')}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary',
              focusRing,
            )}
          >
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
          <div
            id="mobile-navigation"
            hidden={!open}
            className="absolute end-0 top-12 z-50 flex w-52 flex-col gap-1 rounded-lg border border-border bg-background p-2 shadow-lg"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={localizeHref(item.href, locale)}
                onClick={() => setOpen(false)}
                aria-current={activePath === item.href ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  focusRing,
                  activePath === item.href
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {t(`nav.${item.label}`)}
              </Link>
            ))}
            {/* "GitHub" is a brand name and reads the same in every locale, so
                the visible label stays put; the accessible name is localized to
                match the desktop control, which is icon-only and has nothing
                else to announce. */}
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('github')}
              className={cn(
                'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                focusRing,
              )}
            >
              GitHub
            </a>
            <LanguageSwitcher className="mt-1 h-9 w-full justify-between px-2" />
          </div>
        </div>
      </div>
    </header>
  )
}
