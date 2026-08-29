import { Badge } from '@/components/ui/badge'
import { heroSplitDemoContent, type HeroSplitDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroSplit/Component.tsx
 * (hero-split@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   CMSLink                                  → <DemoLink> (@/components/Link is consumer-only)
 *   image upload                             → empty bg-muted panel
 *   HeroSplitBlockData                       → HeroSplitDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 *   imagePosition                            → the same lg:order-* swap, from demo content
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function HeroSplitDemo({
  className,
  content = heroSplitDemoContent,
}: {
  className?: string
  content?: HeroSplitDemoContent
}) {
  const { description, eyebrow, highlights, imagePosition, links, title } = content
  const imageFirst = imagePosition === 'left'

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={`flex flex-col gap-8${imageFirst ? ' lg:order-2' : ''}`}>
            <div className="flex flex-col gap-4">
              {eyebrow ? (
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
                >
                  {eyebrow}
                </Badge>
              ) : null}

              <div className="flex flex-col gap-4">
                <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
                  {title}
                </div>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </div>
            </div>

            {links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}

            {highlights.length > 0 ? (
              <ul className="flex flex-col gap-3 border-t border-border/70 pt-6">
                {highlights.map(({ label }, index) => (
                  <li
                    key={`${label}-${index}`}
                    className="flex items-baseline gap-3 text-sm text-muted-foreground"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div
            className={`order-first relative overflow-hidden rounded-card border border-border/70 bg-muted${
              imageFirst ? ' lg:order-1' : ' lg:order-none'
            } aspect-[4/3]`}
          />
        </div>
      </div>
    </div>
  )
}
