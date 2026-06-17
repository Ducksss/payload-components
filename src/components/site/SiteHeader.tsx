import Link from 'next/link'

import { Github } from 'lucide-react'

import { Wordmark } from '@/components/site/Wordmark'
import { githubRepoUrl } from '@/lib/site'
import { cn } from '@/utilities/ui'

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/components', label: 'Components' },
  { href: '/about', label: 'About' },
] as const

export function SiteHeader({
  activePath,
}: {
  activePath?: (typeof navLinks)[number]['href']
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
      <div className="flex h-14 items-center justify-between gap-4 pl-4 pr-5 md:pr-8">
        <Link href="/" aria-label="Payload Components home">
          <Wordmark mobileIconOnly withBadge />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
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
      </div>
    </header>
  )
}
