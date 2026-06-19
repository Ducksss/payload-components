import React from 'react'

import type { TestimonialsWallBlock as TestimonialsWallBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = TestimonialsWallBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TestimonialsWallBlock: React.FC<Props> = ({
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
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {testimonials && testimonials.length > 0 ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {testimonials.map((item, index) => (
                <figure
                  className="mb-4 flex break-inside-avoid flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-5"
                  key={item.id ?? index}
                >
                  <figcaption className="flex items-center gap-3">
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
                  <blockquote className="text-pretty text-sm leading-6 text-muted-foreground">
                    {item.quote}
                  </blockquote>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
