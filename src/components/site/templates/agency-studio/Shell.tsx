import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import './theme.css'

/* Northline (agency-studio) template shell — FOUNDATION SKELETON.
 *
 * Owned by the Agency art-direction track: replace with the real Northline
 * header (responsive, keyboard-operable mobile menu), footer, and editorial
 * rhythm — materially different from Relay. Contract to preserve: render
 * everything under data-template-theme='agency-studio', use real internal
 * navigation via templatePreviewHref, mark the active page, and keep all
 * interactive semantics here (never inside the visual canvas). */
export function AgencyStudioShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div data-template-theme="agency-studio" className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <nav
          aria-label="Northline site navigation"
          className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"
        >
          <Link href={templatePreviewHref(template.slug)} className="text-base font-semibold">
            Northline
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

      <main className="mx-auto flex max-w-5xl flex-col gap-20 px-4 py-20 sm:px-6">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <span>Northline — a fictional studio concept</span>
          <span>Composed from open-source Payload blocks</span>
        </div>
      </footer>
    </div>
  )
}
