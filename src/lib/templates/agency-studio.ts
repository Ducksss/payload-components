import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  contactRoutingFormDemoContent,
  contentColumnsDemoContent,
  contentCommunityDemoContent,
  contentFeatureSplitDemoContent,
  contentImageFrameDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentShowcaseDemoContent,
  contentStatsDemoContent,
  faqAccordionDemoContent,
  faqSplitDemoContent,
  featureCardsMediaDemoContent,
  featureIconGridDemoContent,
  featureSplitDemoContent,
  featureStepsDemoContent,
  heroBasicDemoContent,
  heroVideoDemoContent,
  logoCloudInlineWrapDemoContent,
  statsProofDemoContent,
  teamRosterDemoContent,
  testimonialsQuoteDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Agency Studio — "Northline", a fictional brand and digital-product studio.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Agency
 * art-direction track replaces them with original editorial Northline copy.
 * Do not ship this file with default catalog content. */

export const agencyStudioTemplate: TemplateShowcase = {
  assets: [],
  category: 'agency',
  description:
    'Northline is a fictional brand and digital-product studio: an editorial, warm, portfolio-led agency site concept spanning Home, Services, Work, About, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Work', path: 'work' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'States the studio point of view, shows selected work, proof, and the people behind it.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-video', content: heroVideoDemoContent, id: 'hero' },
        {
          componentSlug: 'logo-cloud-inline-wrap',
          content: logoCloudInlineWrapDemoContent,
          id: 'logos',
        },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'showcase' },
        { componentSlug: 'feature-split', content: featureSplitDemoContent, id: 'approach' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'stats' },
        {
          componentSlug: 'testimonials-quote',
          content: testimonialsQuoteDemoContent,
          id: 'testimonial',
        },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'team' },
        {
          componentSlug: 'call-to-action-centered',
          content: callToActionCenteredDemoContent,
          id: 'cta',
        },
      ],
      title: 'Northline — A brand and digital product studio',
    },
    {
      description: 'Explains the offers, working method, deliverables, and common questions.',
      label: 'Services',
      path: 'services',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'offers' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'services' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'method' },
        {
          componentSlug: 'feature-cards-media',
          content: featureCardsMediaDemoContent,
          id: 'deliverables',
        },
        { componentSlug: 'faq-accordion', content: faqAccordionDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Northline — Services',
    },
    {
      description: 'Presents a curated portfolio narrative with client proof.',
      label: 'Work',
      path: 'work',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'lead' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'case-studies' },
        {
          componentSlug: 'content-feature-split',
          content: contentFeatureSplitDemoContent,
          id: 'feature',
        },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'proof' },
        {
          componentSlug: 'call-to-action-centered',
          content: callToActionCenteredDemoContent,
          id: 'cta',
        },
      ],
      title: 'Northline — Work',
    },
    {
      description: 'Explains the philosophy, team, history, and community involvement.',
      label: 'About',
      path: 'about',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'philosophy' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'history' },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'team' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Northline — About',
    },
    {
      description: 'Explains project fit and routes conversations without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        {
          componentSlug: 'contact-routing-form',
          content: contactRoutingFormDemoContent,
          id: 'contact',
        },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
      ],
      title: 'Northline — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'agency-studio',
  status: 'concept',
  summary:
    'An editorial, warm, portfolio-led studio site for a fictional brand and digital-product practice.',
  theme: {
    description:
      'Warm paper surfaces, ink foreground, a restrained rust accent, larger type, cinematic image crops, and deliberate negative space.',
    id: 'agency-studio',
    swatches: ['#faf6f0', '#1c1917', '#b45309'],
  },
  title: 'Agency Studio',
  visualTone: ['Editorial', 'Warm', 'Portfolio-led'],
}
