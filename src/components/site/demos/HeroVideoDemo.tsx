import { Badge } from '@/components/ui/badge'
import { heroVideoDemoContent, type HeroVideoDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroVideo/Component.tsx
 * (hero-video@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   Media/video                              → static gradient poster (no uploads on the site)
 *   HeroVideoBlockData                       → HeroVideoDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function HeroVideoDemo({
  className,
  content = heroVideoDemoContent,
}: {
  className?: string
  content?: HeroVideoDemoContent
}) {
  const { description, eyebrow, links, proofItems, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="relative isolate min-h-[36rem] overflow-hidden rounded-frame border border-border/70 bg-foreground">
        <div className="absolute inset-0 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-accent/30 to-muted" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div className="relative mx-auto flex min-h-[36rem] max-w-5xl flex-col justify-end px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="flex max-w-3xl flex-col gap-6">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full border-background/30 bg-background/10 px-3 py-1 text-background uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="text-4xl font-medium tracking-display text-balance text-background sm:text-6xl">
                {title}
              </div>
              <p className="max-w-2xl text-base leading-7 text-background/80 sm:text-lg">
                {description}
              </p>
            </div>

            {links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}

            {proofItems.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {proofItems.map(({ label }, index) => (
                  <Badge
                    key={`${label}-${index}`}
                    variant="secondary"
                    className="rounded-full bg-background/10 px-3 py-1 text-sm text-background"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
