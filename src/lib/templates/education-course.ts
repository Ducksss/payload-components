import type { TemplateShowcase } from './types'

import {
  callToActionBoxedDemoContent,
  callToActionCenteredDemoContent,
  callToActionSignupDemoContent,
  comparatorTableDemoContent,
  contentColumnsDemoContent,
  contentQuoteDemoContent,
  contentRowsDemoContent,
  contentShowcaseDemoContent,
  contentStatsDemoContent,
  faqGroupedDemoContent,
  faqSplitDemoContent,
  featureStepsDemoContent,
  heroBasicDemoContent,
  heroProductTiltDemoContent,
  logoCloudInlineWrapDemoContent,
  pricingCardsDemoContent,
  pricingCardsMutedDemoContent,
  statsProofDemoContent,
  teamRosterDemoContent,
  testimonialsRatingDemoContent,
  testimonialsSpotlightDemoContent,
  testimonialsWallDemoContent,
} from '@/lib/demo-content'

/* Education — "Northfield School", a fictional practical-typography school.
 *
 * FOUNDATION SKELETON: the recipes below are the frozen launch contract; the
 * content values are catalog defaults standing in until the Education
 * art-direction track replaces them with bespoke, editor-shaped Northfield
 * copy. Do not ship this file with default catalog content.
 *
 * IA note for the art-direction track: this concept's distinguishing feature is
 * a syllabus shape nothing else in the gallery has — `feature-steps` carries a
 * module ladder, `content-rows` the lessons inside it, and `content-columns`
 * the prerequisites. Tuition is expressed without literal currency amounts (a
 * preview-surface guard forbids price strings): use plan names, cadence, and
 * what is included. */

export const educationCourseTemplate: TemplateShowcase = {
  assets: [],
  category: 'education',
  description:
    'Northfield School is a fictional practical-typography school: a patient, structured education site concept spanning Home, Curriculum, Instructors, Outcomes, and Enroll — composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Curriculum', path: 'curriculum' },
    { label: 'Instructors', path: 'instructors' },
    { label: 'Outcomes', path: 'outcomes' },
    { label: 'Enroll', path: 'enroll' },
  ],
  pages: [
    {
      description:
        'Explains what the school teaches, shows the module ladder and the people who teach it, and closes on enrolment.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-product-tilt', content: heroProductTiltDemoContent, id: 'prospectus' },
        { componentSlug: 'logo-cloud-inline-wrap', content: logoCloudInlineWrapDemoContent, id: 'where-grads-work' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'module-ladder' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'what-you-make' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'testimonials-spotlight', content: testimonialsSpotlightDemoContent, id: 'student-voice' },
        { componentSlug: 'pricing-cards-muted', content: pricingCardsMutedDemoContent, id: 'tuition' },
        { componentSlug: 'faq-split', content: faqSplitDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Northfield School — Typography, taught properly',
    },
    {
      description: 'The full syllabus: modules in order, the lessons inside them, and what you need first.',
      label: 'Curriculum',
      path: 'curriculum',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'feature-steps', content: featureStepsDemoContent, id: 'modules' },
        { componentSlug: 'content-rows', content: contentRowsDemoContent, id: 'lessons' },
        { componentSlug: 'content-columns', content: contentColumnsDemoContent, id: 'prerequisites' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Northfield School — Curriculum',
    },
    {
      description: 'Introduces the people teaching, with their working credentials.',
      label: 'Instructors',
      path: 'instructors',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'team-roster', content: teamRosterDemoContent, id: 'faculty' },
        { componentSlug: 'content-quote', content: contentQuoteDemoContent, id: 'teaching-philosophy' },
        { componentSlug: 'testimonials-wall', content: testimonialsWallDemoContent, id: 'student-voice' },
        { componentSlug: 'call-to-action-boxed', content: callToActionBoxedDemoContent, id: 'cta' },
      ],
      title: 'Northfield School — Instructors',
    },
    {
      description: 'Reports what graduates actually go on to do, with student work as evidence.',
      label: 'Outcomes',
      path: 'outcomes',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'content-stats', content: contentStatsDemoContent, id: 'numbers' },
        { componentSlug: 'stats-proof', content: statsProofDemoContent, id: 'proof', tone: 'contrast' },
        { componentSlug: 'content-showcase', content: contentShowcaseDemoContent, id: 'student-work' },
        { componentSlug: 'testimonials-rating', content: testimonialsRatingDemoContent, id: 'ratings' },
        { componentSlug: 'call-to-action-centered', content: callToActionCenteredDemoContent, id: 'cta' },
      ],
      title: 'Northfield School — Outcomes',
    },
    {
      description: 'Makes cohort options and what is included legible, then resolves objections.',
      label: 'Enroll',
      path: 'enroll',
      sections: [
        { componentSlug: 'hero-basic', content: heroBasicDemoContent, id: 'hero' },
        { componentSlug: 'pricing-cards', content: pricingCardsDemoContent, id: 'options' },
        { componentSlug: 'comparator-table', content: comparatorTableDemoContent, id: 'compare-cohorts' },
        { componentSlug: 'faq-grouped', content: faqGroupedDemoContent, id: 'faq' },
        { componentSlug: 'call-to-action-signup', content: callToActionSignupDemoContent, id: 'cta' },
      ],
      title: 'Northfield School — Enroll',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'education-course',
  status: 'concept',
  summary: 'A patient, structured site for a fictional practical-typography school.',
  theme: {
    description:
      'Ink on chalk with one highlighter accent — a studious, orderly palette built around a numbered module ladder and generous reading measure.',
    id: 'education-course',
    swatches: ['#f7f7f5', '#22201d', '#c8a021'],
  },
  title: 'Education Course',
  visualTone: ['Patient', 'Structured', 'Credible'],
}
