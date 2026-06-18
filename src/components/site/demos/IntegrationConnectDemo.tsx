import { Layers } from 'lucide-react'

import { integrationConnectDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationConnect/Component.tsx
 * (integration-connect@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 * imgClassName values are not mirrored. If the component Component.tsx changes,
 * update this file in the same PR. */

export function IntegrationConnectDemo({
  className,
  content = integrationConnectDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, subtext } = content
  const left = demoLogos.slice(0, 3)
  const right = demoLogos.slice(3, 6)

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
          <div className="relative flex w-full max-w-md items-center justify-between">
            <div className="pointer-events-none absolute inset-x-12 inset-y-0 bg-[radial-gradient(var(--connect-dots)_1px,transparent_1px)] [--connect-dots:rgba(120,120,130,0.35)] [background-size:16px_16px] opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_55%,transparent_100%)]" />

            <div className="flex flex-col gap-6">
              {left.map((logo) => (
                <div
                  className="relative flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background"
                  key={logo.name}
                >
                  <logo.Icon aria-hidden="true" className="size-6 text-foreground/70" strokeWidth={1.75} />
                  <span className="pointer-events-none absolute left-full top-1/2 h-px w-10 bg-gradient-to-r from-border to-transparent" />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
              <Layers aria-hidden="true" className="size-9 text-primary" strokeWidth={1.75} />
            </div>

            <div className="flex flex-col gap-6">
              {right.map((logo) => (
                <div
                  className="relative flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background"
                  key={logo.name}
                >
                  <logo.Icon aria-hidden="true" className="size-6 text-foreground/70" strokeWidth={1.75} />
                  <span className="pointer-events-none absolute right-full top-1/2 h-px w-10 bg-gradient-to-l from-border to-transparent" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex max-w-lg flex-col items-center gap-5 text-center">
            <div className="text-balance text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              {heading}
            </div>
            {subtext ? (
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
