'use client'

import type { HTMLMotionProps } from 'motion/react'

import { motion } from 'motion/react'

import { cn } from '@/utilities/ui'

/**
 * Layered directional blur, ported from the motion-primitives ProgressiveBlur
 * (MIT) into the payload-components family. Only runtime dependency is `motion`.
 *
 * Used by the Logo Cloud Marquee block to fade the scrolling logos into the
 * card edges.
 */

export const GRADIENT_ANGLES = {
  bottom: 180,
  left: 270,
  right: 90,
  top: 0,
}

export type ProgressiveBlurProps = {
  blurIntensity?: number
  blurLayers?: number
  className?: string
  direction?: keyof typeof GRADIENT_ANGLES
} & HTMLMotionProps<'div'>

export function ProgressiveBlur({
  blurIntensity = 0.25,
  blurLayers = 8,
  className,
  direction = 'bottom',
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2)
  const segmentSize = 1 / (blurLayers + 1)

  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction]
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
        )

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(', ')})`

        return (
          <motion.div
            className="absolute inset-0 rounded-[inherit]"
            key={index}
            style={{
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              maskImage: gradient,
            }}
            {...props}
          />
        )
      })}
    </div>
  )
}
