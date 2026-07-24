'use client'

import { motion, useReducedMotion } from 'motion/react'

/* Colophon reveal for the ink footer. The shared TemplateSectionReveal only
 * choreographs canvas sections, so the footer sign-off draws itself in like
 * the last page of a printed piece: a warm apricot rule draws across, then
 * the serif line rises. Once, in view, transform/opacity only; reduced motion
 * lands the final frame instantly (JS gate + motion-reduce pins keep even the
 * pre-hydration HTML complete). */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function NorthlineColophon({ signOff }: { signOff: string }) {
  const reduce = useReducedMotion() ?? false

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <motion.span
        aria-hidden="true"
        className="h-px w-16 origin-left motion-reduce:transform-none!"
        style={{ backgroundColor: 'var(--nl-apricot)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ margin: '0px 0px -10% 0px', once: true }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE }}
      />
      <motion.p
        className="font-serif text-4xl italic leading-tight text-balance sm:text-5xl motion-reduce:opacity-100! motion-reduce:transform-none!"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: '0px 0px -10% 0px', once: true }}
        transition={reduce ? { duration: 0 } : { delay: 0.15, duration: 0.8, ease: EASE }}
      >
        {signOff}
      </motion.p>
    </div>
  )
}
