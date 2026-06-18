const productionSiteUrl = 'https://www.payload-components.xyz'
const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || productionSiteUrl).replace(/\/+$/, '')

export const siteUrl =
  configuredSiteUrl === 'https://payload-components.xyz' ? productionSiteUrl : configuredSiteUrl
export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const githubIssuesUrl = `${githubRepoUrl}/issues`
export const githubContentBranch = process.env.NEXT_PUBLIC_GITHUB_CONTENT_BRANCH ?? 'dev'
export const docsRoute = '/docs'
export const docsImageRoute = '/og/docs'
export const docsContentRoute = '/llms.mdx/docs'
export const primaryInstallCommand = 'npx payload-components add hero-basic'

export const siteDescription =
  'Payload Components is an MIT registry and CLI that installs typed Payload CMS blocks into Payload v3 + Next.js projects with config, render maps, types, and import maps wired.'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroEyebrow = 'Payload Components public alpha'

/* The H1 renders primary + accent as one accessible name; the e2e H1
   assertion consumes the concatenated heroHeadline. The OG card renders the
   two parts separately so it can set the accent in Instrument Serif italic
   (see src/app/opengraph-image.tsx). */
export const heroHeadlinePrimary = 'Install Payload blocks'
export const heroHeadlineAccent = 'wired, not pasted.'
export const heroHeadline = `${heroHeadlinePrimary} ${heroHeadlineAccent}`

export const heroSubheadline =
  'One command copies the block source, registers it in your Pages collection, maps the renderer, and regenerates types and the admin import map. The result is a reviewable git diff — not a checklist.'

export const heroPrimaryCta = { href: '/docs', label: 'Get started' } as const

export const heroTertiaryLinks = [
  { href: '/components', label: 'Browse the components' },
  { href: '#wiring', label: 'See what add actually wires' },
] as const

/**
 * Stylized replay of a real `payload-components add` run. Stage wording tracks
 * tools/payload-components/commands/add.ts and the component manifest contract —
 * update it if the installer stages change.
 */
export const terminalDemoLines = [
  { kind: 'command', text: 'npx payload-components add hero-basic' },
  { kind: 'info', text: 'payload-components: installing "hero-basic" into ./acme-site' },
  { kind: 'step', text: 'resolved hero-basic@0.1.0 · payload-website-starter' },
  { kind: 'step', text: 'copied src/blocks/{shared/heroFields.ts, HeroBasic/config.ts, HeroBasic/Component.tsx}' },
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
  tax: { heading: 'The paste was never the problem.', id: 'tax' },
  wiring: { heading: 'Copying files was never the hard part.', id: 'wiring' },
  workflow: { heading: 'From catalog to commit in three moves.', id: 'workflow' },
} as const

/* ------------------------------------------------------------------ */
/* Stack band — what components install into. No customer logos (alpha, open  */
/* source); the honest "works with" row is the supported stack.         */
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

/* ------------------------------------------------------------------ */
/* The tax — the problem the catalog answers. Mirrors /about's          */
/* unchecked grunt-work checklist; the wiring ledger below checks the    */
/* same five items off.                                                  */
/* ------------------------------------------------------------------ */

export const taxEyebrow = 'The grunt-work tax'
export const taxIntro =
  'Every Payload project needs the same surfaces — a hero, a feature grid, post cards. Copying the files is the easy part. A pasted block is dead until four more edits land, and proving them — every block, every repo — is where the week actually goes.'
export const taxChecklist = [
  'register the block in src/collections/Pages/index.ts',
  'map it in src/blocks/RenderBlocks.tsx',
  'run payload generate:types',
  'run payload generate:importmap',
  'prove it still works — integration tests, e2e, click through the admin',
] as const
export const taxKicker = 'One command pays that whole list down — and lands it as a diff you can review.'

/* Receipts strip — every line is verifiable in this repository. */
export const receipts = [
  { icon: 'scale', label: 'MIT licensed, end to end' },
  { icon: 'shield', label: 'Integration and e2e suites gate every PR' },
  { icon: 'moon', label: 'Nightly fresh-repo install smoke test' },
  { icon: 'layers', label: 'Payload 3 · Next 15 / 16' },
  { icon: 'braces', label: 'Open registry JSON at /r/registry.json' },
] as const


export const workflowIntro =
  'No scaffolds, no vendored framework, no lock-in. Components arrive as plain source plus two scoped patches you can read in the diff.'

export const workflowSteps = [
  {
    command: '/docs/components/hero-basic',
    description:
      'Every component documents its fields, the files it ships, the files it patches, and the targets it supports — before you run anything.',
    title: 'Read the contract',
  },
  {
    command: 'npx payload-components add hero-basic',
    description:
      'The CLI verifies your project shape against the support matrix, copies source, registers the block, and regenerates Payload output in one pass.',
    title: 'Run one command',
  },
  {
    command: 'git diff --stat',
    description:
      'Everything the install did is an ordinary repo diff: block source, two scoped patches, regenerated types. Review it like any PR.',
    title: 'Commit a working block',
  },
] as const

/* ------------------------------------------------------------------ */
/* Wiring ledger — the differentiator as a verifiable artifact table.  */
/* Rows mirror the manifest contract: recovery.patchedFiles plus the   */
/* generate:types / generate:importmap postInstall steps.              */
/* ------------------------------------------------------------------ */

export const wiringIntro =
  'A plain shadcn add stops at your filesystem. A Payload block isn’t live until it’s registered, rendered, typed, and in the admin import map — payload-components add owns exactly those four edits.'

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
/* Component catalog grid                                                    */
/* ------------------------------------------------------------------ */

export const componentsIntro =
  'No screenshots, no skeletons — the specimen below is the real component rendered with sample content. Thirty-six page blocks install today; eight post components are in development. Nothing ships without its full contract: source, manifest, docs, and installer coverage.'

/* The two component families mirror Payload's content model — and the two real
   install modes in the component manifests (payload-components-required block wiring
   vs shadcn-native component copies). */
export const componentFamilies = {
  pages: {
    countLabel: '38 installable',
    description:
      'Blocks for the Pages layout builder — installed with full wiring: collection config, render mapping, generated types, import map.',
    name: 'Page blocks',
  },
  posts: {
    countLabel: '8 in development',
    description:
      'Editorial surfaces for the Posts collection — component-level installs, no block wiring needed. In development.',
    name: 'Post components',
  },
} as const

/* Display order on the /components catalog (it reads Object.keys order). Page families are
   ranked by importance + catalog depth to mirror the docs sidebar (see
   src/lib/component-page-tree.tsx FAMILIES): the universal landing-page sections first
   (Hero, Feature, Content, Call to action), then the deeper / flashier families
   (Integration, Logo cloud, Team), then the single-variant utility (Embed). pricing / faq /
   testimonials ship no components yet, so they stay hidden (the catalog filters out count 0). */
export const componentCategories = {
  hero: { family: 'pages', label: 'Hero' },
  features: { family: 'pages', label: 'Features' },
  content: { family: 'pages', label: 'Content' },
  cta: { family: 'pages', label: 'Call to action' },
  integration: { family: 'pages', label: 'Integration' },
  logos: { family: 'pages', label: 'Logo cloud' },
  team: { family: 'pages', label: 'Team' },
  embed: { family: 'pages', label: 'Embed' },
  pricing: { family: 'pages', label: 'Pricing' },
  faq: { family: 'pages', label: 'FAQ' },
  testimonials: { family: 'pages', label: 'Testimonials' },
  cards: { family: 'posts', label: 'Cards' },
  archive: { family: 'posts', label: 'Archive' },
  header: { family: 'posts', label: 'Post header' },
  index: { family: 'posts', label: 'Index' },
  author: { family: 'posts', label: 'Author' },
  newsletter: { family: 'posts', label: 'Newsletter' },
  related: { family: 'posts', label: 'Related' },
} as const

export type ComponentCategory = keyof typeof componentCategories

export const componentEntries = [
  {
    category: 'hero',
    command: 'npx payload-components add hero-basic',
    description:
      'A headline-led marketing hero with CTA links, proof badges, Payload block config, and frontend rendering.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'links', 'proofItems'],
    href: '/docs/components/hero-basic',
    slug: 'hero-basic',
    status: 'Alpha',
    target: 'Hero section',
    title: 'Hero Basic',
    version: '0.1.0',
  },
  {
    category: 'features',
    command: 'npx payload-components add feature-grid-basic',
    description:
      'A text-first feature grid with repeatable items, optional CTA wiring, and idempotent registration.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    href: '/docs/components/feature-grid-basic',
    slug: 'feature-grid-basic',
    status: 'Alpha',
    target: 'Feature section',
    title: 'Feature Grid Basic',
    version: '0.1.0',
  },
  {
    category: 'features',
    command: 'npx payload-components add feature-split',
    description:
      'A two-column feature section pairing a heading and CTA with a stacked feature list.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    href: '/docs/components/feature-split',
    slug: 'feature-split',
    status: 'Alpha',
    target: 'Split section',
    title: 'Feature Split',
    version: '0.1.0',
  },
  {
    category: 'features',
    command: 'npx payload-components add feature-bento',
    description:
      'An asymmetric bento grid that leads with a featured cell and fills supporting cells.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    href: '/docs/components/feature-bento',
    slug: 'feature-bento',
    status: 'Alpha',
    target: 'Bento grid',
    title: 'Feature Bento',
    version: '0.1.0',
  },
  {
    category: 'features',
    command: 'npx payload-components add feature-steps',
    description:
      'A numbered steps block for sequential, how-it-works feature flows.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    href: '/docs/components/feature-steps',
    slug: 'feature-steps',
    status: 'Alpha',
    target: 'Steps section',
    title: 'Feature Steps',
    version: '0.1.0',
  },
  {
    category: 'embed',
    command: 'npx payload-components add embed-basic',
    description:
      'A responsive, accessible iframe block for YouTube, Vimeo, maps, forms, charts, and external widgets with a selectable aspect ratio.',
    family: 'pages',
    fields: ['url', 'title', 'aspectRatio', 'caption', 'allowFullscreen'],
    href: '/docs/components/embed-basic',
    slug: 'embed-basic',
    status: 'Alpha',
    target: 'Embed / media',
    title: 'Embed Basic',
    version: '0.1.0',
  },
  {
    category: 'logos',
    command: 'npx payload-components add logo-cloud-grid',
    description:
      'A centered, wrapping wall of editable logo uploads under a heading, installed as a wired Payload block.',
    family: 'pages',
    fields: ['heading', 'logos'],
    href: '/docs/components/logo-cloud-grid',
    slug: 'logo-cloud-grid',
    status: 'Alpha',
    target: 'Logo cloud',
    title: 'Logo Cloud Grid',
    version: '0.1.0',
  },
  {
    category: 'logos',
    command: 'npx payload-components add logo-cloud-hover',
    description:
      'A logo wall that dims and blurs on hover to reveal a single call-to-action.',
    family: 'pages',
    fields: ['heading', 'logos', 'links'],
    href: '/docs/components/logo-cloud-hover',
    slug: 'logo-cloud-hover',
    status: 'Alpha',
    target: 'Logo cloud',
    title: 'Logo Cloud Hover',
    version: '0.1.0',
  },
  {
    category: 'logos',
    command: 'npx payload-components add logo-cloud-marquee',
    description:
      'An auto-scrolling marquee of editable logos with progressive-blur edge fades.',
    family: 'pages',
    fields: ['heading', 'logos'],
    href: '/docs/components/logo-cloud-marquee',
    slug: 'logo-cloud-marquee',
    status: 'Alpha',
    target: 'Logo cloud',
    title: 'Logo Cloud Marquee',
    version: '0.1.0',
  },
  {
    category: 'logos',
    command: 'npx payload-components add logo-cloud-inline',
    description:
      'A compact label-over-logos strip for editable trust logos.',
    family: 'pages',
    fields: ['heading', 'logos'],
    href: '/docs/components/logo-cloud-inline',
    slug: 'logo-cloud-inline',
    status: 'Alpha',
    target: 'Logo cloud',
    title: 'Logo Cloud Inline',
    version: '0.1.0',
  },
  {
    category: 'logos',
    command: 'npx payload-components add logo-cloud-inline-wrap',
    description:
      'A single wrapping row that keeps the label inline with editable trust logos.',
    family: 'pages',
    fields: ['heading', 'logos'],
    href: '/docs/components/logo-cloud-inline-wrap',
    slug: 'logo-cloud-inline-wrap',
    status: 'Alpha',
    target: 'Logo cloud',
    title: 'Logo Cloud Inline Wrap',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-columns',
    description:
      'A two-column content section pairing a heading with body paragraphs and a CTA, installed as a wired Payload block.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'links'],
    href: '/docs/components/content-columns',
    slug: 'content-columns',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Columns',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-image-lead',
    description:
      'A content section led by a full-width image above a two-column heading, body, and CTA.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'links'],
    href: '/docs/components/content-image-lead',
    slug: 'content-image-lead',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Image Lead',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-feature-media',
    description:
      'A content section pairing body copy and two icon features beside a framed media panel.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'image'],
    href: '/docs/components/content-feature-media',
    slug: 'content-feature-media',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Feature Media',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-feature-split',
    description:
      'A content section pairing a side media panel with body copy and two icon features.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'image'],
    href: '/docs/components/content-feature-split',
    slug: 'content-feature-split',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Feature Split',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-showcase',
    description:
      'A centered content section with an intro, a full-width image, and a four-up grid of icon features.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'features'],
    href: '/docs/components/content-showcase',
    slug: 'content-showcase',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Showcase',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-quote',
    description:
      'A content section pairing a media panel with body copy and a cited pull quote.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'quote', 'citation', 'logo'],
    href: '/docs/components/content-quote',
    slug: 'content-quote',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Quote',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-community',
    description:
      'A centered content section with a heading, body copy, and a wall of community avatars.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'avatars'],
    href: '/docs/components/content-community',
    slug: 'content-community',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Community',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-split-rows',
    description:
      'A content section with an intro and alternating media-and-text rows.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'rows'],
    href: '/docs/components/content-split-rows',
    slug: 'content-split-rows',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Split Rows',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-rows',
    description:
      'A content section with an intro and a uniform stack of media-and-text rows.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'rows'],
    href: '/docs/components/content-rows',
    slug: 'content-rows',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Rows',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-image-frame',
    description:
      'A centered content section with an intro and a layered, framed screenshot.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'backgroundImage'],
    href: '/docs/components/content-image-frame',
    slug: 'content-image-frame',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Image Frame',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-stats',
    description:
      'A content section with an intro, a grid of icon features, and a stats list.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'stats'],
    href: '/docs/components/content-stats',
    slug: 'content-stats',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content Stats',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-list',
    description:
      'A serif-headed content section pairing a heading with a labeled-term list.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'items'],
    href: '/docs/components/content-list',
    slug: 'content-list',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content List',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-list-columns',
    description:
      'A serif-headed content section with a two-column labeled-term list.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'items'],
    href: '/docs/components/content-list-columns',
    slug: 'content-list-columns',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content List Columns',
    version: '0.1.0',
  },
  {
    category: 'content',
    command: 'npx payload-components add content-list-icons',
    description:
      'A serif-headed content section with an intro and a multi-column icon list.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items'],
    href: '/docs/components/content-list-icons',
    slug: 'content-list-icons',
    status: 'Alpha',
    target: 'Content section',
    title: 'Content List Icons',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-grid',
    description:
      'A responsive grid of integration cards — logo, name, description, and a learn-more link — installed as a wired Payload block.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations'],
    href: '/docs/components/integration-grid',
    slug: 'integration-grid',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Grid',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-cluster',
    description:
      'A centered cluster of integration logos around a featured brand mark, with a heading and CTA.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo', 'links'],
    href: '/docs/components/integration-cluster',
    slug: 'integration-cluster',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Cluster',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-split',
    description:
      'A two-column section pairing a featured-mark logo cluster with a heading, subtext, and CTA.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo', 'links'],
    href: '/docs/components/integration-split',
    slug: 'integration-split',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Split',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-connect',
    description:
      'Integration logos wired to a central brand mark by connector lines, installed as a wired Payload block.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    href: '/docs/components/integration-connect',
    slug: 'integration-connect',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Connect',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-orbit',
    description:
      'Concentric rings of integration logos that orbit a featured brand mark on hover.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    href: '/docs/components/integration-orbit',
    slug: 'integration-orbit',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Orbit',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-list',
    description:
      'A vertical list of integration rows — logo, name, description, and an add action — installed as a wired Payload block.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations'],
    href: '/docs/components/integration-list',
    slug: 'integration-list',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration List',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-marquee',
    description:
      'Three auto-scrolling rows of integration logos around a featured brand mark, with progressive edge fades.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    href: '/docs/components/integration-marquee',
    slug: 'integration-marquee',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Marquee',
    version: '0.1.0',
  },
  {
    category: 'integration',
    command: 'npx payload-components add integration-testimonial',
    description:
      'A two-column section pairing a customer quote with a grid of integration logo cards.',
    family: 'pages',
    fields: ['heading', 'subtext', 'integrations', 'quote', 'author', 'role'],
    href: '/docs/components/integration-testimonial',
    slug: 'integration-testimonial',
    status: 'Alpha',
    target: 'Integration section',
    title: 'Integration Testimonial',
    version: '0.1.0',
  },
  {
    category: 'cta',
    command: 'npx payload-components add call-to-action-centered',
    description:
      'A centered call-to-action block: heading, supporting copy, and one or two CTA links.',
    family: 'pages',
    fields: ['title', 'description', 'links'],
    href: '/docs/components/call-to-action-centered',
    slug: 'call-to-action-centered',
    status: 'Alpha',
    target: 'Call to action',
    title: 'Call To Action Centered',
    version: '0.1.0',
  },
  {
    category: 'cta',
    command: 'npx payload-components add call-to-action-boxed',
    description:
      'A boxed call-to-action block: heading, copy, and CTA links inside a nested panel.',
    family: 'pages',
    fields: ['title', 'description', 'links'],
    href: '/docs/components/call-to-action-boxed',
    slug: 'call-to-action-boxed',
    status: 'Alpha',
    target: 'Boxed CTA',
    title: 'Call To Action Boxed',
    version: '0.1.0',
  },
  {
    category: 'cta',
    command: 'npx payload-components add call-to-action-signup',
    description:
      'An email-capture call-to-action block: heading, copy, and a form that posts to your endpoint.',
    family: 'pages',
    fields: ['title', 'description', 'emailPlaceholder', 'submitLabel', 'action'],
    href: '/docs/components/call-to-action-signup',
    slug: 'call-to-action-signup',
    status: 'Alpha',
    target: 'Email capture',
    title: 'Call To Action Signup',
    version: '0.1.0',
  },
  {
    category: 'team',
    command: 'npx payload-components add team-roster',
    description:
      'A team section that groups members into titled departments, each a grid of avatars with name and role.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'groups'],
    href: '/docs/components/team-roster',
    slug: 'team-roster',
    status: 'Alpha',
    target: 'Team section',
    title: 'Team Roster',
    version: '0.1.0',
  },
  {
    category: 'team',
    command: 'npx payload-components add team-grid',
    description:
      'A team section with a heading, intro, and a responsive grid of member photo cards that reveal role on hover.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'members'],
    href: '/docs/components/team-grid',
    slug: 'team-grid',
    status: 'Alpha',
    target: 'Team section',
    title: 'Team Grid',
    version: '0.1.0',
  },
] as const

export type ComponentEntry = (typeof componentEntries)[number]

/* The in-development posts suite — real components from the registry roadmap,
   shown as "Coming soon" until their installer coverage lands. */
export const upcomingComponents = [
  {
    category: 'cards',
    description: 'A post card with image, categories, date, title, and excerpt.',
    family: 'posts',
    slug: 'post-card',
    target: 'Archive card',
    title: 'Post Card',
  },
  {
    category: 'archive',
    description: 'An archive grid for rendering arrays of post summaries.',
    family: 'posts',
    slug: 'post-archive',
    target: 'Archive grid',
    title: 'Post Archive',
  },
  {
    category: 'header',
    description: 'A post hero with category, author, date, and summary.',
    family: 'posts',
    slug: 'post-hero',
    target: 'Post header',
    title: 'Post Hero',
  },
  {
    category: 'index',
    description: 'A featured post surface with image, category, and date.',
    family: 'posts',
    slug: 'featured-post',
    target: 'Index spotlight',
    title: 'Featured Post',
  },
  {
    category: 'index',
    description: 'A compact post list with dates, categories, and descriptions.',
    family: 'posts',
    slug: 'post-list',
    target: 'Compact index',
    title: 'Post List',
  },
  {
    category: 'author',
    description: 'An author profile card for article pages and editorial bylines.',
    family: 'posts',
    slug: 'author-card',
    target: 'Byline',
    title: 'Author Card',
  },
  {
    category: 'newsletter',
    description: 'A newsletter callout for post pages and editorial surfaces.',
    family: 'posts',
    slug: 'newsletter-callout',
    target: 'Engagement',
    title: 'Newsletter Callout',
  },
  {
    category: 'related',
    description: 'A related-posts section for compact recommendations.',
    family: 'posts',
    slug: 'related-posts',
    target: 'Post footer',
    title: 'Related Posts',
  },
] as const

export type UpcomingComponent = (typeof upcomingComponents)[number]

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
/* the registry exists. These are NOT payload-components installs (the CLI is  */
/* alpha): they predate it. The setupTax lines carry the honest         */
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
    answer:
      'Yes — and built to stay that way. The registry, the CLI, both components, and this site are one MIT-licensed repository: no pricing, no license key, no gated tier. Payload Components is community-first by design — the catalog grows from real installs and contributions, not a paid roadmap.',
    question: 'Is Payload Components free?',
  },
  {
    answer:
      'In Payload, a block is a composable page-builder field — a reusable content section (hero, feature grid, CTA) editors stack to lay out a page. Payload Components ships pre-built blocks plus the wiring that makes them live, so a block is not just copied in: it is registered in your Pages collection, mapped in your renderer, typed, and added to the admin import map.',
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

export const catalogTitle = 'Component catalog'
export const catalogDescription =
  'Installable Payload CMS blocks and components, each with docs, registry metadata, and CLI wiring that registers, renders, types, and import-maps it for you. Read the contract before you add it.'

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
    description: 'Current alpha components with exact commands and contracts.',
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

export const footerColumns = [
  {
    links: [
      { href: '/components', label: 'Component catalog' },
      { href: '/docs', label: 'Documentation' },
      { href: '/docs/installation', label: 'Install workflow' },
      { href: '/docs/architecture', label: 'Architecture' },
    ],
    title: 'Product',
  },
  {
    links: componentEntries.map((component) => ({ href: component.href, label: component.title })),
    title: 'Components',
  },
  {
    links: [
      { href: '/about', label: 'About' },
      { external: true, href: githubRepoUrl, label: 'GitHub' },
      { external: true, href: githubIssuesUrl, label: 'Open an issue' },
      { href: '/docs/contributing', label: 'Contributing' },
      { external: true, href: '/r/registry.json', label: 'Registry JSON' },
    ],
    title: 'Project',
  },
] as const
