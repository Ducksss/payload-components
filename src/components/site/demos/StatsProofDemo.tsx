import { Badge } from '@/components/ui/badge'
import { statsProofDemoContent, type StatsProofDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/StatsProof/Component.tsx
 * (stats-proof@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   Media logo                               → static customer wordmark
 *   StatsProofBlockData                      → StatsProofDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function StatsProofDemo({
  className,
  content = statsProofDemoContent,
}: {
  className?: string
  content?: StatsProofDemoContent
}) {
  const { author, body, description, eyebrow, metrics, quote, role, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {eyebrow ? (
                <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                  {eyebrow}
                </Badge>
              ) : null}

              <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
                {title}
              </div>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              {body ? <p className="text-base leading-7 text-muted-foreground">{body}</p> : null}
            </div>

            {metrics.length > 0 ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
                {metrics.map((metric, index) => (
                  <div
                    key={`${metric.value}-${index}`}
                    className="flex flex-col-reverse border-t border-border/70 pt-5"
                  >
                    <dt className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</dt>
                    <dd className="text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <figure className="rounded-panel border border-border/70 bg-background/85 p-6 sm:p-8">
            <div className="mb-8 flex h-9 items-center">
              <div className="font-medium tracking-title text-foreground">NORTHWIND</div>
            </div>
            <blockquote className="text-pretty text-xl leading-8 text-foreground sm:text-2xl">
              {quote}
            </blockquote>
            <figcaption className="mt-8 flex flex-col gap-1">
              <cite className="text-sm font-medium not-italic text-foreground">{author}</cite>
              {role ? <span className="text-sm text-muted-foreground">{role}</span> : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}
