'use client'

import { motion, useReducedMotion } from 'motion/react'

/* The Northfield mark — a specimen block: a ruled page with a highlighter
 * stroke laid across the middle rule and running past the page edge, the way a
 * marker does. Token-derived, no raster asset, and the only drawn element in the
 * chrome.
 *
 * The stroke scales in from its left edge on mount: transform only, so nothing
 * alpha-composites over the header's filled action mid-animation. Reduced motion
 * zeroes the transition here and theme.css pins the final frame before
 * hydration. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function NorthfieldMark() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0 overflow-visible"
      fill="none"
      viewBox="0 0 20 20"
    >
      <motion.rect
        animate={{ scaleX: 1 }}
        className="nf-mark-stroke"
        data-nf-reveal
        height="2.6"
        initial={{ scaleX: 0 }}
        style={{ originX: 0, originY: 0.5 }}
        transition={
          reduceMotion ? { duration: 0 } : { delay: 0.18, duration: 0.55, ease: EASE_OUT }
        }
        width="17"
        x="2.5"
        y="8.7"
      />
      <rect height="18" stroke="currentColor" strokeWidth="1.2" width="13" x="1" y="1" />
      <g opacity="0.5" stroke="currentColor" strokeWidth="1">
        <path d="M3.6 5.4h7.8" />
        <path d="M3.6 10h6.2" />
        <path d="M3.6 14.6h4.4" />
      </g>
    </svg>
  )
}
