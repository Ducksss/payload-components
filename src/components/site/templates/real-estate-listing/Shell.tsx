import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { MoorhouseHeader } from './MoorhouseHeader'
import './theme.css'

/* Moorhouse & Kent (real-estate-listing) template shell — WAVE 0 SCAFFOLD.
 *
 * Contract (frozen): everything renders beneath
 * data-template-theme='real-estate-listing'; internal navigation goes through
 * templatePreviewHref; the active page carries aria-current='page'; the mobile
 * disclosure lives in MoorhouseHeader; every interactive element lives in this
 * chrome, never inside the aria-hidden visual canvas. The site stays
 * forced-light — every colour comes from named tokens in theme.css and nothing
 * here touches :root, .dark, or globals.css.
 *
 * Art direction (for the art-direction wave): the listing register — warm
 * stone and slate ink with a brick-red accent, hairline rules, and the
 * assured, surveyed calm of a firm that puts every guide in writing. */

const officeLines = [
  '12 Sheep Street, Abbotsmoor',
  'Weekdays 9:00 – 17:30',
  'Saturdays 9:00 – 13:00',
] as const

const coverageLines = [
  'Abbotsmoor and the five villages of the Vale',
  'Steeple Vale · Lower Cray · Fenny Cross',
  'Marle Hill · Bell End Green',
] as const

export function RealEstateListingShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="real-estate-listing"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <MoorhouseHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="mk-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <p className="max-w-2xl text-2xl leading-9 tracking-heading">
            One office, six people, and about ninety homes a year — every guide in writing, every
            viewing accompanied.
          </p>

          <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-3">
            <div className="flex flex-col gap-4">
              <span className="mk-footer-label text-base font-semibold">The office</span>
              <address className="flex flex-col gap-3 not-italic">
                {officeLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
                <span className="text-base leading-7 text-muted-foreground">
                  office@moorhouseandkent.example · 01632 960 233
                </span>
              </address>
            </div>

            <div className="flex flex-col gap-4">
              <span className="mk-footer-label text-base font-semibold">Where we sell</span>
              <div className="flex flex-col gap-3">
                {coverageLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="mk-footer-label text-base font-semibold">Pages</span>
              <nav aria-label="Moorhouse & Kent footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="mk-focus inline-flex min-h-11 w-fit items-center rounded-md pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mk-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Moorhouse &amp; Kent — a fictional estate agency in a fictional town, invented
              for this concept preview. Every home, person, guide, and figure here is illustrative,
              and no regulator or redress scheme is referenced.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
