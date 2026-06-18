import { Layers } from 'lucide-react'

import { integrationOrbitDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationOrbit/Component.tsx
 * (integration-orbit@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 * The orbit spin lives in globals.css (.integration-orbit-*) and runs only on
 * hover; the global reduced-motion guard neutralizes it. Inline transform
 * styles are not part of the class-mirror check. If the component Component.tsx
 * changes, update this file in the same PR. */

const slotStyle = (index: number, count: number, radius: string) => ({
  transform: `rotate(${(360 / Math.max(count, 1)) * index}deg) translateY(-${radius})`,
})
const uprightStyle = (index: number, count: number) => ({
  transform: `rotate(${-(360 / Math.max(count, 1)) * index}deg)`,
})

export function IntegrationOrbitDemo({
  className,
  content = integrationOrbitDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, subtext } = content
  const outer = demoLogos.slice(0, 4)
  const inner = demoLogos.slice(4, 7)

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
          <div className="group relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center">
            <div className="integration-orbit-ring absolute inset-0">
              <div className="absolute inset-0 rounded-full border border-dashed border-border/70" />
              {outer.map((logo, index) => (
                <div
                  className="absolute left-1/2 top-1/2"
                  key={logo.name}
                  style={slotStyle(index, outer.length, '7.5rem')}
                >
                  <div style={uprightStyle(index, outer.length)}>
                    <div className="integration-orbit-logo">
                      <div className="flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <logo.Icon aria-hidden="true" className="size-6 text-foreground/70" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="integration-orbit-ring-reverse absolute inset-[24%]">
              <div className="absolute inset-0 rounded-full border border-dashed border-border/70" />
              {inner.map((logo, index) => (
                <div
                  className="absolute left-1/2 top-1/2"
                  key={logo.name}
                  style={slotStyle(index, inner.length, '4.25rem')}
                >
                  <div style={uprightStyle(index, inner.length)}>
                    <div className="integration-orbit-logo">
                      <div className="flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <logo.Icon aria-hidden="true" className="size-5 text-foreground/70" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
              <Layers aria-hidden="true" className="size-9 text-primary" strokeWidth={1.75} />
            </div>
          </div>

          <div className="flex max-w-lg flex-col items-center gap-5 text-center">
            <div className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
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
