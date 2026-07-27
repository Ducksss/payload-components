'use client'

import type { Transition } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/utilities/ui'

/* Halloran & Sons lockup and the firm's standing facts.
 *
 * One place for every detail the header, the footer, and the call band repeat,
 * so the fictional firm can never contradict itself between two pieces of
 * chrome. Everything here is invented. Both phone numbers sit inside the
 * 01632 96xxxx range reserved for fiction and reach nobody; the email uses the
 * reserved `.example` domain. No accreditation body, trade association, licence
 * number, or insurer is named anywhere — the credentials this concept describes
 * are deliberately generic and illustrative.
 *
 * The mark is a signwriter's device, not a logo: a solid safety-orange square
 * with the firm's initial cut out of it, the way it would be sprayed on a van
 * door. It is aria-hidden, so the wordmark text alone names the link. */

export const HALLORAN_NAME = 'Halloran & Sons'
export const HALLORAN_TRADE = 'Heating & Plumbing'
export const HALLORAN_TOWN = 'Ashcombe'
export const HALLORAN_EST = 'Est. 1991'
export const HALLORAN_PHONE = '01632 960 118'
export const HALLORAN_PHONE_TEL = 'tel:+441632960118'
export const HALLORAN_OUT_OF_HOURS = '01632 960 204'
export const HALLORAN_OUT_OF_HOURS_TEL = 'tel:+441632960204'
export const HALLORAN_EMAIL = 'hello@halloran.example'
export const HALLORAN_YARD = 'Unit 4, Tannery Row, Ashcombe'
export const HALLORAN_WEEKDAYS = 'Mon–Fri 7:30–6'
export const HALLORAN_SATURDAY = 'Sat 8–1'
export const HALLORAN_EMERGENCY = 'Emergencies any hour, any day'
export const HALLORAN_COVERAGE = 'Ashcombe & 12 miles around'
export const HALLORAN_NO_FEE = 'No callout fee'

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

export function HalloranWordmark({
  className,
  size = 'header',
}: {
  className?: string
  size?: 'footer' | 'header'
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <span className={cn('hs-wordmark', size === 'footer' && 'hs-wordmark-footer', className)}>
      <motion.span
        animate={{ scale: 1 }}
        aria-hidden="true"
        className="hs-mark"
        data-hs-reveal
        initial={{ scale: 0.72 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
      >
        H
      </motion.span>
      <span className="hs-wordmark-text">
        <span className="hs-wordmark-name">{HALLORAN_NAME}</span>
        <span className="hs-wordmark-trade">
          {HALLORAN_TRADE} · {HALLORAN_TOWN}
        </span>
      </span>
    </span>
  )
}
