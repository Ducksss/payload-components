'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = {
  posterUrl?: string
  videoUrl: string
}

export function HeroVideoPlayer({ posterUrl, videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    if (shouldReduceMotion === false) {
      void video.play().catch(() => undefined)
      return
    }

    video.pause()
  }, [shouldReduceMotion, videoUrl])

  return (
    <video
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
      loop
      muted
      playsInline
      poster={posterUrl}
      preload="none"
      ref={videoRef}
      src={videoUrl}
    />
  )
}
