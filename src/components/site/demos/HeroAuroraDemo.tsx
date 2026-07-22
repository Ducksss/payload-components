import { Badge } from '@/components/ui/badge'
import { heroAuroraDemoContent, type HeroAuroraDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroAurora/Component.tsx
 * (hero-aurora@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may
 * diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; pages own their heading outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   Media                           → placeholder panel (@/components/Media is consumer-side)
 *   HeroAuroraBlockData             → HeroAuroraDemoContent (@/payload-types is consumer-side)
 * If the component Component.tsx changes, update this file in the same PR. */

export function HeroAuroraDemo({
  className,
  content = heroAuroraDemoContent,
}: {
  className?: string
  content?: HeroAuroraDemoContent
}) {
  const { description, eyebrow, imageCaption, links, metrics, proofItems, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col items-center gap-10 mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
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

            {metrics.length > 0 ? (
              <dl className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {metrics.map(({ label, value }, index) => (
                  <div key={`${label}-${index}`} className="flex flex-col items-center gap-1">
                    <dd className="text-2xl font-medium tracking-display tabular-nums">{value}</dd>
                    <dt className="text-xs uppercase tracking-eyebrow text-muted-foreground">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            ) : null}

            {proofItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {proofItems.map(({ label }, index) => (
                  <Badge key={`${label}-${index}`} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <figure className="w-full max-w-5xl">
            <div className="aspect-video overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl" />
            {imageCaption ? (
              <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                {imageCaption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>
    </div>
  )
}
