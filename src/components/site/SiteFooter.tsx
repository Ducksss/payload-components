import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { Wordmark } from '@/components/site/SiteHeader'
import { footerColumns, primaryInstallCommand } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Link href="/" aria-label="Payload Kits home" className="inline-block">
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Typed Payload CMS block kits that install with their wiring — collection config,
              render mapping, generated types, and import map in one command.
            </p>
            <code className="mt-6 inline-block rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
              {primaryInstallCommand}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const external = 'external' in link && link.external

                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                          {external ? (
                            <ArrowUpRight
                              className="size-3 text-muted-foreground/70"
                              aria-hidden="true"
                            />
                          ) : null}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">MIT licensed · © 2026 Ducksss</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Payload v3 · Next.js App Router · open registry
          </p>
        </div>
      </div>
    </footer>
  )
}
