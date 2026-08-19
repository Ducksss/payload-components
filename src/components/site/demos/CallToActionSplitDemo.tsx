import { callToActionSplitDemoContent, type CtaDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/CallToActionSplit/Component.tsx
 * (call-to-action-split@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link exists only in consumer repos)
 *   CallToActionSplitBlockData               → CtaDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → plain mx-auto/max-w-6xl div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function CallToActionSplitDemo({
  className,
  content = callToActionSplitDemoContent,
}: {
  className?: string
  content?: CtaDemoContent
}) {
  const { assurance, description, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {links && links.length > 0 ? (
            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
              {assurance ? (
                <p className="text-sm leading-6 text-muted-foreground lg:text-right">{assurance}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
