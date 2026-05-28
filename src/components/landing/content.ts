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
    detail: '8 shadcn-native Posts kits and 2 payload-kit page blocks ship in the public alpha.',
    label: 'Kits shipped',
    value: '10',
  },
  {
    detail: 'Manual repo cleanup steps after a kit install.',
    label: 'Manual cleanup',
    value: '0',
  },
  {
    detail: 'shadcn-native and payload-kit-required installs stay deliberately separate.',
    label: 'Install modes',
    value: '2',
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
    command: 'npx shadcn add @payload-kits/post-card',
    description:
      'The public front door is shadcn. Start with Posts presentation components that install as ordinary registry files without mutating Payload project config.',
    items: [
      'Installs a real public alpha kit today',
      'Copies frontend files and shadcn UI dependencies only',
      'Keeps the first product promise native to shadcn Directory discovery',
    ],
    label: '01',
    status: 'shipped',
    statusLabel: 'Shipped',
    title: 'Install a shadcn-native kit',
  },
  {
    command: 'npx payload-kit add hero-basic',
    description:
      'When a kit needs Payload schema registration, renderer wiring, generated types, or import-map updates, the wrapper owns those project mutations.',
    items: [
      'Registers page blocks without duplicate wiring',
      'Records install state for recovery and doctor checks',
      'Generates types and updates the import map automatically',
    ],
    label: '02',
    status: 'shipped',
    statusLabel: 'Shipped',
    title: 'Use the CLI for Payload wiring',
  },
  {
    command: 'npx payload-kit doctor',
    description:
      'Doctor inspects shadcn copies, wrapper state, missing Payload registration, dependency drift, and partial install failures.',
    items: [
      'Flags unsupported versions and missing peers',
      'Surfaces drift after repeated installs',
      'Separates shadcn-native kits from wrapper-required kits',
    ],
    label: '03',
    status: 'shipped',
    statusLabel: 'Shipped',
    title: 'Audit the install boundary',
  },
]

export const productDifferentiators: FeatureCard[] = [
  {
    description:
      'shadcn-native kits consume existing Payload-shaped data, while page blocks use the CLI only when the repo needs actual Payload layout wiring.',
    icon: LayoutTemplate,
    title: 'Payload-aware by default',
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
      'The first catalog now covers Posts cards, archives, heroes, lists, authors, newsletters, related content, and two wired page blocks.',
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
      'shadcn-native kits install frontend files and shadcn UI dependencies. payload-kit-required kits add Payload schema registration, renderer wiring, generated types, import-map updates, state tracking, and doctor checks.',
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
