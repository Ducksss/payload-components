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

export type InstalledFileStatus = 'missing' | 'modified' | 'unchanged' | 'unpublished'

export type InstalledFileComparison = {
  projectPath: string
  status: InstalledFileStatus
}

export type InstalledFileReport = {
  comparisons: InstalledFileComparison[]
  missing: string[]
  modified: string[]
}

/* Compare copied source by content, not bytes: the only differences a healthy
 * install can introduce are line endings and a trailing newline (git autocrlf,
 * editors-on-save). Anything else is a real local edit we must not clobber. */
const normalizeSource = (value: string) => value.replaceAll('\r\n', '\n').replace(/\s+$/, '')

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

/* Classify every file a component owns in the consumer repo. `unpublished`
 * means the manifest claims a file the registry item does not ship — a repo
 * authoring bug rather than consumer drift, so it is never treated as an edit. */
export const compareInstalledFiles = async ({
  cwd,
  localized = false,
  manifest,
}: {
  cwd: string
  /* A localized install legitimately differs from the shipped source: its block
   * config's fields array is wrapped in localizeFields(...). Apply the same
   * deterministic transform to the canonical side so a localized component reads
   * as clean, and a real local edit on top of it still reads as modified. */
  localized?: boolean
  manifest: Pick<ComponentManifest, 'files' | 'registryItemName'>
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

    const shipped = await readFile(canonicalFile.sourcePath, 'utf8')
    const canonical =
      localized && isBlockConfigFile(projectPath) ? localizeBlockConfigSource(shipped) : shipped

    comparisons.push({
      projectPath,
      status:
        normalizeSource(installed) === normalizeSource(canonical) ? 'unchanged' : 'modified',
    })
  }

  return {
    comparisons,
    missing: comparisons.filter(({ status }) => status === 'missing').map(({ projectPath }) => projectPath),
    modified: comparisons
      .filter(({ status }) => status === 'modified')
      .map(({ projectPath }) => projectPath),
  }
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
