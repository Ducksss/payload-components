import { describe, expect, it } from 'vitest'

import { groupFilesByDirectory } from '../../src/components/site/ComponentComposition'
import {
  componentNameOf,
  deriveAdminForm,
  deriveComposition,
  humanizeKey,
  isFileOnly,
  renderComposition,
} from '../../src/lib/component-composition'
import { getAllComponentManifests, getComponentManifest } from '../../src/lib/component-manifest'

/* The data-driven reference sections on every component doc page derive their
 * composition tree and admin-form mock from the manifest alone. Pin the two
 * reference shapes (a page block with arrays and links, a file-only post
 * component) and sweep every manifest so a new sampleContent shape can't
 * throw at build. */

const manifest = async (slug: string) => {
  const loaded = await getComponentManifest(slug)
  if (!loaded) throw new Error(`Missing manifest fixture: ${slug}`)
  return loaded
}

describe('component composition tree', () => {
  it('walks a page block from Pages through its fields, collapsing links', async () => {
    const composition = deriveComposition(await manifest('faq-accordion'))

    expect(composition).toMatchObject({ componentName: 'FaqAccordion', fileOnly: false })
    expect(renderComposition(composition.root)).toBe(
      [
        'Pages',
        '└── layout[]',
        '    └── FaqAccordion',
        '        ├── eyebrow',
        '        ├── title',
        '        ├── description',
        '        ├── items[]',
        '        │   ├── question',
        '        │   └── answer',
        '        └── links[]  link',
      ].join('\n'),
    )
  })

  it('walks a file-only component from the template through its props', async () => {
    const composition = deriveComposition(await manifest('post-hero'))

    expect(composition).toMatchObject({ componentName: 'PostHero', fileOnly: true })
    expect(renderComposition(composition.root)).toBe(
      [
        'Your template',
        '└── <PostHero />',
        '    ├── title',
        '    ├── author',
        '    ├── publishedAt',
        '    ├── categories[]',
        '    └── description',
      ].join('\n'),
    )
  })

  it('nests arrays inside array rows and unions optional row keys', async () => {
    const lines = renderComposition(deriveComposition(await manifest('comparator-table')).root)

    expect(lines).toContain(
      '        ├── plans[]\n        │   ├── name\n        │   ├── links[]  link',
    )
    /* badge/highlighted only appear on the second plan. */
    expect(lines).toContain('        │   ├── badge\n        │   └── highlighted')
    expect(lines).toContain('            └── values[]\n                └── label')
  })

  it('expands plain objects and keeps scalars as leaves', async () => {
    const lines = renderComposition(deriveComposition(await manifest('contact-routing-form')).root)

    expect(lines).toContain('        ├── formLabels\n        │   ├── name\n        │   ├── email')
    expect(lines).toContain('        └── action')
  })

  it('derives a tree for every manifest without throwing', async () => {
    const manifests = await getAllComponentManifests()

    expect(manifests.length).toBeGreaterThan(80)
    for (const entry of manifests) {
      const composition = deriveComposition(entry)
      const lines = renderComposition(composition.root).split('\n')

      expect(lines[0], entry.name).toBe(composition.fileOnly ? 'Your template' : 'Pages')
      expect(lines.length, entry.name).toBeGreaterThan(2)
      expect(
        lines.some((line) => line.includes('blockType')),
        entry.name,
      ).toBe(false)
      expect(isFileOnly(entry), entry.name).toBe(entry.installMode === 'file-only')
    }
  })

  it('names file-only components after their Component.tsx directory', () => {
    expect(
      componentNameOf({
        files: ['src/components/AuthorCard/Component.tsx'],
        name: 'author-card',
        payloadFragments: [],
      }),
    ).toBe('AuthorCard')
    expect(componentNameOf({ files: [], name: 'post-hero', payloadFragments: [] })).toBe('PostHero')
  })
})

describe('admin form mock', () => {
  it('labels fields the way Payload does', () => {
    expect(humanizeKey('publishedAt')).toBe('Published At')
    expect(humanizeKey('enablePagination')).toBe('Enable Pagination')
    expect(humanizeKey('title')).toBe('Title')
  })

  it('mocks the FAQ Accordion form with array rows and link chips', async () => {
    const fields = deriveAdminForm((await manifest('faq-accordion')).sampleContent)

    expect(fields.map((field) => `${field.key}:${field.kind}`)).toEqual([
      'eyebrow:text',
      'title:text',
      'description:textarea',
      'items:rows',
      'links:links',
    ])
    const items = fields.find((field) => field.key === 'items')
    expect(items?.kind === 'rows' && items.rows.map((row) => row.primary)).toEqual([
      'How long does setup take?',
      'Which data sources are supported?',
      'Is there a free trial?',
    ])
    const links = fields.find((field) => field.key === 'links')
    expect(links?.kind === 'links' && links.links).toEqual([
      { appearance: 'outline', label: 'Contact support' },
    ])
  })

  it('mocks scalar-only blocks with checkboxes and numbers', async () => {
    const fields = deriveAdminForm((await manifest('collection-query')).sampleContent)

    expect(fields.find((field) => field.key === 'limit')).toMatchObject({
      kind: 'number',
      value: 3,
    })
    expect(fields.find((field) => field.key === 'enableFilters')).toMatchObject({
      checked: true,
      kind: 'checkbox',
      label: 'Enable Filters',
    })
    expect(fields.some((field) => field.kind === 'rows')).toBe(false)
  })

  it('counts nested arrays on a row instead of expanding them', async () => {
    const fields = deriveAdminForm((await manifest('pricing-cards-cta')).sampleContent)
    const plans = fields.find((field) => field.key === 'plans')

    expect(plans?.kind === 'rows' && plans.rows[1]).toEqual({
      counts: ['5 features', '1 link'],
      primary: 'Pro',
      secondary: '$19',
    })
  })

  it('keeps file-only props, string lists and empty values', async () => {
    const fields = deriveAdminForm((await manifest('post-hero')).sampleContent)
    expect(fields.find((field) => field.key === 'categories')).toMatchObject({
      items: ['Field notes'],
      kind: 'list',
    })

    const media = deriveAdminForm((await manifest('feature-cards-media')).sampleContent)
    const items = media.find((field) => field.key === 'items')
    expect(items?.kind === 'rows' && items.rows[0].primary).toBe('Dashboards customers recognize')
    expect(deriveAdminForm({ image: null })).toEqual([
      { key: 'image', kind: 'empty', label: 'Image' },
    ])
  })

  it('derives a form for every manifest without throwing', async () => {
    for (const entry of await getAllComponentManifests()) {
      const fields = deriveAdminForm(entry.sampleContent)
      expect(fields.length, entry.name).toBeGreaterThan(0)
      expect(
        fields.some((field) => field.key === 'blockType'),
        entry.name,
      ).toBe(false)
    }
  })
})

describe('installed file tree', () => {
  it('groups manifest files by directory and compacts single-child chains', async () => {
    const tree = groupFilesByDirectory((await manifest('faq-accordion')).files)

    expect(tree.directories.map((directory) => directory.name)).toEqual(['src/blocks'])
    expect(tree.directories[0].directories.map((directory) => directory.name)).toEqual([
      'shared',
      'FaqAccordion',
    ])
    expect(tree.directories[0].directories[1].files).toEqual([
      'src/blocks/FaqAccordion/config.ts',
      'src/blocks/FaqAccordion/Component.tsx',
    ])
  })

  it('collapses a lone file-only component into one folder', async () => {
    const tree = groupFilesByDirectory((await manifest('post-hero')).files)

    expect(tree.directories).toHaveLength(1)
    expect(tree.directories[0]).toMatchObject({
      directories: [],
      files: ['src/components/PostHero/Component.tsx'],
      name: 'src/components/PostHero',
    })
  })
})
