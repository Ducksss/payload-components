import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { PaleMeridianHeader } from './PaleMeridianHeader'
import './theme.css'

/* Pale Meridian (music-artist) template shell — WAVE 0 SCAFFOLD.
 *
 * Contract (frozen): everything renders beneath
 * data-template-theme='music-artist'; internal navigation goes through
 * templatePreviewHref; the active page carries aria-current='page'; the mobile
 * disclosure lives in PaleMeridianHeader; every interactive element lives in
 * this chrome, never inside the aria-hidden visual canvas. The site stays
 * forced-light — this concept's night-time surfaces come entirely from named
 * tokens in theme.css and nothing here touches :root, .dark, or globals.css.
 *
 * Art direction (for the art-direction wave): the gig-poster register —
 * sodium-lamp amber on near-black indigo with bone-white type. Flyposted, not
 * lanyarded; distinct from event-conference's institutional dark. */

const bandLines = [
  'Vesper Lindqvist · Row Okafor',
  'Juno Marsh · Kit Aldercott',
  'Managed by Mabel Finch',
] as const

const labelLines = [
  'Laundrette Tapes',
  'The room above the laundrette,',
  'Meridian Street, Fennworth',
] as const

export function MusicArtistShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="music-artist"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <PaleMeridianHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="pm-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <p className="max-w-2xl text-2xl leading-9 tracking-heading">
            Four records, one van, and the room above the laundrette. The letters go out once a
            month; the list hears everything first.
          </p>

          <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-3">
            <div className="flex flex-col gap-4">
              <span className="pm-footer-label text-base font-semibold">The band</span>
              <div className="flex flex-col gap-3">
                {bandLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="pm-footer-label text-base font-semibold">The label</span>
              <div className="flex flex-col gap-3">
                {labelLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
                <span className="text-base leading-7 text-muted-foreground">
                  hello@palemeridian.example
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="pm-footer-label text-base font-semibold">Pages</span>
              <nav aria-label="Pale Meridian footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="pm-focus inline-flex min-h-11 w-fit items-center rounded-md pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="pm-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Pale Meridian — a fictional band on a fictional label, invented for this
              concept preview. Every member, venue, zine, and figure here is illustrative, and
              nothing on this site is for sale.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
