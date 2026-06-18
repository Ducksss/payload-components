import { Layers } from 'lucide-react'

import { integrationSplitDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'
import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationSplit/Component.tsx
 * (integration-split@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 *   CMSLink                                  → <DemoLink>
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function IntegrationSplitDemo({
  className,
  content = integrationSplitDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, links, subtext } = content
  const before = demoLogos.slice(0, 3)
  const after = demoLogos.slice(3, 6)

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-2">
          <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center gap-2.5 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)]">
            {before.map((logo) => (
              <div
                className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background"
                key={logo.name}
              >
                <logo.Icon aria-hidden="true" className="size-8 text-foreground/70" strokeWidth={1.75} />
              </div>
            ))}

            <div className="flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
              <Layers aria-hidden="true" className="size-9 text-primary" strokeWidth={1.75} />
            </div>

            {after.map((logo) => (
              <div
                className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background"
                key={logo.name}
              >
                <logo.Icon aria-hidden="true" className="size-8 text-foreground/70" strokeWidth={1.75} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 text-center sm:text-left">
            <div className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
              {heading}
            </div>
            {subtext ? (
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
            ) : null}
            {links && links.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                {links.map(({ link }, index) => (
                  <DemoLink appearance={link.appearance} key={index} label={link.label} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
