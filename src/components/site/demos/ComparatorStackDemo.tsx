import { Check, Minus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { comparatorStackDemoContent, type ComparatorStackDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/ComparatorStack/Component.tsx
 * (comparator-stack@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2> / <h3>                              → <div> (role-neutral; the catalog owns its outline)
 *   <Card>                                   → plain <div> (the Card chrome is presentational)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   ComparatorStackBlockData                 → ComparatorStackDemoContent (@/payload-types is consumer-only)
 *   cn() card/ring wrapper                   → plain div/template classes (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function ComparatorStackDemo({
  className,
  content = comparatorStackDemoContent,
}: {
  className?: string
  content?: ComparatorStackDemoContent
}) {
  const { description, plans, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {title || description ? (
            <div className="flex flex-col items-center gap-4 text-center">
              {title ? (
                <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</div>
              ) : null}

              {description ? (
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-4">
            {plans.map((plan, planIndex) => (
              <div
                key={planIndex}
                className={`border-border/70 bg-background/60 p-6 shadow-none ${plan.highlighted ? 'ring-1 ring-primary' : ''}`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="lg:max-w-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-medium text-foreground">{plan.name}</div>

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
                          <DemoLink key={linkIndex} appearance={link.appearance} label={link.label} />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {plan.features && plan.features.length > 0 ? (
                    <div className="w-full lg:w-72 lg:shrink-0">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center justify-between border-b border-border/70 py-3 text-sm last:border-b-0"
                        >
                          <span className="text-muted-foreground">{feature.label}</span>

                          {feature.included ? (
                            <Check className="size-4 text-primary" />
                          ) : feature.value ? (
                            <span className="font-medium text-foreground">{feature.value}</span>
                          ) : (
                            <Minus className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
