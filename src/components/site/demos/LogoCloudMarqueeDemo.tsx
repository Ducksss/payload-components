import { logoCloudMarqueeDemoContent, type LogoCloudDemoContent } from '@/lib/demo-content'

import { DemoLogoMark, demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/LogoCloudMarquee/Component.tsx
 * (logo-cloud-marquee@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root
 *   <InfiniteSlider>                         → CSS marquee: an overflow-hidden viewport
 *                                              wrapping a track that renders the logos twice
 *                                              and scrolls via .logo-cloud-marquee-track
 *                                              (pure CSS — the site never imports the
 *                                              motion-based source InfiniteSlider)
 *   <ProgressiveBlur className=…>            → plain <div> carrying the same className literal
 *   <Media> upload                           → monochrome wordmark <span>
 * The scroll is reduced-motion-safe via the global guard in globals.css. If the
 * component Component.tsx changes, update this file in the same PR. */

export function LogoCloudMarqueeDemo({
  className,
  content = logoCloudMarqueeDemoContent,
}: {
  className?: string
  content?: LogoCloudDemoContent
}) {
  const { heading } = content
  const marqueeLogos = demoLogos.slice(0, 8)

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:gap-0">
          <div className="md:max-w-44 md:border-r md:border-border/70 md:pr-6">
            <p className="text-center text-sm text-muted-foreground md:text-end">{heading}</p>
          </div>

          <div className="relative w-full py-6 md:w-[calc(100%-11rem)]">
            <div className="overflow-hidden">
              <div className="logo-cloud-marquee-track flex w-max items-center gap-28">
                {[...marqueeLogos, ...marqueeLogos].map((logo, index) => (
                  <div className="flex items-center justify-center" key={`${logo.name}-${index}`}>
                    <DemoLogoMark Icon={logo.Icon} name={logo.name} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card/80 to-transparent" />
            <div className="pointer-events-none absolute left-0 top-0 h-full w-20" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
