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
  contentStatsDemoContent,
  faqAccordionDemoContent,
  faqCardDemoContent,
  faqGroupedDemoContent,
  faqSplitDemoContent,
  featureIconGridDemoContent,
  heroBasicDemoContent,
  statsProofDemoContent,
  teamGridDemoContent,
  teamRosterDemoContent,
  testimonialsQuoteDemoContent,
} from '@/lib/demo-content'

/* Healthcare — "Alder Practice", a fictional family clinic.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Healthcare
 * art-direction track replaces them with bespoke, editor-shaped Alder copy.
 * Do not ship this file with default catalog content.
 *
 * Register notes for the art-direction track:
 * - This concept is deliberately the calmest and most plainspoken in the
 *   gallery. Reassurance over persuasion; no growth-marketing voice.
 * - It carries the highest accessibility bar in the set — a real clinic site is
 *   read by people who are unwell, anxious, or using assistive tech. Aim well
 *   above the AA floor on body copy, keep line length comfortable, and keep the
 *   language plain.
 * - Nothing here may read as real medical advice, and no practitioner
 *   credential, registration number, or regulator may be fabricated. Keep
 *   clinical claims generic and clearly fictional. */

export const healthcareClinicTemplate: TemplateShowcase = {
  assets: [],
  category: 'healthcare',
  description:
    'Alder Practice is a fictional family clinic: a calm, plainspoken healthcare site concept spanning Home, Services, Our Team, Visiting Us, and Book — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Our Team', path: 'team' },
    { label: 'Visiting Us', path: 'visiting' },
    { label: 'Book', path: 'book' },
  ],
  pages: [
    {
      description:
        'Says plainly who the practice is for, what it offers, and how to be seen — reassurance before persuasion.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'welcome' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'reassurance' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'services' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'muted' },
        { componentSlug: 'team-grid', content: teamGridDemoContent, id: 'clinicians' },
        { componentSlug: 'content-community', content: contentCommunityDemoContent, id: 'community' },
        { componentSlug: 'faq-accordion', content: faqAccordionDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Alder Practice — A family clinic on Alder Road',
    },
    {
      description: 'Describes the care available as pathways, in plain language.',
      label: 'Services',
      path: 'services',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-icon-grid', content: featureIconGridDemoContent, id: 'care' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'pathways' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'what-to-expect' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Alder Practice — Services',
    },
    {
      description: 'Introduces the clinicians and the practice’s way of working.',
      label: 'Our Team',
      path: 'team',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'clinicians' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'philosophy' },
        { componentSlug: 'content-image-lead', content: contentImageLeadDemoContent, id: 'practice' },
        { componentSlug: 'testimonials-quote', content: testimonialsQuoteDemoContent, id: 'patient-voice' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Alder Practice — Our Team',
    },
    {
      description: 'The practical page: where the practice is, when it is open, and how to get in.',
      label: 'Visiting Us',
      path: 'visiting',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-image-frame', content: contentImageFrameDemoContent, id: 'building' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'practical' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'hours-access' },
        { componentSlug: 'faq-card', content: faqCardDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Alder Practice — Visiting Us',
    },
    {
      description: 'Routes appointment requests calmly and collects nothing.',
      label: 'Book',
      path: 'book',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'contact-routing-form', content: contactRoutingFormDemoContent, id: 'request' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
      ],
      title: 'Alder Practice — Book an appointment',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'healthcare-clinic',
  status: 'concept',
  summary: 'A calm, plainspoken site for a fictional family clinic.',
  theme: {
    description:
      'Soft alder green and sky over warm white — the airiest palette in the gallery, with comfortable measure, generous spacing, and contrast held well above the floor.',
    id: 'healthcare-clinic',
    swatches: ['#fbfaf7', '#22423a', '#5f8f86'],
  },
  title: 'Healthcare Clinic',
  visualTone: ['Calm', 'Plainspoken', 'Accessible'],
}
