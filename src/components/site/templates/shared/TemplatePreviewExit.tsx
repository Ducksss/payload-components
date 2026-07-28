import Link from 'next/link'

import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'
import { templateDetailHref } from '@/lib/templates/registry'

/* Small fixed affordance on raw full-preview routes: names the concept, keeps
 * the "Concept preview" status visible, and routes back to the indexable
 * detail page. Rendered outside the template's visual canvas so it stays real,
 * focusable UI.
 *
 * Being `fixed`, it floats over the concept it is describing — so at narrow
 * widths it is kept small and pushed into the bottom-right corner instead of
 * spanning the middle of the one column the layout has. Centred with the full
 * "{title} · {status}" label it covered a band of hero content at 390px; the
 * title is only dropped from the VISIBLE label, never from the accessible name,
 * so the link still announces which concept it leaves. From `sm` up there is
 * room for the full pill in the middle. */
export function TemplatePreviewExit({ slug, title }: { slug: string; title: string }) {
  return (
    <div
      data-template-preview-exit
      className="fixed bottom-4 right-4 z-50 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
    >
      <Link
        href={templateDetailHref(slug)}
        className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur transition-colors hover:bg-secondary"
      >
        <span aria-hidden="true">←</span>
        <span>
          <span className="sr-only sm:not-sr-only">{title} · </span>
          {TEMPLATE_CONCEPT_STATUS_LABEL}
        </span>
      </Link>
    </div>
  )
}
