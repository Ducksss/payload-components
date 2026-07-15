import type { LucideIcon } from 'lucide-react'

import { ChartBarIncreasing, Database, Fingerprint, IdCard, Shield, Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  featureAccordionDemoContent,
  type FeatureAccordionDemoContent,
  type FeatureDemoIconName,
} from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/FeatureAccordion/Component.tsx
 * (feature-accordion@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   shadcn Accordion                         → static first-row-open <div>s
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   Media upload                             → static dashboard or icon stand-in
 *   FeatureAccordionBlockData                → FeatureAccordionDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export const featureDemoIcons: Record<FeatureDemoIconName, LucideIcon> = {
  chart: ChartBarIncreasing,
  database: Database,
  fingerprint: Fingerprint,
  'id-card': IdCard,
  shield: Shield,
  zap: Zap,
}

export function FeatureAccordionDemo({
  className,
  content = featureAccordionDemoContent,
}: {
  className?: string
  content?: FeatureAccordionDemoContent
}) {
  const { description, eyebrow, items, links, title } = content
  const activeItem = items[0]
  const ActiveIcon = activeItem?.icon ? featureDemoIcons[activeItem.icon] : undefined

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
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
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="w-full">
                {items.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="border-border/70 border-b">
                    <div className="py-4 text-left text-lg tracking-title hover:no-underline">
                      {item.title}
                    </div>
                    {index === 0 ? (
                      <div className="pb-4 text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-border/70 bg-muted">
                {activeItem?.hasImage ? (
                  <div className="grid h-full grid-cols-[0.35fr_1fr] bg-background">
                    <div className="border-r border-border/70 bg-muted/50 p-4" />
                    <div className="grid grid-cols-2 gap-4 p-5">
                      <div className="col-span-2 rounded-inset bg-accent/30" />
                      <div className="rounded-inset bg-muted" />
                      <div className="rounded-inset bg-primary/15" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center bg-background/60">
                    {ActiveIcon ? (
                      <ActiveIcon className="size-16 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <div className="size-16 rounded-full border border-border/70 bg-muted" />
                    )}
                  </div>
                )}
              </div>
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
