import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { TrestleHeader } from './TrestleHeader'
import './theme.css'

/* Trestle (marketplace-wholesale) template shell — WAVE 0 SCAFFOLD for the
 * art-direction wave to rework.
 *
 * Contract (final even where visuals are not): everything renders beneath
 * data-template-theme='marketplace-wholesale'; internal navigation goes
 * through templatePreviewHref with aria-current on the active page; every
 * interactive element lives in this chrome, never inside the aria-hidden
 * visual canvas; the footer carries the fictional disclosure. Scoped colour
 * lives in theme.css; nothing here touches :root, .dark, or globals.css. */

export function MarketplaceWholesaleShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="marketplace-wholesale"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <TrestleHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="tr-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
          <p className="max-w-2xl text-2xl leading-9 tracking-heading">
            The wholesale market between people who make things and people who keep shops. Sixty
            days to pay, makers paid on dispatch, one flat commission.
          </p>

          <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="tr-footer-label text-base font-semibold">The market</span>
              <nav aria-label="Trestle footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="tr-focus inline-flex min-h-11 w-fit items-center rounded-md pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <span className="tr-footer-label text-base font-semibold">The desks</span>
              <span className="text-base leading-7 text-muted-foreground">
                shops@trestle.example
              </span>
              <span className="text-base leading-7 text-muted-foreground">
                makers@trestle.example
              </span>
              <span className="text-base leading-7 text-muted-foreground">01632 960 512</span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="tr-footer-label text-base font-semibold">The office</span>
              <address className="flex flex-col gap-3 not-italic">
                <span className="text-base leading-7 text-muted-foreground">
                  Unit 9, Rope Court, Ellsworth
                </span>
                <span className="text-base leading-7 text-muted-foreground">
                  Weekdays 9–6 · Visitors by arrangement
                </span>
              </address>
            </div>
          </div>
        </div>

        <div className="tr-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Trestle — a fictional wholesale marketplace invented for this concept preview.
              Every maker, shop, person, term, and figure here is illustrative, and nothing on this
              site is for sale.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
