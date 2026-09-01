import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  Boxes,
  CircleDollarSign,
  LayoutTemplate,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react'

export type StepStatus = 'shipped' | 'roadmap'

export type Step = {
  command: string
  description: string
  items: string[]
  label: string
  status: StepStatus
  statusLabel: string
  title: string
}

export type FeatureCard = {
  description: string
  icon: LucideIcon
  title: string
}

export type FeatureShowcase = {
  description: string
  title: string
}

export type RegistryColumn = {
  badge: string
  cta: {
    href: string
    label: string
  }
  description: string
  highlight?: boolean
  icon: LucideIcon
  points: string[]
  price: string
  priceUnit?: string
  title: string
}

export type FaqItem = {
  answer: string
  question: string
}

export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const githubEarlyAccessIssueUrl =
  'https://github.com/Ducksss/payload-components/issues/new?template=early-access.yml'

export const heroInstallCommand = 'npx payload-kit add hero-basic'

export const worksWith = [
  'Payload v3',
  'Next.js App Router',
  'React Server Components',
  'TypeScript',
  'shadcn registry',
]

export const installSteps: Step[] = [
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'One command pulls the kit into your repo: block config, render component, and collection wiring land exactly where Payload expects them.',
    items: [
      'Block config and component land in src/blocks',
      'Collections register the block automatically',
      'No copy-paste, no missing pieces',
    ],
    label: '01',
    status: 'shipped',
    statusLabel: 'Live today',
    title: 'Add a kit',
  },
  {
    command: 'npx payload-kit add feature-grid-basic',
    description:
      'Stack as many kits as the build needs. Registrations dedupe, types regenerate, and the import map stays current on every install.',
    items: [
      'Types regenerate after every install',
      'Import map updates automatically',
      'Repeat installs stay clean and idempotent',
    ],
    label: '02',
    status: 'shipped',
    statusLabel: 'Live today',
    title: 'Everything wires itself',
  },
  {
    command: 'npx payload-kit doctor',
    description:
      'Doctor lands next: preflight checks that catch version drift, missing peers, and repo conflicts before anything changes.',
    items: [
      'Flags unsupported versions and missing peers',
      'Surfaces drift across repeated installs',
      'Protects client repos before changes land',
    ],
    label: '03',
    status: 'roadmap',
    statusLabel: 'Coming next',
    title: 'Ship with confidence',
  },
]

export const featureShowcases: FeatureShowcase[] = [
  {
    description:
      'Every kit ships the block config, the render component, and the collection wiring — placed where your Payload repo expects them, matching the structure you already have.',
    title: 'Installs land in your repo, not on top of it',
  },
  {
    description:
      'payload-kit finishes what it starts: payload-types.ts and the admin import map are rebuilt automatically, so the repo compiles the moment the install completes.',
    title: 'Types and import map, regenerated on every install',
  },
]

export const featureCards: FeatureCard[] = [
  {
    description:
      'Kits are designed around Payload blocks and layout patterns — not generic React components with a schema bolted on.',
    icon: LayoutTemplate,
    title: 'Built for Payload layouts',
  },
  {
    description:
      'Every kit in the catalog is reviewed, consistent, and upgradeable. Install quality is the product.',
    icon: Blocks,
    title: 'Curated, not crowdsourced',
  },
  {
    description:
      'Run the same install twice and the repo stays clean — registrations dedupe, nothing duplicates.',
    icon: RefreshCcw,
    title: 'Idempotent installs',
  },
  {
    description:
      'Repos with existing blocks get a clean merge path instead of a blind overwrite.',
    icon: ShieldCheck,
    title: 'Conflict-aware upgrades',
  },
]

export const registryColumns: RegistryColumn[] = [
  {
    badge: 'Open source',
    cta: {
      href: '/components',
      label: 'Browse the components',
    },
    description:
      'Browse the catalog, preview every kit live, and install a dependable baseline into every project. No account required.',
    icon: Boxes,
    points: [
      'Every public kit, free forever',
      'Full source on GitHub',
      'Live previews and real install commands',
    ],
    price: 'Free',
    priceUnit: 'forever',
    title: 'Public registry',
  },
  {
    badge: 'Pro',
    cta: {
      href: '/?intent=design-partner&source=pricing-pro#early-access',
      label: 'Request Pro early access',
    },
    description:
      'A private namespace with premium kits and bundles, built for teams shipping client sites on repeat.',
    highlight: true,
    icon: CircleDollarSign,
    points: [
      'Private authenticated registry namespace',
      'Premium kit bundles for full site builds',
      'Commercial-friendly licensing for client work',
    ],
    price: 'From $19',
    priceUnit: 'per seat / month',
    title: 'Private Pro registry',
  },
]

export const faqItems: FaqItem[] = [
  {
    answer:
      "No — and that's deliberate. v1 targets Payload v3 and the Next.js App Router so every install path can be tested and guaranteed.",
    question: 'Does v1 support other Payload versions or frontend stacks?',
  },
  {
    answer:
      'No. Payload Kits is a curated catalog. Every kit is built and reviewed to the same standard, so install quality stays predictable.',
    question: 'Is this a marketplace for anyone to publish kits?',
  },
  {
    answer:
      'Pro unlocks a private registry namespace with premium kits and bundles. The public catalog stays free and open source.',
    question: 'What makes Pro different from the public registry?',
  },
  {
    answer:
      'A complete unit: the block config, the frontend component, Payload wiring, and the post-install tasks — type generation and import-map updates — that make it work immediately.',
    question: 'What actually gets installed when I add a kit?',
  },
  {
    answer:
      'Agencies and freelancers shipping Payload sites on repeat. The kit choices and install safeguards are optimized for repeatable client delivery.',
    question: 'Who is Payload Kits for?',
  },
]
