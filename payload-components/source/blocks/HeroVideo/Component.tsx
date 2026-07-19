import React from 'react'

import type { HeroVideoBlock as HeroVideoBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import { HeroVideoPlayer } from './Video'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = HeroVideoBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const HeroVideoBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  links,
  poster,
  proofItems,
  title,
  video,
}) => {
  const videoUrl =
    typeof video === 'object' &&
    video !== null &&
    typeof video.mimeType === 'string' &&
    video.mimeType.startsWith('video/') &&
    typeof video.url === 'string'
      ? video.url
      : undefined

  const posterUrl =
    typeof poster === 'object' && poster !== null && typeof poster.url === 'string'
      ? poster.url
      : undefined

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="relative isolate min-h-[36rem] overflow-hidden rounded-frame border border-border/70 bg-foreground">
        <div className="absolute inset-0 overflow-hidden bg-muted">
          {poster ? (
            <Media resource={poster} imgClassName="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          {videoUrl ? <HeroVideoPlayer posterUrl={posterUrl} videoUrl={videoUrl} /> : null}
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div
          className={cn(
            'relative flex min-h-[36rem] flex-col justify-end px-6 py-10 sm:px-8 lg:px-12 lg:py-14',
            {
              'mx-auto max-w-5xl': !disableInnerContainer,
            },
          )}
        >
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
              <h2 className="text-4xl font-medium tracking-display text-balance text-background sm:text-6xl">
                {title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-background/80 sm:text-lg">
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
    </section>
  )
}
