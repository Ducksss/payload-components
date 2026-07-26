import type { TemplateShellProps } from '../shells'

import { LedgerlineFooter } from './LedgerlineFooter'
import { LedgerlineHeader } from './LedgerlineHeader'
import './theme.css'

/* Ledgerline (fintech-trust) template shell — the institutional money-movement
 * direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='fintech-trust', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, and every
 * interactive semantic (real links, the keyboard-operable mobile disclosure)
 * lives in the shell — never inside the visual canvas.
 *
 * The composition is full-bleed: theme.css dissolves the catalog's specimen card
 * frames and paints three tonal registers — ink, a raised slate shelf, and an
 * inverted paper band for figures and written guarantees — separated by
 * hairlines. Section rhythm is owned by theme.css via the
 * [data-template-section] / [data-tone] wrappers the renderer emits; below-hero
 * sections already scroll-reveal through the shared choreography. */

export function FintechTrustShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      className="flex min-h-screen flex-col text-foreground antialiased"
      data-template-theme="fintech-trust"
    >
      <LedgerlineHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <LedgerlineFooter activePath={activePath} template={template} />
    </div>
  )
}
