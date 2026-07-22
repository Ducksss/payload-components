import { Badge } from '@/components/ui/badge'
import { heroKineticDemoContent, type HeroKineticDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroKinetic/Component.tsx
 * (hero-kinetic@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may
 * diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; pages own their heading outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   Media                           → placeholder plate (@/components/Media is consumer-side)
 *   HeroKineticBlockData            → HeroKineticDemoContent (@/payload-types is consumer-side)
 * If the component Component.tsx changes, update this file in the same PR. */

export function HeroKineticDemo({
  className,
  content = heroKineticDemoContent,
}: {
  className?: string
  content?: HeroKineticDemoContent
}) {
  const { description, eyebrow, imageCaption, links, marqueeItems, proofItems, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-10 mx-auto max-w-6xl">
          <div className="flex max-w-4xl flex-col gap-6">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="text-5xl font-medium tracking-display text-balance sm:text-7xl">
                {title}
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
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
                  <Badge key={`${label}-${index}`} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <figure className="w-full">
            <div className="aspect-[21/9] overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl" />
            {imageCaption ? (
              <figcaption className="mt-4 text-sm text-muted-foreground">{imageCaption}</figcaption>
            ) : null}
          </figure>

          {marqueeItems.length > 0 ? (
            <ul className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border/70 pt-6">
              {marqueeItems.map(({ label }, index) => (
                <li
                  key={`${label}-${index}`}
                  className="text-sm uppercase tracking-eyebrow text-muted-foreground"
                >
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
