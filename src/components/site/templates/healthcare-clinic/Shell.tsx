import Link from 'next/link'

import type { ReactNode } from 'react'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { AlderHeader } from './AlderHeader'
import './theme.css'

/* Alder Practice (healthcare-clinic) template shell — the calm clinic direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='healthcare-clinic', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and every
 * interactive semantic lives in the shell (never inside the visual canvas).
 *
 * Art direction: soft alder green and sky over warm white, and — uniquely in
 * this gallery — no inverted band anywhere on the site. The whole thing is one
 * room of daylight: warm-white paper, a breath of alder for one band per page, a
 * breath of sky for another, separated by hairlines rather than cards. Section
 * rhythm comes from theme.css through the [data-template-section] / [data-tone]
 * wrappers the renderer emits, and below-hero sections already scroll-reveal via
 * the shared choreography, so nothing here duplicates it.
 *
 * Nothing in this shell moves. That is the design decision, not an omission: the
 * calmest site in the gallery should feel still, and a static header and footer
 * are always complete in a capture. See theme.css for the reduced-motion net
 * that also zeroes the hover/focus transitions.
 *
 * The footer is where a clinic's practical information belongs, so it carries
 * the address, the hours, the pages, and how to reach someone — plus the two
 * disclosures this concept must never be without: the practice is fictional, and
 * nothing on the site is medical advice. */

const findUsLines = [
  '18 Alder Road, Fern Hollow',
  'Step-free entrance from the street',
  'Lift to the first floor',
  'Six spaces behind the building, two wider bays',
] as const

const hoursLines = [
  'Monday to Friday, 8:00 – 18:00',
  'Saturday, 9:00 – 12:00',
  'Closed Sundays and public holidays',
  'Phone lines open at 8:00',
] as const

const contactLines = ['Reception — 555 0118', 'reception@alderpractice.example'] as const

function FooterColumn({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="alder-footer-label text-base font-semibold">{label}</span>
      {children}
    </div>
  )
}

export function HealthcareClinicShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="healthcare-clinic"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <AlderHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="alder-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <p className="max-w-2xl text-2xl leading-9 tracking-heading text-foreground">
            A family clinic on Alder Road. Open six days a week, with time held back every morning
            for the things that cannot wait.
          </p>

          <div className="grid gap-10 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn label="Find us">
              <address className="flex flex-col gap-3 not-italic">
                {findUsLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
              </address>
            </FooterColumn>

            <FooterColumn label="Opening hours">
              <div className="flex flex-col gap-3">
                {hoursLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
              </div>
            </FooterColumn>

            <FooterColumn label="Pages">
              <nav aria-label="Alder Practice footer navigation" className="flex flex-col gap-1">
                {template.navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={templatePreviewHref(template.slug, item.path)}
                    aria-current={activePath === item.path ? 'page' : undefined}
                    className="alder-focus inline-flex min-h-11 w-fit items-center rounded-md pe-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </FooterColumn>

            <FooterColumn label="Getting in touch">
              <div className="flex flex-col gap-3">
                {contactLines.map((line) => (
                  <span key={line} className="text-base leading-7 text-muted-foreground">
                    {line}
                  </span>
                ))}
                <span className="alder-footer-notice text-base leading-7">
                  If this is an emergency, contact your local emergency number.
                </span>
              </div>
            </FooterColumn>
          </div>
        </div>

        <div className="alder-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm leading-6 sm:px-8">
            <span>
              © 2026 Alder Practice — a fictional family clinic invented for this concept preview.
              Nothing on this site is medical advice, and no clinician, service, or figure here is
              real.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
