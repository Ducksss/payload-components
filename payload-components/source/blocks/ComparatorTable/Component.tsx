import React from 'react'

import { Check } from 'lucide-react'

import type { ComparatorTableBlock as ComparatorTableBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ComparatorTableBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ComparatorTableBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  features,
  id,
  plans,
  title,
}) => {
  const planCount = plans?.length ?? 0

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          {title || description ? (
            <div className="flex max-w-2xl flex-col gap-4">
              {title ? (
                <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>
              ) : null}

              {description ? (
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          {plans && plans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-2/5 p-4 align-bottom" />
                    {plans.map((plan, planIndex) => (
                      <th
                        key={plan.id ?? planIndex}
                        scope="col"
                        className={cn('min-w-40 p-4 align-bottom', {
                          'bg-primary/5': plan.highlighted,
                        })}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-medium text-foreground">{plan.name}</span>

                            {plan.badge ? (
                              <Badge
                                variant="outline"
                                className="rounded-full px-2 py-0.5 text-xs uppercase tracking-eyebrow"
                              >
                                {plan.badge}
                              </Badge>
                            ) : null}
                          </div>

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
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {features?.map((row, rowIndex) => (
                    <React.Fragment key={row.id ?? rowIndex}>
                      {row.groupLabel ? (
                        <tr>
                          <td
                            className="px-4 pb-2 pt-8 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground"
                            colSpan={planCount + 1}
                          >
                            {row.groupLabel}
                          </td>
                        </tr>
                      ) : null}

                      <tr className="border-t border-border/70">
                        <td className="p-4 text-muted-foreground">{row.feature}</td>

                        {plans.map((plan, planIndex) => {
                          const cell = row.values?.[planIndex]

                          return (
                            <td
                              key={plan.id ?? planIndex}
                              className={cn('p-4 text-foreground', {
                                'bg-primary/5': plan.highlighted,
                              })}
                            >
                              {cell?.included ? (
                                <Check aria-label="Included" className="size-4 text-primary" role="img" />
                              ) : cell?.label ? (
                                <span>{cell.label}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
