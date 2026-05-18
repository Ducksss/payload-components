import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Cpu,
  FileCode2,
  FolderTree,
  LayoutTemplate,
  LockKeyhole,
  MessageSquareQuote,
  Package,
  PanelsTopLeft,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  SquareTerminal,
  Triangle,
  Type,
  Wrench,
  Zap,
} from 'lucide-react'

export type ProofPill = {
  icon?: LucideIcon
  label: string
}

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

export type ReliabilityItem = {
  description: string
  icon: LucideIcon
  title: string
}

export type FaqItem = {
  answer: string
  question: string
}

export type HeroStat = {
  detail: string
  label: string
  value: string
}

export const githubRepoUrl = 'https://github.com/Ducksss/payload-components'
export const githubEarlyAccessIssueUrl =
  'https://github.com/Ducksss/payload-components/issues/new?template=early-access.yml'

export const heroStats: HeroStat[] = [
  {
    detail: 'Shipped kits live in the public alpha today.',
    label: 'Kits shipped',
    value: '2',
  },
  {
    detail: 'Manual repo cleanup steps after a kit install.',
    label: 'Manual cleanup',
    value: '0',
  },
  {
    detail: 'Single command to install a kit and finish wiring.',
    label: 'CLI calls to ship',
    value: '1',
  },
]

export const proofPills: ProofPill[] = [
  { icon: Triangle, label: 'Payload v3 only' },
  { icon: Zap, label: 'Next.js App Router' },
  { icon: Type, label: 'Type-safe installs' },
  { icon: Package, label: 'Import-map aware' },
  { icon: Cpu, label: 'Preview friendly' },
]

export const installSteps: Step[] = [
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'The current alpha starts with one real command: install a shipped kit and let the wrapper handle the Payload-aware wiring around it.',
    items: [
      'Installs a real public alpha kit today',
      'Applies the registry workflow through payload-kit',
      'Keeps the install surface legible from the first proof',
    ],
    label: '01',
    status: 'shipped',
    statusLabel: 'Shipped',
    title: 'Install a shipped alpha kit',
  },
  {
    command: 'npx payload-kit add feature-grid-basic',
    description:
      'The second shipped kit proves the multi-kit path: files land cleanly, registrations dedupe correctly, and the repo still finishes in a usable state.',
    items: [
      'Registers the second block without duplicate wiring',
      'Leaves separate installed state entries per kit',
      'Generates types and updates the import map automatically',
    ],
    label: '02',
    status: 'shipped',
    statusLabel: 'Shipped',
    title: 'Prove the second-kit install path',
  },
  {
    command: 'npx payload-kit doctor',
    description:
      'Doctor is next on the roadmap. It is not shipped yet, but it is the next operational layer after the two real public kits.',
    items: [
      'Will flag unsupported versions and missing peers',
      'Will surface drift after repeated installs',
      'Follows the gallery and two-kit alpha proof',
    ],
    label: '03',
    status: 'roadmap',
    statusLabel: 'Roadmap',
    title: 'See what lands next',
  },
]

export const productDifferentiators: FeatureCard[] = [
  {
    description:
      'Every kit is designed to drop into Payload layouts instead of fighting them with generic component-library assumptions.',
    icon: LayoutTemplate,
    title: 'Layouts-aware by default',
  },
  {
    description:
      'Schema wiring, render components, and install tasks stay aligned so block output and repo structure move together.',
    icon: FolderTree,
    title: 'Repo-native integration',
  },
  {
    description:
      'Installs finish with generated types and refreshed admin imports so teams do not have to remember fragile cleanup steps.',
    icon: FileCode2,
    title: 'Type and import-map safe',
  },
  {
    description:
      'The catalog stays curated, upgradeable, and consistent across kits, which matters more than chasing visual novelty.',
    icon: Blocks,
    title: 'Curated for delivery speed',
  },
]

export const registryColumns: RegistryColumn[] = [
  {
    badge: 'Open core',
    cta: {
      href: githubRepoUrl,
      label: 'Browse the public registry',
    },
    description:
      'Use the public registry to evaluate install quality, preview the kits, and adopt a dependable baseline into every new client project.',
    icon: Boxes,
    points: [
      'Free public registry for trust and adoption',
      'Curated starter kits and documentation',
      'Strong SEO footprint for the catalog itself',
    ],
    price: 'Free',
    priceUnit: 'forever',
    title: 'Public registry',
  },
  {
    badge: 'Paid Pro',
    cta: {
      href: '/?intent=design-partner&source=pricing-pro#early-access',
      label: 'Request Pro early access',
    },
    description:
      'Unlock the private namespace for premium kits, higher-value bundles, and the install workflows that matter once delivery volume starts climbing.',
    highlight: true,
    icon: CircleDollarSign,
    points: [
      'Private authenticated registry namespace',
      'Premium kit bundles for repeatable site builds',
      'Commercial-friendly path for agencies and freelancers',
    ],
    price: 'From $19',
    priceUnit: 'per seat / month',
    title: 'Private Pro registry',
  },
]

export const reliabilityItems: ReliabilityItem[] = [
  {
    description:
      'Repeated installs should finish cleanly without duplicate fragments or mysterious manual cleanup.',
    icon: RefreshCcw,
    title: 'Idempotent installs',
  },
  {
    description:
      'The CLI should spot unsupported project versions, missing peers, and drift before any fragile changes land.',
    icon: SearchCheck,
    title: 'Compatibility checks',
  },
  {
    description:
      'Pro kits stay behind authenticated access while the install surface remains predictable for approved teams.',
    icon: LockKeyhole,
    title: 'Entitlement-aware access',
  },
  {
    description:
      'When a repo already has existing blocks, the tool should guide a clean merge instead of blindly overwriting work.',
    icon: ShieldCheck,
    title: 'Conflict-aware upgrades',
  },
]

export const whyPayloadKits: FeatureCard[] = [
  {
    description:
      'CLI surfaces tell you what changed, what was installed, and what still needs attention.',
    icon: SquareTerminal,
    title: 'Operationally legible',
  },
  {
    description:
      'Curated kits ship with the pieces agencies actually reuse instead of one-off demo fragments.',
    icon: PanelsTopLeft,
    title: 'Built for repeated launches',
  },
  {
    description:
      'Hero Basic and Feature Grid Basic already move from idea to Payload-ready code through the shipped alpha install path.',
    icon: MessageSquareQuote,
    title: 'Catalog starts narrow on purpose',
  },
  {
    description:
      'Doctor and post-install checks make the platform feel safer to adopt in real client repos.',
    icon: Wrench,
    title: 'Reliability over novelty',
  },
]

export const faqItems: FaqItem[] = [
  {
    answer:
      'No. v1 is intentionally opinionated around Payload v3 and Next.js App Router so the install path can stay reliable.',
    question: 'Does v1 support other Payload versions or frontend stacks?',
  },
  {
    answer:
      'Not in v1. The first release is a curated kit platform with a public registry and a paid private registry, not a user-generated marketplace.',
    question: 'Is this a marketplace for anyone to publish kits?',
  },
  {
    answer:
      'No. The paid tier is access to a private registry namespace with premium kits and bundles, while the public catalog remains free for trust and adoption.',
    question: 'What makes Pro different from the public registry?',
  },
  {
    answer:
      'Each installable kit ships as a complete unit: the block config, frontend component, Payload wiring, sample content, and the post-install tasks required to make it work.',
    question: 'What actually gets installed when I add a kit?',
  },
  {
    answer:
      'Agencies and freelancers shipping many client websites. The messaging, kit choices, and install safeguards are all optimized for repeatable delivery work.',
    question: 'Who is the product really for?',
  },
]

export const proofChecks = [
  {
    icon: CheckCircle2,
    text: 'Supports the official website-style Payload starter first',
  },
  {
    icon: CheckCircle2,
    text: 'Plays nicely with existing blocks in mildly customized repos',
  },
  {
    icon: CheckCircle2,
    text: 'Keeps multi-kit installs legible as the catalog grows',
  },
]
