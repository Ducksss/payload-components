import { Badge } from '@/components/ui/badge'
import { statsInlineDemoContent, type StatsBandDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/StatsInline/Component.tsx
 * (stats-inline@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   StatsInlineBlockData                     → StatsBandDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function StatsInlineDemo({
  className,
  content = statsInlineDemoContent,
}: {
  className?: string
  content?: StatsBandDemoContent
}) {
  const { description, eyebrow, metrics, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <div className="flex flex-col gap-4">
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

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {metrics.length > 0 ? (
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {metrics.map((metric, index) => (
                <li
                  key={`${metric.value}-${index}`}
                  className="border-t border-border/70 py-6 text-xl leading-8 text-muted-foreground"
                >
                  <span className="font-medium text-foreground">{metric.value}</span> {metric.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
