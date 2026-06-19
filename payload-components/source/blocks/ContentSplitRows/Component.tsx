import React from 'react'

import type { ContentSplitRowsBlock as ContentSplitRowsBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentSplitRowsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentSplitRowsBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  id,
  paragraphs,
  rows,
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

            <h2 className="text-4xl font-medium tracking-display text-balance">{title}</h2>

            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((paragraph, index) => (
                  <p className="text-base leading-7 text-muted-foreground" key={paragraph.id ?? index}>
                    {paragraph.text}
                  </p>
                ))
              : null}
          </div>

          {rows && rows.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/70">
              {rows.map((row, index) => (
                <div
                  className="grid gap-6 py-8 first:pt-0 last:pb-0 sm:grid-cols-2 sm:items-center sm:gap-12"
                  key={row.id ?? `${row.title}-${index}`}
                >
                  <div className={index % 2 === 1 ? 'sm:order-last' : undefined}>
                    {row.image ? (
                      <div className="overflow-hidden rounded-card border border-border/70">
                        <Media resource={row.image} imgClassName="h-full w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-medium tracking-heading">{row.title}</h3>
                    <p className="text-base leading-7 text-muted-foreground">{row.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
