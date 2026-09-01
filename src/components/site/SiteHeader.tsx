'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { GitHubMark } from '@/components/site/GitHubMark'
import { Wordmark } from '@/components/site/Wordmark'
import { githubRepoUrl } from '@/lib/site'
import { cn } from '@/utilities/ui'

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/components', label: 'Components' },
  { href: '/templates', label: 'Templates' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const

export function SiteHeader({ activePath }: { activePath?: (typeof navLinks)[number]['href'] }) {
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
      <a
        href={skipTarget}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-foreground"
      >
        Skip to content
      </a>
      <div className="flex h-14 items-center justify-between gap-4 pl-4 pr-5 md:pr-8">
        <Link href="/" aria-label="Payload Components home">
          <Wordmark mobileIconOnly withBadge />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex sm:gap-1.5">
          {navLinks.map((item) => {
            const active = activePath === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}

          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:ml-1"
          >
            <GitHubMark className="size-4" aria-hidden="true" />
          </a>
        </nav>
        <div className="relative sm:hidden" data-mobile-menu>
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ☰
          </button>
          <div
            id="mobile-navigation"
            hidden={!open}
            className="absolute right-0 top-11 z-50 flex w-48 flex-col gap-1 rounded-lg border border-border bg-background p-2 shadow-lg"
          >
            {[...navLinks, { href: githubRepoUrl, label: 'GitHub' }].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.label === 'GitHub' ? '_blank' : undefined}
                rel={item.label === 'GitHub' ? 'noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  activePath === item.href
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
