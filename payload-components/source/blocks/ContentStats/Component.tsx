import React from 'react'

import { ArrowRight } from 'lucide-react'

import type { ContentStatsBlock as ContentStatsBlockData } from '@/payload-types'

import { contentIcons } from '@/blocks/shared/contentIcons'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentStatsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentStatsBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  features,
  id,
  paragraphs,
  stats,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-3xl': !disableInnerContainer,
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
                  <p className="text-lg leading-7 text-muted-foreground" key={paragraph.id ?? index}>
                    {paragraph.text}
                  </p>
                ))
              : null}
          </div>

          {features && features.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon ? contentIcons[feature.icon] : null

                return (
                  <div className="flex flex-col gap-2" key={feature.id ?? `${feature.title}-${index}`}>
                    {Icon ? <Icon className="size-6" /> : null}
                    <h3 className="text-lg font-medium tracking-heading">{feature.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          ) : null}

          {stats && stats.length > 0 ? (
            <ul className="flex flex-col gap-2 border-t border-border/70 pt-8 text-muted-foreground">
              {stats.map((stat, index) => (
                <li className="flex items-center gap-1.5" key={stat.id ?? `${stat.value}-${index}`}>
                  <ArrowRight className="size-4 opacity-50" />
                  <span className="font-medium text-foreground">{stat.value}</span> {stat.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
