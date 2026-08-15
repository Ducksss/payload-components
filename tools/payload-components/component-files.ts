import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import type { ComponentManifest, RegistryDefinition } from './types'

import { isBlockConfigFile, localizeBlockConfigSource } from './project'
import { isPathInside, readJsonFile, repoRoot } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')
const sourceRoot = path.join(repoRoot, 'payload-components', 'source')

export type CanonicalFile = {
  /* Path inside the consumer project, e.g. src/blocks/HeroBasic/config.ts. */
  projectPath: string
  /* Absolute path to the shipped source of record in this repo. */
  sourcePath: string
}

/* `outdated` is the file this CLI wrote at an earlier version, still untouched:
 * it differs from what ships now, but matches the hash recorded at install, so
 * overwriting it loses nothing. Only `modified` — differing from both — is a
 * local edit. Without a recorded hash the two are indistinguishable and
 * everything that differs stays `modified`, which is the safe reading. */
export type InstalledFileStatus = 'missing' | 'modified' | 'outdated' | 'unchanged' | 'unpublished'

export type InstalledFileComparison = {
  projectPath: string
  status: InstalledFileStatus
}

export type InstalledFileReport = {
  comparisons: InstalledFileComparison[]
  missing: string[]
  modified: string[]
  outdated: string[]
}

/* Compare copied source by content, not bytes: the only differences a healthy
 * install can introduce are line endings and a trailing newline (git autocrlf,
 * editors-on-save). Anything else is a real local edit we must not clobber. */
const normalizeSource = (value: string) => value.replaceAll('\r\n', '\n').replace(/\s+$/, '')

/* Hash the normalized text, so the line-ending and trailing-newline drift that
 * `normalizeSource` forgives cannot turn a recorded file into a false edit. */
export const hashSource = (value: string) =>
  createHash('sha256').update(normalizeSource(value)).digest('hex')

/* Map a registry item's shipped files to where they land in a consumer repo.
 * The registry item is the source of truth for that mapping (`target`), so
 * `diff`/`update` compare against exactly what an install would have written. */
export const resolveCanonicalFiles = async (registryItemName: string) => {
  const registry = await readJsonFile<RegistryDefinition>(registryDefinitionPath)
  const registryItem = registry.items.find((item) => item.name === registryItemName)

  if (!registryItem) {
    throw new Error(
      `Registry item "${registryItemName}" does not exist in payload-components/registry.json.`,
    )
  }

  const canonicalFiles = new Map<string, CanonicalFile>()

  for (const file of registryItem.files ?? []) {
    const projectPath = file.target.replace(/^~\//, '')
    const sourcePath = path.resolve(repoRoot, file.path)

    if (!isPathInside(sourceRoot, sourcePath)) {
      throw new Error(
        `Registry item "${registryItemName}" references "${file.path}", which is outside payload-components/source.`,
      )
    }

    canonicalFiles.set(projectPath, { projectPath, sourcePath })
  }

  return canonicalFiles
}

/* What an install of this component would write to `projectPath` right now. A
 * localized install legitimately differs from the shipped source: its block
 * config's fields array is wrapped in localizeFields(...). Applying the same
 * deterministic transform to the canonical side makes a localized component read
 * as clean, while a real local edit on top of it still reads as modified. */
const readCanonicalSource = async ({
  canonicalFile,
  localized,
  projectPath,
}: {
  canonicalFile: CanonicalFile
  localized: boolean
  projectPath: string
}) => {
  const shipped = await readFile(canonicalFile.sourcePath, 'utf8')

  return localized && isBlockConfigFile(projectPath) ? localizeBlockConfigSource(shipped) : shipped
}

/* Classify every file a component owns in the consumer repo. `unpublished`
 * means the manifest claims a file the registry item does not ship — a repo
 * authoring bug rather than consumer drift, so it is never treated as an edit. */
export const compareInstalledFiles = async ({
  cwd,
  localized = false,
  manifest,
  recordedHashes,
}: {
  cwd: string
  localized?: boolean
  manifest: Pick<ComponentManifest, 'files' | 'registryItemName'>
  /* Per-file hashes from install state — what this CLI last wrote. Supplying
   * them is what separates an untouched older version from a local edit; without
   * them every difference from the current source reads as an edit. */
  recordedHashes?: Record<string, string>
}): Promise<InstalledFileReport> => {
  const canonicalFiles = await resolveCanonicalFiles(manifest.registryItemName)
  const comparisons: InstalledFileComparison[] = []

  for (const projectPath of manifest.files) {
    const canonicalFile = canonicalFiles.get(projectPath)

    if (!canonicalFile) {
      comparisons.push({ projectPath, status: 'unpublished' })
      continue
    }

    const installed = await readFile(path.join(cwd, projectPath), 'utf8').catch(() => undefined)

    if (installed === undefined) {
      comparisons.push({ projectPath, status: 'missing' })
      continue
    }

    const canonical = await readCanonicalSource({ canonicalFile, localized, projectPath })

    if (normalizeSource(installed) === normalizeSource(canonical)) {
      comparisons.push({ projectPath, status: 'unchanged' })
      continue
    }

    const recordedHash = recordedHashes?.[projectPath]

    comparisons.push({
      projectPath,
      status: recordedHash !== undefined && recordedHash === hashSource(installed)
        ? 'outdated'
        : 'modified',
    })
  }

  const collect = (status: InstalledFileStatus) =>
    comparisons.filter((comparison) => comparison.status === status).map(({ projectPath }) => projectPath)

  return {
    comparisons,
    missing: collect('missing'),
    modified: collect('modified'),
    outdated: collect('outdated'),
  }
}

/* Stamp what an install just wrote, for the state entry. Only files that match
 * the shipped source right now are stamped: anything already differing may carry
 * local edits, and recording those would license a later `update` to overwrite
 * them. An unstamped file simply keeps the conservative old behaviour. */
export const hashInstalledFiles = async ({
  cwd,
  localized = false,
  manifest,
}: {
  cwd: string
  localized?: boolean
  manifest: Pick<ComponentManifest, 'files' | 'registryItemName'>
}): Promise<Record<string, string>> => {
  const canonicalFiles = await resolveCanonicalFiles(manifest.registryItemName)
  const fileHashes: Record<string, string> = {}

  for (const projectPath of manifest.files) {
    const canonicalFile = canonicalFiles.get(projectPath)

    if (!canonicalFile) {
      continue
    }

    const installed = await readFile(path.join(cwd, projectPath), 'utf8').catch(() => undefined)

    if (installed === undefined) {
      continue
    }

    const canonical = await readCanonicalSource({ canonicalFile, localized, projectPath })

    if (normalizeSource(installed) !== normalizeSource(canonical)) {
      continue
    }

    fileHashes[projectPath] = hashSource(installed)
  }

  return fileHashes
}

/* Copy a shipped shared helper straight into the project. Helpers like
 * localizeFields are not catalog components — they carry no Payload wiring, no
 * demo twin, and no docs page of their own — so they are copied directly rather
 * than routed through a registry item that would show up in the catalog. An
 * existing copy is left alone; the consumer may have edited it. */
export const copySharedSourceFile = async ({
  cwd,
  projectPath,
  sourceSubdirectory,
}: {
  cwd: string
  projectPath: string
  /* Subdirectory of payload-components/source to copy from. Block helpers live
   * at the root; the starter base bundle lives under `base/`. */
  sourceSubdirectory?: string
}) => {
  const sourcePath = path.resolve(
    sourceRoot,
    sourceSubdirectory ?? '',
    projectPath.replace(/^src\//, ''),
  )

  if (!isPathInside(sourceRoot, sourcePath)) {
    throw new Error(`Refusing to copy "${projectPath}" from outside payload-components/source.`)
  }

  const destinationPath = path.resolve(cwd, projectPath)

  if (!isPathInside(cwd, destinationPath)) {
    throw new Error(`Refusing to write "${projectPath}" outside ${cwd}.`)
  }

  const alreadyPresent = await readFile(destinationPath, 'utf8').then(
    () => true,
    () => false,
  )

  if (alreadyPresent) {
    return false
  }

  await mkdir(path.dirname(destinationPath), { recursive: true })
  await copyFile(sourcePath, destinationPath)

  return true
}

/* Files this component may delete on its own: everything it owns that no other
 * still-recorded component also ships. Family variants share their field base
 * (src/blocks/shared/heroFields.ts), so removing hero-basic while hero-video
 * stays installed must leave the shared file in place. */
export const partitionOwnedFiles = ({
  files,
  retainedManifests,
}: {
  files: string[]
  retainedManifests: Array<Pick<ComponentManifest, 'files' | 'name'>>
}) => {
  const sharedWith = new Map<string, string[]>()

  for (const projectPath of files) {
    const owners = retainedManifests
      .filter((manifest) => manifest.files.includes(projectPath))
      .map((manifest) => manifest.name)
      .sort()

    if (owners.length > 0) {
      sharedWith.set(projectPath, owners)
    }
  }

  return {
    exclusiveFiles: files.filter((projectPath) => !sharedWith.has(projectPath)).sort(),
    sharedFiles: [...sharedWith.entries()]
      .map(([projectPath, owners]) => ({ owners, projectPath }))
      .sort((left, right) => left.projectPath.localeCompare(right.projectPath)),
  }
}
