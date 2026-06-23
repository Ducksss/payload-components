import { Badge } from '@/components/ui/badge'
import { testimonialsBentoDemoContent, type TestimonialDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TestimonialsBento/Component.tsx
 * (testimonials-bento@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its heading outline)
 *   <Media> upload (avatar + logo)           → monogram / bg-muted placeholders (no DB on the landing)
 *   TestimonialsBentoBlockData               → TestimonialDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper + featured span       → plain / ternary class strings (skipped by the class-mirror guard)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function TestimonialsBentoDemo({
  className,
  content = testimonialsBentoDemoContent,
}: {
  className?: string
  content?: TestimonialDemoContent
}) {
  const { description, eyebrow, items, title } = content

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

            <div className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</div>

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              {items.map((item, index) => (
                <figure
                  className={
                    item.featured
                      ? 'flex flex-col gap-6 rounded-2xl border border-border/70 bg-background/60 p-6 sm:col-span-2 lg:row-span-2'
                      : 'flex flex-col gap-6 rounded-2xl border border-border/70 bg-background/60 p-6'
                  }
                  key={index}
                >
                  {item.featured ? (
                    <div className="flex h-6 items-center">
                      <div className="h-5 w-16 rounded bg-muted" />
                    </div>
                  ) : null}
                  <blockquote className="text-pretty text-sm leading-6 text-foreground">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{item.author}</span>
                      {item.role ? (
                        <span className="text-xs text-muted-foreground">{item.role}</span>
                      ) : null}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
