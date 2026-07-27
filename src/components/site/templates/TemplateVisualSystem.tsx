'use client'

import { motion, useReducedMotion } from 'motion/react'

import type { TemplateShowcase } from '@/lib/templates/types'

import './template-surface-motion.css'

/* Visual-system summary: the fictional brand's palette swatches (data-driven
 * hex values rendered via inline style — they are template content, not site
 * design tokens), the theme description, and the declared visual tone.
 *
 * The swatches deal themselves in left to right, which is the one place on the
 * detail page where a stagger says something: the palette is an ordered set.
 * Only the circles animate — never the hex captions — so axe can never catch a
 * text node mid-fade. Type-only imports keep this island free of registry data. */

const SWATCH_SPRING = { damping: 20, mass: 0.6, stiffness: 320, type: 'spring' } as const

export function TemplateVisualSystem({ template }: { template: TemplateShowcase }) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <div className="grid gap-6 rounded-card border border-border bg-card p-6 shadow-card sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 sm:p-7">
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
          Palette
        </h3>
        <ul className="flex items-center gap-3" aria-label={`${template.title} palette swatches`}>
          {template.theme.swatches.map((swatch, index) => (
            <li key={swatch} className="flex flex-col items-center gap-1.5">
              <motion.span
                className="block size-10 rounded-full border border-border shadow-card"
                data-template-motion
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: '0px 0px -10% 0px', once: true }}
                transition={
                  reduceMotion ? { duration: 0 } : { ...SWATCH_SPRING, delay: index * 0.05 }
                }
                style={{ backgroundColor: swatch }}
              />
              <span className="font-mono text-[11px] text-muted-foreground">{swatch}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
          Direction
        </h3>
        <p className="max-w-prose text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {template.theme.description}
        </p>
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Visual tone">
          {template.visualTone.map((tone) => (
            <li
              key={tone}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
