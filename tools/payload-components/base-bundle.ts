import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { hashSource } from './component-files'
import { readSafeProjectFile, safeProjectFileExists, writeSafeProjectFile } from './safe-path'
import type { BaseBundleStateEntry } from './types'
import { commitFileChanges, isPathInside, repoRoot } from './utils'

/* The starter primitives every installed block imports.
 *
 * Across all 154 shipped source files there are exactly four consumer imports
 * outside shadcn UI — `@/utilities/ui`, `@/components/Media`, `@/components/Link`,
 * and `@/fields/linkGroup` — plus the two host files the installer patches. A
 * project scaffolded by `create-payload-app` has none of them, which is why a
 * bare app could not accept an install before this bundle existed.
 *
 * These are copied, never `shadcn add`ed: they are not catalog components, they
 * carry no Payload wiring of their own, and they must not appear in the catalog.
 * A pre-existing implementation is left alone; files created or adopted by the
 * scaffold are recorded so later runs can update clean copies without treating
 * consumer-owned code as ours. */

export const BASE_BUNDLE_FILES = [
  'src/utilities/ui.ts',
  'src/fields/link.ts',
  'src/fields/linkGroup.ts',
  'src/components/Link/index.tsx',
  'src/components/Media/index.tsx',
  'src/collections/Media.ts',
  'src/collections/Pages/index.ts',
  'src/blocks/RenderBlocks.tsx',
] as const

/* npm packages the copied files import that a bare Payload app does not have. */
export const BASE_BUNDLE_DEPENDENCIES = {
  clsx: '^2.1.1',
  'tailwind-merge': '^3.0.0',
} as const

const baseSourceRoot = path.join(repoRoot, 'payload-components', 'source', 'base')

const getBaseSourcePath = (projectPath: string) =>
  path.resolve(baseSourceRoot, projectPath.replace(/^src\//, ''))

const readOptionalFile = async (cwd: string, filePath: string) =>
  (await safeProjectFileExists({ cwd, filePath }))
    ? await readSafeProjectFile({ cwd, filePath })
    : undefined

const readCanonicalBaseFiles = async (): Promise<Map<string, string>> => {
  const files = await Promise.all(
    BASE_BUNDLE_FILES.map(async (projectPath) => {
      const sourcePath = getBaseSourcePath(projectPath)

      if (!isPathInside(baseSourceRoot, sourcePath)) {
        throw new Error(`Refusing to read starter base source outside ${baseSourceRoot}.`)
      }

      return [projectPath, await readFile(sourcePath, 'utf8')] as const
    }),
  )

  return new Map<string, string>(files)
}

/* The version is the contract itself, not a hand-maintained number that can be
 * forgotten when a primitive, dependency, or file set changes. */
export const getBaseBundleVersion = async () => {
  const canonical = await readCanonicalBaseFiles()
  const digest = createHash('sha256')

  for (const projectPath of BASE_BUNDLE_FILES) {
    digest.update(projectPath)
    digest.update('\0')
    digest.update(canonical.get(projectPath) ?? '')
    digest.update('\0')
  }

  digest.update(JSON.stringify(BASE_BUNDLE_DEPENDENCIES))

  return `sha256:${digest.digest('hex')}`
}

const CONFIG_COLLECTIONS_ANCHOR = /collections:\s*\[/

export const syncBaseBundle = async ({
  cwd,
  force = false,
  recordedFileHashes = {},
}: {
  cwd: string
  force?: boolean
  recordedFileHashes?: BaseBundleStateEntry['fileHashes']
}) => {
  const canonical = await readCanonicalBaseFiles()
  const adopted: string[] = []
  const created: string[] = []
  const fileHashes: Record<string, string> = {}
  const kept: string[] = []
  const modified: string[] = []
  const removed: string[] = []
  const updated: string[] = []
  const changes: Array<{ content: string | null; filePath: string }> = []

  for (const projectPath of new Set([...BASE_BUNDLE_FILES, ...Object.keys(recordedFileHashes)])) {
    const destinationPath = path.resolve(cwd, projectPath)

    if (!isPathInside(cwd, destinationPath)) {
      throw new Error(`Refusing to scaffold "${projectPath}" outside ${cwd}.`)
    }

    const current = await readOptionalFile(cwd, destinationPath)
    const recordedHash = recordedFileHashes[projectPath]
    const canonicalSource = canonical.get(projectPath)

    if (canonicalSource === undefined) {
      if (current === undefined) {
        continue
      }

      if (recordedHash && (hashSource(current) === recordedHash || force)) {
        changes.push({ content: null, filePath: destinationPath })
        removed.push(projectPath)
      } else {
        modified.push(projectPath)
        if (recordedHash) fileHashes[projectPath] = recordedHash
      }

      continue
    }

    const canonicalHash = hashSource(canonicalSource)

    if (current === undefined) {
      changes.push({ content: canonicalSource, filePath: destinationPath })
      created.push(projectPath)
      fileHashes[projectPath] = canonicalHash
      continue
    }

    const currentHash = hashSource(current)

    if (currentHash === canonicalHash) {
      fileHashes[projectPath] = canonicalHash

      if (!recordedHash) {
        adopted.push(projectPath)
      }

      continue
    }

    if (!recordedHash) {
      kept.push(projectPath)
      continue
    }

    if (currentHash !== recordedHash && !force) {
      modified.push(projectPath)
      fileHashes[projectPath] = recordedHash
      continue
    }

    if (currentHash !== canonicalHash) {
      changes.push({ content: canonicalSource, filePath: destinationPath })
      updated.push(projectPath)
    }

    fileHashes[projectPath] = canonicalHash
  }

  await commitFileChanges(changes, { cwd })

  return { adopted, created, fileHashes, kept, modified, removed, updated }
}

export const inspectBaseBundle = async ({
  cwd,
  installed,
}: {
  cwd: string
  installed: BaseBundleStateEntry
}) => {
  const missingFiles: string[] = []
  const modifiedFiles: string[] = []

  for (const [projectPath, recordedHash] of Object.entries(installed.fileHashes)) {
    const current = await readOptionalFile(cwd, path.join(cwd, projectPath))

    if (current === undefined) {
      missingFiles.push(projectPath)
    } else if (hashSource(current) !== recordedHash) {
      modifiedFiles.push(projectPath)
    }
  }

  const registryVersion = await getBaseBundleVersion()

  return {
    isClean:
      installed.version === registryVersion &&
      missingFiles.length === 0 &&
      modifiedFiles.length === 0,
    missingFiles,
    modifiedFiles,
    recordedVersion: installed.version,
    registryVersion,
    updateAvailable: installed.version !== registryVersion,
  }
}

export const copyBaseBundle = async ({ cwd }: { cwd: string }) => {
  const result = await syncBaseBundle({ cwd })

  return {
    created: result.created,
    skipped: [...result.adopted, ...result.kept, ...result.modified],
  }
}

/* Register the two collections in the project's Payload config.
 *
 * Text-anchored like the rest of the installer's patching, and idempotent: a
 * config that already names a collection is left as it is, so a re-run adds
 * nothing. A config with no `collections:` array at all is reported rather than
 * rewritten — guessing at the shape of someone's buildConfig call is exactly the
 * kind of edit that is hard to review. */
export const registerBaseCollections = async ({
  configFileRelPath,
  cwd,
}: {
  configFileRelPath: string
  cwd: string
}) => {
  const configPath = path.join(cwd, configFileRelPath)
  const source = await readSafeProjectFile({ cwd, filePath: configPath })
  const anchor = CONFIG_COLLECTIONS_ANCHOR.exec(source)

  if (!anchor || anchor.index === undefined) {
    return { patched: false, reason: 'no-collections-array' as const }
  }

  const missing = (['Pages', 'Media'] as const).filter(
    (collection) => !new RegExp(`\\b${collection}\\b`).test(source),
  )

  if (missing.length === 0) {
    return { patched: false, reason: 'already-registered' as const }
  }

  const imports = missing
    .map((collection) =>
      collection === 'Pages'
        ? "import { Pages } from './collections/Pages'"
        : "import { Media } from './collections/Media'",
    )
    .join('\n')
  const insertAt = anchor.index + anchor[0].length
  const patched = `${imports}\n${source.slice(0, insertAt)}${missing.join(', ')}, ${source.slice(insertAt)}`

  await writeSafeProjectFile({ contents: patched, cwd, filePath: configPath })

  return { patched: true, reason: 'registered' as const, registered: missing }
}
