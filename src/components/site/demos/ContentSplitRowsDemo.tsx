import { Badge } from '@/components/ui/badge'
import { contentSplitRowsDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContentSplitRows/Component.tsx
 * (content-split-rows@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   ContentSplitRowsBlockData                → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentSplitRowsDemo({
  className,
  content = contentSplitRowsDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { eyebrow, paragraphs, rows, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
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

            {paragraphs.map((paragraph, index) => (
              <p className="text-base leading-7 text-muted-foreground" key={index}>
                {paragraph.text}
              </p>
            ))}
          </div>

          {rows && rows.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/70">
              {rows.map((row, index) => (
                <div
                  className="grid gap-6 py-8 first:pt-0 last:pb-0 sm:grid-cols-2 sm:items-center sm:gap-12"
                  key={index}
                >
                  <div className={index % 2 === 1 ? 'sm:order-last' : undefined}>
                    <div className="overflow-hidden rounded-card border border-border/70">
                      <div className="aspect-[4/3] w-full bg-muted" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-xl font-medium tracking-heading">{row.title}</div>
                    <p className="text-base leading-7 text-muted-foreground">{row.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
