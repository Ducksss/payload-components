import React from 'react'

import type { TestimonialsQuoteBlock as TestimonialsQuoteBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = TestimonialsQuoteBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TestimonialsQuoteBlock: React.FC<Props> = ({
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
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <figure
          className={cn('border-l-2 border-primary pl-6', {
            'mx-auto max-w-2xl': !disableInnerContainer,
          })}
        >
          <blockquote className="text-pretty text-xl leading-8 text-foreground sm:text-2xl">
            {quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            {avatar ? (
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                <Media resource={avatar} imgClassName="size-full object-cover" />
              </div>
            ) : null}
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
    </section>
  )
}
