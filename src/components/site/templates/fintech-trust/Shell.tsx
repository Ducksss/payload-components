import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import './theme.css'

/* Ledgerline (fintech-trust) template shell — FOUNDATION SKELETON.
 *
 * Owned by the Fintech art-direction track: replace with the real Ledgerline
 * header (responsive, keyboard-operable mobile menu), footer, and section
 * rhythm. Contract to preserve: render everything under data-template-theme=
 * 'fintech-trust', use real internal navigation via templatePreviewHref, mark
 * the active page, and keep all interactive semantics here (never inside the
 * visual canvas). */
export function FintechTrustShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div data-template-theme="fintech-trust" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95">
        <nav
          aria-label="Ledgerline site navigation"
          className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
        >
          <Link href={templatePreviewHref(template.slug)} className="text-sm font-semibold">
            Ledgerline
          </Link>
          <div className="flex items-center gap-1">
            {template.navigation.map((item) => (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={activePath === item.path ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  activePath === item.path
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <span>Ledgerline — a fictional product concept</span>
          <span>Composed from open-source Payload blocks</span>
        </div>
      </footer>
    </div>
  )
}
