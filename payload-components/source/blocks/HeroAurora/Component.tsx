'use client'

import React from 'react'

import type { HeroAuroraBlock as HeroAuroraBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

/* CONTRACT SKELETON — the aurora art direction (animated gradient field,
 * staggered headline, pointer-parallax product panel, metric ticker via the
 * `motion` package) is built by the hero-aurora track. Keep the field contract
 * and the section/container wrapper props; everything visual may change. */

type Props = HeroAuroraBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const HeroAuroraBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  imageCaption,
  links,
  metrics,
  productImage,
  proofItems,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('flex flex-col items-center gap-10', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-medium tracking-display text-balance sm:text-6xl">
                {title}
              </h2>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>

            {links && links.length > 0 ? (
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={index}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    {...link}
                  />
                ))}
              </div>
            ) : null}

            {metrics && metrics.length > 0 ? (
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

            {proofItems && proofItems.length > 0 ? (
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
            <div className="aspect-video overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl">
              {productImage ? (
                <Media resource={productImage} imgClassName="h-full w-full object-contain" />
              ) : null}
            </div>
            {imageCaption ? (
              <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                {imageCaption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  )
}
