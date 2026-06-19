import React from 'react'

import type { EmbedBasicBlock as EmbedBasicBlockData } from '@/payload-types'

import { getSafeEmbedUrl } from '@/blocks/shared/safeUrls'
import { cn } from '@/utilities/ui'

type Props = EmbedBasicBlockData & {
  id?: string
  className?: string
}

const aspectClassByRatio: Record<NonNullable<EmbedBasicBlockData['aspectRatio']>, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
}

export const EmbedBasicBlock: React.FC<Props> = ({
  allowFullscreen,
  aspectRatio,
  caption,
  className,
  id,
  title,
  url,
}) => {
  const aspectClass = aspectClassByRatio[aspectRatio ?? '16:9'] ?? aspectClassByRatio['16:9']
  const safeUrl = getSafeEmbedUrl(url)

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <figure className="overflow-hidden rounded-frame border border-border/70 bg-card/35">
        <div className={cn('relative w-full bg-muted', aspectClass)}>
          {safeUrl ? (
            <iframe
              allow="encrypted-media; picture-in-picture"
              allowFullScreen={allowFullscreen ?? true}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-forms allow-popups allow-presentation allow-scripts"
              src={safeUrl}
              title={title}
            />
          ) : null}
        </div>

        {caption ? (
          <figcaption className="px-6 py-4 text-sm text-muted-foreground">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  )
}
