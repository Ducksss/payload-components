'use client'
import Link from 'next/link'

import type { Transition } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'

import { FrameworksLockup, FrameworksWordmark } from './lockup'

/* Frameworks ’26 footer — the back of the poster. An oversized wordmark, the
 * date/venue lockup at full size, then three indexes of plain practical
 * information.
 *
 * Every reveal is TRANSFORM ONLY (no opacity), for two reasons: an
 * opacity-faded block containing the violet ticket link would transiently sit
 * below AA while it animates, and a below-the-fold whileInView fade leaves
 * elements parked at opacity 0 during an axe sweep. A slide is honest here
 * anyway — the footer reads as a sheet pushed up under the page. Reduced
 * motion pins the final frame via the [data-fw-reveal] net in theme.css. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

const practicalLines = [
  'Live captions in all three rooms',
  'Step-free from the street to every seat',
  'Quiet room on level two, both days',
  'Recordings up within 72 hours',
] as const

const slide = (reduceMotion: boolean, delay: number) => ({
  initial: { y: 22 },
  transition: reduceMotion ? { duration: 0 } : { delay, duration: 0.65, ease: EASE_OUT },
  viewport: { margin: '0px 0px -8% 0px', once: true },
  whileInView: { y: 0 },
})

export function FrameworksFooter({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <footer className="fw-footer">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 sm:px-6 lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-8 overflow-hidden">
          <motion.div data-fw-reveal {...slide(reduceMotion, 0)}>
            <FrameworksWordmark className="fw-wordmark-hero" />
          </motion.div>

          <motion.div data-fw-reveal {...slide(reduceMotion, 0.08)}>
            <FrameworksLockup />
          </motion.div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-label="Frameworks ’26 footer index" className="flex flex-col gap-3">
            <span className="fw-footer-heading">Index</span>
            {template.navigation.map((item) => (
              <Link
                aria-current={activePath === item.path ? 'page' : undefined}
                className="fw-footer-link"
                href={templatePreviewHref(template.slug, item.path)}
                key={item.path}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="fw-footer-heading">Practical</span>
            {practicalLines.map((line) => (
              <span className="fw-footer-line" key={line}>
                {line}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="fw-footer-heading">Say hello</span>
            <span className="fw-footer-line">hello@frameworks.conf</span>
            <span className="fw-footer-line">
              The programme committee reads every proposal blind, every year.
            </span>
            <span className="fw-footer-line">
              Code of conduct enforced by the crew, not by a form.
            </span>
          </div>
        </div>

        <div className="fw-footer-rule flex flex-col justify-between gap-2 sm:flex-row">
          <span>© 2026 Frameworks — a fictional conference concept</span>
          <span>Composed from open-source Payload blocks</span>
        </div>
      </div>
    </footer>
  )
}
