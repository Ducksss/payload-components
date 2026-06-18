import { Badge } from '@/components/ui/badge'
import { contentQuoteDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContentQuote/Component.tsx
 * (content-quote@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   ContentQuoteBlockData                    → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner-grid wrapper                  → plain grid div (skipped by the class-mirror guard)
 * <blockquote>/<cite> are non-focusable, non-heading elements — kept real.
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentQuoteDemo({
  className,
  content = contentQuoteDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { citation, eyebrow, paragraphs, quote, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="overflow-hidden rounded-panel border border-border/70">
            <div className="aspect-[4/3] w-full bg-muted" />
          </div>

          <div className="flex flex-col gap-6">
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

            <blockquote className="border-l-2 border-border pl-4">
              <p className="text-base leading-7 text-foreground">{quote}</p>
              <div className="mt-4 flex flex-col gap-3">
                <cite className="text-sm font-medium not-italic text-foreground">{citation}</cite>
                <div className="h-6 w-20 bg-muted opacity-70" />
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}
