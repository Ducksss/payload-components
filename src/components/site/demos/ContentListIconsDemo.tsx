import { Badge } from '@/components/ui/badge'
import { contentListIconsDemoContent, type ContentListDemoContent } from '@/lib/demo-content'

import { ContentDemoIcon } from './ContentDemoIcon'

/* DEMO TWIN of payload-components/source/blocks/ContentListIcons/Component.tsx
 * (content-list-icons@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   ContentListIconsBlockData                → ContentListDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * Badge + the lucide icon map are the same primitives the component installs.
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentListIconsDemo({
  className,
  content = contentListIconsDemoContent,
}: {
  className?: string
  content?: ContentListDemoContent
}) {
  const { description, eyebrow, items, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="font-serif text-4xl font-medium text-balance">{title}</div>

            {description ? <p className="text-muted-foreground">{description}</p> : null}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 text-sm lg:grid-cols-3">
              {items.map((item, index) => (
                <div className="flex flex-col gap-3 border-t border-border/70 pt-6" key={index}>
                  <ContentDemoIcon name={item.icon} className="size-4 text-muted-foreground" />
                  <p className="leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground">{item.term}</span>{' '}
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
