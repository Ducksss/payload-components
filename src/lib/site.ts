export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://payload-components.xyz'
).replace(/\/+$/, '')
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
  'No screenshots, no skeletons — the specimen below is the real component rendered with sample content. Two page blocks install today; eight post components are in development. Nothing ships without its full contract: source, manifest, docs, and installer coverage.'

/* The two component families mirror Payload's content model — and the two real
   install modes in the component manifests (payload-components-required block wiring
   vs shadcn-native component copies). */
export const componentFamilies = {
  pages: {
    countLabel: '2 installable',
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

export const componentEntries = [
  {
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
] as const

export type ComponentEntry = (typeof componentEntries)[number]

/* The in-development posts suite — real components from the registry roadmap,
   shown as "Coming soon" until their installer coverage lands. */
export const upcomingComponents = [
  {
    description: 'A post card with image, categories, date, title, and excerpt.',
    family: 'posts',
    slug: 'post-card',
    target: 'Archive card',
    title: 'Post Card',
  },
  {
    description: 'An archive grid for rendering arrays of post summaries.',
    family: 'posts',
    slug: 'post-archive',
    target: 'Archive grid',
    title: 'Post Archive',
  },
  {
    description: 'A post hero with category, author, date, and summary.',
    family: 'posts',
    slug: 'post-hero',
    target: 'Post header',
    title: 'Post Hero',
  },
  {
    description: 'A featured post surface with image, category, and date.',
    family: 'posts',
    slug: 'featured-post',
    target: 'Index spotlight',
    title: 'Featured Post',
  },
  {
    description: 'A compact post list with dates, categories, and descriptions.',
    family: 'posts',
    slug: 'post-list',
    target: 'Compact index',
    title: 'Post List',
  },
  {
    description: 'An author profile card for article pages and editorial bylines.',
    family: 'posts',
    slug: 'author-card',
    target: 'Byline',
    title: 'Author Card',
  },
  {
    description: 'A newsletter callout for post pages and editorial surfaces.',
    family: 'posts',
    slug: 'newsletter-callout',
    target: 'Engagement',
    title: 'Newsletter Callout',
  },
  {
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
