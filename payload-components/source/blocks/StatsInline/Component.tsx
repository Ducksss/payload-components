import React from 'react'

import type { StatsInlineBlock as StatsInlineBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = StatsInlineBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const StatsInlineBlock: React.FC<Props> = ({
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
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-4xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {metrics && metrics.length > 0 ? (
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {metrics.map((metric, index) => (
                <li
                  key={metric.id ?? `${metric.value}-${index}`}
                  className="border-t border-border/70 py-6 text-xl leading-8 text-muted-foreground"
                >
                  <span className="font-medium text-foreground">{metric.value}</span> {metric.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
