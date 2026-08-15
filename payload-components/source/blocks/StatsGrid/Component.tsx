import React from 'react'

import type { StatsGridBlock as StatsGridBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = StatsGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const StatsGridBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  metrics,
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

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="max-w-2xl text-lg leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {metrics && metrics.length > 0 ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.id ?? `${metric.value}-${index}`}
                  className="flex flex-col-reverse border-t border-border/70 pt-5"
                >
                  <dt className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</dt>
                  <dd className="text-4xl font-medium tracking-display text-foreground">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  )
}
