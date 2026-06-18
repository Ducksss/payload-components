import { Badge } from '@/components/ui/badge'
import { contentColumnsDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/ContentColumns/Component.tsx
 * (content-columns@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   ContentColumnsBlockData                  → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner-grid wrapper                  → plain grid div (skipped by the class-mirror guard)
 * Badge is the same shadcn primitive the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentColumnsDemo({
  className,
  content = contentColumnsDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { eyebrow, links, paragraphs, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance">{title}</div>
          </div>

          <div className="flex flex-col gap-6">
            {paragraphs.map((paragraph, index) => (
              <p className="text-base leading-7 text-muted-foreground" key={index}>
                {paragraph.text}
              </p>
            ))}

            {links && links.length > 0 ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
