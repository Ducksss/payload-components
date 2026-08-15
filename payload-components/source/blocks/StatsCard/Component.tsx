import React from 'react'

import type { StatsCardBlock as StatsCardBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = StatsCardBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const StatsCardBlock: React.FC<Props> = ({
  className,
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
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-4xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>
          </div>

          {metrics && metrics.length > 0 ? (
            <dl className="grid divide-y divide-border/70 rounded-panel border border-border/70 bg-background/85 md:auto-cols-fr md:grid-flow-col md:divide-x md:divide-y-0">
              {metrics.map((metric, index) => (
                <div
                  key={metric.id ?? `${metric.value}-${index}`}
                  className="flex flex-col-reverse gap-2 px-6 py-8 text-center"
                >
                  <dt className="text-sm leading-6 text-muted-foreground">{metric.label}</dt>
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
