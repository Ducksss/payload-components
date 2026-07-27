'use client'

import Link from 'next/link'

import type { Transition } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import {
  HALLORAN_EMAIL,
  HALLORAN_EMERGENCY,
  HALLORAN_OUT_OF_HOURS,
  HALLORAN_OUT_OF_HOURS_TEL,
  HALLORAN_PHONE,
  HALLORAN_PHONE_TEL,
  HALLORAN_SATURDAY,
  HALLORAN_WEEKDAYS,
  HALLORAN_YARD,
  HalloranWordmark,
} from './lockup'

/* Halloran & Sons footer — the back of the van, then the small print.
 *
 * It opens with the one thing a trade site is for: a steel band with the phone
 * number set as large as it will go, the hours beside it, and a route into the
 * contact page. Below that, four plain columns — the firm, the work, the patch,
 * and how to reach it — and a closing rule that says outright that the firm is
 * fictional, the numbers are inside the range reserved for fiction, and the
 * credentials described are illustrative rather than any real accreditation.
 *
 * Only the call band moves, and it moves by transform alone: it carries a
 * bordered action, and an opacity fade over the steel would drop that action's
 * label below AA on the way in. The reduced-motion net in theme.css pins the
 * finished frame before hydration, which is what captures and posters record. */

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

const work = [
  'Boiler repairs',
  'New boilers & cylinders',
  'Radiators & heating',
  'Leaks & burst pipes',
  'Blocked drains',
  'Bathrooms & taps',
  'Power flushing',
  'Landlord checks',
] as const

const patch = [
  'Ashcombe · Bellhouse · Quarry Bank',
  'Kirkby Wend · Highbridge · Nettlebed Cross',
  'Marlow Bank · Cold Harbour · Dyer’s End',
  'Sattersfield · Pellham Cross · Wenlock',
  'Thornleigh · Ostley Green · Barrow Hill',
] as const

export function HalloranFooter({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const reduceMotion = useReducedMotion() ?? false
  const contactHref = templatePreviewHref(template.slug, 'contact')

  return (
    <footer className="hs-footer">
      <div className="hs-callband">
        <motion.div
          className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-12"
          data-hs-reveal
          initial={{ y: 18 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
          viewport={{ margin: '0px 0px -8% 0px', once: true }}
          whileInView={{ y: 0 }}
        >
          <div className="flex flex-col gap-3">
            <span className="hs-callband-eyebrow">Something cold? Something leaking?</span>
            <a
              aria-label={`Call Halloran & Sons on ${HALLORAN_PHONE}`}
              className="hs-callband-number"
              href={HALLORAN_PHONE_TEL}
            >
              {HALLORAN_PHONE}
            </a>
            <span className="hs-callband-hours">
              {HALLORAN_WEEKDAYS} · {HALLORAN_SATURDAY} · {HALLORAN_EMERGENCY}
            </span>
          </div>

          <Link className="hs-callband-cta" href={contactHref}>
            Or send us the details
          </Link>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div className="flex max-w-sm flex-col gap-4">
            <HalloranWordmark size="footer" />
            <p className="hs-footer-line">
              A family firm since 1991. Dad bought the first van; his sons run it now, and he
              still does the Friday services. Four engineers, three vans, one number.
            </p>
            <span className="hs-footer-address">{HALLORAN_YARD}</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="hs-footer-heading">What we do</span>
            <ul className="flex flex-col gap-1.5">
              {work.map((item) => (
                <li className="hs-footer-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="hs-footer-heading">Where we go</span>
            <ul className="flex flex-col gap-1.5">
              {patch.map((item) => (
                <li className="hs-footer-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <span className="hs-footer-item">…and anywhere inside about twelve miles.</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="hs-footer-heading">Get hold of us</span>
            <a className="hs-footer-contact" href={HALLORAN_PHONE_TEL}>
              {HALLORAN_PHONE}
              <span className="hs-footer-contact-note">The office, in the day</span>
            </a>
            <a className="hs-footer-contact" href={HALLORAN_OUT_OF_HOURS_TEL}>
              {HALLORAN_OUT_OF_HOURS}
              <span className="hs-footer-contact-note">Out of hours, one of us</span>
            </a>
            <span className="hs-footer-contact">
              {HALLORAN_EMAIL}
              <span className="hs-footer-contact-note">Paperwork and quotes</span>
            </span>
          </div>
        </div>

        <nav
          aria-label="Halloran & Sons footer navigation"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6"
        >
          {template.navigation.map((item) => (
            <Link
              aria-current={activePath === item.path ? 'page' : undefined}
              className={cn(
                'hs-footer-link',
                activePath === item.path && 'hs-footer-link-active',
              )}
              href={templatePreviewHref(template.slug, item.path)}
              key={item.path}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hs-footer-rule mt-6 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <span>
            © 2026 Halloran &amp; Sons — a fictional firm built as a concept preview. Both
            numbers sit inside the range reserved for fiction and reach nobody, and the
            qualifications described on this site are illustrative, not a real accreditation.
          </span>
          <span className="shrink-0 sm:text-right">
            Composed from open-source Payload blocks
          </span>
        </div>
      </div>
    </footer>
  )
}
