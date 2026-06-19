import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect } from 'vitest'

import type { InstallState, ComponentManifest, PayloadFragment } from '../../tools/payload-components/types'

const layoutAnchor = "name: 'layout'"

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

export const readFixtureFile = (fixtureDir: string, filePath: string) =>
  readFile(path.join(fixtureDir, filePath), 'utf8')

export const readInstallState = async (fixtureDir: string) =>
  JSON.parse(
    await readFixtureFile(fixtureDir, path.join('.payload-components', 'state.json')),
  ) as InstallState

const countOccurrences = (source: string, text: string) =>
  source.match(new RegExp(escapeRegExp(text), 'g'))?.length ?? 0

const getLayoutBlockEntries = (source: string) => {
  const layoutIndex = source.indexOf(layoutAnchor)

  if (layoutIndex === -1) {
    throw new Error('Unable to find the layout tab in Pages collection config.')
  }

  const layoutSlice = source.slice(layoutIndex)
  const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!blocksMatch?.[1]) {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  return blocksMatch[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const getPayloadFragment = <TKind extends PayloadFragment['kind']>(
  manifest: ComponentManifest,
  kind: TKind,
): Extract<PayloadFragment, { kind: TKind }> => {
  const fragment = manifest.payloadFragments.find((candidate) => candidate.kind === kind)

  if (!fragment) {
    throw new Error(`Unable to find the ${kind} payload fragment for "${manifest.name}".`)
  }

  return fragment as Extract<PayloadFragment, { kind: TKind }>
}

const expectManifestFilesInstalled = async (fixtureDir: string, manifest: ComponentManifest) => {
  await Promise.all(
    manifest.files.map(async (filePath) => {
      const installedSource = await readFixtureFile(fixtureDir, filePath)
      expect(installedSource.length).toBeGreaterThan(0)
    }),
  )
}

const expectUniqueRegistrations = ({
  manifest,
  pagesSource,
  renderBlocksSource,
}: {
  manifest: ComponentManifest
  pagesSource: string
  renderBlocksSource: string
}) => {
  const renderBlocksFragment = getPayloadFragment(manifest, 'renderBlocks')
  const pagesLayoutFragment = getPayloadFragment(manifest, 'pagesLayout')

  expect(
    countOccurrences(
      renderBlocksSource,
      `import { ${renderBlocksFragment.importName} } from '${renderBlocksFragment.importPath}'`,
    ),
  ).toBe(1)
  expect(
    countOccurrences(
      renderBlocksSource,
      `${renderBlocksFragment.blockSlug}: ${renderBlocksFragment.importName}`,
    ),
  ).toBe(1)

  expect(
    countOccurrences(
      pagesSource,
      `import { ${pagesLayoutFragment.importName} } from '${pagesLayoutFragment.importPath}'`,
    ),
  ).toBe(1)
  expect(
    getLayoutBlockEntries(pagesSource).filter((entry) => entry === pagesLayoutFragment.blockName),
  ).toHaveLength(1)
}

const expectInstalledStateEntry = (state: InstallState, manifest: ComponentManifest) => {
  const expectedPatchedFiles = normalizeFileList([
    ...manifest.recovery.patchedFiles,
    ...(Object.keys(manifest.dependencies).length > 0 ? ['package.json', 'pnpm-lock.yaml'] : []),
  ])

  expect(state.components[manifest.name]).toMatchObject({
    manifestVersion: manifest.version,
    patchedFiles: expectedPatchedFiles,
    registryItemName: manifest.registryItemName,
    status: 'installed',
  })
  expect(state.components[manifest.name]?.installedAt).toBeTruthy()
}

export const expectInstalledComponents = async (
  fixtureDir: string,
  manifests: ComponentManifest[],
) => {
  await Promise.all(manifests.map((manifest) => expectManifestFilesInstalled(fixtureDir, manifest)))

  const [renderBlocksSource, pagesSource, state] = await Promise.all([
    readFixtureFile(fixtureDir, path.join('src', 'blocks', 'RenderBlocks.tsx')),
    readFixtureFile(fixtureDir, path.join('src', 'collections', 'Pages', 'index.ts')),
    readInstallState(fixtureDir),
  ])

  for (const manifest of manifests) {
    expectUniqueRegistrations({
      manifest,
      pagesSource,
      renderBlocksSource,
    })
    expectInstalledStateEntry(state, manifest)
  }
}
