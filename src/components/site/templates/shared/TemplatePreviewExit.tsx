import Link from 'next/link'

import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'
import { templateDetailHref } from '@/lib/templates/registry'

/* Small fixed affordance on raw full-preview routes: names the concept, keeps
 * the "Concept preview" status visible, and routes back to the indexable
 * detail page. Rendered outside the template's visual canvas so it stays real,
 * focusable UI. */
export function TemplatePreviewExit({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Link
        href={templateDetailHref(slug)}
        className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur transition-colors hover:bg-secondary"
      >
        <span aria-hidden="true">←</span>
        <span>
          {title} · {TEMPLATE_CONCEPT_STATUS_LABEL}
        </span>
      </Link>
    </div>
  )
}
