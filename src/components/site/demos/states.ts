import {
  faqAccordionDemoContent,
  faqCardDemoContent,
  faqGridDemoContent,
  faqSplitDemoContent,
  type FaqDemoContent,
} from '@/lib/demo-content'

/* Example states for the component doc pages' "Examples" section.
 *
 * A state is one named configuration of a demo twin's `content` prop — the
 * twin stays the same specimen, only the editor-entered data changes. Each
 * state renders through two surfaces that must stay in step:
 *   - /components/preview/<slug>/<state> — the static iframe target
 *     (src/app/[locale]/components/preview/[slug]/[state]/page.tsx)
 *   - <ComponentExample slug state /> in content/docs/components/<slug>.mdx,
 *     which embeds that route and shows the content as block JSON.
 * The MDX writes the `### <title>` heading and the summary sentence itself so
 * the table of contents and the markdown surfaces see them; `title` and
 * `summary` are kept here as the canonical copy and for the registry test
 * (tests/int/component-examples.int.spec.ts).
 *
 * Only slugs whose twin accepts a `content` prop belong here. Content is
 * realistic product copy in the same voice as src/lib/demo-content.ts (Acme,
 * the analytics product). Ids are kebab-case and unique per slug. */

export type ExampleState<TContent = unknown> = {
  content: TContent
  id: string
  summary: string
  title: string
}

/* --- FAQ family -------------------------------------------------------- */

const faqAccordionStates: ExampleState<FaqDemoContent>[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    summary:
      'Just a heading and the questions. Leave the optional fields empty and the block tightens up.',
    content: {
      items: faqAccordionDemoContent.items.slice(0, 3),
      links: [],
      title: 'Frequently asked questions',
    },
  },
  {
    id: 'with-cta',
    title: 'With a support CTA',
    summary:
      'Add one or two links and a support CTA row appears under the answers — the first link is the primary button, the second an outline.',
    content: {
      ...faqAccordionDemoContent,
      links: [
        { link: { appearance: 'default', label: 'Contact support' } },
        { link: { appearance: 'outline', label: 'Read the docs' } },
      ],
    },
  },
  {
    id: 'long-form',
    title: 'Long-form answers',
    summary:
      'Long answers keep their measure: the column stays at a readable width and every answer wraps under its question.',
    content: {
      description: 'The questions that come up once a team is past the trial.',
      eyebrow: 'Support',
      items: [
        {
          answer:
            'Acme connects with a read-only role you create in your warehouse. We never write back to your tables, and the connection is scoped to the schemas you pick during setup. You can rotate the credentials at any time from the workspace settings.',
          question: 'How does Acme connect to my data warehouse?',
        },
        {
          answer:
            'Dashboards query live, so a new column or a renamed table shows up the next time the view refreshes. If a query breaks, the dashboard keeps its last good result and flags the chart that needs attention. Nothing is deleted on your behalf.',
          question: 'What happens to dashboards when the underlying data changes?',
        },
        {
          answer:
            'Yes. Row-level rules are written once and applied to every dashboard, so a regional manager only sees their own region without a separate copy of each chart. Rules are versioned alongside the dashboard, so you can see who changed what and when.',
          question: 'Can I control who sees which numbers?',
        },
        {
          answer:
            'Every plan includes unlimited viewers; you only pay for the editors who build dashboards. Query volume is metered against the included allowance, and we email you before you cross it. Annual plans lock the price for the year.',
          question: 'How are seats and usage billed?',
        },
        {
          answer:
            'Most teams start by connecting the same warehouse and rebuilding their five most-used dashboards, which usually takes a week. We provide an import for Looker and Metabase definitions, and a solutions engineer reviews the result with you before you switch over.',
          question: 'What does moving from another tool look like?',
        },
      ],
      links: [],
      title: 'Questions from teams rolling out',
    },
  },
  {
    id: 'single',
    title: 'A single question',
    summary:
      'The block holds up with a single question, so it works as a one-off callout as well as a full FAQ.',
    content: {
      items: [
        {
          answer:
            'Start on the free tier with no credit card; upgrade once you outgrow the included usage.',
          question: 'Is there a free trial?',
        },
      ],
      links: [],
      title: 'Before you sign up',
    },
  },
]

const faqSplitStates: ExampleState<FaqDemoContent>[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    summary:
      'Heading on the left, questions on the right, nothing else. Leave the optional fields empty and the left column shrinks to the title.',
    content: {
      items: faqSplitDemoContent.items.slice(0, 3),
      links: [],
      title: 'Questions, answered',
    },
  },
  {
    id: 'with-cta',
    title: 'With a support CTA',
    summary:
      'Links render under the heading in the left column, so the CTA sits beside the questions rather than below them.',
    content: {
      ...faqSplitDemoContent,
      links: [
        { link: { appearance: 'default', label: 'Talk to sales' } },
        { link: { appearance: 'outline', label: 'Read the security docs' } },
      ],
    },
  },
]

const faqCardStates: ExampleState<FaqDemoContent>[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    summary:
      'A title and the questions inside one card. Leave the optional fields empty and the card is all there is.',
    content: {
      items: faqCardDemoContent.items.slice(0, 3),
      links: [],
      title: 'Frequently asked questions',
    },
  },
  {
    id: 'with-cta',
    title: 'With a support CTA',
    summary:
      'Links render as a button row under the card — the first link is the primary button, the second an outline.',
    content: {
      ...faqCardDemoContent,
      links: [
        { link: { appearance: 'default', label: 'Start free trial' } },
        { link: { appearance: 'outline', label: 'Contact support' } },
      ],
    },
  },
]

/* faq-grid shares the FaqDemoContent shape but its renderer has no link row,
   so a "with-cta" state would show nothing new: it gets the minimal state only. */
const faqGridStates: ExampleState<FaqDemoContent>[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    summary:
      'A title and four questions in a two-column grid. The grid variant has no link row, so this is the block at its plainest.',
    content: {
      items: faqGridDemoContent.items.slice(0, 4),
      links: [],
      title: 'Common questions',
    },
  },
]

/* Slug → ordered states. Every slug here must have a demo twin in registry.ts
   that accepts `content`; the pairing is pinned by the int spec. */
export const exampleStatesBySlug: Record<string, ExampleState[]> = {
  'faq-accordion': faqAccordionStates,
  'faq-card': faqCardStates,
  'faq-grid': faqGridStates,
  'faq-split': faqSplitStates,
}

export function getExampleState(slug: string, id: string): ExampleState | undefined {
  return exampleStatesBySlug[slug]?.find((state) => state.id === id)
}

/* Every slug/state pair, for the per-state preview route's generateStaticParams. */
export function exampleStateParams(): { slug: string; state: string }[] {
  return Object.entries(exampleStatesBySlug).flatMap(([slug, states]) =>
    states.map((state) => ({ slug, state: state.id })),
  )
}
