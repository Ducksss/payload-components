import type { TemplateShellProps } from '../shells'

import { HalloranFooter } from './HalloranFooter'
import { HalloranHeader } from './HalloranHeader'
import './theme.css'

/* Halloran & Sons (trade-service) template shell — the fictional firm's real
 * chrome, and deliberately the plainest in the gallery.
 *
 * Contract: everything renders beneath data-template-theme='trade-service'; the
 * masthead and footer navigate internally through templatePreviewHref; the
 * active page carries aria-current='page'; the mobile disclosure is
 * keyboard-operable (see HalloranHeader); and every interactive element lives in
 * this chrome, never inside the aria-hidden visual canvas.
 *
 * The one intentional dark surface — the steel facts strip, the tonal contrast
 * bands, and the footer's call band — comes entirely from named tokens in
 * theme.css. The site itself stays forced-light and this template never touches
 * :root, .dark, or globals.css. Section rhythm (full-bleed bands, the hairline
 * between sections, the paper/deep-paper/steel treatments) is styled from
 * theme.css through the [data-template-section] / [data-tone] wrappers the
 * renderer emits. */

export function TradeServiceShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      className="hs-root flex min-h-screen flex-col antialiased"
      data-template-theme="trade-service"
    >
      <HalloranHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <HalloranFooter activePath={activePath} template={template} />
    </div>
  )
}
