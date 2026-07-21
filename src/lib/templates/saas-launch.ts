import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  callToActionSignupDemoContent,
  comparatorTableDemoContent,
  contactRoutingFormDemoContent,
  contentCommunityDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentStatsDemoContent,
  faqCardDemoContent,
  faqGroupedDemoContent,
  faqSplitDemoContent,
  featureBentoDemoContent,
  featureCardsMediaDemoContent,
  featureSplitDemoContent,
  featureStepsDemoContent,
  heroBasicDemoContent,
  heroProductTiltDemoContent,
  integrationClusterDemoContent,
  integrationGridDemoContent,
  logoCloudMarqueeDemoContent,
  pricingCardsDemoContent,
  pricingCardsMutedDemoContent,
  statsProofDemoContent,
  teamGridDemoContent,
  testimonialsRatingDemoContent,
  testimonialsSpotlightDemoContent,
} from '@/lib/demo-content'

/* SaaS Launch — "Relay", a fictional B2B analytics platform.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the SaaS art-direction
 * track replaces them with bespoke, editor-shaped Relay copy. Do not ship this
 * file with default catalog content. */

export const saasLaunchTemplate: TemplateShowcase = {
  assets: [],
  category: 'saas',
  description:
    'Relay is a fictional B2B analytics platform: a precise, optimistic, product-led SaaS marketing site concept spanning Home, Product, Pricing, About, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Product', path: 'product' },
    { label: 'Pricing', path: 'pricing' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'Explains the product, shows proof and platform breadth, and drives the primary conversion.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-product-tilt', content: heroProductTiltDemoContent, id: 'hero' },
        { componentSlug: 'logo-cloud-marquee', content: logoCloudMarqueeDemoContent, id: 'logos' },
        { componentSlug: 'feature-bento', content: featureBentoDemoContent, id: 'features' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'stats' },
        {
          componentSlug: 'integration-cluster',
          content: integrationClusterDemoContent,
          id: 'integrations',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: testimonialsSpotlightDemoContent,
          id: 'testimonial',
        },
        { componentSlug: 'pricing-cards-muted', content: pricingCardsMutedDemoContent, id: 'pricing' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Relay — Product analytics for teams that ship',
    },
    {
      description: 'Explains core workflows and the infrastructure underneath them.',
      label: 'Product',
      path: 'product',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-split', content: featureSplitDemoContent, id: 'workflows' },
        {
          componentSlug: 'feature-cards-media',
          content: featureCardsMediaDemoContent,
          id: 'capabilities',
        },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'steps' },
        { componentSlug: 'integration-grid', content: integrationGridDemoContent, id: 'integrations' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote' },
        {
          componentSlug: 'call-to-action-centered',
          content: callToActionCenteredDemoContent,
          id: 'cta',
        },
      ],
      title: 'Relay — Product',
    },
    {
      description: 'Makes packaging legible and resolves purchase objections.',
      label: 'Pricing',
      path: 'pricing',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'plans' },
        { componentSlug: 'comparator-table', content: comparatorTableDemoContent, id: 'compare' },
        {
          componentSlug: 'testimonials-rating',
          content: testimonialsRatingDemoContent,
          id: 'testimonials',
        },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-signup', content: callToActionSignupDemoContent, id: 'cta' },
      ],
      title: 'Relay — Pricing',
    },
    {
      description: 'Establishes mission, scale, the team, and the community around the product.',
      label: 'About',
      path: 'about',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'mission' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'scale' },
        { componentSlug: 'team-grid', content: teamGridDemoContent, id: 'team' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Relay — About',
    },
    {
      description: 'Routes sales and product questions without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        {
          componentSlug: 'contact-routing-form',
          content: contactRoutingFormDemoContent,
          id: 'contact',
        },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
      ],
      title: 'Relay — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'saas-launch',
  status: 'concept',
  summary:
    'A precise, optimistic, product-led SaaS marketing site for a fictional B2B analytics platform.',
  theme: {
    description:
      'Cool white and soft blue-gray surfaces with one vivid cobalt accent, measured radii, and proof kept close to the product claims.',
    id: 'saas-launch',
    swatches: ['#f8fafc', '#1e293b', '#2563eb'],
  },
  title: 'SaaS Launch',
  visualTone: ['Precise', 'Optimistic', 'Product-led'],
}
