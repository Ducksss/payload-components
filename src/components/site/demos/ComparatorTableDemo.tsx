import { Fragment } from 'react'

import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { comparatorTableDemoContent, type ComparatorTableDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/ComparatorTable/Component.tsx
 * (comparator-table@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   ComparatorTableBlockData                 → ComparatorTableDemoContent (@/payload-types is consumer-only)
 *   cn() inner/cell wrappers                 → plain divs/template classes (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function ComparatorTableDemo({
  className,
  content = comparatorTableDemoContent,
}: {
  className?: string
  content?: ComparatorTableDemoContent
}) {
  const { description, features, plans, title } = content
  const planCount = plans.length

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          {title || description ? (
            <div className="flex max-w-2xl flex-col gap-4">
              {title ? (
                <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</div>
              ) : null}

              {description ? (
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="w-2/5 p-4 align-bottom" />
                  {plans.map((plan, planIndex) => (
                    <th
                      key={planIndex}
                      className={`min-w-40 p-4 align-bottom ${plan.highlighted ? 'bg-primary/5' : ''}`}
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
                              <DemoLink key={linkIndex} appearance={link.appearance} label={link.label} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {features.map((row, rowIndex) => (
                  <Fragment key={rowIndex}>
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
                        const cell = row.values[planIndex]

                        return (
                          <td
                            key={planIndex}
                            className={`p-4 text-foreground ${plan.highlighted ? 'bg-primary/5' : ''}`}
                          >
                            {cell?.included ? (
                              <Check className="size-4 text-primary" />
                            ) : cell?.label ? (
                              <span>{cell.label}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
