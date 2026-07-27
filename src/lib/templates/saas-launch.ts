import type { PricingPlanDemo } from '@/lib/demo-content'

import type { TemplateShowcase } from './types'

/* SaaS Launch — "Relay", a fictional B2B analytics platform.
 *
 * Art direction: precise, optimistic, trustworthy, technically literate. One
 * product story spans the five pages — Relay turns raw product events into
 * governed metrics, then delivers them as dashboards, digests, and alerts:
 *
 *   Home     pitches the governed-metric idea and closes with proof + pricing
 *   Product  walks governance → daily workflows → onboarding → integrations
 *   Pricing  reuses the exact same three plans the Home teaser shows
 *   About    grounds the mission, the (fictional) team, and the numbers
 *   Contact  routes questions to named desks at the relay.example domain
 *
 * Everything here is fictional: companies (Northwind, Ferrowatt), people, and
 * metrics are invented but plausible; the detail page discloses them as
 * illustrative. All copy stays editor-shaped (demo-content types) — layout
 * belongs to the twins and the Relay shell/theme. */

/* One pricing truth for the whole site: the Home teaser and the Pricing page
 * render the same three plans, and the comparator table below index-aligns to
 * this order (Starter, Growth, Enterprise). */
const relayPlans: PricingPlanDemo[] = [
  {
    description: 'For your first governed metric',
    features: [
      'Up to 3 seats',
      '1M events per month',
      'Two live dashboards',
      'Community support',
    ],
    link: { appearance: 'outline', label: 'Start free' },
    name: 'Starter',
    period: '/ mo',
    price: '$0',
  },
  {
    description: 'Per workspace, billed monthly',
    featured: true,
    features: [
      'Unlimited seats',
      '25M events per month',
      'Unlimited dashboards',
      'Anomaly alerts',
      'Slack and email digests',
    ],
    link: { appearance: 'default', label: 'Start 30-day trial' },
    name: 'Growth',
    period: '/ mo',
    price: '$49',
  },
  {
    description: 'For governed data at scale',
    features: [
      'Custom event volume',
      'SSO and SCIM',
      'Audit log export',
      'Dedicated success engineer',
    ],
    link: { appearance: 'outline', label: 'Talk to sales' },
    name: 'Enterprise',
    price: 'Custom',
  },
]

export const saasLaunchTemplate: TemplateShowcase = {
  assets: [],
  category: 'saas',
  description:
    'Relay is a fictional B2B analytics platform: a precise, optimistic, product-led SaaS marketing site concept spanning Home, Product, Pricing, About, and Contact — cool white and blue-gray surfaces, one cobalt accent, and proof kept close to every claim, composed entirely from blocks in the open registry.',
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
        'Opens with the aurora launch hero — live metrics counting up over the product panel — then builds proof and platform breadth toward the primary conversion.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The launch moment: word-cascade headline closing on a serif-italic
           * "trust.", count-up metrics that the About page repeats verbatim
           * (2.1B events / 48K definitions / 99.98% availability — one set of
           * canonical numbers across the site), and the parallax dashboard
           * panel. CTAs map to real routes: Start free → pricing, See the
           * product → product. */
          componentSlug: 'hero-aurora',
          content: {
            description:
              'Relay turns raw product events into governed metrics, live dashboards, and alerts your whole company can act on — connected to your warehouse in an afternoon.',
            eyebrow: 'Relay Analytics',
            imageCaption: 'One workspace for events, metrics, dashboards, and alerts.',
            links: [
              { link: { appearance: 'default', label: 'Start free' } },
              { link: { appearance: 'outline', label: 'See the product' } },
            ],
            metrics: [
              { label: 'events every day', value: '2.1B' },
              { label: 'metrics under governance', value: '48K' },
              { label: 'trailing-year uptime', value: '99.98%' },
            ],
            proofItems: [
              { label: 'SOC 2 Type II' },
              { label: 'Warehouse-native' },
              { label: 'Free for 30 days' },
            ],
            title: 'Answer every product question with numbers you can trust.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'logo-cloud-marquee',
          content: { heading: 'Trusted by product-led teams' },
          id: 'logos',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-bento',
          content: {
            description:
              'Define a metric once and Relay keeps every chart, digest, and alert reading from the same definition.',
            eyebrow: 'Platform',
            items: [
              {
                description:
                  'Version-controlled definitions with owners, change review, and a full audit trail — the number everyone means when they say revenue.',
                title: 'Governed metrics',
              },
              {
                description:
                  'Warehouse-fresh charts that load fast and read the same for every team.',
                title: 'Live dashboards',
              },
              {
                description:
                  'Monday-morning summaries delivered to Slack and email before the questions start.',
                title: 'Scheduled digests',
              },
              {
                description:
                  'Relay watches the baseline and pages the metric owner the moment a number moves.',
                title: 'Anomaly alerts',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Explore the product' } }],
            title: 'One metric layer, every surface.',
          },
          id: 'features',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Maya Lindgren',
            body: 'Adoption compounds: once the first governed dashboard ships, the next team asks for theirs.',
            description:
              'Aggregate results across Relay workspaces in their first two quarters.',
            eyebrow: 'Proof, not promises',
            logoLabel: 'NORTHWIND',
            metrics: [
              { label: 'faster time to a trusted answer', value: '63%' },
              { label: 'events processed every day', value: '2.1B' },
              { label: 'metric definitions under governance', value: '48K' },
              { label: 'availability, trailing twelve months', value: '99.98%' },
            ],
            quote:
              'Relay made the metric the meeting. We stopped debating whose export was right and started deciding.',
            role: 'VP Product, Northwind',
            title: 'Teams keep the numbers close to the claims.',
          },
          id: 'stats',
          tone: 'contrast',
        },
        {
          componentSlug: 'integration-cluster',
          content: {
            heading: 'Relay plugs into the stack you already run.',
            links: [{ link: { appearance: 'outline', label: 'See all integrations' } }],
            subtext:
              'Warehouse-native connections and event SDKs keep data flowing both ways — no nightly export jobs to babysit.',
          },
          id: 'integrations',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Ingrid Halvorsen',
              quote:
                'Relay ended the Monday-morning number debate. Product, growth, and finance walk in with the same dashboard, and the meeting starts at the decision.',
              role: 'COO, Tidepool Robotics',
            },
          },
          id: 'testimonial',
          tone: 'muted',
        },
        {
          componentSlug: 'pricing-cards-muted',
          content: {
            description:
              'Seats are never metered — bring the whole company to the same number and pay for the events you process.',
            eyebrow: 'Pricing',
            plans: relayPlans,
            title: 'Start free. Scale when the team does.',
          },
          id: 'pricing',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description:
              'The questions teams ask before they point Relay at production data.',
            eyebrow: 'Good questions',
            items: [
              {
                answer:
                  'BI tools start at the chart; Relay starts at the definition. Every dashboard, digest, and alert reads from one governed metric layer, so two teams can never ship two versions of the same number.',
                question: 'How is Relay different from a BI tool?',
              },
              {
                answer:
                  'No. Relay queries your warehouse directly and streams events through an SDK you control — your data stays where it lives, and access follows the roles you already defined.',
                question: 'Do you copy our data somewhere else?',
              },
              {
                answer:
                  'Most teams connect a warehouse, define their first metric, and share a live dashboard the same afternoon. There is no infrastructure to provision.',
                question: 'How long does setup actually take?',
              },
              {
                answer:
                  'The trial runs 30 days with every Growth feature enabled. When it ends you choose a plan — nothing is deleted, and the free Starter tier keeps your definitions intact.',
                question: 'What happens when the trial ends?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Talk to the team' } }],
            title: 'Asked before every rollout.',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Connect your warehouse, define your first governed metric, and share a live dashboard before the end of the day.',
            links: [
              { link: { appearance: 'default', label: 'Start free' } },
              { link: { appearance: 'outline', label: 'Talk to sales' } },
            ],
            title: 'Put every team on the same number.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Relay — Product analytics for teams that ship',
    },
    {
      description: 'Explains core workflows and the infrastructure underneath them.',
      label: 'Product',
      path: 'product',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Relay models events from your product and warehouse into governed metrics, then delivers them as dashboards, digests, and alerts — no nightly export jobs, no version-five spreadsheets.',
            eyebrow: 'Product',
            links: [
              { link: { appearance: 'default', label: 'Start free' } },
              { link: { appearance: 'outline', label: 'View pricing' } },
            ],
            proofItems: [
              { label: 'Warehouse-native' },
              { label: 'Metrics as code' },
              { label: 'Alerts in minutes' },
            ],
            title: 'From raw events to answers everyone trusts.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-split',
          content: {
            description:
              'Every number in Relay traces back to a definition with an owner, a history, and a review trail — governance that works like the code review you already do.',
            eyebrow: 'Metric governance',
            items: [
              {
                description:
                  'A searchable registry of every metric: its SQL, its owner, and everywhere it appears.',
                title: 'Metric registry',
              },
              {
                description:
                  'Definition changes ship through review, with a diff of every dashboard the change touches.',
                title: 'Change review',
              },
              {
                description:
                  'Access maps to the roles in your identity provider, down to the row level.',
                title: 'Role-scoped access',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'See the metric registry' } }],
            title: 'Define it once. Trust it everywhere.',
          },
          id: 'workflows',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'The daily surfaces stay simple because the definitions underneath them do the hard work.',
            eyebrow: 'Daily work',
            items: [
              {
                description:
                  'Drill from any chart to the cohort behind it without writing a query — the follow-up question is already answered.',
                icon: 'chart',
                title: 'Dashboards that answer the follow-up',
              },
              {
                description:
                  'When a metric breaks its baseline, the owner gets the segment, the timeframe, and the likely cause in one message.',
                icon: 'zap',
                title: 'Alerts that arrive with context',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See every workflow' } }],
            title: 'Built for the questions you ask every day.',
          },
          id: 'capabilities',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'Relay meets your data where it already lives, so the path from install to insight is measured in hours.',
            eyebrow: 'Getting started',
            items: [
              {
                description:
                  'Point Relay at Postgres, BigQuery, or Snowflake with read-only credentials — or stream events straight from the SDK.',
                title: 'Connect your warehouse',
              },
              {
                description:
                  'Write definitions in SQL or the visual builder; Relay versions them and assigns each an owner.',
                title: 'Model your metrics',
              },
              {
                description:
                  'Publish dashboards, schedule digests, and set alert baselines — every surface reads the same layer.',
                title: 'Share it everywhere',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Start onboarding' } }],
            title: 'Live before the standup ends.',
          },
          id: 'steps',
        },
        {
          componentSlug: 'integration-grid',
          content: {
            heading: 'Native to the stack you already run.',
            itemDescription:
              'Two-way sync keeps definitions, events, and alerts consistent — no glue code to babysit.',
            subtext:
              'Warehouses, event streams, identity, and messaging — connected with scoped credentials and sensible defaults.',
          },
          id: 'integrations',
          tone: 'muted',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Amara Diallo, Head of Data, Ferrowatt',
            eyebrow: 'In their words',
            logoLabel: 'FERROWATT',
            paragraphs: [
              {
                text: 'Ferrowatt runs eleven product squads against one Relay workspace. Metric changes go through review like code, and nobody has opened a reconciliation spreadsheet since the rollout.',
              },
            ],
            quote:
              'The registry is the part nobody advertises and everybody ends up loving. Our metrics finally have owners, and our arguments finally have endings.',
            title: 'What changes when definitions have owners.',
          },
          id: 'quote',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Start a 30-day trial, or walk through the product with an engineer on your own data — whichever answers faster.',
            links: [
              { link: { appearance: 'default', label: 'Start free trial' } },
              { link: { appearance: 'outline', label: 'Book a walkthrough' } },
            ],
            title: 'See Relay on your own data.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Relay — Product',
    },
    {
      description: 'Makes packaging legible and resolves purchase objections.',
      label: 'Pricing',
      path: 'pricing',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Every plan includes the governed metric layer, live dashboards, and alerts. Pay for the events you process — seats are always free.',
            eyebrow: 'Pricing',
            links: [
              { link: { appearance: 'default', label: 'Start free' } },
              { link: { appearance: 'outline', label: 'Talk to sales' } },
            ],
            proofItems: [
              { label: 'No credit card to start' },
              { label: 'Usage alerts before any overage' },
              { label: 'Cancel anytime' },
            ],
            title: 'Plans that scale with your data, not your headcount.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'pricing-cards',
          content: {
            description:
              'The same three plans, from your first metric to your data platform. Upgrade when the events do.',
            eyebrow: 'Plans',
            plans: relayPlans,
            title: 'Three plans, one metric layer.',
          },
          id: 'plans',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'Every tier, feature by feature — the governed metric layer is never the upsell.',
            features: [
              {
                feature: 'Seats',
                groupLabel: 'Usage',
                values: [{ label: '3' }, { label: 'Unlimited' }, { label: 'Unlimited' }],
              },
              {
                feature: 'Events per month',
                values: [{ label: '1M' }, { label: '25M' }, { label: 'Custom' }],
              },
              {
                feature: 'Live dashboards',
                values: [{ label: '2' }, { label: 'Unlimited' }, { label: 'Unlimited' }],
              },
              {
                feature: 'Governed metric layer',
                groupLabel: 'Capabilities',
                values: [{ included: true }, { included: true }, { included: true }],
              },
              {
                feature: 'Anomaly alerts',
                values: [{}, { included: true }, { included: true }],
              },
              {
                feature: 'Slack and email digests',
                values: [{}, { included: true }, { included: true }],
              },
              {
                feature: 'SSO and SCIM',
                groupLabel: 'Enterprise readiness',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Audit log export',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Dedicated success engineer',
                values: [{}, {}, { included: true }],
              },
            ],
            plans: [
              {
                links: [{ link: { appearance: 'outline', label: 'Start free' } }],
                name: 'Starter',
              },
              {
                badge: 'Most popular',
                highlighted: true,
                links: [{ link: { appearance: 'default', label: 'Start 30-day trial' } }],
                name: 'Growth',
              },
              {
                links: [{ link: { appearance: 'outline', label: 'Talk to sales' } }],
                name: 'Enterprise',
              },
            ],
            title: 'Compare every plan',
          },
          id: 'compare',
          tone: 'muted',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            items: [
              {
                author: 'Priya Raghunathan',
                quote:
                  'We replaced a per-seat BI contract and cut the analytics bill roughly in half — then gave every engineer a login because seats stopped costing anything.',
                rating: 5,
                role: 'Head of Data, Windrose Health',
              },
              {
                author: 'Dmitri Kowalczyk',
                quote:
                  'The usage alerts are honest. We got warned two weeks before we would have crossed our event tier, not after the invoice.',
                rating: 5,
                role: 'Platform Lead, Cartveil',
              },
              {
                author: 'Sofia Beaumont',
                quote:
                  'Migrating definitions from our old stack took a weekend. I would have paid for the metric registry alone.',
                rating: 4,
                role: 'Analytics Engineer, Loamworks',
              },
            ],
            title: 'Rated by the teams paying the bill.',
          },
          id: 'testimonials',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description:
              'Straight answers on plans, billing, and security — and a human at the end of every thread.',
            eyebrow: 'Pricing FAQ',
            groups: [
              {
                icon: 'package',
                items: [
                  {
                    answer:
                      'No. Starter is free forever and the 30-day Growth trial starts without payment details — you add billing only when you pick a paid plan.',
                    question: 'Do I need a credit card to start?',
                  },
                  {
                    answer:
                      'Yes, at any time. Changes apply immediately and we prorate the difference on your next invoice.',
                    question: 'Can I change plans later?',
                  },
                ],
                title: 'Getting started',
              },
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'An event is one tracked action received by Relay. Warehouse queries against metrics you define are never metered.',
                    question: 'How are events counted?',
                  },
                  {
                    answer:
                      'Relay alerts you well before you reach your tier and keeps every dashboard running. We talk before anything changes on your bill.',
                    question: 'What happens if I go over my event volume?',
                  },
                ],
                title: 'Billing',
              },
              {
                icon: 'help-circle',
                items: [
                  {
                    answer:
                      'In your warehouse. Relay queries it directly with read-only credentials and stores only definitions, metadata, and aggregates.',
                    question: 'Where does our data live?',
                  },
                  {
                    answer:
                      'Relay is SOC 2 Type II audited, encrypts data in transit and at rest, and supports SSO on the Enterprise plan.',
                    question: 'What does your security posture look like?',
                  },
                ],
                title: 'Security and compliance',
              },
            ],
            title: 'Before you choose a plan',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'Get the monthly Relay notes: pricing changes, new connectors, and what shipped — no drip sequence, unsubscribe anytime.',
            emailPlaceholder: 'you@company.com',
            submitLabel: 'Subscribe',
            title: 'Not ready to decide? Follow along.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Relay — Pricing',
    },
    {
      description: 'Establishes mission, scale, the team, and the community around the product.',
      label: 'About',
      path: 'about',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Relay started as an internal tool for settling metric arguments. It became a company with one conviction: deciding together starts with counting together.',
            eyebrow: 'About Relay',
            links: [
              { link: { appearance: 'default', label: 'See the product' } },
              { link: { appearance: 'outline', label: 'Get in touch' } },
            ],
            proofItems: [
              { label: 'Founded 2021' },
              { label: 'Remote across 11 countries' },
              { label: 'Customer-funded' },
            ],
            title: 'We build the number teams agree on.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'Our mission',
            links: [{ link: { appearance: 'default', label: 'See how Relay works' } }],
            paragraphs: [
              {
                text: 'Most analytics tools optimize for the chart. We optimize for the agreement — the moment a team stops auditing the number and starts acting on it. That means governance you can read, definitions with owners, and software calm enough to trust with the metrics that run your company.',
              },
            ],
            title: 'Numbers a whole company can stand on.',
          },
          id: 'mission',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Relay today',
            features: [
              {
                description:
                  'We would rather ship a slower feature than a fuzzier number. Correctness is the roadmap.',
                icon: 'gauge',
                title: 'Accuracy over flash',
              },
              {
                description:
                  'Plain language, legible charts, no dark patterns. Software your finance team can love too.',
                icon: 'sparkles',
                title: 'Calm, legible software',
              },
              {
                description:
                  'Read-only credentials, scoped access, and an audit trail on by default — not as an add-on.',
                icon: 'shield',
                title: 'Security by default',
              },
            ],
            paragraphs: [
              {
                text: 'A deliberately small team, funded by the customers we serve, shipping the layer their decisions stand on.',
              },
            ],
            stats: [
              { label: 'Teammates', value: '38' },
              { label: 'Countries', value: '11' },
              { label: 'Customer workspaces', value: '700+' },
              { label: 'Events every day', value: '2.1B' },
            ],
            title: 'Small team, wide footprint.',
          },
          id: 'scale',
          tone: 'muted',
        },
        {
          componentSlug: 'team-grid',
          content: {
            description:
              'The people who answer your support threads are the people who shipped the feature.',
            eyebrow: 'Team',
            members: [
              { name: 'June Okafor', role: 'Co-Founder & CEO' },
              { name: 'Casper Lindqvist', role: 'Co-Founder & CTO' },
              { name: 'Priya Raghavan', role: 'Head of Product' },
              { name: 'Tomás Ibarra', role: 'Staff Engineer, Query' },
              { name: 'Maren Vogel', role: 'Design Lead' },
              { name: 'Sam Whitfield', role: 'Head of Customer Data' },
            ],
            title: 'A team the size of the problem.',
          },
          id: 'team',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Ada Lovelace' },
              { name: 'Alan Turing' },
              { name: 'Grace Hopper' },
              { name: 'Katherine Johnson' },
              { name: 'Margaret Hamilton' },
              { name: 'Barbara Liskov' },
              { name: 'Dennis Ritchie' },
              { name: 'Tim Berners-Lee' },
            ],
            eyebrow: 'Built with customers',
            paragraphs: [
              {
                text: 'Every Relay release starts in a public changelog and a design-partner call. The metric spec is open, the roadmap takes issues, and the sharpest ideas in the registry came from the teams who run it in production.',
              },
            ],
            title: 'The roadmap is a conversation.',
          },
          id: 'community',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Start a trial, or talk to the people who built it — either way, you get a straight answer.',
            links: [
              { link: { appearance: 'default', label: 'Start free' } },
              { link: { appearance: 'outline', label: 'Contact the team' } },
            ],
            title: 'Bring your team to one number.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Relay — About',
    },
    {
      description: 'Routes sales and product questions without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Sales questions, support threads, security reviews — everything routes to a human who works on Relay every day.',
            eyebrow: 'Contact',
            links: [],
            proofItems: [
              { label: 'Replies within one business day' },
              { label: 'Engineers on every thread' },
              { label: 'No ticket maze' },
            ],
            title: 'Ask the people who built it.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description: 'Pricing, procurement, and guided walkthroughs on your own data.',
                label: 'Sales and demos',
                value: 'sales@relay.example',
              },
              {
                description:
                  'Implementation help for existing workspaces — median first reply under four hours.',
                label: 'Support',
                value: 'support@relay.example',
              },
              {
                description:
                  'Vulnerability reports and security questionnaires, acknowledged the same day.',
                label: 'Security desk',
                value: 'security@relay.example',
              },
            ],
            description:
              'Pick a channel or use the form — both land in the same queue, triaged every morning.',
            eyebrow: 'Reach us',
            formConfigured: true,
            formDescription:
              'Tell us about your stack and what you want to measure; we reply with specifics, not a sequence.',
            formLabels: ['Name', 'Work email', 'Company', 'Role', 'What do you want to measure?'],
            formTitle: 'Send the details',
            submitLabel: 'Send message',
            title: 'Route your question to the right desk.',
          },
          id: 'contact',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'What to expect after you press send.',
            eyebrow: 'Before you write',
            items: [
              {
                answer:
                  'Within one business day, from a named person. Support threads for existing workspaces see a median first reply under four hours.',
                question: 'How fast will someone reply?',
              },
              {
                answer:
                  'Yes — demos run on your own data against a sandbox workspace, driven by an engineer, not a slide deck.',
                question: 'Can we get a guided demo?',
              },
              {
                answer:
                  'Growth and Enterprise plans include guided onboarding; we migrate metric definitions from your current stack with you on the call.',
                question: 'Do you help with migration?',
              },
              {
                answer:
                  'Email the security desk. Reports are acknowledged the same day, and our disclosure policy commits to a fix timeline with every triage.',
                question: 'Where do I report a security issue?',
              },
            ],
            links: [],
            title: 'Answered before you ask.',
          },
          id: 'faq',
          tone: 'muted',
        },
      ],
      title: 'Relay — Contact',
    },
  ],
  revision: 4,
  schemaVersion: 1,
  slug: 'saas-launch',
  status: 'concept',
  summary:
    'A precise, optimistic, product-led SaaS marketing site for a fictional B2B analytics platform.',
  theme: {
    description:
      'Cool white and soft blue-gray surfaces with one vivid cobalt accent, measured radii, and proof kept close to the product claims.',
    id: 'saas-launch',
    swatches: ['#f8fafc', '#233047', '#2456e0'],
  },
  title: 'SaaS Launch',
  visualTone: ['Precise', 'Optimistic', 'Product-led'],
}
