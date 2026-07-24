import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  callToActionSignupDemoContent,
  comparatorTableDemoContent,
  contentImageFrameDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentStatsDemoContent,
  faqCardDemoContent,
  faqGroupedDemoContent,
  featureSplitDemoContent,
  featureStepsDemoContent,
  heroAuroraDemoContent,
  heroBasicDemoContent,
  logoCloudInlineWrapDemoContent,
  pricingCardsDemoContent,
  statsProofDemoContent,
  teamGridDemoContent,
  teamRosterDemoContent,
  testimonialsQuoteDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Event — "Frameworks '26", a fictional design + engineering conference.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Event
 * art-direction track replaces them with bespoke, editor-shaped Frameworks
 * copy. Do not ship this file with default catalog content. */

export const eventConferenceTemplate: TemplateShowcase = {
  assets: [],
  category: 'event',
  description:
    'Frameworks ’26 is a fictional design + engineering conference: a bold, high-energy event site concept spanning Home, Speakers, Schedule, Venue, and Tickets — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Speakers', path: 'speakers' },
    { label: 'Schedule', path: 'schedule' },
    { label: 'Venue', path: 'venue' },
    { label: 'Tickets', path: 'tickets' },
  ],
  pages: [
    {
      description: 'Sells the event: dates, proof, featured speakers, and a schedule teaser.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-aurora', content: heroAuroraDemoContent, id: 'hero' },
        { componentSlug: 'logo-cloud-inline-wrap', content: logoCloudInlineWrapDemoContent, id: 'sponsors' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'feature-split', content: featureSplitDemoContent, id: 'why-attend' },
        { componentSlug: 'team-grid', content: teamGridDemoContent, id: 'featured-speakers' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'schedule-teaser' },
        { componentSlug: 'testimonials-quote', content: testimonialsQuoteDemoContent, id: 'testimonial' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'tickets' },
        { componentSlug: 'call-to-action-signup', content: callToActionSignupDemoContent, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Two days for people who ship the web',
    },
    {
      description: 'The full speaker lineup with proof from past editions.',
      label: 'Speakers',
      path: 'speakers',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'lineup' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote', tone: 'muted' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'past-editions' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Speakers',
    },
    {
      description: 'The two-day program by track and time.',
      label: 'Schedule',
      path: 'schedule',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'tracks' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'sessions' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Schedule',
    },
    {
      description: 'The host city, venue, and travel logistics.',
      label: 'Venue',
      path: 'venue',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'city' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'space' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'logistics' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Venue',
    },
    {
      description: 'Ticket tiers and what each includes, with objections resolved.',
      label: 'Tickets',
      path: 'tickets',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'tiers' },
        { componentSlug: 'comparator-table', content: comparatorTableDemoContent, id: 'compare' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-signup', content: callToActionSignupDemoContent, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Tickets',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'event-conference',
  status: 'concept',
  summary: 'A bold, high-energy event site for a fictional design + engineering conference.',
  theme: {
    description:
      'Near-black surfaces with an electric accent and oversized type — a high-contrast, date-driven event identity.',
    id: 'event-conference',
    swatches: ['#0c0c10', '#f5f5f4', '#7c5cff'],
  },
  title: 'Event Conference',
  visualTone: ['Bold', 'High-energy', 'Date-driven'],
}
