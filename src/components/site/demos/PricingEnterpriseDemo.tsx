import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { pricingEnterpriseDemoContent, type PricingDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'
import { DemoLogoMark, demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/PricingEnterprise/Component.tsx
 * (pricing-enterprise@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the landing owns its heading outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   <Media> upload                           → monochrome logo mark (no DB on the landing)
 *   <a href> wrapper                         → omitted (aria-hidden twins hold no focusable elements)
 *   PricingEnterpriseBlockData               → PricingDemoContent (@/payload-types is consumer-only)
 * imgClassName values are not mirrored. Badge is the same shadcn primitive the
 * component installs. If the component Component.tsx changes, update this file in
 * the same PR. */

export function PricingEnterpriseDemo({
  className,
  content = pricingEnterpriseDemoContent,
}: {
  className?: string
  content?: PricingDemoContent
}) {
  const { description, eyebrow, plans, title } = content
  const plan = plans[0]

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

          {plan ? (
            <div className="rounded-frame border border-border/70 bg-background/60 shadow-none">
              <div className="grid items-center gap-12 divide-y divide-border/70 p-8 sm:p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="flex flex-col items-center gap-4 text-center md:pr-12">
                  <div className="text-2xl font-semibold tracking-title">{plan.name}</div>
                  {plan.description ? (
                    <p className="text-base text-muted-foreground">{plan.description}</p>
                  ) : null}
                  <div className="my-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period ? (
                      <span className="text-base text-muted-foreground">{plan.period}</span>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <DemoLink appearance="default" label={plan.link.label} />
                  </div>
                </div>

                <div className="flex flex-col gap-6 md:pl-12">
                  <ul className="flex flex-col gap-4 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-2">
                    {demoLogos.slice(0, 3).map((logo) => (
                      <div className="flex items-center" key={logo.name}>
                        <DemoLogoMark Icon={logo.Icon} name={logo.name} />
                      </div>
                    ))}
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
