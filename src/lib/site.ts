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
export const blogTitle = 'Payload CMS block and installer guides'
export const blogDescription =
  'Practical Payload CMS v3 guides for installing reusable blocks, wiring collections and renderers, generating types, and fixing blocks that do not render.'
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
export const homeMetadataTitle = 'Payload Components: Wired Payload CMS Blocks in One Command'
export const homeMetadataDescription =
  'Install reusable Payload CMS blocks with one command, including collection config, render maps, generated types, and the admin import map for Next.js projects.'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroEyebrow = 'Open-source Payload block registry'

/* The H1 renders primary + accent as one accessible name; the e2e H1
   assertion consumes the concatenated heroHeadline. The OG card renders the
   two parts separately so it can set the accent in Instrument Serif italic
   (see src/app/opengraph-image.tsx). */
export const heroHeadlinePrimary = 'Install Payload blocks'
export const heroHeadlineAccent = 'wired, not pasted.'
export const heroHeadline = `${heroHeadlinePrimary} ${heroHeadlineAccent}`

export const heroSubheadline =
  'For Payload CMS developers, one command installs the block, wires it into Payload, and lands a reviewable git diff.'

export const heroGuideLink = {
  href: '/docs/installation',
  label: 'Read the install guide',
} as const

export const heroTertiaryLinks = [{ href: '/components', label: 'Browse the components' }] as const

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
  faq: { heading: 'Questions, answered straight.', id: 'faq' },
  components: { heading: 'The catalog, rendered live.', id: 'components' },
  wiring: { heading: "A block isn't live until it's wired.", id: 'wiring' },
  workflow: { heading: 'From catalog to commit in three moves.', id: 'workflow' },
} as const

/* ------------------------------------------------------------------ */
/* Stack band — what components install into. No customer logos; the    */
/* honest "works with" row is the supported stack.                      */
/* ------------------------------------------------------------------ */

export const stackBandLede = 'Installs into the stack you already run'

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

export const workflowIntro =
  'No scaffolds, no lock-in — plain source plus two scoped patches you can read.'

export const workflowSteps = [
  {
    command: '/components',
    description: 'Fields, files, and patches — before you run anything.',
    title: 'Read the contract',
  },
  {
    command: 'npx payload-components add hero-basic',
    description: 'The CLI checks your project, then wires it in one pass.',
    title: 'Run one command',
  },
  {
    command: 'git diff --stat',
    description: 'Source, two patches, regenerated types — reviewed like any PR.',
    title: 'Commit a working block',
  },
] as const

/* ------------------------------------------------------------------ */
/* Wiring ledger — the differentiator as a verifiable artifact table.  */
/* Rows mirror the manifest contract: recovery.patchedFiles plus the   */
/* generate:types / generate:importmap postInstall steps.              */
/* ------------------------------------------------------------------ */

export const wiringIntro =
  'Copying the files is the easy part — the four edits after are where every block, every repo, loses the day.'

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
  body: 'I built payload-components because installing a Payload block was never the copy-paste — it was the four edits after. The CLI exists so the second project, and the tenth, get that wiring for free. Read the installer source before you trust it; shipping it MIT is the point.',
  href: 'https://github.com/Ducksss',
  name: 'Ducksss',
  role: 'Maintainer, Payload Components',
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

export const faqIntro =
  'The short version of the docs. Every answer links back to something you can verify in the repository.'

export const faqEntries = [
  {
    answer: `Yes — and built to stay that way. The registry, the CLI, all ${componentEntries.length} installable components, and this site are one MIT-licensed repository: no pricing, no license key, no gated tier. Payload Components is community-first by design — the catalog grows from real installs and contributions, not a paid roadmap.`,
    question: 'Is Payload Components free?',
  },
  {
    answer:
      'In Payload, a block is a composable page-builder field — a reusable content section (hero, feature grid, CTA) editors stack to lay out a page. Payload Components ships pre-built blocks plus the wiring that makes them live, so a block is not just copied in: it is registered in your Pages collection, mapped in your renderer, typed, and added to the admin import map.',
    href: '/docs/payload-blocks',
    linkLabel: 'Read the Payload blocks guide',
    question: 'What is a Payload CMS block?',
  },
  {
    answer:
      'Install one with the CLI — `npx payload-components add hero-basic`. It copies the block source into your project and wires it end to end: registers it in your Pages collection, maps it in RenderBlocks, and regenerates your Payload types and admin import map — landing as one reviewable git diff. The same command adds any block in the catalog.',
    question: 'How do I add a hero block to Payload CMS?',
  },
  {
    answer:
      'Three things: component source files are copied in (block config, component, shared utilities), exactly two files are patched (your Pages collection and RenderBlocks.tsx — each component manifest declares them), and Payload regenerates its own output (payload-types.ts and the admin import map). All of it shows up as an ordinary git diff.',
    href: '/docs/installation',
    linkLabel: 'Read the installation guide',
    question: 'What exactly does an install change in my repo?',
  },
  {
    answer:
      'It converges. The CLI detects existing wiring and skips it — the real output is payload-components: "hero-basic" is already installed. Install state is recorded in .payload-components/state.json, so partial installs are visible and recoverable instead of silently broken.',
    question: 'What happens if I run the same install twice?',
  },
  {
    answer:
      'Payload v3 + Next.js 15/16 projects shaped like the official website starter — rendering layout blocks through src/blocks/RenderBlocks.tsx and registering page blocks in src/collections/Pages/index.ts. The CLI checks your project against the published support matrix before touching anything.',
    question: 'Which projects are supported today?',
  },
  {
    answer:
      'A plain shadcn install copies files and stops. Payload blocks only work after they are registered in your collection schema, mapped in your renderer, typed, and added to the admin import map. payload-components wraps the same registry delivery with exactly that wiring — that boundary is the product, and the wiring ledger above shows it row by row.',
    href: '/docs/shadcn-vs-payload-components',
    linkLabel: 'Read the full shadcn comparison',
    question: 'Why not just run npx shadcn add?',
  },
  {
    answer:
      'Deliberately. A component lands only when its source, manifest metadata, docs page, and installer test coverage ship together — half-wired blocks never reach the catalog. Propose the next component in a GitHub issue; the catalog grows from real installs.',
    question: 'How do new components get into the catalog?',
  },
] as const

/* ------------------------------------------------------------------ */
/* Community / CTA                                                     */
/* ------------------------------------------------------------------ */

export const communityIntro =
  'The registry, the CLI, the components, and this site are one MIT-licensed repository. Read the installer before you trust it — that is the point.'

/* The quiet replacement for placeholder testimonial slots. */
export const communityInvite = {
  href: githubIssuesUrl,
  label: 'Running it in a real repo? Open an issue — early installs get featured.',
} as const

/* ------------------------------------------------------------------ */
/* Catalog page                                                        */
/* ------------------------------------------------------------------ */

export const catalogTitle = `${componentEntries.length} Payload CMS components and typed blocks`
export const catalogDescription = `Browse all ${componentEntries.length} installable Payload CMS components across heroes, features, pricing, calls to action, integrations, testimonials, stats, FAQs, content, teams, embeds, and footers. One CLI command copies a block and wires its collection registration, renderer mapping, generated types, and admin import map.`
export const catalogMetadataTitle = `${componentEntries.length} Payload CMS Components & Blocks | Catalog`
export const catalogMetadataDescription =
  'Browse typed Payload CMS blocks. Run npx payload-components add <component> to wire one into your collection, renderer, generated types, and admin import map.'
export const catalogInstallationLinkLabel = 'See how one-command installation works'
export const catalogBlocksGuideLinkLabel = 'Follow a block from config to live page'
export const catalogTemplatesLinkLabel = 'Explore Payload CMS template concepts'

/* Composer: pick several blocks across families and get one install command.
   `payload-components add` takes any number of names, so the selection maps
   straight onto a single command rather than a list to run one at a time. */
export const composerTrayLabel = 'Selected components'
export const composerEmptyHint = 'Select components to build one install command'
export const composerClearLabel = 'Clear selection'
export const composerCopyLabel = 'Copy install command'
export const composerAddLabel = (slug: string) => `Add ${slug} to the install command`
export const composerRemoveLabel = (slug: string) => `Remove ${slug} from the install command`
export const composerInstallCommand = (slugs: readonly string[]) =>
  `npx payload-components add ${slugs.join(' ')}`

/* ------------------------------------------------------------------ */
/* Templates showcase                                                  */
/* ------------------------------------------------------------------ */

export const templatesEyebrow = 'Templates'
export const templatesTitle = 'Payload CMS template concepts, built from installable blocks'
export const templatesDescription =
  'Explore complete Payload CMS and Next.js site concepts across fifteen verticals — SaaS, agency, commerce, healthcare, restaurant, real estate, music and more. Open every page in a live preview, then trace each section back to a typed block you can install today.'
export const templatesMetadataTitle = 'Payload CMS Templates for Next.js | Concepts & Recipes'
export const templatesMetadataDescription =
  'Explore Payload CMS template concepts across fifteen verticals — SaaS, agency, commerce, healthcare, restaurant, real estate and more — preview every page and inspect the typed block recipe.'

export const templateCategoryLabels = {
  agency: 'Agency',
  civic: 'Civic',
  commerce: 'Commerce',
  education: 'Education',
  event: 'Event',
  fintech: 'Fintech',
  healthcare: 'Healthcare',
  marketplace: 'Marketplace',
  music: 'Music',
  nonprofit: 'Nonprofit',
  portfolio: 'Portfolio',
  'real-estate': 'Real estate',
  restaurant: 'Restaurant',
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
  heading: 'Templates are decided in the open',
  intro:
    'These concepts exist to answer one question with the community: should full-site templates become installable? The recipes, the fictional brands, and the installer RFC all live in the public repository — nothing gated, no email capture.',
  links: [
    {
      description: 'Read the showcase source — every recipe is plain data in the repository.',
      external: true,
      href: githubRepoUrl,
      label: 'Browse the repository',
    },
    {
      description:
        'Should the curated concept copy become seedable? The proposal, what already works, and the open questions.',
      external: true,
      href: `${githubRepoUrl}/blob/main/rfcs/0001-installable-templates.md`,
      label: 'Read the installer RFC',
    },
    {
      description:
        'Tell us which template, page, or block recipe you would actually ship — or propose a new one.',
      external: true,
      href: githubIssuesUrl,
      label: 'Open an issue',
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
    title: 'Documentation',
  },
  {
    description: 'Current components with exact commands and contracts.',
    href: '/components',
    title: 'Component catalog',
  },
  {
    description: 'What payload-components add wires, step by step.',
    href: '/docs/installation',
    title: 'Install workflow',
  },
] as const

export const communityLinks = [
  {
    description: 'Source, issues, roadmap, and contribution discussion live in the open.',
    href: githubRepoUrl,
    label: 'GitHub repository',
  },
  {
    description: 'Suggest a component, report install drift, or help shape the registry contract.',
    href: githubIssuesUrl,
    label: 'Open an issue',
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
      { href: '/components', label: 'Component catalog' },
      { href: '/templates', label: 'Template concepts' },
      { href: '/docs', label: 'Documentation' },
      { href: '/docs/installation', label: 'Install workflow' },
      { href: '/docs/architecture', label: 'Architecture' },
      { href: aiDiscoveryRoute, label: 'AI discovery' },
    ],
    title: 'Product',
  },
  {
    links: [
      ...footerComponentCategoryLinks,
      { accent: true, href: '/components', label: `All ${componentEntries.length} components` },
    ],
    title: 'Components',
  },
  {
    links: [
      { href: '/about', label: 'About' },
      { href: '/brand-guide', label: 'Brand Guide' },
      { external: true, href: githubRepoUrl, label: 'GitHub' },
      { external: true, href: githubIssuesUrl, label: 'Open an issue' },
      { external: true, href: `${githubRepoUrl}/releases`, label: 'Releases' },
      { href: feedRoute, label: 'Updates feed' },
      { href: '/docs/contributing', label: 'Contributing' },
      { href: '/privacy', label: 'Privacy' },
      { external: true, href: '/r/registry.json', label: 'Registry JSON' },
    ],
    title: 'Project',
  },
] as const
