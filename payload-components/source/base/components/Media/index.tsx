import NextImage from 'next/image'
import React from 'react'

import { cn } from '@/utilities/ui'

type MediaResource =
  | {
      alt?: null | string
      height?: null | number
      url?: null | string
      width?: null | number
    }
  | null
  | number
  | string
  | undefined

type MediaProps = {
  className?: string
  imgClassName?: string
  resource?: MediaResource
}

/**
 * Renders an uploaded image from a Payload upload relation.
 *
 * Mirrors the component the Payload website starter ships at
 * `src/components/Media/index.tsx`. Installed blocks use exactly two props —
 * `resource` and `imgClassName` — so this covers that surface and nothing more.
 *
 * A `resource` that is still an ID rather than a populated document renders
 * nothing: the block is being read at a depth that did not populate the upload.
 * Raise `depth` on the query, or populate the field, rather than working around
 * it here.
 */
export const Media: React.FC<MediaProps> = ({ className, imgClassName, resource }) => {
  if (!resource || typeof resource === 'number' || typeof resource === 'string') {
    return null
  }

  const { alt, height, url, width } = resource

  if (!url) {
    return null
  }

  /* Payload stores intrinsic dimensions on the upload. Without them next/image
     cannot reserve space, so fall back to a plain img rather than guessing at a
     size and shifting the layout. */
  if (!height || !width) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ''} className={cn(imgClassName, className)} src={url} />
    )
  }

  return (
    <NextImage
      alt={alt ?? ''}
      className={cn(imgClassName, className)}
      height={height}
      src={url}
      width={width}
    />
  )
}
