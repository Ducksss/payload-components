import { logoCloudGridDemoContent, type LogoCloudDemoContent } from '@/lib/demo-content'

import { DemoLogoMark, demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/LogoCloudGrid/Component.tsx
 * (logo-cloud-grid@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the landing owns its heading outline)
 *   <Media> upload                           → monochrome wordmark <span> (no DB on the landing)
 *   <a href> wrapper                         → omitted (aria-hidden twins hold no focusable elements)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function LogoCloudGridDemo({
  className,
  content = logoCloudGridDemoContent,
}: {
  className?: string
  content?: LogoCloudDemoContent
}) {
  const { heading } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="text-center text-lg font-medium tracking-heading text-foreground">
            {heading}
          </div>

          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            {demoLogos.slice(0, 6).map((logo) => (
              <div className="flex items-center justify-center" key={logo.name}>
                <DemoLogoMark Icon={logo.Icon} name={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
