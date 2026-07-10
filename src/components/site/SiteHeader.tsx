'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Github } from 'lucide-react'

import { Wordmark } from '@/components/site/Wordmark'
import { githubRepoUrl } from '@/lib/site'
import { cn } from '@/utilities/ui'

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/components', label: 'Components' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const

export function SiteHeader({
  activePath,
}: {
  activePath?: (typeof navLinks)[number]['href']
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }
    const onPointer = (event: PointerEvent) => { if (!(event.target as HTMLElement).closest('[data-mobile-menu]')) setOpen(false) }
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open])
  useEffect(() => { setOpen(false) }, [activePath])
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
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
            <Github className="size-4" aria-hidden="true" />
          </a>

          <Link
            href="/docs"
            className="ml-1 hidden h-8 items-center rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Get started
          </Link>
        </nav>
        <div className="relative sm:hidden" data-mobile-menu>
          <button ref={triggerRef} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open navigation" onClick={() => setOpen((value) => !value)} className="inline-flex size-9 items-center justify-center rounded-md border border-border text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">☰</button>
          {open ? <div id="mobile-navigation" role="menu" className="absolute right-0 top-11 z-50 flex w-48 flex-col gap-1 rounded-lg border border-border bg-background p-2 shadow-lg">
            {[...navLinks, { href: githubRepoUrl, label: 'GitHub' }].map((item) => <Link key={item.label} role="menuitem" href={item.href} target={item.label === 'GitHub' ? '_blank' : undefined} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{item.label}</Link>)}
            <Link role="menuitem" href="/docs" onClick={() => setOpen(false)} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Get started</Link>
          </div> : null}
        </div>
      </div>
    </header>
  )
}
