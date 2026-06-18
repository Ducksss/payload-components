import { Layers } from 'lucide-react'

import { integrationMarqueeDemoContent, type IntegrationDemoContent } from '@/lib/demo-content'

import { demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/IntegrationMarquee/Component.tsx
 * (integration-marquee@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <InfiniteSlider>                         → CSS marquee: an overflow-hidden viewport
 *                                              wrapping a track that renders the logos twice
 *                                              and scrolls via .integration-marquee-track
 *                                              (the middle row reversed) — pure CSS, so the
 *                                              site never imports the motion-based source slider
 *   <Media> upload                           → monochrome icon mark (no DB on the landing)
 * The scroll is reduced-motion-safe via the global guard in globals.css. If the
 * component Component.tsx changes, update this file in the same PR. */

export function IntegrationMarqueeDemo({
  className,
  content = integrationMarqueeDemoContent,
}: {
  className?: string
  content?: IntegrationDemoContent
}) {
  const { heading, subtext } = content
  const logos = demoLogos.slice(0, 7)

  const chip = (logo: (typeof demoLogos)[number], index: number) => (
    <div
      className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm"
      key={`${logo.name}-${index}`}
    >
      <logo.Icon aria-hidden="true" className="size-7 text-foreground/70" strokeWidth={1.75} />
    </div>
  )

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
          <div className="relative w-full max-w-2xl space-y-4 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000_55%,transparent_100%)]">
            <div className="overflow-hidden">
              <div className="integration-marquee-track flex w-max items-center gap-5">
                {[...logos, ...logos].map((logo, index) => chip(logo, index))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="integration-marquee-track-reverse flex w-max items-center gap-5">
                {[...logos, ...logos].map((logo, index) => chip(logo, index))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="integration-marquee-track flex w-max items-center gap-5">
                {[...logos, ...logos].map((logo, index) => chip(logo, index))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 m-auto flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
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
