import Link from 'next/link'

import type { ReactNode } from 'react'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { FieldnoteCounter } from './FieldnoteCounter'
import './theme.css'

/* Fieldnote (commerce-brand) template shell — the warm shop direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='commerce-brand', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and every
 * interactive semantic lives in the shell (never inside the visual canvas).
 *
 * The composition is full-bleed: sections own their gutters and the theme
 * dissolves the catalog's specimen frames, so pages read as warm tonal bands —
 * cream paper, a deeper sheet of the same stock, and one espresso band per page
 * — separated by hairlines instead of cards. Section rhythm is styled from
 * theme.css through the [data-template-section] / [data-tone] wrappers the
 * renderer emits; below-hero sections already scroll-reveal via the shared
 * choreography, so nothing here duplicates it.
 *
 * All chrome motion lives in FieldnoteCounter (client). The footer is
 * deliberately static: it is the last thing a poster capture reaches, and a
 * still footer can never render half-arrived. */

const visitLines = [
  'The old ribbon mill, 14 Kestrel Street',
  'Counter open Tuesday to Saturday, eight till four',
  'Public cupping every Wednesday at eight',
] as const

const contactLines = ['hello@fieldnote.example', 'wholesale@fieldnote.example'] as const

function FooterColumn({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-eyebrow text-brand">{label}</span>
      {children}
    </div>
  )
}

export function CommerceBrandShell({ activePath, children, template }: TemplateShellProps) {
  const shopPages = template.navigation.filter(
    (item) => item.path === 'collection' || item.path === 'journal',
  )
  const roasteryPages = template.navigation.filter(
    (item) => item.path === 'story' || item.path === 'contact',
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
      data-template-theme="commerce-brand"
      className="flex min-h-screen flex-col bg-background text-foreground antialiased"
    >
      <FieldnoteCounter activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="fieldnote-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <div className="flex flex-col gap-8 border-b border-border pb-12 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
              Twelve kilos at a time, and a date on every bag.
            </p>
            <span className="flex items-center gap-3 text-xs uppercase tracking-eyebrow text-muted-foreground">
              <span aria-hidden="true" className="h-px w-10 shrink-0 bg-brand" />
              Roasting since 2016
            </span>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn label="Shop">
              <nav aria-label="Fieldnote shop pages" className="flex flex-col gap-3">
                {shopPages.map(footerLink)}
              </nav>
            </FooterColumn>

            <FooterColumn label="The roastery">
              <nav aria-label="Fieldnote roastery pages" className="flex flex-col gap-3">
                {roasteryPages.map(footerLink)}
              </nav>
            </FooterColumn>

            <FooterColumn label="Visit">
              <address className="flex flex-col gap-3 not-italic">
                {visitLines.map((line) => (
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

        <div className="fieldnote-rail">
          <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>© 2026 Fieldnote — a fictional roastery for this concept preview.</span>
            <span>Composed from open-source Payload blocks.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
