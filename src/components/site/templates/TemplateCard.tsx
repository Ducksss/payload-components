import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { TemplateCardPoster } from '@/components/site/templates/TemplateCardPoster'
import { TemplateTrackedLink } from '@/components/site/templates/TemplateTrackedLink'
import { templateCategoryLabels } from '@/lib/site'
import {
  templateDetailHref,
  templatePosterSrc,
  templatePreviewHref,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

/* Posters are captured by tools/templates/capture.ts at a 1280x800 viewport
 * (@2x). Declaring the logical size keeps next/image's aspect ratio exact for
 * both the committed captures and the interim placeholders. */
export const TEMPLATE_POSTER_WIDTH = 1280
export const TEMPLATE_POSTER_HEIGHT = 800

/* One editorial gallery card: poster-led, with the concept status impossible
 * to miss and exactly two actions — explore the indexable detail page, or open
 * the raw full preview. No install command, no price, no capture.
 *
 * Stays a SERVER component (it reads the registry); the poster's springed
 * hover lift is isolated in the TemplateCardPoster client island, and the
 * entrance/filter choreography belongs to TemplateGalleryFilter. */
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

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <Link
            href={detailHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore template
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <TemplateTrackedLink
            event="template_preview_open"
            href={templatePreviewHref(template.slug)}
            properties={{
              page: '',
              revision: template.revision,
              source: 'gallery',
              template: template.slug,
            }}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Open full preview
          </TemplateTrackedLink>
        </div>
      </div>
    </article>
  )
}
