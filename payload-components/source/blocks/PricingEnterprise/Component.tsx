import { Check } from 'lucide-react'
import React from 'react'

import type { PricingEnterpriseBlock as PricingEnterpriseBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = PricingEnterpriseBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const PricingEnterpriseBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  logos,
  plans,
  title,
}) => {
  const plan = plans?.[0]

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

          {plan ? (
            <div className="rounded-frame border border-border/70 bg-background/60 shadow-none">
              <div className="grid items-center gap-12 divide-y divide-border/70 p-8 sm:p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="flex flex-col items-center gap-4 text-center md:pr-12">
                  <h3 className="text-2xl font-semibold tracking-title">{plan.name}</h3>
                  {plan.description ? (
                    <p className="text-base text-muted-foreground">{plan.description}</p>
                  ) : null}
                  <div className="my-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period ? (
                      <span className="text-base text-muted-foreground">{plan.period}</span>
                    ) : null}
                  </div>

                  {plan.links && plan.links.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {plan.links.map(({ link }, linkIndex) => (
                        <CMSLink key={linkIndex} {...link} appearance="default" />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-6 md:pl-12">
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="flex flex-col gap-4 text-sm">
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

                  {logos && logos.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-2">
                      {logos.map((item, index) => {
                        const logo = (
                          <Media resource={item.logo} imgClassName="h-6 w-auto object-contain" />
                        )

                        return (
                          <div className="flex items-center" key={item.id ?? `${item.name}-${index}`}>
                            {item.href ? (
                              <a aria-label={item.name} href={item.href}>
                                {logo}
                              </a>
                            ) : (
                              logo
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
