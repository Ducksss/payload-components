import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  contactRoutingFormDemoContent,
  contentCommunityDemoContent,
  contentImageFrameDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentShowcaseDemoContent,
  contentStatsDemoContent,
  faqCardDemoContent,
  faqSplitDemoContent,
  featureCardsMediaDemoContent,
  heroBasicDemoContent,
  heroKineticDemoContent,
  logoCloudMarqueeDemoContent,
  pricingCardsDemoContent,
  statsProofDemoContent,
  teamGridDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Commerce — "Fieldnote", a fictional specialty-coffee brand.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Commerce
 * art-direction track replaces them with bespoke, editor-shaped Fieldnote copy.
 * Do not ship this file with default catalog content. */

export const commerceBrandTemplate: TemplateShowcase = {
  assets: [],
  category: 'commerce',
  description:
    'Fieldnote is a fictional specialty-coffee brand: a warm, tactile, product-forward DTC marketing site concept spanning Home, Collection, Our Story, Journal, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Collection', path: 'collection' },
    { label: 'Our Story', path: 'story' },
    { label: 'Journal', path: 'journal' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description: 'Introduces the brand, shows the range and proof, and leads to the shop.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-kinetic', content: heroKineticDemoContent, id: 'hero' },
        { componentSlug: 'logo-cloud-marquee', content: logoCloudMarqueeDemoContent, id: 'stockists' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'range' },
        { componentSlug: 'feature-cards-media', content: featureCardsMediaDemoContent, id: 'craft' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'reviews' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'subscription' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Fieldnote — Coffee, roasted to order',
    },
    {
      description: 'Presents the product range and the story behind each roast.',
      label: 'Collection',
      path: 'collection',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'products' },
        { componentSlug: 'feature-cards-media', content: featureCardsMediaDemoContent, id: 'highlights' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'origin' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Fieldnote — Collection',
    },
    {
      description: 'Tells the brand mission, sourcing, and the people behind it.',
      label: 'Our Story',
      path: 'story',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'mission' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote', tone: 'muted' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'sourcing' },
        { componentSlug: 'team-grid', content: teamGridDemoContent, id: 'roasters' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Fieldnote — Our Story',
    },
    {
      description: 'A brewing-and-culture journal that keeps the brand in the conversation.',
      label: 'Journal',
      path: 'journal',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'articles' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'guides' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'feature' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Fieldnote — Journal',
    },
    {
      description: 'Routes wholesale and customer questions without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'contact' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
      ],
      title: 'Fieldnote — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'commerce-brand',
  status: 'concept',
  summary: 'A warm, product-forward DTC marketing site for a fictional specialty-coffee brand.',
  theme: {
    description:
      'Warm cream and espresso surfaces with a single burnt-orange accent, tactile product imagery, and a relaxed editorial rhythm.',
    id: 'commerce-brand',
    swatches: ['#f7f0e6', '#2b1d14', '#c2571f'],
  },
  title: 'Commerce Brand',
  visualTone: ['Warm', 'Tactile', 'Product-forward'],
}
