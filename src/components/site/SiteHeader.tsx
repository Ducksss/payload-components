'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Github } from 'lucide-react'

import { githubRepoUrl } from '@/lib/site'
import { cn } from '@/utilities/ui'

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/components', label: 'Components' },
  { href: '/about', label: 'About' },
] as const

export function Wordmark({ withBadge = false }: { withBadge?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-md bg-brand font-mono text-[13px] font-semibold leading-none text-brand-foreground"
      >
        &gt;
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Payload Components
      </span>
      {withBadge ? (
        <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          alpha
        </span>
      ) : null}
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" aria-label="Payload Components home">
          <Wordmark withBadge />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

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
      </div>
    </header>
  )
}
