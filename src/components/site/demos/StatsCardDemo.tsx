import { Badge } from '@/components/ui/badge'
import { statsCardDemoContent, type StatsBandDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/StatsCard/Component.tsx
 * (stats-card@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   StatsCardBlockData                       → StatsBandDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function StatsCardDemo({
  className,
  content = statsCardDemoContent,
}: {
  className?: string
  content?: StatsBandDemoContent
}) {
  const { eyebrow, metrics, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-3xl font-medium tracking-title text-balance sm:text-4xl">
              {title}
            </div>
          </div>

          {metrics.length > 0 ? (
            <dl className="grid divide-y divide-border/70 rounded-panel border border-border/70 bg-background/85 md:auto-cols-fr md:grid-flow-col md:divide-x md:divide-y-0">
              {metrics.map((metric, index) => (
                <div
                  key={`${metric.value}-${index}`}
                  className="flex flex-col-reverse gap-2 px-6 py-8 text-center"
                >
                  <dt className="text-sm leading-6 text-muted-foreground">{metric.label}</dt>
                  <dd className="text-4xl font-medium tracking-display text-foreground">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  )
}
