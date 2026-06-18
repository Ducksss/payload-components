import { Badge } from '@/components/ui/badge'
import { contentListColumnsDemoContent, type ContentListDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContentListColumns/Component.tsx
 * (content-list-columns@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   ContentListColumnsBlockData              → ContentListDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentListColumnsDemo({
  className,
  content = contentListColumnsDemoContent,
}: {
  className?: string
  content?: ContentListDemoContent
}) {
  const { eyebrow, items, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12">
              {items.map((item, index) => (
                <p className="border-t border-border/70 pt-6 text-muted-foreground" key={index}>
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
