'use client'

import type { ReactNode } from 'react'

import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Continuously scrolling row, ported from the motion-primitives InfiniteSlider
 * (MIT) into the payload-components family. Self-contained: the only runtime
 * dependency is `motion`; element width is measured with a local
 * ResizeObserver instead of an extra package.
 *
 * Used by the Logo Cloud Marquee block to scroll an editable wall of logos.
 */

function useElementWidth() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

export type InfiniteSliderProps = {
  children: ReactNode
  className?: string
  gap?: number
  reverse?: boolean
  speed?: number
  speedOnHover?: number
}

export function InfiniteSlider({
  children,
  className,
  gap = 16,
  reverse = false,
  speed = 100,
  speedOnHover,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  const [ref, width] = useElementWidth()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Respect the user's reduced-motion preference: skip the infinite scroll
    // and leave the row static (WCAG 2.2.2 Pause/Stop/Hide, 2.3.3).
    if (shouldReduceMotion) return

    const contentSize = width + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    const controls = isTransitioning
      ? animate(translation, [translation.get(), to], {
          duration: Math.abs((translation.get() - to) / currentSpeed),
          ease: 'linear',
          onComplete: () => {
            setIsTransitioning(false)
            setKey((prev) => prev + 1)
          },
        })
      : animate(translation, [from, to], {
          duration: contentSize / currentSpeed,
          ease: 'linear',
          onRepeat: () => {
            translation.set(from)
          },
          repeat: Infinity,
          repeatDelay: 0,
          repeatType: 'loop',
        })

    return controls?.stop
  }, [key, translation, currentSpeed, width, gap, isTransitioning, reverse, shouldReduceMotion])

  const hoverProps =
    speedOnHover && !shouldReduceMotion
      ? {
          onHoverEnd: () => {
            setIsTransitioning(true)
            setCurrentSpeed(speed)
          },
          onHoverStart: () => {
            setIsTransitioning(true)
            setCurrentSpeed(speedOnHover)
          },
        }
      : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        ref={ref}
        style={{ gap: `${gap}px`, x: translation }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
