'use client'

import React from 'react'

import type { HeroKineticBlock as HeroKineticBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

/* CONTRACT SKELETON — the kinetic art direction (line-mask type reveal,
 * velocity marquee strip, clip-path image plate via the `motion` package) is
 * built by the hero-kinetic track. Keep the field contract and the
 * section/container wrapper props; everything visual may change. */

type Props = HeroKineticBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const HeroKineticBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  image,
  imageCaption,
  links,
  marqueeItems,
  proofItems,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-4xl flex-col gap-6">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-4">
              <h2 className="text-5xl font-medium tracking-display text-balance sm:text-7xl">
                {title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            {links && links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={index}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    {...link}
                  />
                ))}
              </div>
            ) : null}

            {proofItems && proofItems.length > 0 ? (
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
            <div className="aspect-[21/9] overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl">
              {image ? <Media resource={image} imgClassName="h-full w-full object-cover" /> : null}
            </div>
            {imageCaption ? (
              <figcaption className="mt-4 text-sm text-muted-foreground">{imageCaption}</figcaption>
            ) : null}
          </figure>

          {marqueeItems && marqueeItems.length > 0 ? (
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
    </section>
  )
}
