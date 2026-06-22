import React from 'react'

import { Check, Minus } from 'lucide-react'

import type { ComparatorGridBlock as ComparatorGridBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Props = ComparatorGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ComparatorGridBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  features,
  id,
  plans,
  title,
}) => {
  const columns = `minmax(8rem, 1.4fr) repeat(${plans?.length ?? 0}, minmax(0, 1fr))`

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-4xl': !disableInnerContainer,
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
            <Card className="overflow-x-auto border-border/70 bg-background/60 p-0 shadow-none">
              <div className="min-w-[36rem]">
                <div
                  className="grid items-end border-b border-border/70"
                  style={{ gridTemplateColumns: columns }}
                >
                  <div className="p-4" />

                  {plans.map((plan, planIndex) => (
                    <div
                      key={plan.id ?? planIndex}
                      className={cn('flex flex-col gap-2 p-4 text-center', {
                        'bg-primary/5': plan.highlighted,
                      })}
                    >
                      {plan.badge ? (
                        <Badge
                          variant="outline"
                          className="mx-auto rounded-full px-2 py-0.5 text-xs uppercase tracking-eyebrow"
                        >
                          {plan.badge}
                        </Badge>
                      ) : null}

                      <span className="text-base font-medium text-foreground">{plan.name}</span>

                      <span className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-medium tracking-title text-foreground">{plan.price}</span>
                        {plan.period ? <span className="text-sm text-muted-foreground">{plan.period}</span> : null}
                      </span>
                    </div>
                  ))}
                </div>

                {features?.map((row, rowIndex) => (
                  <div
                    key={row.id ?? rowIndex}
                    className="grid items-center border-b border-border/70 last:border-b-0"
                    style={{ gridTemplateColumns: columns }}
                  >
                    <div className="p-4 text-sm text-muted-foreground">{row.feature}</div>

                    {plans.map((plan, planIndex) => {
                      const cell = row.values?.[planIndex]

                      return (
                        <div
                          key={plan.id ?? planIndex}
                          className={cn('flex items-center justify-center p-4 text-sm text-foreground', {
                            'bg-primary/5': plan.highlighted,
                          })}
                        >
                          {cell?.included ? (
                            <Check aria-label="Included" className="size-4 text-primary" role="img" />
                          ) : cell?.label ? (
                            <span>{cell.label}</span>
                          ) : (
                            <Minus aria-label="Not included" className="size-4 text-muted-foreground" role="img" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}

                <div className="grid border-t border-border/70" style={{ gridTemplateColumns: columns }}>
                  <div className="p-4" />

                  {plans.map((plan, planIndex) => (
                    <div
                      key={plan.id ?? planIndex}
                      className={cn('p-4', {
                        'bg-primary/5': plan.highlighted,
                      })}
                    >
                      {plan.links && plan.links.length > 0 ? (
                        <div className="flex flex-col gap-2">
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
                  ))}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  )
}
