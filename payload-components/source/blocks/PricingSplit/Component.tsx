import { Check } from 'lucide-react'
import React from 'react'

import type { PricingSplitBlock as PricingSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = PricingSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const PricingSplitBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  plans,
  title,
}) => {
  // The featured plan takes the expanded right panel; the other becomes the
  // entry plan on the left. Falls back to source order when none is marked.
  const highlight = plans?.find((plan) => plan.featured) ?? plans?.[1]
  const entry = plans?.find((plan) => plan !== highlight) ?? plans?.[0]

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
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

          {entry && highlight ? (
            <div className="grid gap-6 md:grid-cols-5 md:gap-0">
              <div className="flex flex-col justify-between gap-8 rounded-frame border border-border/70 p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium tracking-title">{entry.name}</h3>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold">{entry.price}</span>
                      {entry.period ? (
                        <span className="text-sm text-muted-foreground">{entry.period}</span>
                      ) : null}
                    </div>
                    {entry.description ? (
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    ) : null}
                  </div>

                  {entry.links && entry.links.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {entry.links.map(({ link }, linkIndex) => (
                        <CMSLink key={linkIndex} className="w-full" {...link} appearance="outline" />
                      ))}
                    </div>
                  ) : null}

                  <hr className="border-dashed" />

                  {entry.features && entry.features.length > 0 ? (
                    <ul className="flex flex-col gap-3 text-sm">
                      {entry.features.map((item, featureIndex) => (
                        <li
                          key={item.id ?? `${item.feature}-${featureIndex}`}
                          className="flex items-center gap-2"
                        >
                          <Check aria-hidden="true" className="size-3" />
                          {item.feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              <div className="rounded-frame border border-border/70 bg-background/60 p-6 shadow-none md:col-span-3 lg:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium tracking-title">{highlight.name}</h3>
                        {highlight.featured ? (
                          <Badge className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground">
                            Popular
                          </Badge>
                        ) : null}
                      </div>
                      <div className="my-3 flex items-baseline gap-1">
                        <span className="text-2xl font-semibold">{highlight.price}</span>
                        {highlight.period ? (
                          <span className="text-sm text-muted-foreground">{highlight.period}</span>
                        ) : null}
                      </div>
                      {highlight.description ? (
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      ) : null}
                    </div>

                    {highlight.links && highlight.links.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {highlight.links.map(({ link }, linkIndex) => (
                          <CMSLink key={linkIndex} className="w-full" {...link} appearance="default" />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4">
                    {highlight.features && highlight.features.length > 0 ? (
                      <ul className="flex flex-col gap-3 text-sm">
                        {highlight.features.map((item, featureIndex) => (
                          <li
                            key={item.id ?? `${item.feature}-${featureIndex}`}
                            className="flex items-center gap-2"
                          >
                            <Check aria-hidden="true" className="size-3" />
                            {item.feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
