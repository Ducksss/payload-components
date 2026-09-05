import englishMessages from '../../messages/en.json' with { type: 'json' }

import packageJson from '../../package.json' with { type: 'json' }

import {
  componentCategories,
  componentEntries,
  componentFamilies,
  componentsIntro,
  upcomingComponents,
} from './component-catalog'
import type { ComponentCategory } from './component-catalog'

export {
  componentCategories,
  componentEntries,
  componentFamilies,
  componentsIntro,
  upcomingComponents,
}
export type { ComponentCategory, ComponentEntry, UpcomingComponent } from './component-catalog'

const productionSiteUrl = 'https://www.payload-components.xyz'
const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || productionSiteUrl).replace(
  /\/+$/,
  '',
)

export const siteUrl =
  configuredSiteUrl === 'https://payload-components.xyz' ? productionSiteUrl : configuredSiteUrl
export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const githubIssuesUrl = `${githubRepoUrl}/issues`
export const githubContentBranch = process.env.NEXT_PUBLIC_GITHUB_CONTENT_BRANCH ?? 'dev'
export const docsRoute = '/docs'
export const docsImageRoute = '/og/docs'
export const docsContentRoute = '/llms.mdx/docs'
export const blogRoute = '/blog'
export const feedRoute = '/feed.xml'
export const aiDiscoveryRoute = '/docs/ai-discovery'
export const feedMetadataAlternates = {
  /* text/plain advertises /llms.txt to agents that only follow links from HTML —
     nothing else on the site references it (robots.ts's typed shape cannot). */
  types: { 'application/rss+xml': feedRoute, 'text/plain': '/llms.txt' },
} as const
export const blogTitle = englishMessages['Blog']['metadataTitle']
export const blogDescription = englishMessages['Blog']['metadataDescription']
export const cliVersion = packageJson.version
const heroBasicComponent = componentEntries.find(({ slug }) => slug === 'hero-basic')

if (!heroBasicComponent) {
  throw new Error('The generated component catalog is missing hero-basic.')
}

export const primaryInstallCommand = heroBasicComponent.command

export const pipelineStages = [
  {
    detail: 'The block config, component, and shared fields land in src/blocks/.',
    title: 'Copy the source',
  },
  {
    detail: 'Added to your Pages collection in src/collections/Pages/index.ts.',
    title: 'Register the block',
  },
  {
    detail: 'Wired into src/blocks/RenderBlocks.tsx so the page renders it.',
    title: 'Map the renderer',
  },
  { detail: 'payload generate:types updates src/payload-types.ts.', title: 'Regenerate types' },
  {
    detail: 'payload generate:importmap updates the admin import map.',
    title: 'Regenerate the import map',
  },
] as const

export const siteDescription =
  'Payload Components is an MIT registry and CLI that installs typed Payload CMS blocks into Payload v3 + Next.js projects with config, render maps, types, and import maps wired.'

/* Next 16 does not deep-merge page-level `openGraph` with the root layout's
   nested fields, so any page that declares its own drops siteName/locale (and
   the share card loses its "Payload Components" attribution). Spread this into
   every page-level openGraph declaration. */
export const siteOpenGraphDefaults = {
  locale: 'en_US',
  siteName: 'Payload Components',
} as const

/* The homepage lives in the same route segment as the root layout, so the
   '%s | Payload Components' title template never applies to it — whatever this
   string says is the whole <title>. It therefore has to carry the brand itself,
   or the one page most likely to rank for "payload components" is the only page
   on the site that never names it. Brand first, then the head term verbatim
   ("Payload CMS blocks"), then the differentiator, so the front of the string
   survives SERP truncation. */
export const homeMetadataTitle = englishMessages['HomeMetadata']['title']
export const homeMetadataDescription = englishMessages['HomeMetadata']['description']

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroEyebrow = englishMessages['Landing']['hero']['eyebrow']

/* The H1 renders primary + accent as one accessible name; the e2e H1
   assertion consumes the concatenated heroHeadline. The OG card renders the
   two parts separately so it can set the accent in Instrument Serif italic
   (see src/app/opengraph-image.tsx). */
export const heroHeadlinePrimary = englishMessages['Landing']['hero']['primary']
export const heroHeadlineAccent = englishMessages['Landing']['hero']['accent']
export const heroHeadline = `${heroHeadlinePrimary} ${heroHeadlineAccent}`

export const heroSubheadline = englishMessages['Landing']['hero']['subheadline']

export const heroGuideLink = {
  href: '/docs/installation',
  label: englishMessages['Landing']['hero']['guide'],
} as const

export const heroTertiaryLinks = [
  { href: '/components', label: englishMessages['Landing']['hero']['browse'] },
] as const

/**
 * Stylized replay of a real `payload-components add` run. Stage wording tracks
 * tools/payload-components/commands/add.ts and the component manifest contract —
 * update it if the installer stages change.
 */
export const terminalDemoLines = [
  { kind: 'command', text: 'npx payload-components add hero-basic' },
  { kind: 'info', text: 'payload-components: installing "hero-basic" into ./acme-site' },
  {
    kind: 'step',
    text: `resolved hero-basic@${heroBasicComponent.version} · payload-website-starter`,
  },
  { kind: 'step', text: 'copied 3 block source files into src/blocks/' },
  { kind: 'step', text: 'registered block in src/collections/Pages/index.ts' },
  { kind: 'step', text: 'wired render mapping in src/blocks/RenderBlocks.tsx' },
  { kind: 'step', text: 'ran payload generate:types' },
  { kind: 'step', text: 'ran payload generate:importmap' },
  { kind: 'step', text: 'recorded install state in .payload-components/state.json' },
  { kind: 'success', text: 'payload-components: installed "hero-basic" successfully.' },
] as const

export type TerminalLine = (typeof terminalDemoLines)[number]

/* Product-proof frame: files the install lands or regenerates. */
export const frameInstalledFiles = [
  'src/blocks/shared/heroFields.ts',
  'src/blocks/HeroBasic/config.ts',
  'src/blocks/HeroBasic/Component.tsx',
  'src/payload-types.ts — regenerated',
  'admin importMap.js — regenerated',
] as const

/* ------------------------------------------------------------------ */
/* Landing sections                                                    */
/* ------------------------------------------------------------------ */

export const landingSections = {
  community: { heading: 'Open source, end to end.', id: 'community' },
  faq: { heading: englishMessages['Landing']['faq']['heading'], id: 'faq' },
  components: { heading: englishMessages['Landing']['catalog']['heading'], id: 'components' },
  wiring: { heading: englishMessages['Landing']['wiring']['heading'], id: 'wiring' },
  workflow: { heading: englishMessages['Landing']['workflow']['heading'], id: 'workflow' },
} as const

/* ------------------------------------------------------------------ */
/* Stack band — what components install into. No customer logos; the    */
/* honest "works with" row is the supported stack.                      */
/* ------------------------------------------------------------------ */

export const stackBandLede = englishMessages['Landing']['stack']['lede']

export const stackItems = [
  { detail: 'v3', label: 'Payload CMS' },
  { detail: '15 / 16', label: 'Next.js' },
  { detail: 'registry', label: 'shadcn' },
  { detail: 'v4', label: 'Tailwind' },
  { detail: 'strict', label: 'TypeScript' },
] as const

export type StackItem = (typeof stackItems)[number]

/* Receipts strip — every line is verifiable in this repository. */
export const receipts = [
  { icon: 'scale', label: 'MIT licensed, end to end' },
  { icon: 'shield', label: 'Integration and e2e suites gate every PR' },
  { icon: 'moon', label: 'Nightly fresh-repo install smoke test' },
  { icon: 'layers', label: 'Payload 3 · Next 15 / 16' },
  { icon: 'braces', label: 'Open registry JSON at /r/registry.json' },
] as const

export const workflowIntro = englishMessages['Landing']['workflow']['intro']

export const workflowSteps = [
  {
    command: '/components',
    description: englishMessages['Landing']['workflow']['steps']['oneDescription'],
    title: englishMessages['Landing']['workflow']['steps']['oneTitle'],
  },
  {
    command: 'npx payload-components add hero-basic',
    description: englishMessages['Landing']['workflow']['steps']['twoDescription'],
    title: englishMessages['Landing']['workflow']['steps']['twoTitle'],
  },
  {
    command: 'git diff --stat',
    description: englishMessages['Landing']['workflow']['steps']['threeDescription'],
    title: englishMessages['Landing']['workflow']['steps']['threeTitle'],
  },
] as const

/* ------------------------------------------------------------------ */
/* Wiring ledger — the differentiator as a verifiable artifact table.  */
/* Rows mirror the manifest contract: recovery.patchedFiles plus the   */
/* generate:types / generate:importmap postInstall steps.              */
/* ------------------------------------------------------------------ */

export const wiringIntro = englishMessages['Landing']['wiring']['intro']

/* Caption under the boundary node map: which of the five a plain paste covers. */
export const wiringMapCaption =
  'A plain paste lands the block source. payload-components wires the other four.'

export const wiringLedger = {
  columns: {
    baseline: {
      command: 'npx shadcn add hero',
      summary: '1 of 5 artifacts. The rest is your TODO list.',
    },
    component: {
      command: 'npx payload-components add hero-basic',
      summary: '5 of 5 in one pass — reviewed as one git diff.',
    },
  },
  /* baseline: null means the artifact is left for you to wire by hand. */
  rows: [
    {
      artifact: 'Block source',
      baseline: 'copied',
      component: 'copied',
      path: 'src/blocks/{shared/heroFields.ts, HeroBasic/config.ts, HeroBasic/Component.tsx}',
    },
    {
      artifact: 'Collection schema',
      baseline: null,
      component: 'patched',
      path: 'src/collections/Pages/index.ts',
    },
    {
      artifact: 'Render mapping',
      baseline: null,
      component: 'patched',
      path: 'src/blocks/RenderBlocks.tsx',
    },
    {
      artifact: 'Generated types',
      baseline: null,
      component: 'regenerated',
      path: 'src/payload-types.ts',
    },
    {
      artifact: 'Admin import map',
      baseline: null,
      component: 'regenerated',
      path: 'admin importMap.js',
    },
  ],
  source: 'payload-components/manifests/hero-basic.json',
} as const

export type WiringLedgerRow = (typeof wiringLedger.rows)[number]

/* ------------------------------------------------------------------ */
/* Maintainer note                                                     */
/* ------------------------------------------------------------------ */

/* The one real voice on the site — the signed maintainer note that
   anchors the open-source close. No fabricated quotes: real installs
   get featured here only when they exist. */
export const maintainerNote = {
  body: englishMessages['Maintainer']['body'],
  href: 'https://github.com/Ducksss',
  name: 'Ducksss',
  role: englishMessages['Maintainer']['role'],
} as const

/* ------------------------------------------------------------------ */
/* Client work — the origin story, as evidence. Real freelance Payload */
/* sites the maintainer shipped BEFORE payload-components existed. Each one    */
/* shipped well AND paid the manual setup tax by hand — which is why    */
/* the registry exists. These are NOT payload-components installs: they */
/* predate it. The setupTax lines carry the honest                     */
/* narrative; taxStats numbers are the maintainer's own recollection,   */
/* deliberately rounded (approx: true → "~") — drafts to confirm, never */
/* audited precision. Consistent with the no-customer-logos stance.     */
/* ------------------------------------------------------------------ */

export const clientShowcaseEyebrow = 'Where this came from'

export const clientShowcaseHeading = 'The freelance work that paid the tax'

export const clientShowcaseIntro =
  'Real Payload sites I shipped for clients — before payload-components existed. Each one launched well. Each one also paid the same manual setup tax by hand: bespoke blocks rebuilt from scratch, types regenerated by hand, every surface re-proven before launch. These are not payload-components installs — they predate it. They are the reason it exists.'

export const showcaseSetupTaxLabel = 'Setup tax paid by hand'

export type ClientProject = {
  /* URL-safe id; also the screenshot filename at public/showcase/<slug>.jpg. */
  slug: string
  /* Display name shown in the card heading. */
  name: string
  /* Live, public URL — rendered in the frame's address bar and the visit link. */
  url: string
  /* Host shown in the address bar (no scheme) — stored to avoid runtime URL parsing. */
  displayUrl: string
  /* One factual line: what the site is. */
  summary: string
  /* The manual setup tax this site paid, by hand, pre-payload-components. Plain phrases. */
  setupTax: readonly string[]
  /* Optional scannable chips. approx: true renders a leading "~" so rounded
     recollections never read as audited stats. Omit rather than invent. */
  taxStats?: readonly { approx?: boolean; label: string; value: string }[]
  /* Factual alt text describing the site — never a marketing claim. */
  alt: string
}

export const clientProjects: readonly ClientProject[] = [
  {
    slug: 'symposium',
    name: 'Acacia AI — Symposium',
    url: 'https://symposium.acacia-ai.org/',
    displayUrl: 'symposium.acacia-ai.org',
    summary:
      'A four-week open AI sprint for students, run by Acacia AI — programme site with how-it-works, build tracks, partners, a journal, and registration.',
    setupTax: [
      'Every surface — how-it-works, build, partners, journal — hand-built as a Payload block',
      'Each block registered by hand in the Pages collection and RenderBlocks map',
      'payload generate:types and the admin import map re-run after every block',
      'Clicked through the admin and ran e2e before each deploy',
    ],
    taxStats: [
      { approx: true, label: 'bespoke blocks', value: '6' },
      { label: 'wired by hand', value: '100%' },
    ],
    alt: 'Screenshot of the Acacia AI Symposium homepage',
  },
  {
    slug: 'genium',
    name: 'Genium & Co',
    url: 'https://www.genium.sg/',
    displayUrl: 'www.genium.sg',
    summary:
      'A Singapore leadership-development consultancy — marketing site spanning services, ROI proof, a five-step process, programmes, team, and a consultation flow.',
    setupTax: [
      'A dozen marketing surfaces — services, ROI, process, programmes, team — hand-built as blocks',
      'Collection schema and RenderBlocks.tsx edited for every new block',
      'Types and admin import map regenerated by hand on every change',
      'Re-proved each surface in the admin before launch',
    ],
    taxStats: [
      { approx: true, label: 'bespoke blocks', value: '9' },
      { label: 'types regen', value: 'every change' },
    ],
    alt: 'Screenshot of the Genium & Co homepage',
  },
] as const

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqIntro = englishMessages['Landing']['faq']['intro']

export const faqEntries = [
  {
    answer: `Yes — and built to stay that way. The registry, the CLI, all ${componentEntries.length} installable components, and this site are one MIT-licensed repository: no pricing, no license key, no gated tier. Payload Components is community-first by design — the catalog grows from real installs and contributions, not a paid roadmap.`,
    question: englishMessages['FaqContent']['entries']['one']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['two']['answer'],
    href: '/docs/payload-blocks',
    linkLabel: englishMessages['FaqContent']['entries']['two']['link'],
    question: englishMessages['FaqContent']['entries']['two']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['three']['answer'],
    question: englishMessages['FaqContent']['entries']['three']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['four']['answer'],
    href: '/docs/installation',
    linkLabel: englishMessages['Templates']['installation'],
    question: englishMessages['FaqContent']['entries']['four']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['five']['answer'],
    question: englishMessages['FaqContent']['entries']['five']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['six']['answer'],
    question: englishMessages['FaqContent']['entries']['six']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['seven']['answer'],
    href: '/docs/shadcn-vs-payload-components',
    linkLabel: englishMessages['FaqContent']['entries']['seven']['link'],
    question: englishMessages['FaqContent']['entries']['seven']['question'],
  },
  {
    answer: englishMessages['FaqContent']['entries']['eight']['answer'],
    question: englishMessages['FaqContent']['entries']['eight']['question'],
  },
] as const

/* ------------------------------------------------------------------ */
/* Community / CTA                                                     */
/* ------------------------------------------------------------------ */

export const communityIntro = englishMessages['Landing']['community']['intro']

/* The quiet replacement for placeholder testimonial slots. */
export const communityInvite = {
  href: githubIssuesUrl,
  label: englishMessages['Landing']['community']['invite'],
} as const

/* ------------------------------------------------------------------ */
/* Catalog page                                                        */
/* ------------------------------------------------------------------ */

export const catalogTitle = `${componentEntries.length} Payload CMS components and typed blocks`
export const catalogDescription = `Browse all ${componentEntries.length} installable Payload CMS components across heroes, features, pricing, calls to action, integrations, testimonials, stats, FAQs, content, teams, embeds, and footers. One CLI command copies a block and wires its collection registration, renderer mapping, generated types, and admin import map.`
export const catalogMetadataTitle = `${componentEntries.length} Payload CMS Components & Blocks | Catalog`
export const catalogMetadataDescription =
  'Browse typed Payload CMS blocks. Run npx payload-components add <component> to wire one into your collection, renderer, generated types, and admin import map.'
export const catalogInstallationLinkLabel = englishMessages['Catalog']['installation']
export const catalogBlocksGuideLinkLabel = englishMessages['Catalog']['blocksGuide']
export const catalogTemplatesLinkLabel = englishMessages['Catalog']['templates']

/* Composer: pick several blocks across families and get one install command.
   `payload-components add` takes any number of names, so the selection maps
   straight onto a single command rather than a list to run one at a time. */
export const composerTrayLabel = englishMessages['CatalogBrowser']['tray']
export const composerEmptyHint = 'Select components to build one install command'
export const composerClearLabel = englishMessages['CatalogBrowser']['clear']
export const composerCopyLabel = englishMessages['Landing']['hero']['copy']
export const composerAddLabel = (slug: string) => `Add ${slug} to the install command`
export const composerRemoveLabel = (slug: string) => `Remove ${slug} from the install command`
export const composerInstallCommand = (slugs: readonly string[]) =>
  `npx payload-components add ${slugs.join(' ')}`

/* ------------------------------------------------------------------ */
/* Templates showcase                                                  */
/* ------------------------------------------------------------------ */

export const templatesEyebrow = englishMessages['Header']['nav']['templates']
export const templatesTitle = englishMessages['Templates']['title']
export const templatesDescription = englishMessages['Templates']['description']
export const templatesMetadataTitle = englishMessages['Templates']['metadataTitle']
export const templatesMetadataDescription = englishMessages['Templates']['metadataDescription']

export const templateCategoryLabels = {
  agency: 'Agency',
  civic: 'Civic',
  commerce: 'Commerce',
  education: englishMessages['Templates']['categories']['education'],
  event: 'Event',
  fintech: 'Fintech',
  healthcare: englishMessages['Templates']['categories']['healthcare'],
  marketplace: englishMessages['Templates']['categories']['marketplace'],
  music: 'Music',
  nonprofit: englishMessages['Templates']['categories']['nonprofit'],
  portfolio: englishMessages['Templates']['categories']['portfolio'],
  'real-estate': englishMessages['Templates']['categories']['real-estate'],
  restaurant: englishMessages['Templates']['categories']['restaurant'],
  saas: 'SaaS',
  trade: 'Trade',
} as const

/* Detail-page link back into the catalog: templates never gate anything — the
   recipe is the point, and every chip resolves to an installable block. */
export const templatesRecipeIntro =
  'Every section on every page is one block from the open registry, in render order. Each chip links to the block’s contract — fields, wiring, and the exact install command.'

/* Community close — templates grow the same way the catalog does: in the
   open, from real needs, with no waitlist or capture in between. */
export const templatesContribution = {
  heading: englishMessages['Templates']['communityHeading'],
  intro:
    'These concepts exist to answer one question with the community: should full-site templates become installable? The recipes, the fictional brands, and the installer RFC all live in the public repository — nothing gated, no email capture.',
  links: [
    {
      description: englishMessages['Templates']['contributionRepositoryDescription'],
      external: true,
      href: githubRepoUrl,
      label: englishMessages['Templates']['contributionRepository'],
    },
    {
      description:
        'Should the curated concept copy become seedable? The proposal, what already works, and the open questions.',
      external: true,
      href: `${githubRepoUrl}/blob/main/rfcs/0001-installable-templates.md`,
      label: englishMessages['Templates']['contributionRfc'],
    },
    {
      description:
        'Tell us which template, page, or block recipe you would actually ship — or propose a new one.',
      external: true,
      href: githubIssuesUrl,
      label: englishMessages['Landing']['community']['issue'],
    },
  ],
} as const

/* ------------------------------------------------------------------ */
/* Shared navigation surfaces                                          */
/* ------------------------------------------------------------------ */

export const surfaceLinks = [
  {
    description: 'Architecture, install behavior, support matrix, and component contracts.',
    href: '/docs',
    title: englishMessages['Common']['documentation'],
  },
  {
    description: 'Current components with exact commands and contracts.',
    href: '/components',
    title: englishMessages['Common']['componentCatalog'],
  },
  {
    description: 'What payload-components add wires, step by step.',
    href: '/docs/installation',
    title: englishMessages['Footer']['installWorkflow'],
  },
] as const

export const communityLinks = [
  {
    description: 'Source, issues, roadmap, and contribution discussion live in the open.',
    href: githubRepoUrl,
    label: englishMessages['Header']['github'],
  },
  {
    description: 'Suggest a component, report install drift, or help shape the registry contract.',
    href: githubIssuesUrl,
    label: englishMessages['Landing']['community']['issue'],
  },
] as const

/* Footer "Components" column: one link per category that actually ships components,
   in catalog display order, deep-linking to the filtered catalog. Mirrors
   CatalogFamilyTeaser's `/components?category=${key}` pattern — keeps the footer compact
   instead of dumping all 38 entries into one column. */
const footerComponentCategoryLinks = (Object.keys(componentCategories) as ComponentCategory[])
  .filter((key) => componentEntries.some((entry) => entry.category === key))
  .map((key) => ({
    href: `/components?category=${key}`,
    label: componentCategories[key].label,
  }))

export const footerColumns = [
  {
    links: [
      { href: '/components', label: englishMessages['Common']['componentCatalog'] },
      { href: '/templates', label: englishMessages['Footer']['templateConcepts'] },
      { href: '/docs', label: englishMessages['Common']['documentation'] },
      { href: '/docs/installation', label: englishMessages['Footer']['installWorkflow'] },
      { href: '/docs/architecture', label: englishMessages['Footer']['architecture'] },
      { href: aiDiscoveryRoute, label: englishMessages['Footer']['aiDiscovery'] },
    ],
    title: 'Product',
  },
  {
    links: [
      ...footerComponentCategoryLinks,
      { accent: true, href: '/components', label: `All ${componentEntries.length} components` },
    ],
    title: englishMessages['Header']['nav']['components'],
  },
  {
    links: [
      { href: '/about', label: 'About' },
      { href: '/brand-guide', label: englishMessages['Common']['brandGuide'] },
      { external: true, href: githubRepoUrl, label: 'GitHub' },
      {
        external: true,
        href: githubIssuesUrl,
        label: englishMessages['Landing']['community']['issue'],
      },
      { external: true, href: `${githubRepoUrl}/releases`, label: 'Releases' },
      { href: feedRoute, label: englishMessages['Footer']['updates'] },
      { href: '/docs/contributing', label: englishMessages['Footer']['contributing'] },
      { href: '/privacy', label: 'Privacy' },
      { external: true, href: '/r/registry.json', label: englishMessages['Footer']['registry'] },
    ],
    title: 'Project',
  },
] as const
