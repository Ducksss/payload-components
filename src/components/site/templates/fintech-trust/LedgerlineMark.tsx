'use client'

import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/utilities/ui'

/* The Ledgerline mark: three ruled ledger lines with a teal movement drawn
 * across them. A bordered plate rather than a filled tile — institutional
 * chrome, not a product badge.
 *
 * The movement line draws itself once on load (pathLength, which motion renders
 * as stroke-dasharray). Reduced motion zeroes the transition AND the scoped CSS
 * net in theme.css pins stroke-dasharray to none, so the pre-hydration frame,
 * Playwright captures, and the generated posters all show the finished mark. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function LedgerlineMark({
  className,
  delay = 0.18,
}: {
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center border border-border',
        className,
      )}
    >
      <svg className="size-4" fill="none" viewBox="0 0 16 16">
        <g opacity="0.45" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1">
          <path d="M2 4.25h12" />
          <path d="M2 8h12" />
          <path d="M2 11.75h12" />
        </g>
        <motion.path
          animate={{ pathLength: 1 }}
          d="M2.7 11.5 6.2 7.7l2.6 2L13.3 4.5"
          data-ledgerline-reveal
          initial={{ pathLength: 0 }}
          stroke="var(--ll-teal)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          transition={reduceMotion ? { duration: 0 } : { delay, duration: 0.9, ease: EASE_OUT }}
        />
      </svg>
    </span>
  )
}
