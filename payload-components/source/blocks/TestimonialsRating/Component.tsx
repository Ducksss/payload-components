import React from 'react'

import { Star } from 'lucide-react'

import type { TestimonialsRatingBlock as TestimonialsRatingBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = TestimonialsRatingBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TestimonialsRatingBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  testimonials,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {testimonials && testimonials.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item, index) => (
                <figure
                  className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/60 p-6"
                  key={item.id ?? index}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        aria-hidden="true"
                        className={cn(
                          'size-4',
                          starIndex < (item.rating ?? 0)
                            ? 'fill-primary stroke-primary'
                            : 'fill-muted stroke-muted-foreground/30',
                        )}
                        key={starIndex}
                      />
                    ))}
                  </div>
                  <blockquote className="text-pretty text-sm leading-6 text-foreground">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3">
                    {item.avatar ? (
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                        <Media resource={item.avatar} imgClassName="size-full object-cover" />
                      </div>
                    ) : null}
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
    </section>
  )
}
