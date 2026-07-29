import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { featureCardsMediaDemoContent, type FeatureCardsMediaDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'
import { featureDemoIcons } from './FeatureAccordionDemo'

/* DEMO TWIN of payload-components/source/blocks/FeatureCardsMedia/Component.tsx
 * (feature-cards-media@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   Media uploads                            → static product illustrations
 *   FeatureCardsMediaBlockData               → FeatureCardsMediaDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function FeatureCardsMediaDemo({
  className,
  content = featureCardsMediaDemoContent,
}: {
  className?: string
  content?: FeatureCardsMediaDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item, index) => {
                const Icon = item.icon ? featureDemoIcons[item.icon] : undefined

                return (
                  <Card
                    key={`${item.title}-${index}`}
                    className="overflow-hidden border-border/70 bg-background/85 py-0 shadow-none"
                  >
                    <div className="aspect-video overflow-hidden border-b border-border/70 bg-muted">
                      <div className="grid h-full grid-cols-3 gap-3 bg-background p-5">
                        <div className="col-span-2 rounded-inset bg-accent/30" />
                        <div className="rounded-inset bg-muted" />
                        <div className="rounded-inset bg-primary/15" />
                        <div className="col-span-2 rounded-inset bg-muted/70" />
                      </div>
                    </div>
                    <CardHeader className="gap-4 p-6">
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted">
                            <Icon className="size-5 text-foreground" aria-hidden="true" />
                          </span>
                        ) : null}
                        <CardTitle className="text-xl tracking-title">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : null}

          {links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {links.map(({ link }, index) => (
                <DemoLink key={index} appearance={link.appearance} label={link.label} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
