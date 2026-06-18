import { Badge } from '@/components/ui/badge'
import { contentListDemoContent, type ContentListDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContentList/Component.tsx
 * (content-list@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   ContentListBlockData                     → ContentListDemoContent (@/payload-types is consumer-only)
 *   cn() inner-grid wrapper                  → plain grid div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentListDemo({
  className,
  content = contentListDemoContent,
}: {
  className?: string
  content?: ContentListDemoContent
}) {
  const { eyebrow, items, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-3xl gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="font-serif text-4xl font-medium text-balance">{title}</div>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-6">
              {items.map((item, index) => (
                <p className="text-muted-foreground" key={index}>
                  <span className="font-medium text-foreground">{item.term}</span> {item.description}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
