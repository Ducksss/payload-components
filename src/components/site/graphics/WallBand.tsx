'use client'

import { useRef, useState, type ReactNode } from 'react'

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

/* One drifting row of the component wall.
 *
 * The track holds the caller's cards twice, so translating it by exactly -50%
 * lands the second copy where the first began — the loop is seamless with no
 * measurement and no layout thrash. A motion value driven by
 * useAnimationFrame owns the offset (rather than a CSS keyframe) because it
 * can be paused mid-drift, which a keyframe cannot:
 *
 * - off-screen the band does no work at all. This is the perf guardrail that
 *   makes an infinite animation acceptable on a landing page — it never burns
 *   frames for a wall nobody is looking at;
 * - hovering pauses the row so a visitor can actually read a block;
 * - reduced motion never advances it, and never mounts the sweep.
 *
 * Transform-only, so the whole thing stays on the compositor. `children` is
 * server-rendered — the cards are RSC and never hydrate. */

/* A backgrounded tab can hand back a multi-second delta on its first frame;
   clamping keeps the row from teleporting when the visitor returns. */
const MAX_FRAME_MS = 64

export function WallBand({
  children,
  reverse = false,
  speed,
}: {
  children: ReactNode
  reverse?: boolean
  speed: number
}) {
  const reduceMotion = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0 })
  const [paused, setPaused] = useState(false)

  /* Reverse rows start a full copy in so they can travel forwards to 0. */
  const offset = useMotionValue(reverse ? -50 : 0)
  const x = useTransform(offset, (value) => `${value}%`)

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || paused) return

    const direction = reverse ? 1 : -1
    let next = offset.get() + direction * speed * (Math.min(delta, MAX_FRAME_MS) / 1000)

    if (next <= -50) next += 50
    if (next >= 0) next -= 50

    offset.set(next)
  })

  return (
    <div
      ref={ref}
      className="overflow-hidden"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 items-start gap-5 pr-5">{children}</div>
        <div className="flex shrink-0 items-start gap-5 pr-5">{children}</div>
      </motion.div>
    </div>
  )
}
