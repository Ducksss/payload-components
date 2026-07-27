import Link from 'next/link'

import type { ReactNode } from 'react'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { RivermouthHeader } from './RivermouthHeader'
import './theme.css'

/* Rivermouth Trust (nonprofit-cause) template shell — the river survey
 * direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='nonprofit-cause', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and every
 * interactive semantic lives in the shell — never inside the visual canvas.
 *
 * The composition is full-bleed: sections own their gutters and the theme
 * dissolves the catalog's specimen frames, so pages read as tonal bands — oat
 * paper, a greener shallow, and one silt band per page — divided by a hairline
 * carrying a small centred gauge tick. Section rhythm is styled from theme.css
 * through the [data-template-section] / [data-tone] wrappers the renderer
 * emits; below-hero sections already scroll-reveal via the shared choreography,
 * so nothing here duplicates it.
 *
 * All chrome motion lives in RivermouthHeader (client). The footer — the Gauge
 * House, where the trust signs off and where the fiction is disclosed — is
 * deliberately static: it is the last thing a poster capture reaches, and a
 * still footer can never render half-arrived. */

const findUsLines = [
  'The Gauge House, Ferney Ford',
  'Work parties meet in the ford car park',
  'First Saturday of the month, half past eight',
] as const

const contactLines = ['hello@rivermouth.example', 'giving@rivermouth.example'] as const

function FooterColumn({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="w-fit border-b-2 border-brand/55 pb-1.5 text-xs font-semibold uppercase tracking-eyebrow text-brand">
        {label}
      </span>
      {children}
    </div>
  )
}

export function NonprofitCauseShell({ activePath, children, template }: TemplateShellProps) {
  const riverPages = template.navigation.filter(
    (item) => item.path === 'work' || item.path === 'impact',
  )
  const takePartPages = template.navigation.filter(
    (item) => item.path === 'involved' || item.path === 'donate',
  )

  const footerLink = (item: { label: string; path: string }) => (
    <Link
      key={item.path}
      href={templatePreviewHref(template.slug, item.path)}
      aria-current={activePath === item.path ? 'page' : undefined}
      className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {item.label}
    </Link>
  )

  return (
    <div
      data-template-theme="nonprofit-cause"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <RivermouthHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="rivermouth-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <div className="flex flex-col gap-8 border-b border-border pb-12 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-3xl font-medium leading-tight tracking-title text-foreground sm:text-4xl">
              Six reaches, nine miles, and a written count of every tree we put in.
            </p>
            <span className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-eyebrow text-muted-foreground">
              <span aria-hidden="true" className="h-4 w-[3px] shrink-0 bg-brand" />
              Working the Corrow since 2009
            </span>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn label="The river">
              <nav aria-label="Rivermouth Trust river pages" className="flex flex-col gap-3">
                {riverPages.map(footerLink)}
              </nav>
            </FooterColumn>

            <FooterColumn label="Take part">
              <nav aria-label="Rivermouth Trust ways to take part" className="flex flex-col gap-3">
                {takePartPages.map(footerLink)}
              </nav>
            </FooterColumn>

            <FooterColumn label="Find us">
              <address className="flex flex-col gap-3 not-italic">
                {findUsLines.map((line) => (
                  <span key={line} className="text-sm leading-6 text-muted-foreground">
                    {line}
                  </span>
                ))}
                {contactLines.map((line) => (
                  <span key={line} className="text-sm text-muted-foreground">
                    {line}
                  </span>
                ))}
              </address>
            </FooterColumn>
          </div>
        </div>

        <div className="rivermouth-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>
              <span className="rivermouth-rail-mark font-medium">Rivermouth Trust</span> — a
              fictional river trust created for this concept preview.
            </span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
