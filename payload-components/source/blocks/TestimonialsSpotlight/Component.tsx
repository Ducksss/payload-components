import React from 'react'

import { Quote } from 'lucide-react'

import type { TestimonialsSpotlightBlock as TestimonialsSpotlightBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = TestimonialsSpotlightBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TestimonialsSpotlightBlock: React.FC<Props> = ({
  author,
  avatar,
  className,
  disableInnerContainer,
  id,
  quote,
  role,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <figure
          className={cn('flex flex-col items-center text-center', {
            'mx-auto max-w-2xl': !disableInnerContainer,
          })}
        >
          <Quote aria-hidden="true" className="size-10 text-primary" strokeWidth={1.5} />
          <blockquote className="mt-6 text-balance text-2xl leading-9 text-foreground sm:text-3xl">
            {quote}
          </blockquote>
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            {avatar ? (
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                <Media resource={avatar} imgClassName="size-full object-cover" />
              </div>
            ) : null}
            <div className="flex flex-col items-center gap-0.5">
              <cite className="text-base font-medium not-italic text-foreground">{author}</cite>
              {role ? <span className="text-sm text-muted-foreground">{role}</span> : null}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
