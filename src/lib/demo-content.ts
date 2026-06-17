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
