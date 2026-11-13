import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  blockThumbnailRecipes,
  templateThumbnailRecipe,
} from '../../tools/payload-components/block-thumbnail-recipes'
import { renderThumbnailSvg } from '../../tools/payload-components/block-thumbnails'
import { createBlockThumbnails } from '../../tools/payload-components/build-block-thumbnails'
import { nearestRecipeSibling } from '../../tools/payload-components/commands/new'

/* Every block's tile in Payload's admin Blocks Drawer shows a picture of its
 * layout: `admin.images.thumbnail`, set from the block's generated thumbnail.ts,
 * an SVG data URI rendered from its recipe in
 * tools/payload-components/block-thumbnail-recipes.ts. `admin.images` arrived
 * in Payload 3.79.0, which is why the support matrix sets that Payload 3 floor.
 * See payload-components/README.md → "Admin Blocks Drawer". */

const repoRoot = process.cwd()
const blocksDir = path.join(repoRoot, 'payload-components', 'source', 'blocks')

const readBlocks = async () => {
  const entries = await readdir(blocksDir, { withFileTypes: true })

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && entry.name !== 'shared')
      .map(async ({ name }) => ({
        camel: name[0].toLowerCase() + name.slice(1),
        config: await readFile(path.join(blocksDir, name, 'config.ts'), 'utf8'),
        name,
        slug: name.replace(/(?<=[a-z0-9])(?=[A-Z])/g, '-').toLowerCase(),
      })),
  )
}

/* The decoded SVG a thumbnail.ts module exports, evaluated the way the module
 * builds it. */
const svgOf = (moduleSource: string) => {
  const lines = [...moduleSource.matchAll(/^ {2}'(<[^']*)',$/gm)].map((match) => match[1])

  return lines.join('')
}

describe('Blocks Drawer thumbnails', () => {
  it('gives every block a recipe, and every recipe a block', async () => {
    const slugs = (await readBlocks()).map(({ slug }) => slug).sort()

    expect(slugs.length).toBeGreaterThan(70)
    expect(Object.keys(blockThumbnailRecipes).sort()).toEqual(slugs)
  })

  it('sets admin.images.thumbnail from the block’s own thumbnail module', async () => {
    for (const { camel, config, name } of await readBlocks()) {
      expect(config, name).toContain(`import { ${camel}Thumbnail } from './thumbnail'`)
      expect(config, name).toMatch(
        new RegExp(
          `^ {2}admin: \\{\\n {4}group: '[^']+',\\n {4}images: \\{\\n {6}thumbnail: ${camel}Thumbnail,\\n {4}\\},\\n {2}\\},$`,
          'm',
        ),
      )
    }

    const template = await readFile(
      path.join(repoRoot, 'payload-components', 'component-template', 'config.ts'),
      'utf8',
    )
    expect(template).toContain("import { exampleBasicThumbnail } from './thumbnail'")
    expect(template).toContain('thumbnail: exampleBasicThumbnail,')
  })

  it('commits each thumbnail.ts exactly as its recipe renders', async () => {
    const thumbnails = await createBlockThumbnails()
    const drifted: string[] = []

    for (const { content, filePath } of thumbnails) {
      const committed = await readFile(filePath, 'utf8').catch(() => '(missing)')

      if (committed !== content) drifted.push(path.relative(repoRoot, filePath))
    }

    /* Run `pnpm thumbnails:build` after changing a recipe or the renderer. */
    expect(drifted).toEqual([])
    expect(thumbnails.length).toBe(Object.keys(blockThumbnailRecipes).length + 1)
  })

  it('ships a decorative, offline 3:2 picture that stays small', async () => {
    for (const { content, filePath } of await createBlockThumbnails()) {
      const name = path.relative(repoRoot, filePath)
      const svg = svgOf(content)
      const viewBox = /viewBox="0 0 (\d+) (\d+)"/.exec(svg)

      expect(viewBox, name).not.toBeNull()
      expect(Number(viewBox![1]) * 2, name).toBe(Number(viewBox![2]) * 3)
      /* Payload passes alt straight to the <img>; empty marks it decorative,
         since the drawer prints the block label under it. */
      expect(content, name).toContain("  alt: '',\n")
      expect(content, name).toContain('url: `data:image/svg+xml,${encodeURIComponent(svg)}`')
      /* No external references: the picture must never fetch anything. */
      expect(svg.replace('xmlns="http://www.w3.org/2000/svg"', ''), name).not.toMatch(
        /https?:|href|<image|<script|<foreignObject/i,
      )
      /* The admin ships every installed block's picture in its client config. */
      expect(encodeURIComponent(svg).length, name).toBeLessThan(12_000)
    }
  })

  it('lists thumbnail.ts in every block manifest and registry item', async () => {
    const registry = JSON.parse(
      await readFile(path.join(repoRoot, 'payload-components', 'registry.json'), 'utf8'),
    ) as { items: Array<{ files: Array<{ target: string }>; name: string }> }

    for (const { name, slug } of await readBlocks()) {
      const manifest = JSON.parse(
        await readFile(
          path.join(repoRoot, 'payload-components', 'manifests', `${slug}.json`),
          'utf8',
        ),
      ) as { files: string[] }
      const item = registry.items.find((entry) => entry.name === slug)

      expect(manifest.files, slug).toContain(`src/blocks/${name}/thumbnail.ts`)
      expect(
        item?.files.map(({ target }) => target),
        slug,
      ).toContain(`~/src/blocks/${name}/thumbnail.ts`)
    }
  })

  it('renders the scaffold recipe, and copies a new variant’s from its nearest sibling', () => {
    expect(renderThumbnailSvg(templateThumbnailRecipe)[0]).toMatch(/^<svg /)

    const slugs = Object.keys(blockThumbnailRecipes)
    expect(nearestRecipeSibling('pricing-probe', slugs)).toMatch(/^pricing-/)
    expect(nearestRecipeSibling('logo-cloud-probe', slugs)).toMatch(/^logo-cloud-/)
    expect(nearestRecipeSibling('call-to-action-probe', slugs)).toMatch(/^call-to-action-/)
    /* A new family has no sibling; `new` falls back to the template recipe. */
    expect(nearestRecipeSibling('gallery-probe', slugs)).toBeUndefined()
  })
})
