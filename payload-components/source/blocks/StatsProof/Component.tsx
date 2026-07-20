import React from 'react'

import type { StatsProofBlock as StatsProofBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = StatsProofBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const StatsProofBlock: React.FC<Props> = ({
  author,
  body,
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  logo,
  metrics,
  quote,
  role,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {eyebrow ? (
                <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                  {eyebrow}
                </Badge>
              ) : null}

              <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              {body ? <p className="text-base leading-7 text-muted-foreground">{body}</p> : null}
            </div>

            {metrics && metrics.length > 0 ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.id ?? `${metric.value}-${index}`}
                    className="flex flex-col-reverse border-t border-border/70 pt-5"
                  >
                    <dt className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</dt>
                    <dd className="text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <figure className="rounded-panel border border-border/70 bg-background/85 p-6 sm:p-8">
            {logo ? (
              <div className="mb-8 flex h-9 items-center">
                <Media resource={logo} imgClassName="h-9 w-auto object-contain object-left" />
              </div>
            ) : null}
            <blockquote className="text-pretty text-xl leading-8 text-foreground sm:text-2xl">
              {quote}
            </blockquote>
            <figcaption className="mt-8 flex flex-col gap-1">
              <cite className="text-sm font-medium not-italic text-foreground">{author}</cite>
              {role ? <span className="text-sm text-muted-foreground">{role}</span> : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
