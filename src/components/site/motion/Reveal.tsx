'use client'

import type { ReactNode } from 'react'

import { motion, useReducedMotion, type Variants } from 'motion/react'

import './landing-motion.css'

/* Scroll choreography for the landing page — the motion.dev counterpart of the
 * template surfaces' TemplateReveal, kept deliberately quiet: one rise per
 * block of content, once, never replayed.
 *
 * Contract:
 * - server and client render the SAME tree. Branching JSX on
 *   useReducedMotion() is a hydration bug (the hook is always false during
 *   SSR), so reduced motion zeroes the TRANSITION instead and
 *   landing-motion.css pins the final state before hydration;
 * - transform + opacity only, so every reveal stays on the compositor;
 * - these wrap section CONTENT, never a <Section> itself — translating a
 *   full-bleed band would slide its background with it;
 * - nothing above the fold uses these. Hero copy keeps its CSS entrance: a
 *   motion `initial` state ships as inline opacity:0 in the SSR HTML, so
 *   gating the LCP headline on hydration would cost real Core Web Vitals. */

const RISE_SPRING = { damping: 26, mass: 0.9, stiffness: 150, type: 'spring' } as const

/* Sits a touch inside the viewport so a reveal never fires for content still
   below the fold, and never waits until it is uncomfortably far up. */
const VIEWPORT = { margin: '0px 0px -12% 0px', once: true } as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      className={className}
      data-landing-motion
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={reduceMotion ? { duration: 0 } : { ...RISE_SPRING, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Staggered sibling reveal. The parent holds the orchestration and the items
   inherit it through variants, so a run of pills/steps/cards resolves as one
   gesture instead of N independent observers. */
const CONTAINER_TAGS = { div: motion.div, ol: motion.ol, ul: motion.ul } as const
const ITEM_TAGS = { div: motion.div, li: motion.li, span: motion.span } as const

export function RevealStagger({
  as = 'div',
  children,
  className,
  stagger = 0.06,
}: {
  as?: keyof typeof CONTAINER_TAGS
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const reduceMotion = useReducedMotion() ?? false
  const Tag = CONTAINER_TAGS[as]

  /* The container animates nothing itself — it only orchestrates. Keeping it
     free of an opacity/transform initial is what lets it wrap a <ul> or a grid
     without the reveal fighting the layout. */
  const variants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduceMotion ? 0 : stagger } },
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={variants}
    >
      {children}
    </Tag>
  )
}

/* MUST be rendered inside a <RevealStagger>. It carries no trigger of its own —
   it waits on the variant the parent propagates — so an orphaned RevealItem
   never leaves its hidden state. (Giving it its own initial/whileInView would
   make it animate independently and destroy the stagger, which is the whole
   reason the pair exists.) */
export function RevealItem({
  as = 'div',
  children,
  className,
  y = 16,
}: {
  as?: keyof typeof ITEM_TAGS
  children: ReactNode
  className?: string
  y?: number
}) {
  const reduceMotion = useReducedMotion() ?? false
  const Tag = ITEM_TAGS[as]

  const variants: Variants = {
    hidden: { opacity: 0, y },
    shown: {
      opacity: 1,
      transition: reduceMotion ? { duration: 0 } : RISE_SPRING,
      y: 0,
    },
  }

  return (
    <Tag className={className} data-landing-motion variants={variants}>
      {children}
    </Tag>
  )
}
