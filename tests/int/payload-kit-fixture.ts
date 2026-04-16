import { cp, mkdtemp as fsMkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { loadManifest } from '../../tools/payload-kit/manifest'

import type { KitManifest, PayloadFragment } from '../../tools/payload-kit/types'

const repoRoot = process.cwd()
const layoutAnchor = "name: 'layout'"

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const stripImportLine = (source: string, importName: string, importPath: string) =>
  source.replace(new RegExp(`^import \\{ ${escapeRegExp(importName)} \\} from '${escapeRegExp(importPath)}'\\n`, 'm'), '')

const stripRenderBlocksFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>,
) => {
  const withoutImport = stripImportLine(source, fragment.importName, fragment.importPath)

  return withoutImport.replace(
    new RegExp(`^\\s*${escapeRegExp(fragment.blockSlug)}: ${escapeRegExp(fragment.importName)},\\n?`, 'm'),
    '',
  )
}

const stripPagesLayoutFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>,
) => {
  const withoutImport = stripImportLine(source, fragment.importName, fragment.importPath)
  const layoutIndex = withoutImport.indexOf(layoutAnchor)

  if (layoutIndex === -1) {
    throw new Error('Unable to find the layout tab in Pages collection config.')
  }

  const layoutSlice = withoutImport.slice(layoutIndex)
  const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!blocksMatch || typeof blocksMatch.index !== 'number') {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  const absoluteMatchStart = layoutIndex + blocksMatch.index
  const absoluteMatchEnd = absoluteMatchStart + blocksMatch[0].length
  const remainingEntries = blocksMatch[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => entry !== fragment.blockName)
  const replacement = `blocks: [${remainingEntries.join(', ')}],`

  return `${withoutImport.slice(0, absoluteMatchStart)}${replacement}${withoutImport.slice(absoluteMatchEnd)}`
}

const copyProjectFixture = async () => {
  const tempDir = await fsMkdtemp(path.join(os.tmpdir(), 'payload-kit-fixture-'))
  await cp(repoRoot, tempDir, {
    filter: (source) => {
      const relative = path.relative(repoRoot, source)

      if (!relative) {
        return true
      }

      const ignoredRoots = [
        '.git',
        '.next',
        '.payload-kit',
        '.playwright-cli',
        'node_modules',
        'output',
        'playwright-report',
        'test-results',
      ]

      return !ignoredRoots.some((ignoredRoot) => relative === ignoredRoot || relative.startsWith(`${ignoredRoot}${path.sep}`))
    },
    recursive: true,
  })

  await symlink(path.join(repoRoot, 'node_modules'), path.join(tempDir, 'node_modules'), 'dir')

  return tempDir
}

export const removeInstalledKitFromFixture = async ({
  fixtureDir,
  manifest,
}: {
  fixtureDir: string
  manifest: Pick<KitManifest, 'files' | 'payloadFragments'>
}) => {
  await Promise.all(
    manifest.files.map((filePath) => rm(path.join(fixtureDir, filePath), { force: true, recursive: true })),
  )

  const renderBlocksPath = path.join(fixtureDir, 'src', 'blocks', 'RenderBlocks.tsx')
  const pagesIndexPath = path.join(fixtureDir, 'src', 'collections', 'Pages', 'index.ts')

  let renderBlocksSource = await readFile(renderBlocksPath, 'utf8')
  let pagesIndexSource = await readFile(pagesIndexPath, 'utf8')

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      renderBlocksSource = stripRenderBlocksFragment(renderBlocksSource, fragment)
      continue
    }

    pagesIndexSource = stripPagesLayoutFragment(pagesIndexSource, fragment)
  }

  await Promise.all([
    writeFile(renderBlocksPath, renderBlocksSource, 'utf8'),
    writeFile(pagesIndexPath, pagesIndexSource, 'utf8'),
  ])
}

export const createInstallFixture = async (kitName: string) => {
  const fixtureDir = await copyProjectFixture()
  const manifest = await loadManifest(kitName)

  await removeInstalledKitFromFixture({
    fixtureDir,
    manifest,
  })

  return {
    fixtureDir,
    manifest,
  }
}
