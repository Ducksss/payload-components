import { Badge } from '@/components/ui/badge'
import { heroProductTiltDemoContent, type HeroProductTiltDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroProductTilt/Component.tsx
 * (hero-product-tilt@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   Media upload                             → static product-dashboard illustration
 *   HeroProductTiltBlockData                 → HeroProductTiltDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function HeroProductTiltDemo({
  className,
  content = heroProductTiltDemoContent,
}: {
  className?: string
  content?: HeroProductTiltDemoContent
}) {
  const { description, eyebrow, imageCaption, links, proofItems, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="text-4xl font-medium tracking-display text-balance sm:text-6xl">
                {title}
              </div>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>

            {links.length > 0 ? (
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}

            {proofItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {proofItems.map(({ label }, index) => (
                  <Badge
                    key={`${label}-${index}`}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-sm"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="w-full max-w-5xl lg:perspective-distant">
            <div className="aspect-video overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl lg:origin-top lg:rotate-x-6">
              <div className="grid h-full grid-cols-[0.3fr_1fr] bg-background">
                <div className="border-r border-border/70 bg-muted/40 p-4">
                  <div className="mb-5 h-5 w-20 rounded-full bg-foreground/15" />
                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-foreground/10" />
                    <div className="h-3 w-4/5 rounded-full bg-foreground/10" />
                    <div className="h-3 w-3/5 rounded-full bg-foreground/10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5">
                  <div className="col-span-2 rounded-panel border border-border/70 bg-card p-4">
                    <div className="h-full min-h-24 rounded-inset bg-accent/25" />
                  </div>
                  <div className="rounded-panel border border-border/70 bg-card p-4">
                    <div className="h-full rounded-inset bg-muted" />
                  </div>
                  <div className="rounded-panel border border-border/70 bg-card p-4">
                    <div className="h-full rounded-inset bg-primary/15" />
                  </div>
                </div>
              </div>
            </div>
            {imageCaption ? (
              <div className="mt-4 text-center text-sm text-muted-foreground">{imageCaption}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
