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

export const heroBasicDemoContent: HeroBasicDemoContent = {
  description:
    'Acme gives product teams hosted dashboards, usage reports, and alerting on one platform — wired to your warehouse in an afternoon, no data team required.',
  eyebrow: 'Acme Cloud · New',
  links: [
    { link: { appearance: 'default', label: 'Start free trial' } },
    { link: { appearance: 'outline', label: 'Book a demo' } },
  ],
  proofItems: [
    { label: 'SOC 2 Type II' },
    { label: '99.99% uptime' },
    { label: 'Trusted by 4,000+ teams' },
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
