import React from 'react'

import type { ContentQuoteBlock as ContentQuoteBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentQuoteBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentQuoteBlock: React.FC<Props> = ({
  citation,
  className,
  disableInnerContainer,
  eyebrow,
  id,
  image,
  logo,
  paragraphs,
  quote,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          {image ? (
            <div className="overflow-hidden rounded-panel border border-border/70">
              <Media resource={image} imgClassName="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="flex flex-col gap-6">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance">{title}</h2>

            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((paragraph, index) => (
                  <p className="text-base leading-7 text-muted-foreground" key={paragraph.id ?? index}>
                    {paragraph.text}
                  </p>
                ))
              : null}

            <blockquote className="border-l-2 border-border pl-4">
              <p className="text-base leading-7 text-foreground">{quote}</p>
              <div className="mt-4 flex flex-col gap-3">
                <cite className="text-sm font-medium not-italic text-foreground">{citation}</cite>
                {logo ? (
                  <Media resource={logo} imgClassName="h-6 w-auto object-contain opacity-70" />
                ) : null}
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
