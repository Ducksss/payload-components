import { Check, Minus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { comparatorGridDemoContent, type ComparatorGridDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/ComparatorGrid/Component.tsx
 * (comparator-grid@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   <Card>                                   → plain <div> (the Card chrome is presentational)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   ComparatorGridBlockData                  → ComparatorGridDemoContent (@/payload-types is consumer-only)
 *   cn() inner/cell wrappers                 → plain divs/template classes (skipped by the class-mirror guard)
 * The gridTemplateColumns inline style mirrors the component's `columns` const.
 * If the component Component.tsx changes, update this file in the same PR. */

export function ComparatorGridDemo({
  className,
  content = comparatorGridDemoContent,
}: {
  className?: string
  content?: ComparatorGridDemoContent
}) {
  const { description, features, plans, title } = content
  const columns = `minmax(8rem, 1.4fr) repeat(${plans.length}, minmax(0, 1fr))`

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          {title || description ? (
            <div className="flex flex-col items-center gap-4 text-center">
              {title ? (
                <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</div>
              ) : null}

              {description ? (
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          <div className="overflow-x-auto border-border/70 bg-background/60 p-0 shadow-none">
            <div className="min-w-[36rem]">
              <div
                className="grid items-end border-b border-border/70"
                style={{ gridTemplateColumns: columns }}
              >
                <div className="p-4" />

                {plans.map((plan, planIndex) => (
                  <div
                    key={planIndex}
                    className={`flex flex-col gap-2 p-4 text-center ${plan.highlighted ? 'bg-primary/5' : ''}`}
                  >
                    {plan.badge ? (
                      <Badge
                        variant="outline"
                        className="mx-auto rounded-full px-2 py-0.5 text-xs uppercase tracking-eyebrow"
                      >
                        {plan.badge}
                      </Badge>
                    ) : null}

                    <span className="text-base font-medium text-foreground">{plan.name}</span>

                    <span className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-medium tracking-title text-foreground">{plan.price}</span>
                      {plan.period ? <span className="text-sm text-muted-foreground">{plan.period}</span> : null}
                    </span>
                  </div>
                ))}
              </div>

              {features.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid items-center border-b border-border/70 last:border-b-0"
                  style={{ gridTemplateColumns: columns }}
                >
                  <div className="p-4 text-sm text-muted-foreground">{row.feature}</div>

                  {plans.map((plan, planIndex) => {
                    const cell = row.values[planIndex]

                    return (
                      <div
                        key={planIndex}
                        className={`flex items-center justify-center p-4 text-sm text-foreground ${plan.highlighted ? 'bg-primary/5' : ''}`}
                      >
                        {cell?.included ? (
                          <Check className="size-4 text-primary" />
                        ) : cell?.label ? (
                          <span>{cell.label}</span>
                        ) : (
                          <Minus className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              <div className="grid border-t border-border/70" style={{ gridTemplateColumns: columns }}>
                <div className="p-4" />

                {plans.map((plan, planIndex) => (
                  <div key={planIndex} className={`p-4 ${plan.highlighted ? 'bg-primary/5' : ''}`}>
                    {plan.links && plan.links.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {plan.links.map(({ link }, linkIndex) => (
                          <DemoLink key={linkIndex} appearance={link.appearance} label={link.label} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
