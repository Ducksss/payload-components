import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  contactRoutingFormDemoContent,
  contentCommunityDemoContent,
  contentFeatureSplitDemoContent,
  contentImageFrameDemoContent,
  contentImageLeadDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentShowcaseDemoContent,
  contentStatsDemoContent,
  faqSplitDemoContent,
  heroBasicDemoContent,
  heroKineticDemoContent,
  statsProofDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Portfolio — a fictional solo designer-developer's personal site.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Portfolio
 * art-direction track replaces them with bespoke, editor-shaped personal copy.
 * Do not ship this file with default catalog content. */

export const portfolioSoloTemplate: TemplateShowcase = {
  assets: [],
  category: 'portfolio',
  description:
    'A fictional solo designer-developer’s personal site: a minimal, typographic, work-led concept spanning Home, Work, About, Writing, and Contact — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Work', path: 'work' },
    { label: 'About', path: 'about' },
    { label: 'Writing', path: 'writing' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description: 'States who the maker is, shows selected work and proof, and invites a project.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-kinetic', content: heroKineticDemoContent, id: 'hero' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'practice' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'selected-work' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Selected work — a solo designer & developer',
    },
    {
      description: 'A curated portfolio of projects with client proof.',
      label: 'Work',
      path: 'work',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'projects' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'lead-project' },
        { componentSlug: 'content-feature-split', content: contentFeatureSplitDemoContent, id: 'case-study' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'proof' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Work',
    },
    {
      description: 'The maker’s philosophy, background, and the numbers behind the practice.',
      label: 'About',
      path: 'about',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'philosophy' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'quote', tone: 'muted' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'background' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'About',
    },
    {
      description: 'Essays and notes that keep the personal site alive between projects.',
      label: 'Writing',
      path: 'writing',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'essays' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'topics' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Writing',
    },
    {
      description: 'A simple way to start a project — collects nothing.',
      label: 'Contact',
      path: 'contact',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'contact' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
      ],
      title: 'Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'portfolio-solo',
  status: 'concept',
  summary: 'A minimal, typographic, work-led personal site for a fictional solo maker.',
  theme: {
    description:
      'Near-monochrome surfaces with a single quiet accent and generous whitespace — a restrained, type-forward personal identity.',
    id: 'portfolio-solo',
    swatches: ['#fafafa', '#18181b', '#4f46e5'],
  },
  title: 'Portfolio Solo',
  visualTone: ['Minimal', 'Typographic', 'Work-led'],
}
