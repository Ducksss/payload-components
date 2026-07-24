import Image from 'next/image'

import { ArrowUpRight } from 'lucide-react'

import type { TemplateShowcase } from '@/lib/templates/types'

import {
  TEMPLATE_POSTER_HEIGHT,
  TEMPLATE_POSTER_WIDTH,
} from '@/components/site/templates/TemplateCard'
import { TemplateTrackedLink } from '@/components/site/templates/TemplateTrackedLink'
import { templatePagePosterSrc, templatePreviewHref } from '@/lib/templates/registry'

/* "Pages included" — one poster card per page of the fictional site, each
 * opening that page in the raw full preview. Posters share the capture tool's
 * 1280x800 logical frame; all of them sit below the detail preview, so they
 * stay lazy. */
export function TemplatePagesGrid({ template }: { template: TemplateShowcase }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {template.pages.map((page) => (
        <TemplateTrackedLink
          key={page.path}
          event="template_preview_open"
          href={templatePreviewHref(template.slug, page.path)}
          properties={{
            page: page.path,
            revision: template.revision,
            source: 'detail',
            template: template.slug,
          }}
          className="group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="relative block overflow-hidden border-b border-border bg-muted/40">
            <Image
              alt={`${template.title} template — ${page.label} page concept poster`}
              className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              height={TEMPLATE_POSTER_HEIGHT}
              loading="lazy"
              sizes="(min-width: 64rem) 28rem, (min-width: 40rem) 50vw, 100vw"
              src={templatePagePosterSrc(template.slug, page.path)}
              width={TEMPLATE_POSTER_WIDTH}
            />
          </span>
          <span className="flex flex-1 flex-col gap-1.5 p-5">
            <span className="flex items-center justify-between gap-2">
              <span className="text-base font-medium text-foreground">{page.label}</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground transition-colors group-hover:text-brand">
                Preview
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{page.description}</span>
          </span>
        </TemplateTrackedLink>
      ))}
    </div>
  )
}
