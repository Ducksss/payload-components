import { Badge } from '@/components/ui/badge'
import { statsGridDemoContent, type StatsBandDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/StatsGrid/Component.tsx
 * (stats-grid@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   StatsGridBlockData                       → StatsBandDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function StatsGridDemo({
  className,
  content = statsGridDemoContent,
}: {
  className?: string
  content?: StatsBandDemoContent
}) {
  const { description, eyebrow, metrics, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
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
              <p className="max-w-2xl text-lg leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {metrics.length > 0 ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={`${metric.value}-${index}`}
                  className="flex flex-col-reverse border-t border-border/70 pt-5"
                >
                  <dt className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</dt>
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
