'use client'

import type { ReactNode } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import './template-surface-motion.css'

/* Scroll reveal for the /templates DETAIL page sections. Deliberately quieter
 * than the gallery: one rise per block of content, once, never replayed.
 *
 * Contract (same as TemplateSectionReveal, which owns the preview routes):
 * - server and client render the SAME tree — branching JSX on
 *   useReducedMotion() is a hydration bug (it is always false during SSR), so
 *   reduced motion zeroes the TRANSITION instead;
 * - template-surface-motion.css pins the final state before hydration;
 * - transform + opacity only, and it wraps section CONTENT, never a <Section>
 *   itself — translating a full-bleed band would slide its background. */
export function TemplateReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      data-template-motion
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: '0px 0px -12% 0px', once: true }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { damping: 26, delay, mass: 0.9, stiffness: 150, type: 'spring' }
      }
    >
      {children}
    </motion.div>
  )
}
