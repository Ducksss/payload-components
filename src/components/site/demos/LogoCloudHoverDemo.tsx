import { logoCloudHoverDemoContent, type LogoCloudDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'
import { DemoLogoMark, demoLogos } from './DemoLogos'

/* DEMO TWIN of payload-components/source/blocks/LogoCloudHover/Component.tsx
 * (logo-cloud-hover@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root
 *   <Media> upload                           → monochrome wordmark <span>
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   <a href> wrapper                         → omitted
 * The hover overlay uses real group-hover classes, so the CTA reveals on
 * hover here too. If the component Component.tsx changes, update this file in
 * the same PR. */

export function LogoCloudHoverDemo({
  className,
  content = logoCloudHoverDemoContent,
}: {
  className?: string
  content?: LogoCloudDemoContent
}) {
  const { heading, links } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <p className="text-center text-sm font-medium text-muted-foreground">{heading}</p>

          <div className="group relative">
            {links && links.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 transition duration-500 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100">
                {links.map(({ link }, index) => (
                  <DemoLink appearance={link.appearance} key={index} label={link.label} />
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-40 group-hover:blur-sm group-focus-within:opacity-40 group-focus-within:blur-sm sm:gap-x-16 sm:gap-y-12 md:grid-cols-4">
              {demoLogos.slice(0, 8).map((logo) => (
                <div className="flex items-center justify-center" key={logo.name}>
                  <DemoLogoMark Icon={logo.Icon} name={logo.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
