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

export type FeatureGridBasicDemoContent = {
  description?: string
  eyebrow?: string
  items: { description: string; title: string }[]
  links: { link: DemoLinkData }[]
  title: string
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
