export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const githubIssuesUrl = `${githubRepoUrl}/issues`
export const githubContentBranch = process.env.NEXT_PUBLIC_GITHUB_CONTENT_BRANCH ?? 'dev'
export const docsRoute = '/docs'
export const docsImageRoute = '/og/docs'
export const docsContentRoute = '/llms.mdx/docs'
export const primaryInstallCommand = 'npx payload-kit add hero-basic'

export const siteDescription =
  'Payload Kits is an MIT-licensed registry and CLI that installs typed, documented Payload CMS block kits into Payload v3 + Next.js projects — block config, render mapping, generated types, and import map wired in one command.'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroEyebrow = 'Payload Kits public alpha'

/* The H1 renders primary + accent as one accessible name; tests and the
   OG image consume the concatenated heroHeadline. */
export const heroHeadlinePrimary = 'Install Payload blocks'
export const heroHeadlineAccent = 'wired, not pasted.'
export const heroHeadline = `${heroHeadlinePrimary} ${heroHeadlineAccent}`

export const heroSubheadline =
  'One command copies the block source, registers it in your Pages collection, maps the renderer, and regenerates types and the admin import map. The result is a reviewable git diff — not a checklist.'

export const heroPrimaryCta = { href: '/docs', label: 'Get started' } as const

export const heroTertiaryLinks = [
  { href: '/components', label: 'Browse the kits' },
  { href: '#wiring', label: 'See what add actually wires' },
] as const

/**
 * Stylized replay of a real `payload-kit add` run. Stage wording tracks
 * tools/payload-kit/commands/add.ts and the kit manifest contract —
 * update it if the installer stages change.
 */
export const terminalDemoLines = [
  { kind: 'command', text: 'npx payload-kit add hero-basic' },
  { kind: 'info', text: 'payload-kit: installing "hero-basic" into ./acme-site' },
  { kind: 'step', text: 'resolved hero-basic@0.1.0 · payload-website-starter' },
  { kind: 'step', text: 'copied src/blocks/HeroBasic/{config.ts, Component.tsx}' },
  { kind: 'step', text: 'registered block in src/collections/Pages/index.ts' },
  { kind: 'step', text: 'wired render mapping in src/blocks/RenderBlocks.tsx' },
  { kind: 'step', text: 'ran payload generate:types' },
  { kind: 'step', text: 'ran payload generate:importmap' },
  { kind: 'step', text: 'recorded install state in .payload-kit/state.json' },
  { kind: 'success', text: 'payload-kit: installed "hero-basic" successfully.' },
] as const

export type TerminalLine = (typeof terminalDemoLines)[number]

/* Product-proof frame: files the install lands or regenerates. */
export const frameInstalledFiles = [
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
  kits: { heading: 'The catalog, rendered live.', id: 'kits' },
  wiring: { heading: 'Copying files was never the hard part.', id: 'wiring' },
  workflow: { heading: 'From catalog to commit in three moves.', id: 'workflow' },
} as const

/* Receipts strip — every line is verifiable in this repository. */
export const receipts = [
  { icon: 'scale', label: 'MIT licensed, end to end' },
  { icon: 'shield', label: '26 integration + 8 e2e tests gate every PR' },
  { icon: 'moon', label: 'Nightly fresh-repo install smoke test' },
  { icon: 'layers', label: 'Payload 3 · Next 15 / 16' },
  { icon: 'braces', label: 'Open registry JSON at /r/registry.json' },
] as const


export const workflowIntro =
  'No scaffolds, no vendored framework, no lock-in. Kits arrive as plain source plus two scoped patches you can read in the diff.'

export const workflowSteps = [
  {
    command: '/docs/kits/hero-basic',
    description:
      'Every kit documents its fields, the files it ships, the files it patches, and the targets it supports — before you run anything.',
    title: 'Read the contract',
  },
  {
    command: 'npx payload-kit add hero-basic',
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
  'A plain shadcn add stops at your filesystem. A Payload block isn’t live until it’s registered, rendered, typed, and in the admin import map — payload-kit add owns exactly those four edits.'

export const wiringLedger = {
  columns: {
    baseline: {
      command: 'npx shadcn add hero',
      summary: '1 of 5 artifacts. The rest is your TODO list.',
    },
    kit: {
      command: 'npx payload-kit add hero-basic',
      summary: '5 of 5 in one pass — reviewed as one git diff.',
    },
  },
  /* baseline: null means the artifact is left for you to wire by hand. */
  rows: [
    {
      artifact: 'Block source',
      baseline: 'copied',
      kit: 'copied',
      path: 'src/blocks/HeroBasic/{config.ts, Component.tsx}',
    },
    {
      artifact: 'Collection schema',
      baseline: null,
      kit: 'patched',
      path: 'src/collections/Pages/index.ts',
    },
    {
      artifact: 'Render mapping',
      baseline: null,
      kit: 'patched',
      path: 'src/blocks/RenderBlocks.tsx',
    },
    {
      artifact: 'Generated types',
      baseline: null,
      kit: 'regenerated',
      path: 'src/payload-types.ts',
    },
    {
      artifact: 'Admin import map',
      baseline: null,
      kit: 'regenerated',
      path: 'admin importMap.js',
    },
  ],
  source: 'payload-kits/manifests/hero-basic.json',
} as const

export type WiringLedgerRow = (typeof wiringLedger.rows)[number]

/* ------------------------------------------------------------------ */
/* Kit catalog grid                                                    */
/* ------------------------------------------------------------------ */

export const kitsIntro =
  'No screenshots, no skeletons — the specimen below is the kit’s real component rendered with sample content. Two page blocks install today; eight post components are in development. Nothing ships without its full contract: source, manifest, docs, and installer coverage.'

/* The two kit families mirror Payload's content model — and the two real
   install modes in the kit manifests (payload-kit-required block wiring
   vs shadcn-native component copies). */
export const kitFamilies = {
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

export const kitEntries = [
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'A headline-led marketing hero with CTA links, proof badges, Payload block config, and frontend rendering.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'links', 'proofItems'],
    href: '/docs/kits/hero-basic',
    slug: 'hero-basic',
    status: 'Alpha',
    target: 'Hero section',
    title: 'Hero Basic',
    version: '0.1.0',
  },
  {
    command: 'npx payload-kit add feature-grid-basic',
    description:
      'A text-first feature grid with repeatable items, optional CTA wiring, and idempotent registration.',
    family: 'pages',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    href: '/docs/kits/feature-grid-basic',
    slug: 'feature-grid-basic',
    status: 'Alpha',
    target: 'Feature section',
    title: 'Feature Grid Basic',
    version: '0.1.0',
  },
] as const

export type KitEntry = (typeof kitEntries)[number]

/* The in-development posts suite — real kits from the registry roadmap,
   shown as "Coming soon" until their installer coverage lands. */
export const upcomingKits = [
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

export type UpcomingKit = (typeof upcomingKits)[number]

/* ------------------------------------------------------------------ */
/* Maintainer note                                                     */
/* ------------------------------------------------------------------ */

/* The one real voice on the site — the signed maintainer note that
   anchors the open-source close. No fabricated quotes: real installs
   get featured here only when they exist. */
export const maintainerNote = {
  body: 'I built payload-kit because installing a Payload block was never the copy-paste — it was the four edits after. The CLI exists so the second project, and the tenth, get that wiring for free. Read the installer source before you trust it; shipping it MIT is the point.',
  href: 'https://github.com/Ducksss',
  name: 'Ducksss',
  role: 'Maintainer, Payload Kits',
} as const

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqIntro =
  'The short version of the docs. Every answer links back to something you can verify in the repository.'

export const faqEntries = [
  {
    answer:
      'Yes. The registry, the CLI, both kits, and this site are one MIT-licensed repository. There is no pricing, no license key, and no gated tier — if that changes someday, it will not change for the open registry.',
    question: 'Is Payload Kits free?',
  },
  {
    answer:
      'Three things: kit source files are copied in (block config, component, shared utilities), exactly two files are patched (your Pages collection and RenderBlocks.tsx — each kit manifest declares them), and Payload regenerates its own output (payload-types.ts and the admin import map). All of it shows up as an ordinary git diff.',
    question: 'What exactly does an install change in my repo?',
  },
  {
    answer:
      'It converges. The CLI detects existing wiring and skips it — the real output is payload-kit: "hero-basic" is already installed. Install state is recorded in .payload-kit/state.json, so partial installs are visible and recoverable instead of silently broken.',
    question: 'What happens if I run the same install twice?',
  },
  {
    answer:
      'Payload v3 + Next.js 15/16 projects shaped like the official website starter — rendering layout blocks through src/blocks/RenderBlocks.tsx and registering page blocks in src/collections/Pages/index.ts. The CLI checks your project against the published support matrix before touching anything.',
    question: 'Which projects are supported today?',
  },
  {
    answer:
      'A plain shadcn install copies files and stops. Payload blocks only work after they are registered in your collection schema, mapped in your renderer, typed, and added to the admin import map. payload-kit wraps the same registry delivery with exactly that wiring — that boundary is the product, and the wiring ledger above shows it row by row.',
    question: 'Why not just run npx shadcn add?',
  },
  {
    answer:
      'Deliberately. A kit lands only when its source, manifest metadata, docs page, and installer test coverage ship together — half-wired blocks never reach the catalog. Propose the next kit in a GitHub issue; the catalog grows from real installs.',
    question: 'How do new kits get into the catalog?',
  },
] as const

/* ------------------------------------------------------------------ */
/* Community / CTA                                                     */
/* ------------------------------------------------------------------ */

export const communityIntro =
  'The registry, the CLI, the kits, and this site are one MIT-licensed repository. Read the installer before you trust it — that is the point.'

/* The quiet replacement for placeholder testimonial slots. */
export const communityInvite = {
  href: githubIssuesUrl,
  label: 'Running it in a real repo? Open an issue — early installs get featured.',
} as const

/* ------------------------------------------------------------------ */
/* Catalog page                                                        */
/* ------------------------------------------------------------------ */

export const catalogTitle = 'Kit catalog'
export const catalogDescription =
  'Installable Payload block kits with docs, registry metadata, and CLI wiring. Each kit links to its full contract before you add it to a project.'

/* ------------------------------------------------------------------ */
/* Shared navigation surfaces                                          */
/* ------------------------------------------------------------------ */

export const surfaceLinks = [
  {
    description: 'Architecture, install behavior, support matrix, and kit contracts.',
    href: '/docs',
    title: 'Documentation',
  },
  {
    description: 'Current alpha kits with exact commands and contracts.',
    href: '/components',
    title: 'Kit catalog',
  },
  {
    description: 'What payload-kit add wires, step by step.',
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
    description: 'Suggest a kit, report install drift, or help shape the registry contract.',
    href: githubIssuesUrl,
    label: 'Open an issue',
  },
] as const

export const footerColumns = [
  {
    links: [
      { href: '/components', label: 'Kit catalog' },
      { href: '/docs', label: 'Documentation' },
      { href: '/docs/installation', label: 'Install workflow' },
      { href: '/docs/architecture', label: 'Architecture' },
    ],
    title: 'Product',
  },
  {
    links: kitEntries.map((kit) => ({ href: kit.href, label: kit.title })),
    title: 'Kits',
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
