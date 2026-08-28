import React from 'react'

import type { HeroSplitBlock as HeroSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = HeroSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const HeroSplitBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  highlights,
  id,
  links,
  media,
  mediaPosition,
  title,
}) => {
  /* The visual leads on mobile whichever side it takes on desktop: a stacked
     hero that opens with prose pushes the image below the fold for no gain. */
  const mediaFirst = mediaPosition === 'left'

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid items-center gap-10 lg:grid-cols-2 lg:gap-16', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className={cn('flex flex-col gap-8', { 'lg:order-2': mediaFirst })}>
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
                <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
                  {title}
                </h2>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
              </div>
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

            {highlights && highlights.length > 0 ? (
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
            className={cn(
              'relative overflow-hidden rounded-card border border-border/70 bg-muted',
              { 'lg:order-1': mediaFirst },
            )}
          >
            <Media resource={media} imgClassName="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
