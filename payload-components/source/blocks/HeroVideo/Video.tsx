'use client'

import { useReducedMotion } from 'motion/react'

type Props = {
  posterUrl?: string
  videoUrl: string
}

export function HeroVideoPlayer({ posterUrl, videoUrl }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const canAutoPlay = shouldReduceMotion === false

  if (!canAutoPlay) return null

  return (
    <video
      aria-hidden="true"
      autoPlay={canAutoPlay}
      className="absolute inset-0 h-full w-full object-cover"
      loop
      muted
      playsInline
      poster={posterUrl}
      src={videoUrl}
    />
  )
}
