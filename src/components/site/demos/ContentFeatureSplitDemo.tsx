import { Badge } from '@/components/ui/badge'
import { contentFeatureSplitDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

import { ContentDemoIcon } from './ContentDemoIcon'

/* DEMO TWIN of payload-components/source/blocks/ContentFeatureSplit/Component.tsx
 * (content-feature-split@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   ContentFeatureSplitBlockData             → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner-grid wrapper                  → plain grid div (skipped by the class-mirror guard)
 * Badge + the lucide icon map are the same primitives the component installs.
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentFeatureSplitDemo({
  className,
  content = contentFeatureSplitDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { eyebrow, features, paragraphs, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-last overflow-hidden rounded-[1.5rem] border border-border/70 lg:order-first">
            <div className="aspect-[4/3] w-full bg-muted" />
          </div>

          <div className="flex flex-col gap-6">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-[-0.06em] text-balance">{title}</div>

            {paragraphs.map((paragraph, index) => (
              <p className="text-base leading-7 text-muted-foreground" key={index}>
                {paragraph.text}
              </p>
            ))}

            {features && features.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                {features.map((feature, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <div className="flex items-center gap-2">
                      <ContentDemoIcon name={feature.icon} className="size-4" />
                      <div className="text-sm font-medium tracking-[-0.01em]">{feature.title}</div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
