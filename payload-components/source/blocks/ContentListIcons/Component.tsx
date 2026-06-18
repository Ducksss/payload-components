import React from 'react'

import type { ContentListIconsBlock as ContentListIconsBlockData } from '@/payload-types'

import { contentIcons } from '@/blocks/shared/contentIcons'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentListIconsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentListIconsBlock: React.FC<Props> = ({
  className,
  description,
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
          className={cn('flex flex-col gap-12', {
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

            {description ? <p className="text-muted-foreground">{description}</p> : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 text-sm lg:grid-cols-3">
              {items.map((item, index) => {
                const Icon = item.icon ? contentIcons[item.icon] : null

                return (
                  <div
                    className="flex flex-col gap-3 border-t border-border/70 pt-6"
                    key={item.id ?? `${item.term}-${index}`}
                  >
                    {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
                    <p className="leading-5 text-muted-foreground">
                      <span className="font-medium text-foreground">{item.term}</span> {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
