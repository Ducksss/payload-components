import { Box, Code2, FileCode2, GitBranch, Github, PackageCheck, Terminal } from 'lucide-react'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const primaryInstallCommand = 'npx payload-kit add hero-basic'

export const siteDescription =
  'Payload Kits is an MIT-licensed catalog of installable Payload CMS kits with registry delivery, CLI wiring, generated types, and docs built on Fumadocs.'

export const kitEntries = [
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'A headline-led marketing block with CTA links, proof badges, Payload block config, and frontend rendering.',
    href: '/docs/kits/hero-basic',
    slug: 'hero-basic',
    status: 'Alpha',
    title: 'Hero Basic',
  },
  {
    command: 'npx payload-kit add feature-grid-basic',
    description:
      'A text-first feature grid with repeatable fields, optional CTA wiring, and idempotent registration.',
    href: '/docs/kits/feature-grid-basic',
    slug: 'feature-grid-basic',
    status: 'Alpha',
    title: 'Feature Grid Basic',
  },
] as const

export const proofItems = [
  {
    description: 'Kits are distributed as shadcn-compatible registry items.',
    icon: PackageCheck,
    title: 'Registry-backed',
  },
  {
    description: 'The wrapper handles Payload-specific block registration and render wiring.',
    icon: GitBranch,
    title: 'Payload-aware',
  },
  {
    description:
      'Post-install tasks regenerate Payload types and admin import maps in target repos.',
    icon: FileCode2,
    title: 'Type-safe',
  },
] as const

export const docsHighlights = [
  {
    description: 'Read the architecture, install contract, and support matrix before installing.',
    icon: FileCode2,
    title: 'Fumadocs docs',
  },
  {
    description: 'Browse real kit metadata and exact commands without opening Payload admin.',
    icon: Box,
    title: 'Public catalog',
  },
  {
    description: 'Run one command, then let the CLI verify files, fragments, and install state.',
    icon: Terminal,
    title: 'CLI workflow',
  },
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
