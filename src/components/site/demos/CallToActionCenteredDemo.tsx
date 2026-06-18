import { callToActionCenteredDemoContent, type CtaDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/CallToActionCentered/Component.tsx
 * (call-to-action-centered@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   CallToActionCenteredBlockData            → CtaDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → plain mx-auto/max-w-2xl div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function CallToActionCenteredDemo({
  className,
  content = callToActionCenteredDemoContent,
}: {
  className?: string
  content?: CtaDemoContent
}) {
  const { description, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
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
  )
}
