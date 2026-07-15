import React from 'react'

import type { FeatureCardsMediaBlock as FeatureCardsMediaBlockData } from '@/payload-types'
import type { FeatureIconName } from '@/blocks/shared/featureIcons'

import { featureIcons } from '@/blocks/shared/featureIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FeatureCardsMediaBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FeatureCardsMediaBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  links,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item, index) => {
                const Icon =
                  item.icon && item.icon in featureIcons
                    ? featureIcons[item.icon as FeatureIconName]
                    : undefined

                return (
                  <Card
                    key={item.id ?? `${item.title}-${index}`}
                    className="overflow-hidden border-border/70 bg-background/85 py-0 shadow-none"
                  >
                    <div className="aspect-video overflow-hidden border-b border-border/70 bg-muted">
                      {item.image ? (
                        <Media resource={item.image} imgClassName="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <CardHeader className="gap-4 p-6">
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted">
                            <Icon className="size-5 text-foreground" aria-hidden="true" />
                          </span>
                        ) : null}
                        <CardTitle className="text-xl tracking-title">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : null}

          {links && links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {links.map(({ link }, index) => (
                <CMSLink
                  key={index}
                  appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                  {...link}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
