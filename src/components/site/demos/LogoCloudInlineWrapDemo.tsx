import { logoCloudInlineWrapDemoContent, type LogoCloudDemoContent } from '@/lib/demo-content'

import { DemoLogoMark, demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/LogoCloudInlineWrap/Component.tsx
 * (logo-cloud-inline-wrap@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root
 *   <Media> upload                           → monochrome wordmark <span>
 *   <a href> wrapper                         → omitted
 * If the component Component.tsx changes, update this file in the same PR. */

export function LogoCloudInlineWrapDemo({
  className,
  content = logoCloudInlineWrapDemoContent,
}: {
  className?: string
  content?: LogoCloudDemoContent
}) {
  const { heading } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-4">
          <p className="text-muted-foreground">{heading}</p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {demoLogos.slice(0, 4).map((logo) => (
              <div className="flex items-center" key={logo.name}>
                <DemoLogoMark Icon={logo.Icon} name={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
