export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const primaryInstallCommand = 'npx payload-kit add hero-basic'

export const siteDescription =
  'Payload Kits is an MIT-licensed registry and CLI for installing documented Payload CMS block kits into supported Next.js projects.'

export const kitEntries = [
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'A headline-led marketing block with CTA links, proof badges, Payload block config, and frontend rendering.',
    href: '/docs/kits/hero-basic',
    slug: 'hero-basic',
    status: 'Alpha',
    target: 'Hero section',
    title: 'Hero Basic',
  },
  {
    command: 'npx payload-kit add feature-grid-basic',
    description:
      'A text-first feature grid with repeatable fields, optional CTA wiring, and idempotent registration.',
    href: '/docs/kits/feature-grid-basic',
    slug: 'feature-grid-basic',
    status: 'Alpha',
    target: 'Feature section',
    title: 'Feature Grid Basic',
  },
] as const

export const heroBadge = 'MIT · Payload v3 · Next.js 15/16'

export const heroSubheadline =
  'One command copies the kit, registers the block, wires RenderBlocks, and regenerates your types. Typed end-to-end, safe to re-run.'

export const terminalSteps = [
  'Detected Payload v3 · Next.js 16',
  'Copied 4 files from registry',
  'Registered block in Pages layout',
  'Wired RenderBlocks.tsx mapping',
  'Ran generate:types',
  'Ran generate:importmap',
] as const

export const terminalFinalLine = 'Installed hero-basic — 0 manual edits.'

export const proofPoints = [
  'shadcn-compatible registry',
  'Idempotent installs',
  'Typed end-to-end',
  'MIT licensed',
] as const

export const installComparison = {
  manual: {
    command: 'pnpm dlx shadcn add …',
    label: 'Registry only',
    steps: [
      { done: true, text: 'Files copied' },
      { done: false, text: 'Register block in Pages layout — manual' },
      { done: false, text: 'Edit RenderBlocks.tsx — manual' },
      { done: false, text: 'Regenerate payload-types.ts — manual' },
      { done: false, text: 'Rebuild import map — manual' },
    ],
  },
  wired: {
    command: 'npx payload-kit add hero-basic',
    label: 'Registry + wiring',
    steps: [
      { done: true, text: 'Files copied' },
      { done: true, text: 'Block registered in Pages layout' },
      { done: true, text: 'RenderBlocks.tsx wired' },
      { done: true, text: 'Types + import map regenerated' },
      { done: true, text: 'Safe to re-run — idempotent' },
    ],
  },
} as const

export const featureCells = [
  {
    description: 'Every block ships an explicit interface name and lands in your generated payload-types.ts.',
    title: 'Typed end-to-end',
  },
  {
    description: 'Pages layout entries land in the right place without hand-editing collection configs.',
    title: 'Auto-registration',
  },
  {
    description: 'Re-running an install never duplicates imports, fragments, or layout entries.',
    title: 'Idempotent installs',
  },
  {
    description: 'Unsupported project shapes fail cleanly with actionable errors before anything is written.',
    title: 'Shape detection',
  },
  {
    description: 'generate:types and generate:importmap run for you after the wiring lands.',
    title: 'Post-install codegen',
  },
  {
    description: 'Each kit documents its fields, Payload target, and install path before you add it.',
    title: 'Docs-first contracts',
  },
] as const

export const generatedTypeSnippet = `interface HeroBasicBlock {
  eyebrow?: string
  title: string
  description: string
  links?: LinkItem[]
  badges?: BadgeItem[]
}`

export const footerLinkGroups = [
  {
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/components', label: 'Kit catalog' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/architecture', label: 'Architecture' },
    ],
    title: 'Product',
  },
  {
    links: [
      { external: true, href: githubRepoUrl, label: 'GitHub' },
      { external: true, href: `${githubRepoUrl}/issues`, label: 'Issues' },
      { href: '/docs/contributing', label: 'Contributing' },
    ],
    title: 'Community',
  },
] as const
