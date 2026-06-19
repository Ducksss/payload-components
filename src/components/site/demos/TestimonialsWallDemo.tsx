import { Badge } from '@/components/ui/badge'
import { testimonialsWallDemoContent, type TestimonialDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TestimonialsWall/Component.tsx
 * (testimonials-wall@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its heading outline)
 *   <Media> upload                           → monogram placeholder (no DB on the landing)
 *   TestimonialsWallBlockData                → TestimonialDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain mx-auto/max-w-5xl flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function TestimonialsWallDemo({
  className,
  content = testimonialsWallDemoContent,
}: {
  className?: string
  content?: TestimonialDemoContent
}) {
  const { description, eyebrow, items, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</div>

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {items.map((item, index) => (
                <figure
                  className="mb-4 flex break-inside-avoid flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-5"
                  key={index}
                >
                  <figcaption className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
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
                  <blockquote className="text-pretty text-sm leading-6 text-muted-foreground">
                    {item.quote}
                  </blockquote>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
