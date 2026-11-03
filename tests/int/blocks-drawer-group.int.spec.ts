import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { familyOfSlug } from '../../src/lib/component-page-tree'
import { deriveDrawerGroup } from '../../tools/payload-components/commands/new'

/* Payload's admin Blocks Drawer lists blocks under their `admin.group`. An
 * editor who installs twenty of ours should see them under the same family
 * headings the catalog and docs sidebar use, so every shipped config's group is
 * its FAMILIES label (src/lib/component-page-tree.tsx). `admin.group` arrived in
 * Payload 3.25.0; the pictures beside it (`admin.images`, 3.79.0) are held to
 * their recipes in blocks-drawer-thumbnails.int.spec.ts. See
 * payload-components/README.md → "Admin Blocks Drawer". */

const blocksDir = path.join(process.cwd(), 'payload-components', 'source', 'blocks')

const GROUP = /^ {2}admin: \{\n {4}group: '([^']+)',\n/m

const readBlockConfigs = async () => {
  const entries = await readdir(blocksDir, { withFileTypes: true })

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && entry.name !== 'shared')
      .map(async ({ name }) => ({
        name,
        slug: name.replace(/(?<=[a-z0-9])(?=[A-Z])/g, '-').toLowerCase(),
        source: await readFile(path.join(blocksDir, name, 'config.ts'), 'utf8'),
      })),
  )
}

describe('Blocks Drawer groups', () => {
  it('files every block config under its catalog family', async () => {
    const configs = await readBlockConfigs()
    const mismatched = configs.flatMap(({ name, slug, source }) => {
      const group = GROUP.exec(source)?.[1]
      const family = familyOfSlug(slug).label

      return group === family ? [] : [`${name}: admin.group ${group ?? '(missing)'} ≠ ${family}`]
    })

    expect(configs.length).toBeGreaterThan(70)
    expect(mismatched).toEqual([])
  })

  it('sets the group beside the block identifiers', async () => {
    for (const { name, source } of await readBlockConfigs()) {
      /* One top-level admin object, right after interfaceName, so the
         localize wrap's top-level fields anchor and the docs walkthrough keep
         reading the same shape. The deprecated top-level imageURL stays out:
         pictures go through admin.images. */
      expect(source, name).toMatch(/^ {2}interfaceName: '\w+',\n {2}admin: \{\n/m)
      expect(source.match(/^ {2}admin:/gm), name).toHaveLength(1)
      expect(source, name).not.toMatch(/\bimageURL\s*:|\bimageAltText\s*:/)
    }
  })

  it('derives a scaffolded block’s group the way the catalog groups its slug', async () => {
    const groups = (await readBlockConfigs()).map(({ slug, source }) => ({
      group: GROUP.exec(source)?.[1] ?? '',
      words: slug.split('-'),
    }))

    for (const slug of ['hero-probe', 'logo-cloud-probe', 'call-to-action-probe', 'faq-probe']) {
      expect(deriveDrawerGroup(slug, groups), slug).toBe(familyOfSlug(slug).label)
    }

    /* A new family has no sibling yet; both fall back to the first word. */
    expect(deriveDrawerGroup('gallery-probe', groups)).toBe(familyOfSlug('gallery-probe').label)
  })
})
