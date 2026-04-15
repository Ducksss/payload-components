import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  FileCode2,
  FolderTree,
  LayoutTemplate,
  LockKeyhole,
  MessageSquareQuote,
  PanelsTopLeft,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  SquareTerminal,
  Wrench,
} from 'lucide-react'

export type ProofPill = {
  label: string
}

export type Step = {
  command: string
  description: string
  items: string[]
  label: string
  title: string
}

export type FeatureCard = {
  description: string
  icon: LucideIcon
  title: string
}

export type RegistryColumn = {
  badge: string
  description: string
  icon: LucideIcon
  points: string[]
  title: string
}

export type ReliabilityItem = {
  description: string
  icon: LucideIcon
  title: string
}

export type KitCategory = {
  description: string
  kits: {
    description: string
    includes: string[]
    name: string
  }[]
  label: string
  value: string
}

export type FaqItem = {
  answer: string
  question: string
}

export const proofPills: ProofPill[] = [
  { label: 'Payload v3 only' },
  { label: 'Next.js App Router' },
  { label: 'Type-safe installs' },
  { label: 'Import-map aware' },
  { label: 'Preview friendly' },
]

export const installSteps: Step[] = [
  {
    command: 'npx payload-kit init',
    description:
      'Detect the repo shape, confirm it is a supported Payload v3 + Next.js app, and prepare the registry config before anything touches your blocks.',
    items: [
      'Validates project shape before install',
      'Sets up the Payload-specific registry workflow',
      'Keeps the install path opinionated from day one',
    ],
    label: '01',
    title: 'Prepare the repo',
  },
  {
    command: 'npx payload-kit add hero-pricing-faq',
    description:
      'Install a complete kit with its frontend block, Payload schema, admin-safe defaults, dependency wiring, and the repo changes required to make it real.',
    items: [
      'Adds the render component and config fragments',
      'Installs peer dependencies and sample content',
      'Runs generate:types and generate:importmap for you',
    ],
    label: '02',
    title: 'Add a production-ready kit',
  },
  {
    command: 'npx payload-kit doctor',
    description:
      'Audit the project after upgrades and repeated installs so you can see version drift, missing peers, and compatibility gaps before they become delivery risk.',
    items: [
      'Flags unsupported versions and missing peers',
      'Surfaces multi-kit conflicts before deploy',
      'Keeps repeatable client builds from drifting',
    ],
    label: '03',
    title: 'Verify before shipping',
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
    description:
      'Use the public registry to evaluate install quality, preview the kits, and adopt a dependable baseline into every new client project.',
    icon: Boxes,
    points: [
      'Free public registry for trust and adoption',
      'Curated starter kits and documentation',
      'Strong SEO footprint for the catalog itself',
    ],
    title: 'Public registry',
  },
  {
    badge: 'Paid Pro',
    description:
      'Unlock the private namespace for premium kits, higher-value bundles, and the install workflows that matter once delivery volume starts climbing.',
    icon: CircleDollarSign,
    points: [
      'Private authenticated registry namespace',
      'Premium kit bundles for repeatable site builds',
      'Commercial-friendly path for agencies and freelancers',
    ],
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
      'Testimonials, forms, pricing, hero, and FAQ kits move from idea to Payload-ready code in minutes.',
    icon: MessageSquareQuote,
    title: 'Catalog tuned for websites first',
  },
  {
    description:
      'Doctor and post-install checks make the platform feel safer to adopt in real client repos.',
    icon: Wrench,
    title: 'Reliability over novelty',
  },
]

export const kitCategories: KitCategory[] = [
  {
    description: 'The pieces that give a new Payload site its backbone fast.',
    kits: [
      {
        description:
          'Headline-led hero blocks with strong payload wiring and preview-safe defaults.',
        includes: ['hero block', 'render component', 'seed content'],
        name: 'Hero kit',
      },
      {
        description: 'Stats and logo sections for establishing trust without manual layout work.',
        includes: ['stats block', 'logo cloud', 'spacing presets'],
        name: 'Proof kit',
      },
      {
        description: 'Flexible content sections that still feel deliberate in a real client build.',
        includes: ['content block', 'layout variants', 'docs metadata'],
        name: 'Content kit',
      },
    ],
    label: 'Foundation',
    value: 'foundation',
  },
  {
    description: 'The conversion surfaces agencies rebuild on nearly every marketing site.',
    kits: [
      {
        description:
          'Pricing layouts with opinionated tier structure and clean editorial hierarchy.',
        includes: ['pricing block', 'tier schema', 'responsive layout'],
        name: 'Pricing kit',
      },
      {
        description: 'Focused CTA sections that plug into layouts without awkward wrapper work.',
        includes: ['cta block', 'button treatments', 'copy slots'],
        name: 'CTA kit',
      },
      {
        description:
          'FAQ blocks that ship with admin-friendly editing and stable frontend rendering.',
        includes: ['faq block', 'accordion UI', 'example content'],
        name: 'FAQ kit',
      },
    ],
    label: 'Conversion',
    value: 'conversion',
  },
  {
    description: 'The trust and capture modules that turn a site from pretty to usable.',
    kits: [
      {
        description:
          'Testimonials and quote sections designed for easy payload editing and visual consistency.',
        includes: ['testimonial block', 'quote variants', 'avatar-safe defaults'],
        name: 'Testimonial kit',
      },
      {
        description:
          'Newsletter and contact forms with the shape agencies expect in content-heavy sites.',
        includes: ['form block', 'validation-ready fields', 'submission states'],
        name: 'Form kit',
      },
      {
        description:
          'About and team sections for faster client-site assembly without generic filler layouts.',
        includes: ['team block', 'about section', 'image treatments'],
        name: 'About kit',
      },
    ],
    label: 'Trust & capture',
    value: 'trust',
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
