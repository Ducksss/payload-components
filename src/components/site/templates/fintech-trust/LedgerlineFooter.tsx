'use client'

import Link from 'next/link'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { templatePreviewHref } from '@/lib/templates/registry'

import { LedgerlineMark } from './LedgerlineMark'

/* Ledgerline colophon — the institutional trust chrome.
 *
 * Four index columns over a hairline figure strip: the numbers a counterparty
 * checks before a call, set in tabular mono so they align down the row. The
 * compliance column names industry programmes only and closes by saying plainly
 * that the posture is illustrative — Ledgerline is a fictional concept.
 *
 * Columns reveal once in view (transform + opacity; nothing here is a filled
 * action, so the fade is contrast-safe) and are pinned to their final frame
 * before hydration by the reduced-motion net in theme.css. */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const reveal = (reduceMotion: boolean, delay: number) => ({
  initial: { opacity: 0, y: 16 },
  transition: reduceMotion ? { duration: 0 } : { delay, duration: 0.55, ease: EASE_OUT },
  viewport: { margin: '0px 0px -10% 0px', once: true },
  whileInView: { opacity: 1, y: 0 },
})

const ledgerStrip = [
  { label: 'Settlement rails', value: '9' },
  { label: 'Settlement currencies', value: '34' },
  { label: 'Trailing 24-month uptime', value: '99.995%' },
  { label: 'Entries reconciled without a human', value: '99.7%' },
] as const

const compliance = [
  'SOC 2 Type II',
  'PCI DSS Level 1',
  'ISO 27001-aligned controls',
  'Annual third-party audit',
] as const

const columnHeading = 'font-mono text-xs uppercase tracking-eyebrow text-muted-foreground'
const columnLink =
  'w-fit font-mono text-xs uppercase tracking-eyebrow text-muted-foreground transition-colors hover:text-foreground'

export function LedgerlineFooter({
  activePath,
  template,
}: {
  activePath: string
  template: TemplateShowcase
}) {
  const reduceMotion = useReducedMotion() ?? false
  const navItem = (path: string) => template.navigation.find((item) => item.path === path)

  const indexColumn = (heading: string, paths: string[], delay: number) => (
    <motion.nav
      aria-label={`Ledgerline ${heading.toLowerCase()} pages`}
      className="flex flex-col gap-3"
      data-ledgerline-reveal
      {...reveal(reduceMotion, delay)}
    >
      <span className={columnHeading}>{heading}</span>
      {paths.map((path) => {
        const item = navItem(path)
        if (!item) return null

        return (
          <Link
            aria-current={activePath === item.path ? 'page' : undefined}
            className={columnLink}
            href={templatePreviewHref(template.slug, item.path)}
            key={item.path}
          >
            {item.label}
          </Link>
        )
      })}
    </motion.nav>
  )

  return (
    <footer className="ledgerline-footer">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr]">
          <motion.div
            className="flex max-w-sm flex-col gap-4"
            data-ledgerline-reveal
            {...reveal(reduceMotion, 0)}
          >
            <div className="flex items-center gap-2.5 text-foreground">
              <LedgerlineMark delay={0} />
              <span className="text-base font-semibold tracking-heading">Ledgerline</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              One immutable record for money in motion — authorization, settlement, fees, and
              reversals, provable line by line across every rail you run.
            </p>
            <span className="font-mono text-xs uppercase tracking-eyebrow text-brand">
              programs@ledgerline.example
            </span>
          </motion.div>

          {indexColumn('Platform', ['product', 'security'], 0.06)}
          {indexColumn('Commercial', ['pricing', 'contact'], 0.12)}

          <motion.div
            className="flex flex-col gap-3"
            data-ledgerline-reveal
            {...reveal(reduceMotion, 0.18)}
          >
            <span className={columnHeading}>Compliance</span>
            <ul className="flex flex-col gap-2">
              {compliance.map((item) => (
                <li className="flex items-start gap-2 text-sm text-muted-foreground" key={item}>
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs leading-5 text-muted-foreground">
              Ledgerline is a fictional company built as a concept preview; the posture above is
              illustrative and not certified.
            </p>
          </motion.div>
        </div>

        <motion.dl
          className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4"
          data-ledgerline-reveal
          {...reveal(reduceMotion, 0.22)}
        >
          {ledgerStrip.map((entry) => (
            <div
              className="flex flex-col-reverse gap-1 lg:border-l lg:border-border lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
              key={entry.label}
            >
              <dt className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
                {entry.label}
              </dt>
              <dd className="text-2xl font-medium tracking-title text-foreground">{entry.value}</dd>
            </div>
          ))}
        </motion.dl>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-border pt-6 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground sm:flex-row">
          <span>© 2026 Ledgerline Systems — a fictional company for this concept preview</span>
          <span>Composed from open-source Payload blocks</span>
        </div>
      </div>
    </footer>
  )
}
