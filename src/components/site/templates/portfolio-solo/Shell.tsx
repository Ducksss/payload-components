import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'

import { RenkoHeader } from './RenkoHeader'
import { RenkoSignOff } from './RenkoSignOff'
import './theme.css'

/* Ilse Renko (portfolio-solo) template shell — the restrained personal
 * direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='portfolio-solo', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and all
 * interactive semantics live in the shell (never inside the visual canvas).
 *
 * The composition is one narrow column on a wide sheet: header, sections and
 * footer all share the same 64rem measure and the same gutters, and the whole
 * site is separated by hairline rules rather than cards or bands. Section
 * rhythm, the ruled boundaries and the monospace gutter index are styled from
 * theme.css via the [data-template-section] / [data-tone] wrappers the renderer
 * emits.
 *
 * The chrome never inverts — the only dark surface on the whole site is the
 * home page's record band. A personal site's footer belongs on the same paper
 * as its pages, so this one carries a sign-off, a "currently" note, and the
 * date the site was last touched, all in the maker's own voice. */

const currentlyLines = [
  'Finishing a design system for Kaskad’s freight console.',
  'Rewriting the Lume Type licensing flow.',
  'Taking new projects from October.',
] as const

const elsewhereLines = ['ilse@renko.studio', 'Notes, monthly-ish', 'Tallinn — EET (UTC+3)'] as const

export function PortfolioSoloShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="portfolio-solo"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <RenkoHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <RenkoSignOff signOff="Written, designed, and deployed by the same person." />

          <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
            <nav aria-label="Ilse Renko footer navigation" className="flex flex-col gap-3">
              <span className="font-mono text-xs lowercase text-muted-foreground">index</span>
              {template.navigation.map((item) => (
                <Link
                  key={item.path}
                  href={templatePreviewHref(template.slug, item.path)}
                  aria-current={activePath === item.path ? 'page' : undefined}
                  className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs lowercase text-muted-foreground">currently</span>
              {currentlyLines.map((line) => (
                <span key={line} className="text-sm leading-6 text-muted-foreground">
                  {line}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs lowercase text-muted-foreground">elsewhere</span>
              {elsewhereLines.map((line) => (
                <span key={line} className="text-sm leading-6 text-muted-foreground">
                  {line}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
            <span>© 2026 Ilse Renko — a fictional maker, invented for this concept</span>
            <span>Last touched 12 July 2026 · composed from open-source Payload blocks</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
