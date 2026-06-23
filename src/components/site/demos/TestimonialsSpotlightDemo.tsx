import { Quote } from 'lucide-react'

import { testimonialsSpotlightDemoContent, type TestimonialDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TestimonialsSpotlight/Component.tsx
 * (testimonials-spotlight@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <Media> upload                           → monogram placeholder (no DB on the landing)
 *   TestimonialsSpotlightBlockData           → TestimonialDemoContent (@/payload-types is consumer-only)
 *   cn() figure inner-container              → plain mx-auto/max-w-2xl figure (skipped by the class-mirror guard)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function TestimonialsSpotlightDemo({
  className,
  content = testimonialsSpotlightDemoContent,
}: {
  className?: string
  content?: TestimonialDemoContent
}) {
  const testimonial = content.testimonial
  if (!testimonial) return null
  const { author, quote, role } = testimonial

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <figure className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Quote aria-hidden="true" className="size-10 text-primary" strokeWidth={1.5} />
          <blockquote className="mt-6 text-balance text-2xl leading-9 text-foreground sm:text-3xl">
            {quote}
          </blockquote>
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
              <span className="text-sm font-medium text-muted-foreground">{author.charAt(0)}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <cite className="text-base font-medium not-italic text-foreground">{author}</cite>
              {role ? <span className="text-sm text-muted-foreground">{role}</span> : null}
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
