'use client'

import type { ReactNode } from 'react'

import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'
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
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(viewportRef, { amount: 'some' })
  const translation = useMotionValue(0)
  const [key, setKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Respect the user's reduced-motion preference: skip the infinite scroll
    // and leave the row static (WCAG 2.2.2 Pause/Stop/Hide, 2.3.3).
    if (shouldReduceMotion) {
      translation.set(0)
      return
    }

    // IntersectionObserver-backed `useInView` stops the animation controls
    // while the slider is off-screen. Restarting from the motion value avoids
    // a visual jump when the section re-enters the viewport.
    if (!isInView || width === 0 || currentSpeed <= 0) return

    const contentSize = width + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    const current = translation.get()
    const inRange = current >= -contentSize / 2 && current <= 0
    const start = inRange ? current : from
    if (!inRange || Math.abs(start - to) < 0.5) translation.set(from)

    const actualStart = Math.abs(start - to) < 0.5 ? from : start
    const controls = animate(translation, [actualStart, to], {
      duration: Math.abs((actualStart - to) / currentSpeed) * 2,
      ease: 'linear',
      onComplete: () => {
        translation.set(from)
        setKey((previous) => previous + 1)
      },
    })

    return controls?.stop
  }, [currentSpeed, gap, isInView, key, reverse, shouldReduceMotion, translation, width])

  const hoverProps =
    speedOnHover && !shouldReduceMotion
      ? {
          onHoverEnd: () => {
            setCurrentSpeed(speed)
          },
          onHoverStart: () => {
            setCurrentSpeed(speedOnHover)
          },
        }
      : {}

  return (
    <div className={cn('overflow-hidden', className)} ref={viewportRef}>
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
