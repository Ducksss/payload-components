import type { ComponentType } from 'react'

import type { TemplatePage, TemplateSection } from '@/lib/templates/types'

import { demosBySlug } from '@/components/site/demos/registry'

import { TemplateSectionReveal } from './TemplateSectionReveal'

/* Renders one template page's ordered section recipe through the existing site
 * demo twins — the same components the catalog and docs previews use, so the
 * showcase can never drift from what actually installs. Twins stay aria-hidden
 * and non-interactive; the surrounding template shell owns all real semantics.
 *
 * Never import Payload target code, manifests, or consumer-only modules here.
 * Content is typed at the definition site (TemplateSection is a discriminated
 * union over demo-content types); the cast below only erases that narrowing to
 * cross the untyped demosBySlug boundary. */

type TwinComponent = ComponentType<{ className?: string; content?: unknown }>

export function TemplateSectionRenderer({
  index = 0,
  section,
}: {
  index?: number
  section: TemplateSection
}) {
  const Twin = demosBySlug[section.componentSlug] as TwinComponent | undefined
  if (!Twin) return null

  /* TemplateSectionReveal renders the [data-template-section] wrapper itself
     (scroll choreography for below-hero sections, plain final-state div for
     the hero, reduced motion, and captures) — theme selectors keyed on
     [data-template-section] > [aria-hidden] are unaffected. */
  return (
    <TemplateSectionReveal id={section.id} index={index} tone={section.tone ?? 'base'}>
      <Twin content={section.content} />
    </TemplateSectionReveal>
  )
}

export function TemplatePageRenderer({ page }: { page: TemplatePage }) {
  return (
    <>
      {page.sections.map((section, index) => (
        <TemplateSectionRenderer key={section.id} index={index} section={section} />
      ))}
    </>
  )
}
