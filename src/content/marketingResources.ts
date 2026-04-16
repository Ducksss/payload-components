export type MarketingResourceSection = {
  bullets?: string[]
  paragraphs: string[]
  title: string
}

export type MarketingResource = {
  description: string
  keyword: string
  readingTime: string
  sections: MarketingResourceSection[]
  slug: string
  source: string
  summary: string
  title: string
}

export const marketingResources: MarketingResource[] = [
  {
    description:
      'A practical breakdown of what Payload block reuse needs beyond JSX so installs still hold up once schema wiring, previews, and repo drift enter the picture.',
    keyword: 'payload cms blocks',
    readingTime: '6 min read',
    sections: [
      {
        paragraphs: [
          'Reusable Payload blocks fail when teams optimize for screenshots instead of repo behavior. The visual component is only one part of the install. The rest is the schema, the render wiring, the generated types, and the admin setup that lets editors actually use the block safely.',
          'If any one of those pieces is missing, the block may look polished in isolation but still increase delivery friction in the repo where it lands.',
        ],
        title: 'The block is not the whole install',
      },
      {
        bullets: [
          'a block config export the collection can register immediately',
          'a render component with typed props from generated Payload types',
          'any required registration fragments for layout rendering',
          'sample content or preview metadata so the block is not a blank shell',
        ],
        paragraphs: [
          'A production-ready Payload block needs a full install contract. That contract should be explicit, small, and repeatable enough that another engineer can run it twice without wondering what changed.',
        ],
        title: 'Ship the integration contract with the block',
      },
      {
        paragraphs: [
          'Payload repos drift quickly. Agencies add custom blocks, rename folders, change wrappers, and introduce client-specific conventions. A reusable block only survives if the install path detects the repo shape first and knows how to merge into mildly customized projects.',
          'That is why `init`, compatibility checks, and file-ownership tracking matter just as much as the actual component code.',
        ],
        title: 'Design around repo shape, not ideal demos',
      },
      {
        paragraphs: [
          'Preview behavior and admin editability are part of the product promise. If a block installs but cannot be edited predictably in Payload, the team still loses time. Treat editor confidence as a core acceptance criterion.',
        ],
        title: 'Count editor trust as part of delivery quality',
      },
    ],
    slug: 'payload-cms-blocks',
    source: 'resource-payload-cms-blocks',
    summary:
      'Reusable Payload blocks need more than polished UI. The real work is the schema, wiring, generated types, preview behavior, and repeatable repo integration around them.',
    title: 'Payload CMS blocks that survive real client repos',
  },
  {
    description:
      'How to use the official Payload + Next.js website template as a faster agency foundation without dragging generic demo decisions into every client build.',
    keyword: 'payload nextjs website template',
    readingTime: '5 min read',
    sections: [
      {
        paragraphs: [
          'The official website-style starter already solves useful problems: frontend routing, admin wiring, redirects, search, posts, forms, and a sane Payload v3 baseline. Agencies should keep that proven plumbing instead of rebuilding it from scratch for every project.',
          'What usually slows teams down is not the starter itself. It is the repeated block and content customization that happens immediately after the project begins.',
        ],
        title: 'Keep the verified plumbing',
      },
      {
        bullets: [
          'reduce the block catalog to the modules you actually sell repeatedly',
          'tighten the layout surface so new sections feel intentional',
          'keep type generation and import-map refreshes in the happy path',
        ],
        paragraphs: [
          'A better agency starter is not more generic. It is more opinionated around the work you already know how to sell and deliver.',
        ],
        title: 'Narrow the surface to repeated delivery work',
      },
      {
        paragraphs: [
          'The fastest way to differentiate an agency starter is to replace placeholder content with proof assets: hero variants, pricing, testimonials, FAQ, CTAs, and forms that map to real launch workflows. That is the layer where reusable kits become more useful than a generic template.',
        ],
        title: 'Replace demo content with delivery assets',
      },
      {
        paragraphs: [
          'If you are still validating the product, instrument the early-access path before you buy traffic. Source-aware waitlist capture, design-partner qualification, and GitHub proof surfaces create better learning than broad acquisition too early.',
        ],
        title: 'Instrument the learning loop from day one',
      },
    ],
    slug: 'payload-nextjs-website-template',
    source: 'resource-payload-nextjs-template',
    summary:
      'The official starter is a strong base. The leverage comes from narrowing it around the blocks, workflows, and install confidence agencies need repeatedly.',
    title: 'Payload + Next.js website template: what agencies should keep and what to change',
  },
  {
    description:
      'A concise guide to the gap between file delivery and true Payload-native installs, and why a CLI wrapper still matters even when a shadcn-compatible registry exists.',
    keyword: 'shadcn registry for payload',
    readingTime: '6 min read',
    sections: [
      {
        paragraphs: [
          'A registry is excellent at delivering files, dependencies, and a distribution format developers already understand. That solves part of the problem. It does not solve the Payload-specific repo updates that make those files usable inside a real project.',
          'If the block still needs manual registration or cleanup after the files land, the install is not done yet.',
        ],
        title: 'File delivery is necessary, but not sufficient',
      },
      {
        bullets: [
          'registering block configs in the right collection or layout',
          'wiring render components into the block renderer',
          'refreshing generated types after schema changes',
          'refreshing import maps when admin components move',
        ],
        paragraphs: [
          'Payload adds a second layer of work on top of the registry. That second layer is exactly where brittle copy-paste flows usually fail.',
        ],
        title: 'Payload adds repo-wiring responsibilities',
      },
      {
        paragraphs: [
          'That is why a wrapper CLI still matters. `init` can validate the project shape. `add` can coordinate the install steps in the right order. `doctor` can detect version drift, missing peers, and install conflicts before deploy.',
        ],
        title: 'The wrapper CLI owns the Payload-native workflow',
      },
      {
        paragraphs: [
          'An open-core approach works well here. The public registry acts as the trust layer and proves install quality. Premium kits can come later, once the basic install story is obviously reliable and worth paying to repeat.',
        ],
        title: 'Use the public layer to earn trust first',
      },
    ],
    slug: 'shadcn-registry-for-payload',
    source: 'resource-shadcn-registry-payload',
    summary:
      'Registries distribute files. Payload-native installs also need schema registration, type generation, import-map updates, and compatibility checks around those files.',
    title: 'Why a shadcn registry alone is not enough for Payload installs',
  },
]

export const getMarketingResourceBySlug = (slug: string) => {
  return marketingResources.find((resource) => resource.slug === slug)
}
