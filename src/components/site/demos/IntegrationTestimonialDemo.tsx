import {
  integrationTestimonialDemoContent,
  type IntegrationDemoContent,
} from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationTestimonial/Component.tsx
 * (integration-testimonial@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark / monogram (no DB on the landing)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function IntegrationTestimonialDemo({
  className,
  content = integrationTestimonialDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, itemDescription, subtext, testimonial } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
                {heading}
              </div>
              {subtext ? (
                <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
              ) : null}
            </div>

            {testimonial ? (
              <figure className="flex flex-col gap-4 border-l-2 border-border pl-5">
                <blockquote className="text-pretty text-sm text-foreground sm:text-base">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                    <span className="text-xs font-medium text-muted-foreground">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{testimonial.author}</span>
                    {testimonial.role ? (
                      <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {demoLogos.slice(0, 6).map((logo) => (
              <div
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-4"
                key={logo.name}
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card">
                  <logo.Icon aria-hidden="true" className="size-5 text-foreground/70" strokeWidth={1.75} />
                </div>
                <div className="text-sm font-medium text-foreground">{logo.name}</div>
                {itemDescription ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{itemDescription}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
