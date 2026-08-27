import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { TansyHeader } from './TansyHeader'
import './theme.css'

/* Tansy (restaurant-bistro) template shell — the candlelit room's chrome.
 *
 * Contract (frozen): everything renders beneath
 * data-template-theme='restaurant-bistro'; internal navigation goes through
 * templatePreviewHref; the active page carries aria-current='page'; the mobile
 * disclosure lives in TansyHeader; every interactive element lives in this
 * chrome, never inside the aria-hidden visual canvas. The site stays
 * forced-light — every colour comes from named tokens in theme.css and nothing
 * here touches :root, .dark, or globals.css.
 *
 * Art direction: the page opens and closes on the same night ink — the
 * utility strip above the masthead and the rail under the footer — so every
 * page is bracketed by evening while the room between stays warm cream. The
 * footer is where a dining room's practical facts live: the hours, the
 * address, the phone, set under copper small-caps labels, beneath one closing
 * line in the menu serif. Nothing in this shell moves; an unhurried room
 * holds still (theme.css nets the hover transitions under reduced motion). */

const hoursLines = [
  'Dinner from six, Wednesday to Sunday',
  'Sunday lunch from twelve',
  'The kitchen rests Monday and Tuesday',
] as const

const findUsLines = [
  '4 Weir Street, Porthmere',
  'The blue door, two minutes up from the harbour steps',
] as const

export function RestaurantBistroShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="restaurant-bistro"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <TansyHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="tansy-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <p className="tansy-footer-line max-w-2xl text-3xl leading-10">
            A small dining room by the harbour wall. The menu is written at four; the phone is
            answered from three.
          </p>

          <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-3">
            <div className="flex flex-col gap-4">
              <span className="tansy-footer-label">Hours</span>
              <div className="flex flex-col gap-3">
                {hoursLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="tansy-footer-label">Find us</span>
              <address className="flex flex-col gap-3 not-italic">
                {findUsLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
                <span className="text-base leading-7 text-muted-foreground">
                  joan@tansy.example · 01632 960 447
                </span>
              </address>
            </div>

            <div className="flex flex-col gap-4">
              <span className="tansy-footer-label">Pages</span>
              <nav aria-label="Tansy footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="tansy-focus inline-flex min-h-11 w-fit items-center rounded-md pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="tansy-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Tansy — a fictional dining room in a fictional town, invented for this concept
              preview. Every person, supplier, review, and figure here is illustrative.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
