import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { featureSplitDemoContent, type FeatureSectionDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/FeatureSplit/Component.tsx
 * (feature-split@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   FeatureSplitBlockData           → FeatureSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner-grid wrapper         → plain mx-auto/max-w-6xl div (skipped by the class-mirror guard)
 * Badge/Card are the same shadcn primitives the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

export function FeatureSplitDemo({
  className,
  content = featureSplitDemoContent,
}: {
  className?: string
  content?: FeatureSectionDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-4">
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

            {links.length > 0 ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <Card
                  key={`${item.title}-${index}`}
                  className="border-border/70 bg-background/85 shadow-none"
                >
                  <CardHeader className="gap-3 p-5">
                    <CardTitle className="text-lg tracking-snug">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <CardDescription className="text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
