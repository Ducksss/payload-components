import React from 'react'

import type { FeatureSplitBlock as FeatureSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Props = FeatureSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FeatureSplitBlock: React.FC<Props> = ({
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
          className={cn('grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16', {
            'mx-auto max-w-6xl': !disableInnerContainer,
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
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}

            {links && links.length > 0 ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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

          {items && items.length > 0 ? (
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <Card key={item.id ?? `${item.title}-${index}`} className="border-border/70 bg-background/85 shadow-none">
                  <CardHeader className="gap-3 p-5">
                    <CardTitle className="text-lg tracking-snug">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <CardDescription className="text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
