import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { contentStatsDemoContent, type ContentSectionDemoContent } from '@/lib/demo-content'

import { ContentDemoIcon } from './ContentDemoIcon'

/* DEMO TWIN of payload-components/source/blocks/ContentStats/Component.tsx
 * (content-stats@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   ContentStatsBlockData                    → ContentSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * Badge + the lucide icons (feature map + ArrowRight) are the same primitives the component installs.
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContentStatsDemo({
  className,
  content = contentStatsDemoContent,
}: {
  className?: string
  content?: ContentSectionDemoContent
}) {
  const { eyebrow, features, paragraphs, stats, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance">{title}</div>

            {paragraphs.map((paragraph, index) => (
              <p className="text-lg leading-7 text-muted-foreground" key={index}>
                {paragraph.text}
              </p>
            ))}
          </div>

          {features && features.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <ContentDemoIcon name={feature.icon} className="size-6" />
                  <div className="text-lg font-medium tracking-heading">{feature.title}</div>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {stats && stats.length > 0 ? (
            <ul className="flex flex-col gap-2 border-t border-border/70 pt-8 text-muted-foreground">
              {stats.map((stat, index) => (
                <li className="flex items-center gap-1.5" key={index}>
                  <ArrowRight className="size-4 opacity-50" />
                  <span className="font-medium text-foreground">{stat.value}</span> {stat.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
