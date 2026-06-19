import React from 'react'

import type { ContentListBlock as ContentListBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentListBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentListBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid gap-8 lg:grid-cols-2 lg:gap-16', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="font-serif text-4xl font-medium text-balance">{title}</h2>
          </div>

          {items && items.length > 0 ? (
            <div className="flex flex-col gap-6">
              {items.map((item, index) => (
                <p className="text-muted-foreground" key={item.id ?? `${item.term}-${index}`}>
                  <span className="font-medium text-foreground">{item.term}</span> {item.description}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
