import type { CSSProperties } from 'react'

import { Badge } from '@/components/ui/badge'
import { heroBasicDemoContent, type HeroBasicDemoContent } from '@/lib/demo-content'
import { cn } from '@/utilities/ui'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroBasic/Component.tsx
 * (hero-basic@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may
 * diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; the landing owns its heading outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   HeroBasicBlockData              → HeroBasicDemoContent (@/payload-types exists only in consumer repos)
 * Badge is the same shadcn primitive the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

type PartDelays = {
  description: number
  eyebrow: number
  links: number
  proofItems: number
  title: number
}

type RiseStyle = CSSProperties & { '--spawn-delay'?: string }

const rise = (delay: number | undefined): RiseStyle | undefined =>
  delay === undefined ? undefined : { '--spawn-delay': `${delay}ms` }

export function HeroBasicDemo({
  className,
  content = heroBasicDemoContent,
  partDelays,
}: {
  className?: string
  content?: HeroBasicDemoContent
  /* When set, each field staggers in with the twin-rise animation —
     used by the hero install replay. Absent = static rendering. */
  partDelays?: PartDelays
}) {
  const { description, eyebrow, links, proofItems, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className={cn(
                  'w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow',
                  partDelays && 'twin-rise',
                )}
                style={rise(partDelays?.eyebrow)}
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex max-w-3xl flex-col gap-4">
              <div
                className={cn(
                  'text-4xl font-medium tracking-display text-balance sm:text-5xl',
                  partDelays && 'twin-rise',
                )}
                style={rise(partDelays?.title)}
              >
                {title}
              </div>
              <p
                className={cn(
                  'max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg',
                  partDelays && 'twin-rise',
                )}
                style={rise(partDelays?.description)}
              >
                {description}
              </p>
            </div>
          </div>

          {links.length > 0 ? (
            <div
              className={cn('flex flex-col gap-3 sm:flex-row', partDelays && 'twin-rise')}
              style={rise(partDelays?.links)}
            >
              {links.map(({ link }, index) => (
                <DemoLink key={index} appearance={link.appearance} label={link.label} />
              ))}
            </div>
          ) : null}

          {proofItems.length > 0 ? (
            <div
              className={cn('flex flex-wrap gap-3', partDelays && 'twin-rise')}
              style={rise(partDelays?.proofItems)}
            >
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
      </div>
    </div>
  )
}
