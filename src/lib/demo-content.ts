/**
 * Sample content for the landing-page demo twins.
 *
 * Types hand-mirror the component field contracts in
 * payload-components/source/blocks/{HeroBasic,FeatureGridBasic}/config.ts —
 * if a component config changes its fields, update the matching type here.
 *
 * Deliberately NOT in site.ts: the e2e specs and the OG image import
 * site.ts, and this fictional specimen copy ("Acme") must never leak
 * into assertions or metadata. The fictional product matches the
 * `./acme-site` repo the terminal replay installs into.
 */

export type DemoLinkData = {
  appearance: 'default' | 'outline'
  label: string
}

export type HeroBasicDemoContent = {
  description: string
  eyebrow?: string
  links: { link: DemoLinkData }[]
  proofItems: { label: string }[]
  title: string
}

/* The whole Feature family (grid-basic, split, bento, steps) renders from one
   demo-content shape: the shared featureFields header plus title+description
   items and optional CTA links. */
export type FeatureSectionDemoContent = {
  description?: string
  eyebrow?: string
  items: { description: string; title: string }[]
  links: { link: DemoLinkData }[]
  title: string
}

export type FeatureGridBasicDemoContent = FeatureSectionDemoContent

export type EmbedBasicDemoContent = {
  allowFullscreen?: boolean
  aspectRatio: '16:9' | '4:3' | '1:1' | '21:9'
  caption?: string
  title: string
  url: string
}

/* The whole Logo Cloud family (grid, hover, marquee, inline, inline-wrap)
   renders from one demo-content shape: the shared heading, and for the hover
   variant an optional CTA link. The logos themselves are presentational and
   backend-free, so the twins pull invented monochrome marks from
   `@/components/site/demos/DemoLogos` rather than carrying logo data here. */
export type LogoCloudDemoContent = {
  heading: string
  links?: { link: DemoLinkData }[]
}

/* The whole Call To Action family (centered, boxed, signup) renders from one
   demo-content shape: the shared title+description, optional CTA links for the
   centered/boxed variants, and the email-form labels for the signup variant. */
export type CtaDemoContent = {
  title: string
  description?: string
  emailPlaceholder?: string
  links?: { link: DemoLinkData }[]
  submitLabel?: string
}

export const heroBasicDemoContent: HeroBasicDemoContent = {
  description:
    'Acme gives product teams hosted dashboards, usage reports, and alerting on one platform — wired to your data in an afternoon.',
  eyebrow: 'Acme Cloud · New',
  links: [
    { link: { appearance: 'default', label: 'Start free trial' } },
    { link: { appearance: 'outline', label: 'Talk to sales' } },
  ],
  proofItems: [
    { label: 'SOC 2 Type II' },
    { label: '99.99% uptime' },
    { label: 'No credit card required' },
  ],
  title: 'Ship customer dashboards in days, not quarters.',
}

export const featureGridBasicDemoContent: FeatureGridBasicDemoContent = {
  description: 'Three surfaces cover the reporting work that used to take a sprint.',
  eyebrow: 'Platform',
  items: [
    {
      description: 'Composable charts on live data, embedded in your product with one snippet.',
      title: 'Hosted dashboards',
    },
    {
      description: 'Weekly digests rendered to PDF and delivered to every customer workspace.',
      title: 'Scheduled reports',
    },
    {
      description: 'Threshold alerts that page the right owner before customers notice.',
      title: 'Usage alerts',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Explore the platform' } }],
  title: 'Everything a data team ships weekly.',
}

export const featureSplitDemoContent: FeatureSectionDemoContent = {
  description:
    'Pair the story on the left with the proof on the right — side by side on desktop, stacked on mobile.',
  eyebrow: 'Built for teams',
  items: [
    {
      description: 'Scope access by workspace so the right people edit the right surfaces.',
      title: 'Roles and permissions',
    },
    {
      description: 'Every publish is versioned and reversible, with a record of who changed what.',
      title: 'Audit trail',
    },
    {
      description: 'Bring your own identity provider and onboard the whole team in minutes.',
      title: 'Single sign-on',
    },
  ],
  links: [{ link: { appearance: 'default', label: 'See how it works' } }],
  title: 'Everything your team needs to ship with confidence.',
}

export const featureBentoDemoContent: FeatureSectionDemoContent = {
  description: 'Lead with the headline capability, then let the supporting cells fill in around it.',
  eyebrow: 'Platform',
  items: [
    {
      description:
        'Composable charts on live data, embedded in your product with one snippet — the workspace your customers open every day.',
      title: 'Hosted dashboards',
    },
    {
      description: 'Weekly digests rendered to PDF and delivered to every customer workspace.',
      title: 'Scheduled reports',
    },
    {
      description: 'Threshold alerts that page the right owner before customers notice.',
      title: 'Usage alerts',
    },
    {
      description: 'Every change is versioned, attributed, and reversible.',
      title: 'Audit log',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Explore the platform' } }],
  title: 'One platform, every surface.',
}

export const featureStepsDemoContent: FeatureSectionDemoContent = {
  description:
    'Number the path from install to launch so prospects see the whole journey at a glance.',
  eyebrow: 'Onboarding',
  items: [
    {
      description: 'Point the SDK at your warehouse or stream events directly — no migration required.',
      title: 'Connect your data',
    },
    {
      description: 'Drag charts onto a canvas and bind them to the metrics that matter.',
      title: 'Compose a view',
    },
    {
      description: 'Embed the finished workspace with one snippet and roll it out to every account.',
      title: 'Ship to customers',
    },
  ],
  links: [{ link: { appearance: 'default', label: 'Start onboarding' } }],
  title: 'Live in three steps.',
}

export const embedBasicDemoContent: EmbedBasicDemoContent = {
  allowFullscreen: true,
  aspectRatio: '16:9',
  caption: 'Acme product tour — two minutes from sign-up to first dashboard.',
  title: 'Acme product tour',
  url: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
}

export const logoCloudGridDemoContent: LogoCloudDemoContent = {
  heading: 'Trusted by teams shipping on Payload.',
}

export const logoCloudHoverDemoContent: LogoCloudDemoContent = {
  heading: 'Powering the best product teams.',
  links: [{ link: { appearance: 'default', label: 'Meet our customers' } }],
}

export const logoCloudMarqueeDemoContent: LogoCloudDemoContent = {
  heading: 'Powering the best teams',
}

export const logoCloudInlineDemoContent: LogoCloudDemoContent = {
  heading: 'Trusted by teams at:',
}

export const logoCloudInlineWrapDemoContent: LogoCloudDemoContent = {
  heading: 'Trusted by teams at:',
}

export type ContentIconKey = 'zap' | 'cpu' | 'lock' | 'sparkles' | 'gauge' | 'shield'

export type ContentFeatureDemo = {
  description: string
  icon?: ContentIconKey
  title: string
}

/* The whole Content family (columns, image-lead, feature-media, feature-split,
   showcase, quote, community) renders from one demo-content shape: the shared
   eyebrow/title/paragraphs plus the optional media, features, CTA, quote, or
   avatars a given variant uses. Media uploads are backend-free on the
   landing/docs previews, so the twins render presentational placeholders. */
export type ContentSectionDemoContent = {
  avatars?: { name: string }[]
  citation?: string
  eyebrow?: string
  features?: ContentFeatureDemo[]
  links?: { link: DemoLinkData }[]
  paragraphs: { text: string }[]
  quote?: string
  rows?: { description: string; title: string }[]
  stats?: { label: string; value: string }[]
  title: string
}

/* The serif "list" content variants (content-list, content-list-columns,
   content-list-icons) render from a labeled-term list rather than paragraphs,
   so they carry their own demo-content shape. */
export type ContentListDemoContent = {
  description?: string
  eyebrow?: string
  items: { description: string; icon?: ContentIconKey; term: string }[]
  title: string
}

export const contentColumnsDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Why teams switch',
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem — from the products you ship to the APIs and platforms helping your team move faster.',
    },
    {
      text: 'Pair the headline on the left with the detail on the right: a layout that reads top-to-bottom on mobile and side-by-side on desktop.',
    },
  ],
  links: [{ link: { appearance: 'default', label: 'Learn more' } }],
  title: 'The Acme ecosystem brings together your products and platforms.',
}

export const contentImageLeadDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Built in the open',
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem — from the products you ship to the APIs and platforms helping your team move faster.',
    },
  ],
  links: [{ link: { appearance: 'default', label: 'Learn more' } }],
  title: 'The Acme ecosystem brings together your products and platforms.',
}

export const contentFeatureMediaDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Under the hood',
  features: [
    {
      description: 'Server-rendered sections keep pages quick for developers and editors alike.',
      icon: 'zap',
      title: 'Fast',
    },
    {
      description: 'A real content model behind every section, not a wall of hardcoded markup.',
      icon: 'cpu',
      title: 'Powerful',
    },
  ],
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem helping your team move faster.',
    },
  ],
  title: 'The Acme ecosystem brings together your models.',
}

export const contentFeatureSplitDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Built to scale',
  features: [
    {
      description: 'Access control and versioning are part of the platform, not bolted on.',
      icon: 'lock',
      title: 'Secure',
    },
    {
      description: 'Polished, accessible markup that matches the rest of your site.',
      icon: 'sparkles',
      title: 'Refined',
    },
  ],
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem helping your team move faster.',
    },
  ],
  title: 'The Acme ecosystem brings together your models.',
}

export const contentShowcaseDemoContent: ContentSectionDemoContent = {
  eyebrow: 'The platform',
  features: [
    { description: 'Server-rendered sections keep pages quick.', icon: 'zap', title: 'Fast' },
    { description: 'A real content model behind every section.', icon: 'cpu', title: 'Powerful' },
    { description: 'Access control and versioning built in.', icon: 'lock', title: 'Secure' },
    { description: 'Polished, accessible markup throughout.', icon: 'sparkles', title: 'Refined' },
  ],
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem helping your team move faster.',
    },
  ],
  title: 'The Acme ecosystem brings together your products and platforms.',
}

export const contentQuoteDemoContent: ContentSectionDemoContent = {
  citation: 'Jordan Rivera, CTO',
  eyebrow: 'In their words',
  paragraphs: [
    {
      text: 'Acme is more than just the dashboard. It supports an entire ecosystem helping your team move faster.',
    },
  ],
  quote:
    'Using Acme has been like unlocking a design superpower — the perfect fusion of simplicity and versatility.',
  title: 'The Acme ecosystem brings together your models.',
}

export const contentCommunityDemoContent: ContentSectionDemoContent = {
  avatars: [
    { name: 'Ada Lovelace' },
    { name: 'Alan Turing' },
    { name: 'Grace Hopper' },
    { name: 'Linus Torvalds' },
    { name: 'Margaret Hamilton' },
    { name: 'Dennis Ritchie' },
    { name: 'Katherine Johnson' },
    { name: 'Tim Berners-Lee' },
  ],
  eyebrow: 'Open source',
  paragraphs: [
    {
      text: 'Acme grows from real installs and pull requests. Every block ships with its full contract: source, manifest, docs, and installer coverage.',
    },
  ],
  title: 'Built by the community, for the community.',
}

export const contentSplitRowsDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Smart editor',
  paragraphs: [
    {
      text: 'Efficient content creation is our mission. Edit text, generate snippets, format documents, and integrate with your existing workflow.',
    },
  ],
  rows: [
    {
      description:
        'We put together your schedule automatically and work the highest-priority items first.',
      title: 'Marketing campaigns',
    },
    {
      description:
        'Ask the chat to create or update your events, or have it prepare today’s agenda.',
      title: 'AI meeting scheduler',
    },
  ],
  title: 'Ask Acme to edit anything.',
}

export const contentRowsDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Smart editor',
  paragraphs: [
    {
      text: 'Efficient content creation is our mission. Edit text, generate snippets, format documents, and integrate with your existing workflow.',
    },
  ],
  rows: [
    {
      description:
        'We put together your schedule automatically and work the highest-priority items first.',
      title: 'Marketing campaigns',
    },
    {
      description:
        'Ask the chat to create or update your events, or have it prepare today’s agenda.',
      title: 'AI meeting scheduler',
    },
  ],
  title: 'Ask Acme to edit anything.',
}

export const contentImageFrameDemoContent: ContentSectionDemoContent = {
  eyebrow: 'Built in the open',
  paragraphs: [
    {
      text: 'Our assistant helps you create better content faster — generate ideas, improve your writing, and design layouts with simple prompts.',
    },
  ],
  title: 'Create content with AI assistance.',
}

export const contentStatsDemoContent: ContentSectionDemoContent = {
  eyebrow: 'The platform',
  features: [
    {
      description: 'Spark creativity with AI-powered content suggestions and inspiration.',
      icon: 'sparkles',
      title: 'Generate ideas',
    },
    {
      description: 'Enhance your text with smart editing suggestions and style refinements.',
      icon: 'zap',
      title: 'Improve writing',
    },
    {
      description: 'Create visually appealing layouts that capture your audience’s attention.',
      icon: 'gauge',
      title: 'Design layouts',
    },
  ],
  paragraphs: [
    {
      text: 'Our assistant helps you create better content faster with simple prompts.',
    },
  ],
  stats: [
    { label: 'Integrations', value: '90+' },
    { label: 'Productivity boost', value: '56%' },
    { label: 'Customer support', value: '24/7' },
    { label: 'Active users', value: '10k+' },
  ],
  title: 'Create content with AI assistance.',
}

export const contentListDemoContent: ContentListDemoContent = {
  eyebrow: 'What you get',
  items: [
    {
      description: 'Spark creativity with AI-powered content suggestions and inspiration.',
      term: 'Generate ideas',
    },
    {
      description: 'Enhance your text with smart editing suggestions and style refinements.',
      term: 'Improve writing',
    },
    {
      description: 'Create visually appealing layouts that capture your audience’s attention.',
      term: 'Design layouts',
    },
  ],
  title: 'Create content with AI assistance.',
}

export const contentListColumnsDemoContent: ContentListDemoContent = {
  eyebrow: 'What you get',
  items: [
    {
      description: 'Spark creativity with AI-powered content suggestions and inspiration.',
      term: 'Generate ideas',
    },
    {
      description: 'Enhance your text with smart editing suggestions and style refinements.',
      term: 'Improve writing',
    },
  ],
  title: 'Create content with AI assistance.',
}

export const contentListIconsDemoContent: ContentListDemoContent = {
  description: 'Our assistant helps you create better content faster with simple prompts.',
  eyebrow: 'What you get',
  items: [
    {
      description: 'Spark creativity with AI-powered content suggestions and inspiration.',
      icon: 'sparkles',
      term: 'Generate ideas',
    },
    {
      description: 'Enhance your text with smart editing suggestions and style refinements.',
      icon: 'zap',
      term: 'Improve writing',
    },
    {
      description: 'Create visually appealing layouts that capture your audience’s attention.',
      icon: 'gauge',
      term: 'Design layouts',
    },
  ],
  title: 'Create content with AI assistance.',
}

/* The whole Integration family (grid, cluster, split, connect, orbit, list,
   marquee, testimonial) renders from one demo-content shape: the shared
   heading + optional subtext, an optional generic per-item blurb for the
   card/list variants, an optional CTA link, and an optional testimonial for
   the testimonial variant. The logos themselves are presentational and
   backend-free, so the twins pull invented monochrome marks from
   `@/components/site/demos/DemoLogos` rather than carrying logo data here. */
export type IntegrationDemoContent = {
  heading: string
  itemDescription?: string
  links?: { link: DemoLinkData }[]
  subtext?: string
  testimonial?: { author: string; quote: string; role?: string }
}

export const integrationGridDemoContent: IntegrationDemoContent = {
  heading: 'Connect Acme to the tools you already run.',
  itemDescription:
    'Two-way sync that keeps usage, billing, and events flowing without a line of glue code.',
  subtext: 'Native integrations across analytics, billing, and messaging — wired in an afternoon.',
}

export const integrationClusterDemoContent: IntegrationDemoContent = {
  heading: 'Plug Acme into your stack.',
  links: [{ link: { appearance: 'outline', label: 'Browse integrations' } }],
  subtext: 'A growing catalog of native connections, with your workspace at the center.',
}

export const integrationSplitDemoContent: IntegrationDemoContent = {
  heading: 'One hub for every integration.',
  links: [{ link: { appearance: 'default', label: 'Browse integrations' } }],
  subtext:
    'Connect the tools your team lives in and let Acme keep them in sync, automatically.',
}

export const integrationConnectDemoContent: IntegrationDemoContent = {
  heading: 'Everything routes through Acme.',
  subtext: 'Your data flows out to every connected tool and back again, in real time.',
}

export const integrationOrbitDemoContent: IntegrationDemoContent = {
  heading: 'An ecosystem in orbit.',
  subtext: 'Hover to see the integrations that revolve around your Acme workspace.',
}

export const integrationListDemoContent: IntegrationDemoContent = {
  heading: 'Add an integration in one click.',
  itemDescription: 'Connect once and keep usage, billing, and events in sync automatically.',
  subtext: 'Browse the catalog and switch on the connections your team needs.',
}

export const integrationMarqueeDemoContent: IntegrationDemoContent = {
  heading: 'Works with the tools you already use.',
  subtext: 'A growing catalog of native integrations across your whole stack.',
}

export const integrationTestimonialDemoContent: IntegrationDemoContent = {
  heading: 'Integrate with your favorite tools.',
  itemDescription: 'Native two-way sync, no glue code required.',
  subtext: 'Connect seamlessly with the platforms and services that power your workflow.',
  testimonial: {
    author: 'Jordan Lee',
    quote:
      'We had Acme talking to our warehouse, billing, and Slack in a single afternoon — the integrations just worked.',
    role: 'Head of Platform, Northwind',
  },
}

export const callToActionCenteredDemoContent: CtaDemoContent = {
  description:
    'Ship customer-facing dashboards in an afternoon — no infrastructure to manage and nothing to wire by hand.',
  links: [
    { link: { appearance: 'default', label: 'Get started' } },
    { link: { appearance: 'outline', label: 'Book a demo' } },
  ],
  title: 'Start building with Acme today.',
}

export const callToActionBoxedDemoContent: CtaDemoContent = {
  description:
    'A framed, high-emphasis call to action for the end of a landing page — the box draws the eye to the next step.',
  links: [
    { link: { appearance: 'default', label: 'Create an account' } },
    { link: { appearance: 'outline', label: 'Talk to sales' } },
  ],
  title: 'Bring your team to Acme.',
}

export const callToActionSignupDemoContent: CtaDemoContent = {
  description:
    'Join the Acme newsletter for product updates, changelog highlights, and the occasional deep dive.',
  emailPlaceholder: 'Your email address',
  submitLabel: 'Subscribe',
  title: 'Stay in the loop.',
}

/* The Team family (roster, grid) renders from one demo-content shape: the shared
   eyebrow/title plus the grouped department roster (team-roster) or the flat
   member grid (team-grid) a given variant uses. Member avatars are backend-free
   on the landing/docs previews, so the twins render presentational placeholders
   rather than real images — only names and roles carry into the preview. */
export type TeamMemberDemo = { name: string; role: string }

export type TeamSectionDemoContent = {
  description?: string
  eyebrow?: string
  groups?: { label: string; members: TeamMemberDemo[] }[]
  members?: TeamMemberDemo[]
  title: string
}

export const teamRosterDemoContent: TeamSectionDemoContent = {
  eyebrow: 'Our team',
  groups: [
    {
      label: 'Leadership',
      members: [
        { name: 'Ada Lovelace', role: 'Co-Founder & CEO' },
        { name: 'Alan Turing', role: 'Co-Founder & CTO' },
        { name: 'Grace Hopper', role: 'Chief Operating Officer' },
        { name: 'Katherine Johnson', role: 'VP of Product' },
      ],
    },
    {
      label: 'Engineering',
      members: [
        { name: 'Linus Torvalds', role: 'Principal Engineer' },
        { name: 'Margaret Hamilton', role: 'Staff Engineer' },
        { name: 'Dennis Ritchie', role: 'Backend Lead' },
        { name: 'Barbara Liskov', role: 'Platform Engineer' },
      ],
    },
  ],
  title: 'The people building Acme.',
}

export const teamGridDemoContent: TeamSectionDemoContent = {
  description:
    'A small, senior team shipping the platform that product teams open every day.',
  eyebrow: 'Team',
  members: [
    { name: 'Henry Lee', role: 'UX Engineer' },
    { name: 'Isabella Garcia', role: 'Sales Manager' },
    { name: 'Liam Brown', role: 'Founder & CEO' },
    { name: 'Olivia Miller', role: 'Visual Designer' },
    { name: 'Ava Williams', role: 'Interaction Designer' },
    { name: 'Elijah Jones', role: 'Co-Founder & CTO' },
  ],
  title: 'Our dream team.',
}

export type FaqIconKey = 'clock' | 'credit-card' | 'truck' | 'globe' | 'package' | 'help-circle'

export type FaqItemDemo = { answer: string; question: string }

/* The plain FAQ variants (faq-accordion, faq-split, faq-card, faq-grid) render
   from one demo-content shape: the shared heading, question/answer items, and
   an optional CTA link (the grid variant passes none). */
export type FaqDemoContent = {
  description?: string
  eyebrow?: string
  items: FaqItemDemo[]
  links: { link: DemoLinkData }[]
  title: string
}

/* faq-icons tags each question with an icon from the faqIcons allowlist. */
export type FaqIconsDemoContent = {
  description?: string
  eyebrow?: string
  items: (FaqItemDemo & { icon?: FaqIconKey })[]
  title: string
}

/* faq-grouped buckets questions under titled, icon-tagged categories. */
export type FaqGroupedDemoContent = {
  description?: string
  eyebrow?: string
  groups: { icon?: FaqIconKey; items: FaqItemDemo[]; title: string }[]
  title: string
}

export const faqAccordionDemoContent: FaqDemoContent = {
  description: 'Short answers to what teams ask before rolling Acme out company-wide.',
  eyebrow: 'Support',
  items: [
    {
      answer:
        'Most teams connect their first data source and ship a dashboard in an afternoon — there is no infrastructure to provision.',
      question: 'How long does setup take?',
    },
    {
      answer:
        'Postgres, BigQuery, Snowflake, and any warehouse that speaks SQL, plus a REST ingestion endpoint for everything else.',
      question: 'Which data sources are supported?',
    },
    {
      answer:
        'Yes — every dashboard ships with a signed embed snippet and row-level access controls.',
      question: 'Can I embed dashboards in my own app?',
    },
    {
      answer:
        'Start on the free tier with no credit card; upgrade once you outgrow the included usage.',
      question: 'Is there a free trial?',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Contact support' } }],
  title: 'Frequently asked questions',
}

export const faqSplitDemoContent: FaqDemoContent = {
  description: 'Billing, security, and onboarding — answered before you have to ask.',
  eyebrow: 'FAQs',
  items: [
    {
      answer:
        'Upgrade or downgrade at any time; changes take effect immediately and we prorate the difference.',
      question: 'Can I change my plan later?',
    },
    {
      answer: 'All major credit cards, PayPal, and invoicing for annual enterprise plans.',
      question: 'What payment methods do you accept?',
    },
    {
      answer:
        'We are SOC 2 Type II certified, encrypt data in transit and at rest, and never train on your data.',
      question: 'How do you handle security?',
    },
    {
      answer:
        'Every workspace gets SSO, audit logs, and role-based access so the right people see the right surfaces.',
      question: 'Do you support single sign-on?',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Talk to sales' } }],
  title: 'Questions, answered',
}

export const faqCardDemoContent: FaqDemoContent = {
  description: 'The essentials on trials, billing, and support before you commit.',
  eyebrow: 'Support',
  items: [
    {
      answer:
        'Start with a 14-day free trial with full access to every feature. No credit card required.',
      question: 'How does the free trial work?',
    },
    {
      answer: 'No setup fees and no hidden costs — you only ever pay for your subscription plan.',
      question: 'Is there a setup fee?',
    },
    {
      answer:
        'We offer a 30-day money-back guarantee. Contact us within 30 days for a full refund.',
      question: 'Do you offer refunds?',
    },
    {
      answer:
        'Cancel anytime from your account settings; access continues until the billing period ends.',
      question: 'How do I cancel my subscription?',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Contact support' } }],
  title: 'Frequently asked questions',
}

export const faqGridDemoContent: FaqDemoContent = {
  description: 'Everything you need to know about the Acme platform, at a glance.',
  eyebrow: 'Help center',
  items: [
    {
      answer:
        'Click Sign up and follow the prompts. You can register with email or connect your Google account.',
      question: 'How do I create an account?',
    },
    {
      answer: 'Yes — a 14-day free trial with full access to all features, no credit card required.',
      question: 'Is there a free trial?',
    },
    {
      answer: 'All major credit cards, PayPal, and bank transfers for annual plans.',
      question: 'What payment methods do you accept?',
    },
    {
      answer: 'We offer a 30-day money-back guarantee — contact support within 30 days for a refund.',
      question: 'Can I get a refund?',
    },
    {
      answer: 'Upgrade, downgrade, or cancel at any time from your billing settings.',
      question: 'Can I change my plan?',
    },
    {
      answer:
        'Our team is available by email and live chat, with priority support on paid plans.',
      question: 'How do I reach support?',
    },
  ],
  links: [],
  title: 'Common questions',
}

export const faqIconsDemoContent: FaqIconsDemoContent = {
  description: 'Quick answers, grouped by the part of Acme you are asking about.',
  eyebrow: 'Support',
  items: [
    {
      answer:
        'Our team is available Monday to Friday, 9:00 AM to 8:00 PM EST, and weekends from 10:00 AM to 6:00 PM EST.',
      icon: 'clock',
      question: 'What are your support hours?',
    },
    {
      answer:
        'Subscriptions are charged to your default payment method on the same day each cycle; manage everything from the billing dashboard.',
      icon: 'credit-card',
      question: 'How does billing work?',
    },
    {
      answer:
        'Yes — guided onboarding and white-glove migration are available for teams that need to move fast.',
      icon: 'truck',
      question: 'Can I expedite onboarding?',
    },
    {
      answer:
        'We offer multilingual support in English, Spanish, French, German, and Japanese during regional business hours.',
      icon: 'globe',
      question: 'Do you offer localized support?',
    },
  ],
  title: 'Frequently asked questions',
}

export const faqGroupedDemoContent: FaqGroupedDemoContent = {
  description: 'Browse answers by topic, or reach out if you still need a hand.',
  eyebrow: 'Help center',
  groups: [
    {
      icon: 'package',
      items: [
        {
          answer: 'Click Sign up, then connect your first data source — most teams ship in an afternoon.',
          question: 'How do I get started?',
        },
        {
          answer: 'Yes, a 14-day free trial with full access to every feature and no credit card.',
          question: 'Is there a free trial?',
        },
      ],
      title: 'Getting started',
    },
    {
      icon: 'credit-card',
      items: [
        {
          answer: 'All major credit cards, PayPal, and bank transfers for annual plans.',
          question: 'What payment methods do you accept?',
        },
        {
          answer: 'We offer a 30-day money-back guarantee — contact support within 30 days.',
          question: 'Can I get a refund?',
        },
      ],
      title: 'Billing',
    },
    {
      icon: 'help-circle',
      items: [
        {
          answer: 'Email and live chat are available to every plan, with priority routing on paid tiers.',
          question: 'How do I reach support?',
        },
        {
          answer: 'We are SOC 2 Type II certified and encrypt your data in transit and at rest.',
          question: 'How is my data protected?',
        },
      ],
      title: 'Support',
    },
  ],
  title: 'How can we help?',
}

/* The whole Comparator family (table, grid, stack) renders from one set of demo
   shapes: an optional heading plus plans and either a shared feature matrix
   (table/grid, values index-aligned to plans) or per-plan checklists (stack).
   A cell with `included` shows a check, a `label`/`value` shows text, and an
   empty cell shows a dash. */
export type ComparatorPlanDemo = {
  badge?: string
  highlighted?: boolean
  links?: { link: DemoLinkData }[]
  name: string
  period?: string
  price?: string
}

export type ComparatorCellDemo = {
  included?: boolean
  label?: string
}

export type ComparatorTableDemoContent = {
  description?: string
  features: { feature: string; groupLabel?: string; values: ComparatorCellDemo[] }[]
  plans: ComparatorPlanDemo[]
  title?: string
}

export type ComparatorGridDemoContent = {
  description?: string
  features: { feature: string; values: ComparatorCellDemo[] }[]
  plans: ComparatorPlanDemo[]
  title?: string
}

export type ComparatorStackPlanDemo = ComparatorPlanDemo & {
  description?: string
  features: { included?: boolean; label: string; value?: string }[]
}

export type ComparatorStackDemoContent = {
  description?: string
  plans: ComparatorStackPlanDemo[]
  title?: string
}

export const comparatorTableDemoContent: ComparatorTableDemoContent = {
  description:
    'A full feature matrix so teams can see exactly what each tier unlocks before they commit.',
  features: [
    { feature: 'Projects', groupLabel: 'Usage', values: [{ label: '3' }, { label: 'Unlimited' }, { label: 'Unlimited' }] },
    { feature: 'API calls', values: [{ label: '10K / mo' }, { label: '1M / mo' }, { label: 'Custom' }] },
    { feature: 'Team members', values: [{ label: '1' }, { label: '10' }, { label: 'Unlimited' }] },
    { feature: 'Analytics dashboard', groupLabel: 'Capabilities', values: [{ included: true }, { included: true }, { included: true }] },
    { feature: 'Custom webhooks', values: [{}, { included: true }, { included: true }] },
    { feature: 'SSO / SAML', values: [{}, {}, { included: true }] },
    { feature: 'Priority support', values: [{}, { included: true }, { included: true }] },
  ],
  plans: [
    { links: [{ link: { appearance: 'outline', label: 'Get started' } }], name: 'Free' },
    { badge: 'Most popular', highlighted: true, links: [{ link: { appearance: 'default', label: 'Start free trial' } }], name: 'Pro' },
    { links: [{ link: { appearance: 'outline', label: 'Talk to sales' } }], name: 'Scale' },
  ],
  title: 'Compare every plan',
}

export const comparatorGridDemoContent: ComparatorGridDemoContent = {
  description: 'Compare plans side by side and pick the tier that fits your team today.',
  features: [
    { feature: 'Integrations', values: [{ label: '5' }, { label: 'Unlimited' }, { label: 'Unlimited' }] },
    { feature: 'API calls', values: [{ label: '10K / mo' }, { label: '100K / mo' }, { label: '1M / mo' }] },
    { feature: 'Team members', values: [{ label: '1' }, { label: '5' }, { label: 'Unlimited' }] },
    { feature: 'Analytics', values: [{ included: true }, { included: true }, { included: true }] },
    { feature: 'Custom webhooks', values: [{}, { included: true }, { included: true }] },
    { feature: 'SSO / SAML', values: [{}, {}, { included: true }] },
  ],
  plans: [
    { links: [{ link: { appearance: 'outline', label: 'Get started' } }], name: 'Starter', period: '/mo', price: '$0' },
    { badge: 'Most popular', highlighted: true, links: [{ link: { appearance: 'default', label: 'Start free trial' } }], name: 'Pro', period: '/mo', price: '$29' },
    { links: [{ link: { appearance: 'outline', label: 'Start free trial' } }], name: 'Team', period: '/mo', price: '$79' },
  ],
  title: 'Pricing that scales with you',
}

export const comparatorStackDemoContent: ComparatorStackDemoContent = {
  description: "Start free and scale as you grow — every plan lists exactly what's included.",
  plans: [
    {
      description: 'For individuals and small projects.',
      features: [
        { label: 'Integrations', value: '3' },
        { label: 'API calls', value: '1,000 / mo' },
        { included: false, label: 'Analytics' },
        { included: false, label: 'Custom webhooks' },
      ],
      links: [{ link: { appearance: 'outline', label: 'Get started' } }],
      name: 'Starter',
      period: '/mo',
      price: '$0',
    },
    {
      badge: 'Most popular',
      description: 'For growing teams.',
      features: [
        { label: 'Integrations', value: 'Unlimited' },
        { label: 'API calls', value: '100K / mo' },
        { included: true, label: 'Analytics' },
        { included: true, label: 'Custom webhooks' },
      ],
      highlighted: true,
      links: [{ link: { appearance: 'default', label: 'Start free trial' } }],
      name: 'Pro',
      period: '/mo',
      price: '$29',
    },
    {
      description: 'For large organizations.',
      features: [
        { label: 'Integrations', value: 'Unlimited' },
        { label: 'API calls', value: 'Unlimited' },
        { included: true, label: 'Analytics' },
        { included: true, label: 'SSO / SAML' },
      ],
      links: [{ link: { appearance: 'outline', label: 'Contact sales' } }],
      name: 'Enterprise',
      price: 'Custom',
    },
  ],
  title: 'Choose your plan',
}

/* The whole Testimonials family (quote, spotlight, grid, rating, bento, wall)
   renders from one demo-content shape: the shared eyebrow/title/description
   heading plus either a single featured `testimonial` or an `items` array of
   quotes. Avatars and per-card logos are Media uploads, backend-free on the
   landing/docs previews, so the twins render presentational placeholders (a
   monogram or a bg-muted block) rather than carrying real image data. */
export type TestimonialDemoItem = {
  author: string
  featured?: boolean
  quote: string
  rating?: number
  role?: string
}

export type TestimonialDemoContent = {
  description?: string
  eyebrow?: string
  items?: TestimonialDemoItem[]
  testimonial?: TestimonialDemoItem
  title?: string
}

export const testimonialsQuoteDemoContent: TestimonialDemoContent = {
  testimonial: {
    author: 'Théa Marchetti',
    quote:
      'Acme has been like unlocking a design superpower — the perfect fusion of simplicity and versatility. We shipped our customer dashboards weeks ahead of schedule.',
    role: 'VP Engineering, Northwind',
  },
}

export const testimonialsSpotlightDemoContent: TestimonialDemoContent = {
  testimonial: {
    author: 'Marcus Webb',
    quote:
      'We replaced three internal tools with Acme in a single quarter. The team ships faster, and our customers finally get the dashboards they kept asking for.',
    role: 'Founder & CEO, Lattice',
  },
}

export const testimonialsGridDemoContent: TestimonialDemoContent = {
  description:
    'Read why product teams choose Acme for the reporting work that used to take a sprint.',
  eyebrow: 'Loved by teams',
  items: [
    {
      author: 'Henry Lee',
      quote:
        'Using Acme has been like unlocking a secret design superpower. The flexibility to customize every surface is incredible.',
      role: 'UX Engineer',
    },
    {
      author: 'Isabella Garcia',
      quote:
        'Acme transformed the way we ship customer dashboards. What used to take a sprint now takes an afternoon.',
      role: 'Product Lead',
    },
    {
      author: 'Liam Brown',
      quote:
        'The component library accelerated our entire workflow. Acme is a genuine game-changer for our team.',
      role: 'Founder & CEO',
    },
  ],
  title: 'What our customers say.',
}

export const testimonialsRatingDemoContent: TestimonialDemoContent = {
  items: [
    {
      author: 'Olivia Miller',
      quote:
        'Acme is really extraordinary and practical — no need to break your head. A real gold mine for product teams.',
      rating: 5,
      role: 'Visual Designer',
    },
    {
      author: 'Ava Williams',
      quote:
        'Acme transformed the way I develop web applications. The flexibility to customize every aspect is amazing.',
      rating: 4,
      role: 'Frontend Dev',
    },
    {
      author: 'Elijah Jones',
      quote:
        'The extensive collection of blocks has significantly accelerated my workflow. Highly recommended.',
      rating: 5,
      role: 'Co-Founder & CTO',
    },
  ],
  title: 'Rated by the people who ship on it.',
}

export const testimonialsBentoDemoContent: TestimonialDemoContent = {
  eyebrow: 'Wall of proof',
  items: [
    {
      author: 'Shantanu Rao',
      featured: true,
      quote:
        'Acme has transformed the way our company develops web applications. The extensive collection of blocks and templates has significantly accelerated our workflow, and the freedom to customize every surface lets us create experiences that feel genuinely our own. Acme is a game-changer for modern product teams.',
      role: 'Staff Engineer',
    },
    {
      author: 'Jonathan Yombo',
      quote: 'Acme is really extraordinary and very practical. A real gold mine.',
      role: 'Software Engineer',
    },
    {
      author: 'Yucel Faruksahan',
      quote: 'Great work on Acme. One of the best platforms I have seen so far.',
      role: 'Creator, Tailkits',
    },
    {
      author: 'Rodrigo Aguilar',
      quote: 'I love Acme. The blocks are well-structured, simple to use, and beautifully designed.',
      role: 'Creator, TailwindAwesome',
    },
  ],
  title: 'Built by makers, loved by thousands of developers.',
}

export const testimonialsWallDemoContent: TestimonialDemoContent = {
  description:
    'Hundreds of teams ship on Acme every day. Here is what a few of them told us.',
  items: [
    {
      author: 'Jonathan Yombo',
      quote:
        'Acme is really extraordinary and very practical, no need to break your head. A real gold mine.',
      role: 'Software Engineer',
    },
    {
      author: 'Yves Kalume',
      quote: 'With no experience in web design I redesigned my entire site in a few minutes thanks to Acme.',
      role: 'GDE — Android',
    },
    {
      author: 'Oketa Fred',
      quote: 'I absolutely love Acme! The blocks are beautifully designed and easy to use.',
      role: 'Fullstack Developer',
    },
    {
      author: 'Zeki',
      quote: 'Using Acme has been like unlocking a secret design superpower — stunning and user-friendly.',
      role: 'Founder, ChatExtend',
    },
    {
      author: 'Joseph Kitheka',
      quote: 'Acme has transformed the way I develop web applications. The flexibility is unmatched.',
      role: 'Fullstack Developer',
    },
    {
      author: 'Khatab Wedaa',
      quote: 'Acme is elegant, clean, and responsive — very helpful to start fast with a project.',
      role: 'Creator, MerakiUI',
    },
    {
      author: 'Rodrigo Aguilar',
      quote: 'I love Acme. The blocks are well-structured, simple to use, and beautifully designed.',
      role: 'Creator, TailwindAwesome',
    },
    {
      author: 'Yucel Faruksahan',
      quote: 'Great work on Acme. One of the best platforms I have seen so far.',
      role: 'Creator, Tailkits',
    },
    {
      author: 'Shekinah Tshiokufila',
      quote: 'Acme is redefining the standard of web design — an easy, efficient way to ship beauty.',
      role: 'Senior Software Engineer',
    },
  ],
  title: 'Loved by the community.',
}
