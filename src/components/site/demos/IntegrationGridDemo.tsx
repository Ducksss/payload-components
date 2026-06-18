import { integrationGridDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationGrid/Component.tsx
 * (integration-grid@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 *   <a href> "Learn more"                    → <span> (aria-hidden twins hold no focusable elements)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function IntegrationGridDemo({
  className,
  content = integrationGridDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, itemDescription, subtext } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <div className="text-balance text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              {heading}
            </div>
            {subtext ? (
              <p className="mx-auto max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                {subtext}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoLogos.slice(0, 6).map((logo) => (
              <div
                className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-background/60 p-6"
                key={logo.name}
              >
                <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                  <logo.Icon aria-hidden="true" className="size-6 text-foreground/70" strokeWidth={1.75} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-base font-medium text-foreground">{logo.name}</div>
                  {itemDescription ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{itemDescription}</p>
                  ) : null}
                </div>

                <div className="mt-auto border-t border-dashed border-border/70 pt-5">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                    Learn more
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
