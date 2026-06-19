import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { pricingSplitDemoContent, type PricingDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/PricingSplit/Component.tsx
 * (pricing-split@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the landing owns its heading outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   PricingSplitBlockData                    → PricingDemoContent (@/payload-types is consumer-only)
 * Badge is the same shadcn primitive the component installs.
 * If the component Component.tsx changes, update this file in the same PR. */

export function PricingSplitDemo({
  className,
  content = pricingSplitDemoContent,
}: {
  className?: string
  content?: PricingDemoContent
}) {
  const { description, eyebrow, plans, title } = content
  const entry = plans[0]
  const highlight = plans[1]

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="mx-auto w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {entry && highlight ? (
            <div className="grid gap-6 md:grid-cols-5 md:gap-0">
              <div className="flex flex-col justify-between gap-8 rounded-frame border border-border/70 p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium tracking-title">{entry.name}</div>
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

                  <div className="flex flex-col gap-2">
                    <DemoLink appearance="outline" className="w-full" label={entry.link.label} />
                  </div>

                  <hr className="border-dashed" />

                  <ul className="flex flex-col gap-3 text-sm">
                    {entry.features.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-frame border border-border/70 bg-background/60 p-6 shadow-none md:col-span-3 lg:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium tracking-title">{highlight.name}</div>
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

                    <div className="flex flex-col gap-2">
                      <DemoLink appearance="default" className="w-full" label={highlight.link.label} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-3 text-sm">
                      {highlight.features.map((feature, featureIndex) => (
                        <li key={`${feature}-${featureIndex}`} className="flex items-center gap-2">
                          <Check className="size-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
