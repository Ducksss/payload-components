import { Badge } from '@/components/ui/badge'
import { contentImageLeadDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/ContentImageLead/Component.tsx
 * (content-image-lead@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   ContentImageLeadBlockData                → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentImageLeadDemo({
  className,
  content = contentImageLeadDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { eyebrow, links, paragraphs, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="overflow-hidden rounded-[1.5rem] border border-border/70">
            <div className="aspect-[16/7] w-full bg-muted" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-4">
              {eyebrow ? (
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]"
                >
                  {eyebrow}
                </Badge>
              ) : null}

              <div className="text-4xl font-medium tracking-[-0.06em] text-balance">{title}</div>
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
    </div>
  )
}
