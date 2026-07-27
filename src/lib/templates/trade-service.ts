import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  contactRoutingFormDemoContent,
  contentColumnsDemoContent,
  contentImageFrameDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentStatsDemoContent,
  faqAccordionDemoContent,
  faqCardDemoContent,
  faqGroupedDemoContent,
  faqSplitDemoContent,
  featureCardsMediaDemoContent,
  featureIconGridDemoContent,
  featureStepsDemoContent,
  heroBasicDemoContent,
  heroKineticDemoContent,
  logoCloudMarqueeDemoContent,
  statsProofDemoContent,
  testimonialsRatingDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Trade — "Halloran & Sons", a fictional heating and plumbing firm.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Trade
 * art-direction track replaces them with bespoke, editor-shaped Halloran copy.
 * Do not ship this file with default catalog content.
 *
 * Register notes for the art-direction track:
 * - This is the plainest, least-styled concept in the gallery on purpose: a
 *   local trade site whose job is to be believed and phoned. Utility first,
 *   no artifice, high contrast, big tap targets.
 * - Reviews are the entire proof engine (there is no case-study or metrics
 *   culture here), which is why the Reviews page is a first-class route.
 * - No fabricated accreditation body, licence number, or insurer. Keep
 *   credentials generic and clearly fictional, and express callout rates
 *   without literal currency amounts (a preview-surface guard forbids price
 *   strings) — "no callout fee", "fixed first-hour rate", and similar. */

export const tradeServiceTemplate: TemplateShowcase = {
  assets: [],
  category: 'trade',
  description:
    'Halloran & Sons is a fictional heating and plumbing firm: a direct, utility-first local trade site concept spanning Home, Services, Areas, Reviews, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Areas', path: 'areas' },
    { label: 'Reviews', path: 'reviews' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'States what they do and where, proves it with reviews, and makes getting in touch unmissable.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-kinetic', content: heroKineticDemoContent, id: 'signage' },
        { componentSlug: 'logo-cloud-marquee', content: logoCloudMarqueeDemoContent, id: 'accreditations' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'what-we-do' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'testimonials-rating', content: testimonialsRatingDemoContent, id: 'reviews' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'why-us' },
        { componentSlug: 'faq-accordion', content: faqAccordionDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Halloran & Sons — Heating and plumbing, done properly',
    },
    {
      description: 'Lists the jobs they take on and exactly how a callout runs.',
      label: 'Services',
      path: 'services',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-cards-media', content: featureCardsMediaDemoContent, id: 'jobs' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'detail' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'how-a-callout-works' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Halloran & Sons — Services',
    },
    {
      description: 'Says plainly which areas they cover and how quickly they can get there.',
      label: 'Areas',
      path: 'areas',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'coverage' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'response' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'the-van' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Halloran & Sons — Areas we cover',
    },
    {
      description: 'The proof engine: customer reviews at length, which is how this trade is actually judged.',
      label: 'Reviews',
      path: 'reviews',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'all-reviews' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'testimonials-rating', content: testimonialsRatingDemoContent, id: 'ratings' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Halloran & Sons — Reviews',
    },
    {
      description: 'Makes contact effortless and collects nothing.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'contact' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
      ],
      title: 'Halloran & Sons — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'trade-service',
  status: 'concept',
  summary: 'A direct, utility-first site for a fictional heating and plumbing firm.',
  theme: {
    description:
      'Safety orange and steel on off-white — high-contrast, unpretentious, with heavy type, big tap targets, and no decoration for its own sake.',
    id: 'trade-service',
    swatches: ['#f8f8f6', '#1c2024', '#d2540c'],
  },
  title: 'Trade Service',
  visualTone: ['Direct', 'Utility-first', 'Local'],
}
