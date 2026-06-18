import { Badge } from '@/components/ui/badge'
import { contentCommunityDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContentCommunity/Component.tsx
 * (content-community@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   <a href> avatar                          → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   ContentCommunityBlockData                → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentCommunityDemo({
  className,
  content = contentCommunityDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { avatars, eyebrow, paragraphs, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-3xl font-medium tracking-title text-balance sm:text-4xl">
              {title}
            </div>

            {paragraphs.map((paragraph, index) => (
              <p className="text-base leading-7 text-muted-foreground" key={index}>
                {paragraph.text}
              </p>
            ))}
          </div>

          {avatars && avatars.length > 0 ? (
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {avatars.map((item, index) => (
                <div
                  className="size-14 overflow-hidden rounded-full border border-border/70"
                  key={index}
                >
                  <div className="h-full w-full bg-muted" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
