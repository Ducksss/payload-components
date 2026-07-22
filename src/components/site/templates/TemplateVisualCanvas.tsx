import type { ReactNode } from 'react'

/* Accessible wrapper for the composed visual concept. The demo twins inside are
 * individually aria-hidden, heading-free, and non-interactive (their contract);
 * this wrapper gives the whole canvas one screen-reader description so the
 * preview page still reads as content rather than silence. Real semantics
 * (H1, nav, footer) belong to the template shell, not this canvas. */
export function TemplateVisualCanvas({
  children,
  summary,
}: {
  children: ReactNode
  summary: string
}) {
  return (
    <div data-template-canvas>
      <p className="sr-only">{summary}</p>
      {children}
    </div>
  )
}
