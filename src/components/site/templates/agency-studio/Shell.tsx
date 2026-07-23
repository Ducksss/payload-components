import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { NorthlineColophon } from './NorthlineColophon'
import { NorthlineHeader } from './NorthlineHeader'
import './theme.css'

/* Northline (agency-studio) template shell — the editorial studio direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='agency-studio', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and all
 * interactive semantics live in the shell (never inside the visual canvas).
 *
 * The composition is full-bleed: sections own their gutters and the theme
 * dissolves the catalog card frames, so pages read as tonal editorial bands —
 * paper, deeper paper, ink — separated by hairline rules. Section rhythm is
 * styled from theme.css via the [data-template-section] / [data-tone]
 * wrappers the renderer emits.
 *
 * Shell choreography (all reduced-motion gated, final-state safe): the
 * masthead staggers in and tints its hairline on scroll (NorthlineHeader),
 * the footer sign-off draws in like a colophon (NorthlineColophon), and
 * footer index links carry an underline-draw hover. */

const footerStudioLines = [
  'Herengracht 480, 1017 CB Amsterdam',
  '145 Plymouth St, Brooklyn, NY 11201',
] as const

export function AgencyStudioShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="agency-studio"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <NorthlineHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
          <NorthlineColophon signOff="Say one true thing, clearly, everywhere it matters." />

          <div className="grid gap-10 sm:grid-cols-3">
            <nav aria-label="Northline footer index" className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-background/60">
                Index
              </span>
              {template.navigation.map((item) => (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={activePath === item.path ? 'page' : undefined}
                  className="relative w-fit text-sm text-background/80 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-background/70 after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:text-background hover:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-background/60">
                The studio
              </span>
              {footerStudioLines.map((line) => (
                <span key={line} className="text-sm text-background/80">
                  {line}
                </span>
              ))}
              <span className="text-sm text-background/80">
                Open studio, first Thursday monthly
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-eyebrow text-background/60">
                New business
              </span>
              <span className="text-sm text-background/80">new@northline.studio</span>
              <span className="text-sm text-background/80">
                Two honest paragraphs beat a forty-page brief.
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-background/20 pt-6 font-mono text-xs uppercase tracking-eyebrow text-background/60 sm:flex-row">
            <span>© 2026 Northline — a fictional studio concept</span>
            <span>Composed from open-source Payload blocks</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
