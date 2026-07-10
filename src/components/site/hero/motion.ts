import type { CSSProperties } from 'react'

/* Shared inline-style plumbing for the hero install stage. Every beat is a
 * one-shot CSS animation parameterized by custom-property delays, so the
 * whole choreography replays via subtree remount (HeroInstallReplay) and
 * collapses to its finished frame under reduced motion. */
export type MotionStyle = CSSProperties & {
  '--line-delay'?: string
  '--line-duration'?: string
  '--spawn-delay'?: string
  '--tick-delay'?: string
  '--wire-len'?: string
}

export const spawnStyle = (delay: number): MotionStyle => ({
  '--spawn-delay': `${delay}ms`,
})

export const lineStyle = (delay: number, duration: number): MotionStyle => ({
  '--line-delay': `${delay}ms`,
  '--line-duration': `${duration}ms`,
})

export const tickStyle = (delay: number): MotionStyle => ({
  '--tick-delay': `${delay}ms`,
})

/* One clock for the whole stage (ms from mount). The rail narrates the run,
 * wires carry the command out to the three surfaces, then each surface
 * receives its artifact — admin first, the repo diff printing while the
 * rendered page materializes last, center stage. */
export const heroTimeline = {
  adminPop: 1980,
  diffStagger: 110,
  diffStart: 2300,
  skeletonFade: 2450,
  tickerFinal: 2560,
  tickerGap: 450,
  tickerStart: 760,
  twinStagger: 110,
  twinStart: 2500,
  wireDelays: { admin: 1500, diff: 1900, page: 1700 },
  wirePortLag: 420,
} as const
