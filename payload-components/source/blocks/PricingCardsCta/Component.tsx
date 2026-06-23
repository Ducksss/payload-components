import { Check } from 'lucide-react'
import React from 'react'

import type { PricingCardsCtaBlock as PricingCardsCtaBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Props = PricingCardsCtaBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const PricingCardsCtaBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  plans,
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

          {plans && plans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, index) => (
                <Card
                  key={plan.id ?? `${plan.name}-${index}`}
                  className={cn('relative flex flex-col border-border/70 bg-background/85 shadow-none', {
                    'ring-1 ring-brand': plan.featured,
                  })}
                >
                  {plan.featured ? (
                    <Badge className="absolute inset-x-0 -top-3 mx-auto w-fit rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground">
                      Popular
                    </Badge>
                  ) : null}

                  <CardHeader className="gap-1">
                    <CardTitle className="font-medium tracking-title">{plan.name}</CardTitle>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold">{plan.price}</span>
                      {plan.period ? (
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      ) : null}
                    </div>
                    {plan.description ? (
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                    ) : null}

                    {plan.links && plan.links.length > 0 ? (
                      <div className="mt-4 flex flex-col gap-2">
                        {plan.links.map(({ link }, linkIndex) => (
                          <CMSLink
                            key={linkIndex}
                            className="w-full"
                            {...link}
                            appearance={plan.featured ? 'default' : 'outline'}
                          />
                        ))}
                      </div>
                    ) : null}
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <hr className="border-dashed" />

                    {plan.features && plan.features.length > 0 ? (
                      <ul className="flex flex-col gap-3 text-sm">
                        {plan.features.map((item, featureIndex) => (
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
