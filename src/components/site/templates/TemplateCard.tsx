import type { TemplateShowcase } from '@/lib/templates/types'

import { TemplateCardPoster } from '@/components/site/templates/TemplateCardPoster'
import { templateCategoryLabels } from '@/lib/site'
import {
  templateDetailHref,
  templatePosterSrc,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

/* Posters are captured by tools/templates/capture.ts at a 1280x800 viewport
 * (@2x). Declaring the logical size keeps next/image's aspect ratio exact for
 * both the committed captures and the interim placeholders. */
export const TEMPLATE_POSTER_WIDTH = 1280
export const TEMPLATE_POSTER_HEIGHT = 800

export function TemplateCard({
  priority = false,
  template,
}: {
  priority?: boolean
  template: TemplateShowcase
}) {
  const detailHref = templateDetailHref(template.slug)
  const blockCount = uniqueTemplateBlockSlugs(template).length

  return (
    <article className="group flex flex-col overflow-hidden rounded-frame border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-frame">
      <TemplateCardPoster
        alt={`${template.title} template — home page concept poster`}
        height={TEMPLATE_POSTER_HEIGHT}
        href={detailHref}
        label={`Explore the ${template.title} template`}
        priority={priority}
        sizes="(min-width: 64rem) 44rem, 100vw"
        src={templatePosterSrc(template.slug)}
        width={TEMPLATE_POSTER_WIDTH}
      />

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
            {templateCategoryLabels[template.category]}
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-border sm:inline-block" />
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
            {TEMPLATE_CONCEPT_STATUS_LABEL}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-heading text-foreground">
            {template.title}
          </h2>
          <p className="text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {template.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ul className="flex flex-wrap items-center gap-1.5" aria-label="Visual tone">
            {template.visualTone.map((tone) => (
              <li
                key={tone}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tone}
              </li>
            ))}
          </ul>
          <p className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
            {template.pages.length} pages · {blockCount} unique blocks
          </p>
        </div>
      </div>
    </article>
  )
}
