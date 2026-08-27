import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { TrestleHeader } from './TrestleHeader'
import './theme.css'

/* Trestle (marketplace-wholesale) template shell — two sides of one ledger.
 *
 * The shell stamps two data attributes theme.css keys the mirror grammar on:
 * data-tr-page (deepens the home hero) and data-tr-side — 'shops' on the
 * buyers route, 'makers' on suppliers, 'both' everywhere else — which anchors
 * each page header's wash and spruce edge rule to its own side of the ledger,
 * so the two audience pages render as mirror images of one another.
 *
 * The footer closes every page the way the ledger closes: the two-sided
 * promise as a pull line, then four ruled columns — the pages, the SHOPS DESK
 * and the MAKERS DESK side by side (the footer's own recto/verso), and the
 * office — over a rail carrying the fiction disclosure.
 *
 * Contract (frozen): everything renders beneath
 * data-template-theme='marketplace-wholesale'; internal navigation goes
 * through templatePreviewHref with aria-current on the active page; every
 * interactive element lives in this chrome, never inside the aria-hidden
 * visual canvas. Scoped colour lives in theme.css; nothing here touches
 * :root, .dark, or globals.css. */

const desks = [
  {
    label: 'The shops desk',
    lines: ['Orders, terms, returns, applications.', 'Answered inside a working day.'],
    value: 'shops@trestle.example',
  },
  {
    label: 'The makers desk',
    lines: ['Listings, dispatch, payments.', 'Read by people who have packed a kiln.'],
    value: 'makers@trestle.example',
  },
] as const

export function MarketplaceWholesaleShell({ activePath, children, template }: TemplateShellProps) {
  const side = activePath === 'buyers' ? 'shops' : activePath === 'suppliers' ? 'makers' : 'both'

  return (
    <div
      data-template-theme="marketplace-wholesale"
      data-tr-page={activePath === '' ? 'home' : activePath}
      data-tr-side={side}
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <TrestleHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="tr-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-16">
          <p className="tr-footer-line max-w-2xl">
            Two sides, one ledger — sixty days to pay for the shops, paid on dispatch for the
            makers, one flat commission in the middle.
          </p>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="tr-footer-col flex flex-col gap-3.5">
              <span className="tr-footer-label">The market</span>
              <nav aria-label="Trestle footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    data-tr-active={activePath === item.path ? '' : undefined}
                    className="tr-focus tr-footer-link inline-flex min-h-11 w-fit items-center rounded-md pe-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {desks.map((desk) => (
              <div key={desk.label} className="tr-footer-col flex flex-col gap-3.5">
                <span className="tr-footer-label">{desk.label}</span>
                <span className="tr-footer-strong break-words">{desk.value}</span>
                {desk.lines.map((line) => (
                  <span key={line} className="tr-footer-item">
                    {line}
                  </span>
                ))}
              </div>
            ))}

            <div className="tr-footer-col flex flex-col gap-3.5">
              <span className="tr-footer-label">The office</span>
              <address className="flex flex-col gap-3.5 not-italic">
                <span className="tr-footer-item">Unit 9, Rope Court, Ellsworth</span>
                <span className="tr-footer-item">Weekdays 9–6 · Visitors by arrangement</span>
                <span className="tr-footer-strong">01632 960 512</span>
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
