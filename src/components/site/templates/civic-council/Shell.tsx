import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { MarlefordHeader } from './MarlefordHeader'
import './theme.css'

/* Marleford District Council (civic-council) template shell.
 *
 * Contract: everything renders beneath data-template-theme='civic-council';
 * internal navigation goes through templatePreviewHref with aria-current on
 * the active page; every interactive element lives in this chrome, never
 * inside the aria-hidden visual canvas; the footer carries the fictional
 * disclosure and the generic emergency note — both are fiction-safety
 * surfaces and stay. Scoped colour lives in theme.css; nothing here touches
 * :root, .dark, or globals.css.
 *
 * The footer is the committee slate (the theme's contrast remap covers
 * .mdc-footer, so the semantic utility classes below resolve dark-safe),
 * entered over a 6px teal task rule: crest and name first, then pages, the
 * phone line, and the Guildhall, then the disclosure rail. A civic site's
 * chrome is deliberately still — no entrances, no reveals, nothing moves. */

export function CivicCouncilShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="civic-council"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <MarlefordHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="mdc-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="mdc-crest" />
            <span className="mdc-footer-name">Marleford District Council</span>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="mdc-footer-label">Pages</span>
              <nav
                aria-label="Marleford District Council footer navigation"
                className="flex flex-col gap-1"
              >
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="mdc-focus inline-flex min-h-11 w-fit items-center pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <span className="mdc-footer-label">Reach us</span>
              <span className="text-base leading-7 text-muted-foreground">
                01632 960 700 · weekdays 8:30–5
              </span>
              <span className="text-base leading-7 text-muted-foreground">
                hello@marleford.example
              </span>
              <span className="mdc-footer-notice text-base leading-7">
                In an emergency, contact your local emergency number.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="mdc-footer-label">The Guildhall</span>
              <address className="flex flex-col gap-3 not-italic">
                <span className="text-base leading-7 text-muted-foreground">
                  Bridge Street, Marleford
                </span>
                <span className="text-base leading-7 text-muted-foreground">
                  Step-free from the street · Hearing loop at every desk
                </span>
                <span className="text-base leading-7 text-muted-foreground">
                  Desk open 8:30–5, Saturday 9–12
                </span>
              </address>
            </div>
          </div>
        </div>

        <div className="mdc-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Marleford District Council — a fictional local authority invented for this
              concept preview. Every place, person, meeting, service, and figure here is
              illustrative, and nothing on this site is guidance from any real authority.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
