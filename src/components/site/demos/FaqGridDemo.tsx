import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { faqGridDemoContent, type FaqDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/FaqGrid/Component.tsx
 * (faq-grid@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}>  → <div> root (no landmark)
 *   <h2> / <h3>                               → <div> (the catalog owns its outline)
 *   FaqGridBlockData                          → FaqDemoContent (@/payload-types is consumer-only)
 * Badge + Card are the same shadcn primitives the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

export function FaqGridDemo({
  className,
  content = faqGridDemoContent,
}: {
  className?: string
  content?: FaqDemoContent
}) {
  const { description, eyebrow, items, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="mx-auto w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item, index) => (
                <Card
                  key={index}
                  className="border-border/70 bg-background/85 p-6 shadow-none"
                >
                  <div className="text-base font-medium tracking-title">{item.question}</div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
