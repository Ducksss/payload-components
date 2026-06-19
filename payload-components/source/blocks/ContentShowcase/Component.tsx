import React from 'react'

import type { ContentShowcaseBlock as ContentShowcaseBlockData } from '@/payload-types'

import { contentIcons } from '@/blocks/shared/contentIcons'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentShowcaseBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentShowcaseBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  features,
  id,
  image,
  paragraphs,
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
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((paragraph, index) => (
                  <p className="text-base leading-7 text-muted-foreground" key={paragraph.id ?? index}>
                    {paragraph.text}
                  </p>
                ))
              : null}
          </div>

          {image ? (
            <div className="overflow-hidden rounded-panel border border-border/70">
              <Media resource={image} imgClassName="h-full w-full object-cover" />
            </div>
          ) : null}

          {features && features.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon ? contentIcons[feature.icon] : null

                return (
                  <div className="flex flex-col gap-2" key={feature.id ?? `${feature.title}-${index}`}>
                    <div className="flex items-center gap-2">
                      {Icon ? <Icon className="size-4" /> : null}
                      <h3 className="text-sm font-medium tracking-micro">{feature.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
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
