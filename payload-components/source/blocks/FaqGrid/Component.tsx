import React from 'react'

import type { FaqGridBlock as FaqGridBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Props = FaqGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FaqGridBlock: React.FC<Props> = ({
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
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="mx-auto w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item, index) => (
                <Card
                  key={item.id ?? `${item.question}-${index}`}
                  className="border-border/70 bg-background/85 p-6 shadow-none"
                >
                  <h3 className="text-base font-medium tracking-title">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
