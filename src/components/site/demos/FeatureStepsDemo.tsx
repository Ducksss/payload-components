import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { featureStepsDemoContent, type FeatureSectionDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/FeatureSteps/Component.tsx
 * (feature-steps@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   FeatureStepsBlockData           → FeatureSectionDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper              → plain mx-auto/max-w-5xl div (skipped by the class-mirror guard)
 * Step numbers come from the array index, exactly as the component derives them.
 * If the component Component.tsx changes, update this file in the same PR. */

export function FeatureStepsDemo({
  className,
  content = featureStepsDemoContent,
}: {
  className?: string
  content?: FeatureSectionDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
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
            <div className="grid gap-4 md:grid-cols-3">
              {items.map((item, index) => (
                <Card
                  key={`${item.title}-${index}`}
                  className="border-border/70 bg-background/85 shadow-none"
                >
                  <CardHeader className="gap-3 p-5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary font-mono text-sm font-medium text-primary-foreground">
                      {index + 1}
                    </span>
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
