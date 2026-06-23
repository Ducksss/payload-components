import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCardsCtaDemoContent, type PricingDemoContent } from '@/lib/demo-content'
import { cn } from '@/utilities/ui'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/PricingCardsCta/Component.tsx
 * (pricing-cards-cta@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   PricingCardsCtaBlockData                 → PricingDemoContent (@/payload-types is consumer-only)
 * Badge/Card are the same shadcn primitives the component installs.
 * If the component Component.tsx changes, update this file in the same PR. */

export function PricingCardsCtaDemo({
  className,
  content = pricingCardsCtaDemoContent,
}: {
  className?: string
  content?: PricingDemoContent
}) {
  const { description, eyebrow, plans, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
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

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={`${plan.name}-${index}`}
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

                  <div className="mt-4 flex flex-col gap-2">
                    <DemoLink
                      appearance={plan.featured ? 'default' : 'outline'}
                      className="w-full"
                      label={plan.link.label}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <hr className="border-dashed" />

                  <ul className="flex flex-col gap-3 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
