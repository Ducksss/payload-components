import type { FeatureGridBasicBlock, HeroBasicBlock } from '@/payload-types'

export const componentsGalleryRoute = '/components'

type GalleryPreview<TBlock> = {
  data: TBlock
  description: string
  label: string
}

type GalleryEntryBase = {
  installCommand: string
  statusLabel: string
  summary: string
  title: string
}

export type HeroGalleryEntry = GalleryEntryBase & {
  preview: GalleryPreview<HeroBasicBlock>
  slug: 'hero-basic'
}

export type FeatureGridGalleryEntry = GalleryEntryBase & {
  preview: GalleryPreview<FeatureGridBasicBlock>
  slug: 'feature-grid-basic'
}

export type KitGalleryEntry = FeatureGridGalleryEntry | HeroGalleryEntry

const statusLabel = 'Shipped alpha'

export const kitGalleryEntries: KitGalleryEntry[] = [
  {
    installCommand: 'npx payload-kit add hero-basic',
    preview: {
      data: {
        blockName: null,
        blockType: 'heroBasic',
        description:
          'Install the first public kit and land a complete hero block with typed props, schema wiring, and import-map-safe output.',
        eyebrow: 'Payload Kits alpha',
        id: 'hero-basic-preview',
        links: [
          {
            id: 'hero-primary',
            link: {
              appearance: 'default',
              label: 'Open the live gallery',
              newTab: false,
              type: 'custom',
              url: componentsGalleryRoute,
            },
          },
        ],
        proofItems: [
          { id: 'hero-proof-1', label: 'Registry-backed install' },
          { id: 'hero-proof-2', label: 'Payload-aware wiring' },
          { id: 'hero-proof-3', label: 'Types generated automatically' },
        ],
        title: 'Ship a production-ready hero without manual repo cleanup.',
      },
      description:
        'A headline-first section with CTA support and a proof ribbon for install confidence.',
      label: 'Marketing hero',
    },
    slug: 'hero-basic',
    statusLabel,
    summary:
      'A headline-first hero block with proof items and CTA support, shipped through the real payload-kit alpha flow.',
    title: 'Hero Basic',
  },
  {
    installCommand: 'npx payload-kit add feature-grid-basic',
    preview: {
      data: {
        blockName: null,
        blockType: 'featureGridBasic',
        description:
          'The second shipped alpha kit gives teams a structured feature section without adding new primitives or manual layout glue.',
        eyebrow: 'Product features',
        id: 'feature-grid-basic-preview',
        items: [
          {
            description:
              'Adds the block files, layout registration, and render wiring through the real alpha install path.',
            id: 'feature-grid-product-1',
            title: 'Real install surface',
          },
          {
            description:
              'Keeps the content model intentionally small so editors get useful structure without extra ceremony.',
            id: 'feature-grid-product-2',
            title: 'Text-first schema',
          },
          {
            description:
              'Finishes with generated types and import-map updates instead of leaving fragile manual steps behind.',
            id: 'feature-grid-product-3',
            title: 'Post-install cleanup handled',
          },
        ],
        links: [
          {
            id: 'feature-grid-product-link',
            link: {
              appearance: 'default',
              label: 'Install feature-grid-basic',
              newTab: false,
              type: 'custom',
              url: '#install-feature-grid-basic',
            },
          },
        ],
        title: 'Show the product layer with a feature grid that belongs in the repo immediately.',
      },
      description: 'A product-facing grid with three editor-friendly items and one CTA.',
      label: 'Product features',
    },
    slug: 'feature-grid-basic',
    statusLabel,
    summary:
      'A text-first feature grid for product and agency landing pages, installed through the same real alpha workflow.',
    title: 'Feature Grid Basic',
  },
]
