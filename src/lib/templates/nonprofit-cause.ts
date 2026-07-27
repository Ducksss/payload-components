import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  contactRoutingFormDemoContent,
  contentColumnsDemoContent,
  contentCommunityDemoContent,
  contentImageFrameDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentShowcaseDemoContent,
  contentStatsDemoContent,
  faqAccordionDemoContent,
  faqCardDemoContent,
  faqSplitDemoContent,
  featureCardsMediaDemoContent,
  featureIconGridDemoContent,
  featureStepsDemoContent,
  heroBasicDemoContent,
  heroVideoDemoContent,
  logoCloudInlineWrapDemoContent,
  statsProofDemoContent,
  teamRosterDemoContent,
  testimonialsQuoteDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Nonprofit — "Rivermouth Trust", a fictional watershed conservation charity.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Nonprofit
 * art-direction track replaces them with bespoke, editor-shaped Rivermouth
 * copy. Do not ship this file with default catalog content.
 *
 * Register note for the art-direction track: this is the only concept in the
 * gallery whose call to action is give/volunteer rather than buy/book/demo.
 * The Donate page deliberately avoids a pricing block — giving levels are
 * expressed as named paths, never currency amounts (a preview-surface guard
 * forbids literal price strings). */

export const nonprofitCauseTemplate: TemplateShowcase = {
  assets: [],
  category: 'nonprofit',
  description:
    'Rivermouth Trust is a fictional watershed conservation charity: a sincere, place-led nonprofit site concept spanning Home, Our Work, Impact, Get Involved, and Donate — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Our Work', path: 'work' },
    { label: 'Impact', path: 'impact' },
    { label: 'Get Involved', path: 'involved' },
    { label: 'Donate', path: 'donate' },
  ],
  pages: [
    {
      description:
        'Opens on the place itself, states the mission, shows the work and its measured impact, and invites people in.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-video', content: heroVideoDemoContent, id: 'catchment' },
        { componentSlug: 'logo-cloud-inline-wrap', content: logoCloudInlineWrapDemoContent, id: 'partners' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'the-work' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'impact', tone: 'contrast' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'place' },
        { componentSlug: 'testimonials-quote', content: testimonialsQuoteDemoContent, id: 'voice' },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'people' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Rivermouth Trust — Restoring a river, reach by reach',
    },
    {
      description: 'Explains the conservation programmes and how each one actually works.',
      label: 'Our Work',
      path: 'work',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'approach' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'programmes' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'projects' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'field' },
        { componentSlug: 'faq-accordion', content: faqAccordionDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Rivermouth Trust — Our Work',
    },
    {
      description: 'Reports measured outcomes honestly — the proof spine of the whole site.',
      label: 'Impact',
      path: 'impact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'numbers' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'community-voice' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Rivermouth Trust — Impact',
    },
    {
      description: 'Lays out concrete volunteer paths — the nonprofit equivalent of a pricing page.',
      label: 'Get Involved',
      path: 'involved',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'how-to-help' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'roles' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Rivermouth Trust — Get Involved',
    },
    {
      description:
        'Explains where money goes and how to give — named giving paths, never currency amounts.',
      label: 'Donate',
      path: 'donate',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-cards-media', content: featureCardsMediaDemoContent, id: 'ways-to-give' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'what-it-funds' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'contact' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
      ],
      title: 'Rivermouth Trust — Donate',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'nonprofit-cause',
  status: 'concept',
  summary: 'A sincere, place-led site for a fictional watershed conservation charity.',
  theme: {
    description:
      'River green and silt over warm paper — an earthy, human palette with photographic space and impact numbers as the proof spine.',
    id: 'nonprofit-cause',
    swatches: ['#f6f4ee', '#1f3a2e', '#4f7d5c'],
  },
  title: 'Nonprofit Cause',
  visualTone: ['Sincere', 'Place-led', 'Human'],
}
