import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

import { captureBlogFigures } from './capture-figures'
import { generateFigures } from './generate-figures'
import { renderContactSheets } from './render-contact-sheets'
import { parseCoverRenderArgs, renderCovers } from './render-covers'
import { validateBlogVisualCatalog } from './visual-system/artifacts'
import { blogVisualCatalog } from './visual-system/catalog'
import { diagramDefinitions } from './visual-system/diagram-data'

import type { CoverRenderOptions } from './render-covers'
import type { DiagramDefinition } from './visual-system/diagram-data'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const defaultAssetRoot = path.join(repoRoot, 'public')
const maxCoverBytes = 250 * 1024
const maxFigureWebpBytes = 350 * 1024
const maxFigureSvgBytes = 150 * 1024

export type AssetValidationOptions = {
  assetRoot?: string
}

export type ValidatedAssetBatch = {
  covers: number
  figures: number
  total: number
}

const collectFiles = async (directory: string): Promise<readonly string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const candidate = path.join(directory, entry.name)
      if (entry.isDirectory()) return await collectFiles(candidate)
      return [candidate]
    }),
  )
  return files.flat()
}

const expectedAssetPaths = () => {
  const covers = blogVisualCatalog.map((entry) => `blog/${entry.slug}/cover.webp`)
  const figures = blogVisualCatalog.flatMap((entry) =>
    entry.figures.map((figure) => figure.path.replace(/^\//, '')),
  )
  return { covers, figures }
}

export const selectDiagramDefinitions = (
  entries: readonly CoverRenderOptions['entries'][number][],
): readonly DiagramDefinition[] => {
  const selectedPaths = new Set(
    entries.flatMap((entry) =>
      entry.figures
        .filter((figure) => figure.path.endsWith('.svg'))
        .map((figure) => figure.path),
    ),
  )
  const selected = diagramDefinitions.filter((definition) =>
    selectedPaths.has(definition.path),
  )

  if (selected.length !== selectedPaths.size) {
    throw new Error('The selected catalog diagrams do not match their renderer definitions.')
  }

  return selected
}

export const validateBlogVisualAssets = async ({
  assetRoot = defaultAssetRoot,
}: AssetValidationOptions = {}): Promise<ValidatedAssetBatch> => {
  const { covers, figures } = expectedAssetPaths()
  const expected = new Set([...covers, ...figures])
  const actual = (await collectFiles(path.join(assetRoot, 'blog')))
    .filter((candidate) => /\.(?:svg|webp)$/i.test(candidate))
    .map((candidate) => path.relative(assetRoot, candidate))
    .sort()

  if (covers.length !== 32 || figures.length !== 35 || expected.size !== 67) {
    throw new Error(
      `Catalog asset inventory is ${covers.length} covers, ${figures.length} figures, and ${expected.size} total; expected 32, 35, and 67.`,
    )
  }
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    throw new Error('Committed blog visual assets do not exactly match the catalog inventory.')
  }

  for (const relativePath of expected) {
    const absolutePath = path.join(assetRoot, relativePath)
    const fileInfo = await stat(absolutePath)
    const isCover = relativePath.endsWith('/cover.webp')

    if (relativePath.endsWith('.webp')) {
      const metadata = await sharp(absolutePath).metadata()
      const expectedDimensions = isCover
        ? { height: 630, width: 1200 }
        : { height: 900, width: 1600 }
      const maxBytes = isCover ? maxCoverBytes : maxFigureWebpBytes

      if (
        metadata.format !== 'webp' ||
        metadata.width !== expectedDimensions.width ||
        metadata.height !== expectedDimensions.height ||
        fileInfo.size > maxBytes
      ) {
        throw new Error(
          `${relativePath} must be a ${expectedDimensions.width}×${expectedDimensions.height} WebP no larger than ${maxBytes} bytes.`,
        )
      }
      continue
    }

    const source = await readFile(absolutePath, 'utf8')
    if (
      !relativePath.endsWith('.svg') ||
      !source.includes('viewBox="0 0 1200 675"') ||
      fileInfo.size > maxFigureSvgBytes
    ) {
      throw new Error(
        `${relativePath} must be a 1200×675 SVG no larger than ${maxFigureSvgBytes} bytes.`,
      )
    }
  }

  return { covers: covers.length, figures: figures.length, total: expected.size }
}

export const renderVisuals = async (
  argv: readonly string[] = process.argv.slice(2),
  environment: Readonly<Record<string, string | undefined>> = process.env,
) => {
  const coverOptions = parseCoverRenderArgs(argv, environment)

  await validateBlogVisualCatalog()
  await renderCovers(coverOptions)
  const selectedDiagrams = selectDiagramDefinitions(coverOptions.entries)
  if (selectedDiagrams.length > 0) {
    await generateFigures({
      definitions: selectedDiagrams,
      outputRoot: path.join(coverOptions.outputRoot, 'public'),
      requireCompleteCatalog: coverOptions.entries.length === blogVisualCatalog.length,
    })
  }
  await captureBlogFigures({
    baseURL: coverOptions.baseUrl,
    outputRoot: coverOptions.outputRoot,
  })
  const assetRoot = path.join(coverOptions.outputRoot, 'public')
  const validated = await validateBlogVisualAssets({ assetRoot })
  await renderContactSheets({
    assetRoot,
    outputDirectory: path.join(
      coverOptions.outputRoot,
      'output',
      'blog-visual-review',
    ),
  })
  console.log(`Validated ${validated.total} Field Journal assets.`)

  return validated
}

const isMain = () =>
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  await renderVisuals()
}
