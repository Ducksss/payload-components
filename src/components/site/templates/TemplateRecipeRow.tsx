'use client'

import { useState } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import type { TemplateAnalyticsProperties } from '@/lib/analytics'

import { TemplateTrackedLink } from '@/components/site/templates/TemplateTrackedLink'

/* One row of the ordered block recipe.
 *
 * The affordance the row has to sell is "this chip is a real registry block —
 * open its contract and install it". So the ordinal swaps for an outbound
 * arrow on hover/focus: the number establishes render order at rest, and the
 * arrow confirms the row goes somewhere the moment you reach for it. Both
 * glyphs share one 20px slot, so nothing reflows and the row never nudges the
 * text beside it.
 *
 * Its own client island (plain string props) so TemplateRecipe stays a server
 * component — that file reads componentEntries from @/lib/site, which must not
 * follow a hover animation into the browser bundle.
 *
 * No [data-template-motion] here on purpose: the RESTING variant already is the
 * finished frame, so the pre-hydration/no-JS/reduce render is correct without a
 * CSS net — and pinning opacity:1 would stack the arrow on top of the ordinal.
 * pointerType is checked instead of a hover media query because a tap fires
 * pointerenter and would strand the row mid-swap. */

const ORDINAL = { active: { opacity: 0, y: -7 }, rest: { opacity: 1, y: 0 } }
const ARROW = { active: { opacity: 1, y: 0 }, rest: { opacity: 0, y: 7 } }
const SWAP_SPRING = { damping: 22, mass: 0.5, stiffness: 420, type: 'spring' } as const

export function TemplateRecipeRow({
  href,
  ordinal,
  properties,
  slug,
  title,
}: {
  href: string
  ordinal: string
  properties: TemplateAnalyticsProperties
  slug: string
  title: string
}) {
  const reduceMotion = useReducedMotion() ?? false
  const [active, setActive] = useState(false)
  const transition = reduceMotion ? { duration: 0 } : SWAP_SPRING

  return (
    <motion.li
      animate={active ? 'active' : 'rest'}
      initial="rest"
      onBlur={() => setActive(false)}
      onFocus={() => setActive(true)}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setActive(true)
      }}
      onPointerLeave={() => setActive(false)}
    >
      <TemplateTrackedLink
        event="template_recipe_click"
        href={href}
        properties={properties}
        className="group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span
          aria-hidden="true"
          className="relative block h-4 w-5 shrink-0 font-mono text-xs text-brand"
        >
          <motion.span
            className="absolute inset-0 flex items-center"
            transition={transition}
            variants={ORDINAL}
          >
            {ordinal}
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center"
            transition={transition}
            variants={ARROW}
          >
            <ArrowUpRight className="size-3.5" />
          </motion.span>
        </span>
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="ml-auto truncate font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          {slug}
        </span>
      </TemplateTrackedLink>
    </motion.li>
  )
}
