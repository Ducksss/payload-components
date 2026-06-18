import { Plus } from 'lucide-react'

import { integrationListDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationList/Component.tsx
 * (integration-list@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 *   <a href> wrapper                         → omitted (aria-hidden twins hold no focusable elements)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function IntegrationListDemo({
  className,
  content = integrationListDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, itemDescription, subtext } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            <div className="text-balance text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              {heading}
            </div>
            {subtext ? (
              <p className="mx-auto max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                {subtext}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col rounded-2xl border border-border/70 bg-background/60 px-5">
            {demoLogos.slice(0, 5).map((logo) => (
              <div
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-dashed border-border/70 py-4 last:border-b-0"
                key={logo.name}
              >
                <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                  <logo.Icon aria-hidden="true" className="size-6 text-foreground/70" strokeWidth={1.75} />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="text-sm font-medium text-foreground">{logo.name}</div>
                  {itemDescription ? (
                    <p className="line-clamp-1 text-sm text-muted-foreground">{itemDescription}</p>
                  ) : null}
                </div>

                <span className="flex size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Plus className="size-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
