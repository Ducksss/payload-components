import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { featureIconGridDemoContent, type FeatureIconGridDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'
import { featureDemoIcons } from './FeatureAccordionDemo'

/* DEMO TWIN of payload-components/source/blocks/FeatureIconGrid/Component.tsx
 * (feature-icon-grid@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   FeatureIconGridBlockData                 → FeatureIconGridDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

function IconDecorator({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-border/70">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-60 [mask-image:radial-gradient(circle_at_center,var(--foreground),transparent_70%)]" />
      <span className="relative flex size-14 items-center justify-center rounded-panel border border-border/70 bg-background shadow-sm">
        <Icon className="size-7 text-foreground" strokeWidth={1.5} />
      </span>
    </div>
  )
}

export function FeatureIconGridDemo({
  className,
  content = featureIconGridDemoContent,
}: {
  className?: string
  content?: FeatureIconGridDemoContent
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
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => {
                const Icon = featureDemoIcons[item.icon]

                return (
                  <Card
                    key={`${item.title}-${index}`}
                    className="overflow-hidden border-border/70 bg-background/85 py-0 shadow-none"
                  >
                    <IconDecorator Icon={Icon} />
                    <CardHeader className="gap-3 p-6">
                      <CardTitle className="text-xl tracking-title">{item.title}</CardTitle>
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
