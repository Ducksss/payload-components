import React from 'react'

import type { StatsGridBlock as StatsGridBlockData } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

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
  footnote,
  id,
  metrics,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10 lg:gap-14', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-2xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          </div>

          {metrics && metrics.length > 0 ? (
            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.id ?? `${metric.value}-${index}`}
                  /* justify-end packs a reversed column toward the top, so a
                     metric with no detail line keeps its value on the same
                     baseline as its neighbours instead of dropping to the
                     bottom of the grid row. */
                  className="flex flex-col-reverse justify-end border-t border-border/70 pt-5"
                >
                  <div className="mt-3 flex flex-col gap-1">
                    <dt className="text-sm font-medium leading-6 text-foreground">
                      {metric.label}
                    </dt>
                    {metric.detail ? (
                      <span className="text-sm leading-6 text-muted-foreground">
                        {metric.detail}
                      </span>
                    ) : null}
                  </div>
                  <dd className="text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {footnote ? <p className="text-sm leading-6 text-muted-foreground">{footnote}</p> : null}
        </div>
      </div>
    </section>
  )
}
