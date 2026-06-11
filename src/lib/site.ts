import {
  BookOpenText,
  Boxes,
  Code2,
  FileCode2,
  GitBranch,
  Github,
  Terminal,
} from 'lucide-react'

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

export const workflowSteps = [
  {
    description: 'Start from kit docs that show the source shape, Payload target, and install path.',
    icon: BookOpenText,
    title: 'Read the kit contract',
  },
  {
    description:
      'Run the wrapper CLI so registry files, layout fragments, and state tracking stay together.',
    icon: GitBranch,
    title: 'Install with payload-kit',
  },
  {
    description:
      'Regenerate target project types and import maps after Payload block wiring lands.',
    icon: FileCode2,
    title: 'Keep Payload generated output current',
  },
] as const

export const surfaceLinks = [
  {
    description: 'Architecture, install behavior, support matrix, and kit-specific guidance.',
    icon: FileCode2,
    href: '/docs',
    title: 'Documentation',
  },
  {
    description: 'Current alpha kits, exact commands, and links into each kit contract.',
    icon: Boxes,
    href: '/components',
    title: 'Kit catalog',
  },
  {
    description: 'Registry delivery plus Payload-specific registration and render-block wiring.',
    icon: Terminal,
    href: '/docs/installation',
    title: 'Install workflow',
  },
] as const

export const targetPrinciples = [
  'The website stays a static Fumadocs/Next.js app.',
  'Payload code lives in installable kit source, not site runtime routes.',
  'Direct shadcn installs copy files; payload-kit owns Payload wiring.',
  'Every new kit should ship source, manifest metadata, docs, and installer coverage together.',
] as const

export const communityLinks = [
  {
    description: 'Source, issues, roadmap, and contribution discussion live in the open.',
    href: githubRepoUrl,
    icon: Github,
    label: 'GitHub repository',
  },
  {
    description: 'Suggest a kit, report install drift, or help shape the registry contract.',
    href: `${githubRepoUrl}/issues`,
    icon: Code2,
    label: 'Open an issue',
  },
] as const
