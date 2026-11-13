import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { blockThumbnailRecipes, templateThumbnailRecipe } from './block-thumbnail-recipes'
import { blockThumbnailModule } from './block-thumbnails'
import { deriveComponentNames } from './commands/new'
import type { ComponentManifest } from './types'
import { readJsonFile, repoRoot, writeTextFile } from './utils'

const sourceBlocksDir = path.join(repoRoot, 'payload-components', 'source', 'blocks')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')
const templateDir = path.join(repoRoot, 'payload-components', 'component-template')

/* Every block's thumbnail.ts, rendered from its recipe, plus the scaffold's copy
 * in component-template/. The int suite compares this against the committed
 * files, so a recipe edit without a rebuild (or a hand edit of the generated
 * SVG) fails the gate. */
export const createBlockThumbnails = async () => {
  const blocks = await Promise.all(
    Object.entries(blockThumbnailRecipes).map(async ([slug, recipe]) => {
      const { camel, pascal } = deriveComponentNames(slug)
      const { title } = await readJsonFile<ComponentManifest>(
        path.join(manifestsDir, `${slug}.json`),
      )

      return {
        content: blockThumbnailModule({ camel, recipe, title }),
        filePath: path.join(sourceBlocksDir, pascal, 'thumbnail.ts'),
      }
    }),
  )

  return [
    ...blocks,
    {
      content: blockThumbnailModule({
        camel: 'exampleBasic',
        recipe: templateThumbnailRecipe,
        title: 'Example Basic',
      }),
      filePath: path.join(templateDir, 'thumbnail.ts'),
    },
  ]
}

export const buildBlockThumbnails = async () => {
  const thumbnails = await createBlockThumbnails()

  await Promise.all(thumbnails.map(({ content, filePath }) => writeTextFile(filePath, content)))
  return thumbnails
}

const isDirectRun = (() => {
  if (!process.argv[1]) return false

  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
})()

if (isDirectRun) {
  buildBlockThumbnails()
    .then((thumbnails) => {
      process.stdout.write(`payload-components: wrote ${thumbnails.length} thumbnail modules.\n`)
    })
    .catch((error) => {
      process.stderr.write(
        `payload-components: ${error instanceof Error ? error.message : 'thumbnail build failed'}\n`,
      )
      process.exitCode = 1
    })
}
