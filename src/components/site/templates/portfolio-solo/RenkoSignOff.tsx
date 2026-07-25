'use client'

import type { Variants } from 'motion/react'

import { motion, useReducedMotion } from 'motion/react'

/* The only moving part in Ilse Renko's shell: a slate rule draws across, then
 * the sign-off rises out of a mask, once, when the footer comes into view.
 *
 * Transform-only on purpose. An opacity entrance on chrome type can dip below
 * AA mid-animation (axe catches exactly that), and a masked rise reads as
 * considered rather than animated — it is the same word-mask idiom the kinetic
 * headline uses, which ties the two ends of the page together.
 *
 * The trigger lives on the OUTER wrapper and drives both children through
 * variants. A `whileInView` on the masked line itself can never fire:
 * IntersectionObserver clips a target against its ancestors' overflow, and the
 * line starts translated fully below its own overflow-hidden mask, so its
 * intersection rect is permanently empty. Observing the unclipped wrapper also
 * means one observer for the whole sign-off.
 *
 * Reduced motion lands the final frame instantly: the JS gate zeroes the
 * duration, the motion-reduce pins beat the inline initial style, and the
 * @media net in theme.css covers the pre-hydration frame that Playwright
 * captures and the poster tool record. */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const ruleVariants: Variants = { in: { scaleX: 1 }, rest: { scaleX: 0 } }
const lineVariants: Variants = { in: { y: '0%' }, rest: { y: '115%' } }

export function RenkoSignOff({ signOff }: { signOff: string }) {
  const reduce = useReducedMotion() ?? false

  return (
    <motion.div
      className="flex max-w-2xl flex-col gap-6"
      initial="rest"
      whileInView="in"
      viewport={{ margin: '0px 0px -10% 0px', once: true }}
    >
      <motion.span
        aria-hidden="true"
        data-ir-draw
        data-ir-nav-rule
        className="h-px w-12 origin-left motion-reduce:transform-none!"
        variants={ruleVariants}
        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      />
      <p className="text-2xl font-medium tracking-title text-balance text-foreground sm:text-3xl">
        <span className="inline-block overflow-hidden px-1 -mx-1 py-2 -my-2">
          <motion.span
            data-ir-rise
            className="inline-block motion-reduce:transform-none!"
            variants={lineVariants}
            transition={reduce ? { duration: 0 } : { delay: 0.1, duration: 0.9, ease: EASE }}
          >
            {signOff}
          </motion.span>
        </span>
      </p>
    </motion.div>
  )
}
