import { Badge } from '@/components/ui/badge'
import { statsGridDemoContent, type StatsGridDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/StatsGrid/Component.tsx
 * (stats-grid@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   StatsGridBlockData                       → StatsGridDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function StatsGridDemo({
  className,
  content = statsGridDemoContent,
}: {
  className?: string
  content?: StatsGridDemoContent
}) {
  const { description, eyebrow, footnote, metrics, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:gap-14">
          <div className="flex max-w-2xl flex-col gap-4">
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
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          </div>

          {metrics.length > 0 ? (
            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={`${metric.value}-${index}`}
                  className="flex flex-col-reverse justify-end border-t border-border/70 pt-5"
                >
                  <div className="mt-3 flex flex-col gap-1">
                    <dt className="text-sm font-medium leading-6 text-foreground">
                      {metric.label}
                    </dt>
                    {metric.detail ? (
                      <span className="text-sm leading-6 text-muted-foreground">
                        {metric.detail}
                      </span>
                    ) : null}
                  </div>
                  <dd className="text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {footnote ? <p className="text-sm leading-6 text-muted-foreground">{footnote}</p> : null}
        </div>
      </div>
    </div>
  )
}
