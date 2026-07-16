import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from '../../tools/payload-components/constants'
import { loadManifest } from '../../tools/payload-components/manifest'
import {
  applyPayloadFragments,
  verifyInstalledPayloadFragments,
} from '../../tools/payload-components/project'
import { runCommand } from '../../tools/payload-components/utils'

import { expectInstalledComponents, readInstallState } from './payload-components-assertions'
import { createInstallFixture, createInstallFixtureForComponents } from './payload-components-fixture'

const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')
const integrationCommandTimeoutMs = 60_000

type RegistryDefinition = {
  items: Array<{
    files?: Array<{ path: string; target?: string }>
    name: string
  }>
}

const representativeInstallComponents = [
  'embed-basic',
  'hero-basic',
  'feature-grid-basic',
  'logo-cloud-marquee',
  'call-to-action-signup',
  'team-grid',
  'faq-accordion',
  'faq-grid',
  'comparator-grid',
  'testimonials-grid',
  'pricing-cards',
] as const

const idempotencyComponents = ['hero-basic', 'logo-cloud-marquee'] as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const manifestNames = async () =>
  (await readdir(manifestsDir))
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => entry.replace(/\.json$/, ''))
    .sort()

const runAddCommand = async (fixtureDir: string, componentName: string) =>
  runCommand({
    args: [payloadComponentBin, 'add', componentName, '--cwd', fixtureDir],
    captureOutput: true,
    command: process.execPath,
    cwd: repoRoot,
    env: process.env,
    timeoutMs: integrationCommandTimeoutMs,
  })

describe('payload-components manifests', () => {
  it('keeps every manifest wired to registry source, docs, and recovery targets', async () => {
    const [registry, names] = await Promise.all([
      readJson<RegistryDefinition>(registryPath),
      manifestNames(),
    ])
    const registryByName = new Map(registry.items.map((item) => [item.name, item]))
    const expectedPatchFor = (kind: string) =>
      kind === 'renderBlocks' ? RENDER_BLOCKS_FILE : PAGES_LAYOUT_FILE

    expect(names.length).toBeGreaterThan(0)

    for (const name of names) {
      const manifest = await loadManifest(name)
      const registryItem = registryByName.get(manifest.registryItemName)

      expect(registryItem, `${name} missing registry item`).toBeTruthy()

      const registryTargets = (registryItem?.files ?? [])
        .map((file) => file.target?.replace(/^~\//, ''))
        .filter(Boolean)
        .sort()

      expect(registryTargets).toEqual([...manifest.files].sort())

      for (const file of registryItem?.files ?? []) {
        await expect(readFile(path.join(repoRoot, file.path), 'utf8')).resolves.toBeTruthy()
      }

      await expect(
        readFile(path.join(repoRoot, 'content', 'docs', 'components', `${name}.mdx`), 'utf8'),
      ).resolves.toContain(`npx payload-components add ${name}`)

      for (const fragment of manifest.payloadFragments) {
        expect(manifest.recovery.patchedFiles).toContain(expectedPatchFor(fragment.kind))
      }
    }
  })

  it('gives every SQL-backed block a short unique database name', async () => {
    const names = await manifestNames()
    const databaseNames = new Set<string>()

    for (const name of names) {
      const manifest = await loadManifest(name)
      const configPath = manifest.files.find((file) => file.endsWith('/config.ts'))
      expect(configPath, `${name} missing block config`).toBeTruthy()
      if (!configPath) continue

      const config = await readFile(
        path.join(repoRoot, 'payload-components', 'source', configPath.replace(/^src\//, '')),
        'utf8',
      )
      const databaseName = config.match(
        /export const \w+: Block = \{\s*\n\s*slug: '[^']+',\s*\n\s*\/\/ Existing apps must migrate stored data before adopting this identifier:\s*\n\s*\/\/ https:\/\/www\.payload-components\.xyz\/docs\/registry#installed-source-and-migrations\s*\n\s*dbName: '([^']+)'/,
      )?.[1]

      expect(
        databaseName,
        `${name} must put the migration warning immediately before its top-level dbName`,
      ).toBeTruthy()
      if (!databaseName) continue
      expect(databaseName.length, `${name} dbName is too long`).toBeLessThanOrEqual(18)
      expect(databaseNames.has(databaseName), `${name} reuses dbName ${databaseName}`).toBe(false)
      databaseNames.add(databaseName)
    }

    expect(databaseNames.size).toBe(names.length)
  })

  it('documents the copied-source database migration boundary', async () => {
    const [workspaceReadme, registryDocs, componentTemplate] = await Promise.all([
      readFile(path.join(repoRoot, 'payload-components', 'README.md'), 'utf8'),
      readFile(path.join(repoRoot, 'content', 'docs', 'registry.mdx'), 'utf8'),
      readFile(
        path.join(repoRoot, 'payload-components', 'templates', 'component-template', 'README.md'),
        'utf8',
      ),
    ])

    for (const [label, source] of [
      ['workspace README', workspaceReadme],
      ['registry docs', registryDocs],
    ] as const) {
      expect(source, `${label} must state the source ownership boundary`).toContain(
        'does not overwrite installed component source',
      )
      expect(source, `${label} must cover database-name updates`).toContain('`dbName`')
      expect(source, `${label} must scope database-name migrations`).toContain('SQL-backed')
      expect(source, `${label} must assign migration ownership`).toContain(
        'consumer project must own the migration',
      )
      expect(source, `${label} must require a data-preserving migration review`).toContain(
        'rename rather than drop and recreate',
      )
    }

    expect(workspaceReadme).toContain('### Deterministic fixture checks')
    expect(workspaceReadme).toContain('### Fresh-consumer smoke validation')
    expect(workspaceReadme).toContain('### Release gate')
    expect(workspaceReadme).toContain('`quick-checks`')
    expect(registryDocs).toContain('## Installed source and migrations')
    for (const shardIndex of [0, 1, 2, 3]) {
      expect(componentTemplate).toContain(`pnpm test:fresh -- --shard-index ${shardIndex}`)
    }
  })
})

describe('payload-components add', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('uses preseeded source and declared local dependencies in the default integration fixture', async () => {
    const componentNames = ['logo-cloud-marquee', 'faq-accordion', 'call-to-action-signup']
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames, {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)

    for (const manifest of manifests) {
      for (const file of manifest.files) {
        await expect(readFile(path.join(fixtureDir, file), 'utf8')).resolves.toBeTruthy()
      }
    }

    const fixturePackage = await readJson<{
      dependencies?: Record<string, string>
    }>(path.join(fixtureDir, 'package.json'))
    expect(fixturePackage.dependencies?.motion).toBe('^12.0.0')
    await expect(
      readFile(path.join(fixtureDir, 'src', 'components', 'ui', 'accordion.tsx'), 'utf8'),
    ).resolves.toBeTruthy()
    await expect(
      readFile(path.join(fixtureDir, 'src', 'components', 'ui', 'button.tsx'), 'utf8'),
    ).resolves.toBeTruthy()
  })

  it.each(representativeInstallComponents)('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName, {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs multiple components without duplicate registrations', async () => {
    const componentNames = ['hero-basic', 'feature-grid-basic', 'logo-cloud-marquee']
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames, {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)

    for (const componentName of componentNames) {
      await runAddCommand(fixtureDir, componentName)
    }

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it.each(idempotencyComponents)('treats a second %s install as idempotent', async (componentName) => {
    const manifest = await loadManifest(componentName)
    const { fixtureDir } = await createInstallFixture(manifest.name, {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)

  it('records the discovered Bun lockfile name in recovery state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('logo-cloud-marquee', {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)
    await rm(path.join(fixtureDir, 'pnpm-lock.yaml'))
    await writeFile(path.join(fixtureDir, 'bun.lock'), 'bun modern lockfile\n', 'utf8')

    await runAddCommand(fixtureDir, manifest.name)

    const state = await readInstallState(fixtureDir)
    expect(state.components[manifest.name]?.patchedFiles).toContain('bun.lock')
    expect(state.components[manifest.name]?.patchedFiles).not.toContain('bun.lockb')
  }, 180000)
})

describe('payload-components fragment patching', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('dedupes a block already registered in a reformatted anchor region', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    const renderBlocks = manifest.payloadFragments.find((fragment) => fragment.kind === 'renderBlocks')
    const pagesLayout = manifest.payloadFragments.find((fragment) => fragment.kind === 'pagesLayout')

    if (renderBlocks?.kind !== 'renderBlocks' || pagesLayout?.kind !== 'pagesLayout') {
      throw new Error('hero-basic must declare both a renderBlocks and a pagesLayout fragment')
    }

    /* The same registration the installer would add, but reformatted the way a
       Prettier reflow or hand-edit leaves it: double quotes + semicolons, odd
       indentation, no trailing comma. Exact-line dedup misses this and appends a
       duplicate key; the shared structural matchers must treat it as present. */
    const renderBlocksPath = path.join(fixtureDir, RENDER_BLOCKS_FILE)
    await writeFile(
      renderBlocksPath,
      [
        `import { ${renderBlocks.importName} } from "${renderBlocks.importPath}";`,
        "import React, { Fragment } from 'react'",
        '',
        'const blockComponents = {',
        `    ${renderBlocks.blockSlug}:${renderBlocks.importName}`,
        '}',
        '',
        'export const RenderBlocks = ({ blocks }: { blocks?: unknown[] }) => blocks',
        '',
      ].join('\n'),
      'utf8',
    )

    const pagesPath = path.join(fixtureDir, PAGES_LAYOUT_FILE)
    await writeFile(
      pagesPath,
      [
        `import { ${pagesLayout.importName} } from "${pagesLayout.importPath}";`,
        "import type { CollectionConfig } from 'payload'",
        '',
        'export const Pages: CollectionConfig = {',
        "  slug: 'pages',",
        '  fields: [',
        '    {',
        "      name: 'layout',",
        "      type: 'blocks',",
        `      blocks: [ ${pagesLayout.blockName} ],`,
        '    },',
        '  ],',
        '}',
        '',
      ].join('\n'),
      'utf8',
    )

    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

    const patchedRenderBlocks = await readFile(renderBlocksPath, 'utf8')
    const patchedPages = await readFile(pagesPath, 'utf8')

    const blockKeyMatches =
      patchedRenderBlocks.match(new RegExp(`\\b${renderBlocks.blockSlug}\\s*:`, 'g')) ?? []
    expect(blockKeyMatches, 'renderBlocks gained a duplicate block registration').toHaveLength(1)

    const renderImportMatches =
      patchedRenderBlocks.match(new RegExp(`import\\s*\\{[^}]*\\b${renderBlocks.importName}\\b`, 'g')) ?? []
    expect(renderImportMatches, 'renderBlocks gained a duplicate import').toHaveLength(1)

    const pagesImportMatches =
      patchedPages.match(new RegExp(`import\\s*\\{[^}]*\\b${pagesLayout.importName}\\b`, 'g')) ?? []
    expect(pagesImportMatches, 'pages gained a duplicate import').toHaveLength(1)

    const verification = await verifyInstalledPayloadFragments({ cwd: fixtureDir, manifest })
    expect(verification.isValid, JSON.stringify(verification.missingFragments)).toBe(true)
  })
})
