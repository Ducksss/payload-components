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

/* The whole Pricing family (cards, cards-muted, cards-cta, split, enterprise)
   renders from one demo-content shape: the shared eyebrow/title/description
   heading plus a list of plans. Each plan carries its price, optional period,
   blurb, a `featured` flag (the emerald highlight), a feature list, and one CTA.
   The enterprise variant renders a single plan; its trust logos are
   presentational and pulled from `@/components/site/demos/DemoLogos`. */
export type PricingPlanDemo = {
  description?: string
  featured?: boolean
  features: string[]
  link: DemoLinkData
  name: string
  period?: string
  price: string
}

export type PricingDemoContent = {
  description?: string
  eyebrow?: string
  plans: PricingPlanDemo[]
  title: string
}

const pricingPlansDemo: PricingPlanDemo[] = [
  {
    description: 'Per editor',
    features: ['Basic analytics dashboard', '5GB cloud storage', 'Email and chat support'],
    link: { appearance: 'outline', label: 'Get started' },
    name: 'Free',
    period: '/ mo',
    price: '$0',
  },
  {
    description: 'Per editor',
    featured: true,
    features: [
      'Everything in Free',
      'Unlimited cloud storage',
      'Priority support',
      'Custom reports',
      'Advanced security',
    ],
    link: { appearance: 'default', label: 'Get started' },
    name: 'Pro',
    period: '/ mo',
    price: '$19',
  },
  {
    description: 'Per editor',
    features: ['Everything in Pro', 'Dedicated success manager', 'SSO and audit logs'],
    link: { appearance: 'outline', label: 'Get started' },
    name: 'Startup',
    period: '/ mo',
    price: '$29',
  },
]

const pricingHeadingDemo = {
  description:
    'Start free and upgrade as you grow — every plan ships with the core platform and support.',
  eyebrow: 'Pricing',
  title: 'Pricing that scales with your team.',
}

export const pricingCardsDemoContent: PricingDemoContent = {
  ...pricingHeadingDemo,
  plans: pricingPlansDemo,
}

export const pricingCardsMutedDemoContent: PricingDemoContent = {
  ...pricingHeadingDemo,
  plans: pricingPlansDemo,
}

export const pricingCardsCtaDemoContent: PricingDemoContent = {
  ...pricingHeadingDemo,
  plans: pricingPlansDemo,
}

export const pricingSplitDemoContent: PricingDemoContent = {
  description: 'Start on the entry plan and unlock the full platform when you are ready.',
  eyebrow: 'Pricing',
  plans: [
    {
      description: 'Per editor',
      features: ['Basic analytics dashboard', '5GB cloud storage', 'Email and chat support'],
      link: { appearance: 'outline', label: 'Get started' },
      name: 'Free',
      period: '/ mo',
      price: '$0',
    },
    {
      description: 'Everything in Free, plus the tools growing teams need.',
      featured: true,
      features: [
        'Unlimited cloud storage',
        'Priority support',
        'Access to community forum',
        'Custom reports',
        'Advanced security',
        'Single sign-on',
      ],
      link: { appearance: 'default', label: 'Get started' },
      name: 'Pro',
      period: '/ mo',
      price: '$19',
    },
  ],
  title: 'Pricing that scales with your team.',
}

export const pricingEnterpriseDemoContent: PricingDemoContent = {
  description: 'One plan for teams of any size, with every feature included.',
  eyebrow: 'Enterprise',
  plans: [
    {
      description: 'For your company of any size',
      features: [
        'Security and compliance',
        'Unlimited storage',
        'Payments and search engine',
        'Access to all components',
      ],
      link: { appearance: 'default', label: 'Get started' },
      name: 'Suite Enterprise',
      period: '/ mo',
      price: '$234',
    },
  ],
  title: 'Start managing your company smarter today.',
}
