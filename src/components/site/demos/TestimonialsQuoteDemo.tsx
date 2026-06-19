import { testimonialsQuoteDemoContent, type TestimonialDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TestimonialsQuote/Component.tsx
 * (testimonials-quote@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <Media> upload                           → monogram placeholder (no DB on the landing)
 *   TestimonialsQuoteBlockData               → TestimonialDemoContent (@/payload-types is consumer-only)
 *   cn() figure inner-container              → plain mx-auto/max-w-2xl figure (skipped by the class-mirror guard)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function TestimonialsQuoteDemo({
  className,
  content = testimonialsQuoteDemoContent,
}: {
  className?: string
  content?: TestimonialDemoContent
}) {
  const testimonial = content.testimonial
  if (!testimonial) return null
  const { author, quote, role } = testimonial

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <figure className="mx-auto max-w-2xl border-l-2 border-primary pl-6">
          <blockquote className="text-pretty text-xl leading-8 text-foreground sm:text-2xl">
            {quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
              <span className="text-xs font-medium text-muted-foreground">{author.charAt(0)}</span>
            </div>
            <cite className="text-sm font-medium not-italic text-foreground">{author}</cite>
            {role ? (
              <>
                <span aria-hidden="true" className="size-1 rounded-full bg-foreground/25" />
                <span className="text-sm text-muted-foreground">{role}</span>
              </>
            ) : null}
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
