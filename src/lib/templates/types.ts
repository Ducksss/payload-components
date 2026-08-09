import type {
  ComparatorTableDemoContent,
  ContactRoutingFormDemoContent,
  ContentSectionDemoContent,
  CtaDemoContent,
  FaqDemoContent,
  FaqGroupedDemoContent,
  FeatureCardsMediaDemoContent,
  FeatureIconGridDemoContent,
  FeatureSectionDemoContent,
  HeroAuroraDemoContent,
  HeroBasicDemoContent,
  HeroKineticDemoContent,
  HeroProductTiltDemoContent,
  HeroVideoDemoContent,
  IntegrationDemoContent,
  LogoCloudDemoContent,
  PricingDemoContent,
  StatsProofDemoContent,
  TeamSectionDemoContent,
  TestimonialDemoContent,
} from '@/lib/demo-content'

/* Full-site template showcase contract — website-only "Concept preview" phase.
 *
 * A TemplateShowcase is pure serializable data: no React, no Payload, no
 * registry/manifest imports. Every section references an existing component
 * slug whose site demo twin (src/components/site/demos/registry.ts) renders it,
 * and every `content` value is checked against that twin's demo-content type
 * via TemplateSectionContentMap below. This keeps the concept model close to
 * editor-shaped Payload fields so a future installer RFC can reuse it, without
 * being an install manifest. */

export type TemplateStatus = 'concept'
export type TemplateCategory =
  | 'agency'
  | 'commerce'
  | 'education'
  | 'event'
  | 'fintech'
  | 'healthcare'
  | 'nonprofit'
  | 'portfolio'
  | 'saas'
  | 'trade'
export type TemplateSectionTone = 'base' | 'contrast' | 'muted'
export type TemplateViewportPreset = 'desktop' | 'mobile' | 'tablet'

/* The exact block slugs the launch concepts may compose. Extend this map (and
 * nothing else) to admit a new slug — the value type must be the demo twin's
 * exported content type so section content stays type-checked. */
export type TemplateSectionContentMap = {
  'call-to-action-boxed': CtaDemoContent
  'call-to-action-centered': CtaDemoContent
  'call-to-action-signup': CtaDemoContent
  'comparator-table': ComparatorTableDemoContent
  'contact-routing-form': ContactRoutingFormDemoContent
  'content-columns': ContentSectionDemoContent
  'content-community': ContentSectionDemoContent
  'content-feature-split': ContentSectionDemoContent
  'content-image-frame': ContentSectionDemoContent
  'content-image-lead': ContentSectionDemoContent
  'content-quote': ContentSectionDemoContent
  'content-rows': ContentSectionDemoContent
  'content-showcase': ContentSectionDemoContent
  'content-stats': ContentSectionDemoContent
  'faq-accordion': FaqDemoContent
  'faq-card': FaqDemoContent
  'faq-grouped': FaqGroupedDemoContent
  'faq-split': FaqDemoContent
  'feature-bento': FeatureSectionDemoContent
  'feature-cards-media': FeatureCardsMediaDemoContent
  'feature-icon-grid': FeatureIconGridDemoContent
  'feature-split': FeatureSectionDemoContent
  'feature-steps': FeatureSectionDemoContent
  'hero-aurora': HeroAuroraDemoContent
  'hero-basic': HeroBasicDemoContent
  'hero-kinetic': HeroKineticDemoContent
  'hero-product-tilt': HeroProductTiltDemoContent
  'hero-video': HeroVideoDemoContent
  'integration-cluster': IntegrationDemoContent
  'integration-grid': IntegrationDemoContent
  'logo-cloud-inline-wrap': LogoCloudDemoContent
  'logo-cloud-marquee': LogoCloudDemoContent
  'pricing-cards': PricingDemoContent
  'pricing-cards-muted': PricingDemoContent
  'stats-proof': StatsProofDemoContent
  'team-grid': TeamSectionDemoContent
  'team-roster': TeamSectionDemoContent
  'testimonials-quote': TestimonialDemoContent
  'testimonials-rating': TestimonialDemoContent
  'testimonials-spotlight': TestimonialDemoContent
  'testimonials-wall': TestimonialDemoContent
}

export type TemplateComponentSlug = keyof TemplateSectionContentMap

/* Discriminated union: `componentSlug` narrows `content` to the matching demo
 * twin content type at the definition site while the value itself stays plain
 * JSON-shaped data. */
export type TemplateSection<K extends TemplateComponentSlug = TemplateComponentSlug> = {
  [S in K]: {
    componentSlug: S
    content: TemplateSectionContentMap[S]
    id: string
    tone?: TemplateSectionTone
  }
}[K]

export type TemplateAsset = {
  alt: string
  height: number
  license: string
  /* Site-absolute path beneath /templates/<slug>/, e.g.
   * '/templates/saas-launch/hero-dashboard.webp'. */
  path: string
  provenance: string
  width: number
}

export type TemplatePage = {
  /* One-sentence purpose shown on the detail page's pages-included grid and as
   * the preview page's screen-reader composition summary. */
  description: string
  /* Short switcher label, e.g. 'Home', 'Pricing'. */
  label: string
  /* '' for the home page; otherwise a single URL-safe segment ('pricing'). */
  path: string
  sections: readonly TemplateSection[]
  /* Document title inside the fictional site, e.g. 'Relay — Pricing'. */
  title: string
}

export type TemplateShowcase = {
  assets: readonly TemplateAsset[]
  category: TemplateCategory
  /* Longer positioning paragraph for the detail page. */
  description: string
  navigation: readonly { label: string; path: string }[]
  pages: readonly TemplatePage[]
  /* Bump on intentional visual changes; posters/baselines regenerate against it. */
  revision: number
  schemaVersion: 1
  slug: string
  status: TemplateStatus
  /* One-sentence positioning for the gallery card. */
  summary: string
  theme: {
    description: string
    id: string
    swatches: readonly string[]
  }
  title: string
  visualTone: readonly string[]
}

export const TEMPLATE_CONCEPT_STATUS_LABEL = 'Concept preview'

export const TEMPLATE_CONCEPT_DISCLOSURE =
  'This is a browsable full-site concept. Every section is composed from blocks in the open registry, and one command installs the whole block set — the curated copy shown here is not seeded, so you assemble the pages yourself in the admin.'
