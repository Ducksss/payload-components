import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  callToActionSignupDemoContent,
  comparatorTableDemoContent,
  contactRoutingFormDemoContent,
  contentColumnsDemoContent,
  contentQuoteDemoContent,
  contentStatsDemoContent,
  faqCardDemoContent,
  faqGroupedDemoContent,
  faqSplitDemoContent,
  featureBentoDemoContent,
  featureCardsMediaDemoContent,
  featureIconGridDemoContent,
  featureSplitDemoContent,
  featureStepsDemoContent,
  heroAuroraDemoContent,
  heroBasicDemoContent,
  integrationClusterDemoContent,
  integrationGridDemoContent,
  logoCloudMarqueeDemoContent,
  pricingCardsDemoContent,
  pricingCardsMutedDemoContent,
  statsProofDemoContent,
  testimonialsRatingDemoContent,
  testimonialsSpotlightDemoContent,
} from '@/lib/demo-content'

/* Fintech — "Ledgerline", a fictional money-movement infrastructure platform.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Fintech
 * art-direction track replaces them with bespoke, editor-shaped Ledgerline
 * copy. Do not ship this file with default catalog content. */

export const fintechTrustTemplate: TemplateShowcase = {
  assets: [],
  category: 'fintech',
  description:
    'Ledgerline is a fictional money-movement infrastructure platform: a serious, trust-first fintech marketing site concept spanning Home, Product, Security, Pricing, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Product', path: 'product' },
    { label: 'Security', path: 'security' },
    { label: 'Pricing', path: 'pricing' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description: 'Explains the platform, proves reliability, and resolves trust up front.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-aurora', content: heroAuroraDemoContent, id: 'hero' },
        { componentSlug: 'logo-cloud-marquee', content: logoCloudMarqueeDemoContent, id: 'customers' },
        { componentSlug: 'feature-bento', content: featureBentoDemoContent, id: 'platform' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'integration-grid', content: integrationGridDemoContent, id: 'integrations' },
        { componentSlug: 'testimonials-spotlight', content: testimonialsSpotlightDemoContent, id: 'testimonial' },
        { componentSlug: 'pricing-cards-muted', content: pricingCardsMutedDemoContent, id: 'pricing' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Ledgerline — Money movement, engineered for trust',
    },
    {
      description: 'Explains the core money-movement primitives and workflows.',
      label: 'Product',
      path: 'product',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-split', content: featureSplitDemoContent, id: 'primitives' },
        { componentSlug: 'feature-cards-media', content: featureCardsMediaDemoContent, id: 'capabilities' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'flow' },
        { componentSlug: 'integration-cluster', content: integrationClusterDemoContent, id: 'ecosystem' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote', tone: 'muted' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Ledgerline — Product',
    },
    {
      description: 'Details the compliance posture, controls, and infrastructure guarantees.',
      label: 'Security',
      path: 'security',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'controls' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'guarantees', tone: 'contrast' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'compliance' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Ledgerline — Security',
    },
    {
      description: 'Makes packaging legible and resolves procurement objections.',
      label: 'Pricing',
      path: 'pricing',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'plans' },
        { componentSlug: 'comparator-table', content: comparatorTableDemoContent, id: 'compare' },
        { componentSlug: 'testimonials-rating', content: testimonialsRatingDemoContent, id: 'testimonials' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-signup', content: callToActionSignupDemoContent, id: 'cta' },
      ],
      title: 'Ledgerline — Pricing',
    },
    {
      description: 'Routes sales and compliance questions without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'contact' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
      ],
      title: 'Ledgerline — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'fintech-trust',
  status: 'concept',
  summary: 'A serious, trust-first marketing site for a fictional money-movement platform.',
  theme: {
    description:
      'Deep ink and cool-slate surfaces with a restrained teal accent — a dense, numbers- and security-forward fintech identity.',
    id: 'fintech-trust',
    swatches: ['#0e1420', '#8a97a8', '#14b8a6'],
  },
  title: 'Fintech Trust',
  visualTone: ['Serious', 'Secure', 'Numbers-forward'],
}
