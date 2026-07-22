'use client'

import type { ReactNode } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateSectionTone } from '@/lib/templates/types'

import './template-motion.css'

/* Scroll choreography for template preview sections. Renders the
 * [data-template-section] element itself so the per-template theme selectors
 * ([data-template-section] > [aria-hidden] > …) keep working unchanged.
 *
 * Contract:
 * - the hero (index 0) never scroll-reveals — heroes own their entrance and
 *   the above-fold frame must be complete on load;
 * - reduced motion renders a plain div in final state (this is also what
 *   Playwright captures and the poster tool record);
 * - a CSS @media (prefers-reduced-motion: reduce) net in template-motion.css
 *   forces final state even before hydration;
 * - transform/opacity only, animated once per section. */
export function TemplateSectionReveal({
  children,
  id,
  index,
  tone,
}: {
  children: ReactNode
  id: string
  index: number
  tone: TemplateSectionTone
}) {
  const reduceMotion = useReducedMotion()

  if (index === 0 || reduceMotion) {
    return (
      <div data-template-section={id} data-tone={tone}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      data-template-section={id}
      data-tone={tone}
      data-template-reveal
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: '0px 0px -12% 0px', once: true }}
      transition={{ damping: 26, mass: 0.9, stiffness: 120, type: 'spring' }}
    >
      {children}
    </motion.div>
  )
}
