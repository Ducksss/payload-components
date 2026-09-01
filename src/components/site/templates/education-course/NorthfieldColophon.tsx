'use client'

import Link from '@/i18n/Link'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'

/* Northfield's colophon — a printer's endmatter rather than a sitemap.
 *
 * Three ruled columns (the page index, the school, the three term dates), then
 * the school's working motto set large in the one italic serif the site loads,
 * then the imprint line: what the page is set in, that the school is fictional,
 * and that the pages are composed from open-registry blocks.
 *
 * Two transform-only reveals: the motto rises, and the rule above the imprint
 * draws from its left edge. Nothing fades — the imprint sits close to the ink
 * band and an opacity entrance would drop small text below AA on its way in.
 * Reduced motion zeroes both transitions, and theme.css pins the final frame
 * before hydration so captures and posters record a complete page. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const schoolLines = [
  'The old Marley Street print works, second floor',
  'Studio open Tuesday to Saturday',
  'office@northfield.example',
] as const

const termLines = [
  'Michaelmas · begins 5 October',
  'Hilary · begins 11 January',
  'Trinity · begins 19 April',
] as const

export function NorthfieldColophon({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <footer className="nf-colophon">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-label="Northfield School footer navigation" className="flex flex-col gap-3">
            <span className="nf-colophon-label">Pages</span>
            {template.navigation.map((item, index) => (
              <Link
                aria-current={activePath === item.path ? 'page' : undefined}
                className="nf-colophon-link flex w-fit items-baseline gap-3 text-sm"
                href={templatePreviewHref(template.slug, item.path)}
                key={item.path}
              >
                <span aria-hidden="true" className="nf-nav-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="nf-colophon-label">The school</span>
            {schoolLines.map((line) => (
              <span className="text-sm leading-6 text-muted-foreground" key={line}>
                {line}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="nf-colophon-label">Term dates</span>
            {termLines.map((line) => (
              <span className="text-sm leading-6 text-muted-foreground" key={line}>
                {line}
              </span>
            ))}
          </div>
        </div>

        <motion.p
          className="nf-motto"
          data-nf-reveal
          initial={{ y: 14 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
          viewport={{ margin: '0px 0px -8% 0px', once: true }}
          whileInView={{ y: 0 }}
        >
          Draw it, space it, set it, then <span className="nf-motto-mark">defend it</span>.
        </motion.p>

        <div className="relative pt-6">
          <motion.span
            animate={{ scaleX: 1 }}
            aria-hidden="true"
            className="nf-colophon-rule absolute inset-x-0 top-0 origin-left"
            data-nf-reveal
            initial={{ scaleX: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }}
          />
          <div className="flex flex-col gap-2 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
            <span>
              Northfield School is a fictional school, invented for this concept. It awards nothing
              but its own certificate of completion.
            </span>
            <span className="nf-imprint">
              Set in Geist, with Instrument Serif italic · composed from open-source Payload blocks
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
