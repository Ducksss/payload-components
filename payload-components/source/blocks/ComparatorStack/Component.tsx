import React from 'react'

import { Check, Minus } from 'lucide-react'

import type { ComparatorStackBlock as ComparatorStackBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Props = ComparatorStackBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ComparatorStackBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  id,
  plans,
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
          {title || description ? (
            <div className="flex flex-col items-center gap-4 text-center">
              {title ? (
                <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>
              ) : null}

              {description ? (
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          {plans && plans.length > 0 ? (
            <div className="flex flex-col gap-4">
              {plans.map((plan, planIndex) => (
                <Card
                  key={plan.id ?? planIndex}
                  className={cn('border-border/70 bg-background/60 p-6 shadow-none', {
                    'ring-1 ring-primary': plan.highlighted,
                  })}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="lg:max-w-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium text-foreground">{plan.name}</h3>

                        {plan.badge ? (
                          <Badge
                            variant="outline"
                            className="rounded-full px-2 py-0.5 text-xs uppercase tracking-eyebrow"
                          >
                            {plan.badge}
                          </Badge>
                        ) : null}
                      </div>

                      {plan.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                      ) : null}

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-medium tracking-title text-foreground">{plan.price}</span>
                        {plan.period ? <span className="text-sm text-muted-foreground">{plan.period}</span> : null}
                      </div>

                      {plan.links && plan.links.length > 0 ? (
                        <div className="mt-4 flex flex-col gap-2">
                          {plan.links.map(({ link }, linkIndex) => (
                            <CMSLink
                              key={linkIndex}
                              appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                              {...link}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {plan.features && plan.features.length > 0 ? (
                      <div className="w-full lg:w-72 lg:shrink-0">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={feature.id ?? featureIndex}
                            className="flex items-center justify-between border-b border-border/70 py-3 text-sm last:border-b-0"
                          >
                            <span className="text-muted-foreground">{feature.label}</span>

                            {feature.included ? (
                              <Check aria-label="Included" className="size-4 text-primary" role="img" />
                            ) : feature.value ? (
                              <span className="font-medium text-foreground">{feature.value}</span>
                            ) : (
                              <Minus aria-label="Not included" className="size-4 text-muted-foreground" role="img" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
