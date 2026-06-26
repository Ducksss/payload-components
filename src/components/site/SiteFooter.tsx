import Link from 'next/link'

import { ArrowUpRight, Github, Mail } from 'lucide-react'

import { Wordmark } from '@/components/site/Wordmark'
import { footerColumns, githubRepoUrl, primaryInstallCommand, supportEmail } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      {/* Quiet emerald hairline tying the footer to the brand accent. */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />
      <div className="container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <Link href="/" aria-label="Payload Components home" className="inline-block">
              <Wordmark withBadge />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Typed Payload CMS components that install with their wiring — collection config,
              render mapping, generated types, and import map in one command.
            </p>
            <div className="mt-6 flex w-fit items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
              <span aria-hidden="true" className="font-semibold text-brand">
                &gt;
              </span>
              <code className="text-muted-foreground">{primaryInstallCommand}</code>
            </div>
            <div className="mt-6 flex max-w-sm flex-col items-start gap-3">
              <Link
                href={githubRepoUrl}
                rel="noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub
                <ArrowUpRight className="size-3 text-muted-foreground/70" aria-hidden="true" />
              </Link>
              <Link
                href={`mailto:${supportEmail}`}
                className="inline-flex max-w-full items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="break-all text-left">{supportEmail}</span>
              </Link>
            </div>
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
                    const accent = 'accent' in link && link.accent

                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
                          className={
                            accent
                              ? 'group inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand/80'
                              : 'inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
                          }
                        >
                          {link.label}
                          {external ? (
                            <ArrowUpRight
                              className="size-3 text-muted-foreground/70"
                              aria-hidden="true"
                            />
                          ) : null}
                          {accent ? (
                            <ArrowUpRight
                              className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
