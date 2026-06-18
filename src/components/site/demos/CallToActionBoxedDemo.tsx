import { callToActionBoxedDemoContent, type CtaDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/CallToActionBoxed/Component.tsx
 * (call-to-action-boxed@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   CallToActionBoxedBlockData               → CtaDemoContent (@/payload-types is consumer-only)
 *   cn() inner panel                         → plain mx-auto/max-w-3xl div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function CallToActionBoxedDemo({
  className,
  content = callToActionBoxedDemoContent,
}: {
  className?: string
  content?: CtaDemoContent
}) {
  const { description, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/70 bg-background/60 px-6 py-10 sm:px-10 sm:py-14">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}

            {links && links.length > 0 ? (
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
