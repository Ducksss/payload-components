import type { TemplateShellProps } from '../shells'

import { FrameworksFooter } from './FrameworksFooter'
import { FrameworksHeader } from './FrameworksHeader'
import './theme.css'

/* Frameworks ’26 (event-conference) template shell — the fictional conference's
 * real chrome, and the gallery's one near-black concept.
 *
 * Contract: everything renders beneath data-template-theme='event-conference';
 * the masthead and footer navigate internally through templatePreviewHref; the
 * active page carries aria-current='page'; the mobile disclosure is
 * keyboard-operable (see FrameworksHeader); and every interactive element lives
 * in this chrome, never inside the aria-hidden visual canvas.
 *
 * The darkness comes entirely from the scoped tokens in theme.css — the site
 * itself stays forced-light and this template never touches :root or .dark.
 * Section rhythm (full-bleed bands, the violet section rules, and the three
 * tonal treatments) is styled from theme.css through the
 * [data-template-section] / [data-tone] wrappers the renderer emits. */

export function EventConferenceShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      className="fw-root flex min-h-screen flex-col antialiased"
      data-template-theme="event-conference"
    >
      <FrameworksHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <FrameworksFooter activePath={activePath} template={template} />
    </div>
  )
}
