import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { ComponentManifest, InstallStateEntry, RegistryDefinition } from './types'

import { isBlockConfigFile, localizeBlockConfigSource } from './project'
import { readSafeProjectFile, resolveSafeProjectPath } from './safe-path'
import { commitFileChanges, isPathInside, readJsonFile, repoRoot, type FileChange } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')
const installBaselinesPath = path.join(repoRoot, 'payload-components', 'install-baselines.json')
const sourceRoot = path.join(repoRoot, 'payload-components', 'source')

type InstallBaselines = {
  components: Record<
    string,
    Record<
      string,
      Record<
        string,
        {
          default: string
          localized?: string
        }
      >
    >
  >
  version: 1
}

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
export const normalizeSource = (value: string) => value.replaceAll('\r\n', '\n').replace(/\s+$/, '')

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

/* Update owns source delivery directly instead of deleting live files and
 * asking shadcn to recreate them. Every replacement and retired-file deletion
 * is staged, then committed as one rollback-capable batch. Dependency and
 * wiring reconciliation still runs through add's idempotent pipeline. */
export const replaceCanonicalComponentFiles = async ({
  additionalChanges = [],
  cwd,
  deleteFiles = [],
  localized = false,
  manifest,
}: {
  additionalChanges?: FileChange[]
  cwd: string
  deleteFiles?: string[]
  localized?: boolean
  manifest: Pick<ComponentManifest, 'files' | 'registryItemName'>
}) => {
  const canonicalFiles = await resolveCanonicalFiles(manifest.registryItemName)
  const changes: Array<{ content: string | null; filePath: string }> = []

  for (const projectPath of manifest.files) {
    const canonicalFile = canonicalFiles.get(projectPath)

    if (!canonicalFile) {
      throw new Error(
        `Registry item "${manifest.registryItemName}" does not ship manifest file "${projectPath}".`,
      )
    }

    const absolutePath = path.resolve(cwd, projectPath)

    if (!isPathInside(cwd, absolutePath)) {
      throw new Error(`Refusing to update "${projectPath}" outside ${cwd}.`)
    }

    const shipped = await readFile(canonicalFile.sourcePath, 'utf8')
    const content =
      localized && isBlockConfigFile(projectPath) ? localizeBlockConfigSource(shipped) : shipped

    changes.push({ content, filePath: absolutePath })
  }

  for (const projectPath of deleteFiles) {
    const absolutePath = path.resolve(cwd, projectPath)

    if (!isPathInside(cwd, absolutePath)) {
      throw new Error(`Refusing to retire "${projectPath}" outside ${cwd}.`)
    }

    changes.push({ content: null, filePath: absolutePath })
  }

  await commitFileChanges([...changes, ...additionalChanges], { cwd })
}

export const resolveCanonicalFileHashes = async ({
  localized,
  manifest,
}: {
  localized: boolean
  manifest: Pick<ComponentManifest, 'files' | 'registryItemName'>
}) => {
  const canonicalFiles = await resolveCanonicalFiles(manifest.registryItemName)
  const hashes: Record<string, string> = {}

  for (const projectPath of manifest.files) {
    const canonicalFile = canonicalFiles.get(projectPath)

    if (!canonicalFile) {
      return undefined
    }

    const shipped = await readFile(canonicalFile.sourcePath, 'utf8')
    const canonical =
      localized && isBlockConfigFile(projectPath) ? localizeBlockConfigSource(shipped) : shipped

    hashes[projectPath] = hashSource(canonical)
  }

  return hashes
}

/* Capture the exact successful install as the future merge base. Reading the
 * consumer files matters: localized installs deliberately differ from the
 * registry source, and only the final on-disk bytes describe what update may
 * safely replace later. */
export const snapshotInstalledFiles = async ({ cwd, files }: { cwd: string; files: string[] }) => {
  const hashes: Record<string, string> = {}

  for (const projectPath of [...new Set(files)].sort()) {
    const absolutePath = path.resolve(cwd, projectPath)

    if (!isPathInside(cwd, absolutePath)) {
      throw new Error(`Refusing to snapshot "${projectPath}" because it resolves outside ${cwd}.`)
    }

    const source = await readSafeProjectFile({ cwd, filePath: absolutePath }).catch(
      () => undefined,
    )

    if (source === undefined) {
      throw new Error(
        `Cannot record installed source baseline because "${projectPath}" is missing.`,
      )
    }

    hashes[projectPath] = hashSource(source)
  }

  return hashes
}

/* v3 state carries its own hashes. Older state did not, so source-changing
 * releases that predate v3 have a small shipped compatibility table. A legacy
 * entry at the current manifest version can still be reconstructed directly
 * from current canonical source. Anything else is unknown and must fail closed
 * instead of pretending an upstream change is a local edit (or vice versa). */
export const resolveRecordedFileHashes = async ({
  componentName,
  installed,
  manifest,
}: {
  componentName: string
  installed: Pick<InstallStateEntry, 'fileHashes' | 'localized' | 'manifestVersion'>
  manifest?: Pick<ComponentManifest, 'files' | 'registryItemName' | 'version'>
}): Promise<Record<string, string> | undefined> => {
  if (Object.keys(installed.fileHashes).length > 0) {
    return { ...installed.fileHashes }
  }

  const localized = installed.localized === true

  if (manifest && installed.manifestVersion === manifest.version) {
    return await resolveCanonicalFileHashes({ localized, manifest })
  }

  const baselines = await readJsonFile<InstallBaselines>(installBaselinesPath)
  const recorded = baselines.components[componentName]?.[installed.manifestVersion]

  if (!recorded) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(recorded).map(([projectPath, hashes]) => [
      projectPath,
      localized && hashes.localized ? hashes.localized : hashes.default,
    ]),
  )
}

/* Classify every file a component owns in the consumer repo. `unpublished`
 * means the manifest claims a file the registry item does not ship — a repo
 * authoring bug rather than consumer drift, so it is never treated as an edit. */
export const compareInstalledFiles = async ({
  baselineHashes,
  cwd,
  localized = false,
  manifest,
}: {
  baselineHashes?: Record<string, string>
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
    const baselineHash = baselineHashes?.[projectPath]

    if (!canonicalFile && !baselineHash) {
      comparisons.push({ projectPath, status: 'unpublished' })
      continue
    }

    const installed = await readSafeProjectFile({
      cwd,
      filePath: path.join(cwd, projectPath),
    }).catch(() => undefined)

    if (installed === undefined) {
      comparisons.push({ projectPath, status: 'missing' })
      continue
    }

    const canonical = baselineHash
      ? undefined
      : await readFile(canonicalFile!.sourcePath, 'utf8').then((shipped) =>
          localized && isBlockConfigFile(projectPath)
            ? localizeBlockConfigSource(shipped)
            : shipped,
        )

    comparisons.push({
      projectPath,
      status:
        hashSource(installed) === (baselineHash ?? hashSource(canonical!))
          ? 'unchanged'
          : 'modified',
    })
  }

  return {
    comparisons,
    missing: comparisons
      .filter(({ status }) => status === 'missing')
      .map(({ projectPath }) => projectPath),
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

  const destinationPath = (
    await resolveSafeProjectPath({ cwd, targetPath: path.resolve(cwd, projectPath) })
  ).path

  const alreadyPresent = await readSafeProjectFile({ cwd, filePath: destinationPath }).then(
    () => true,
    (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return false
      throw error
    },
  )

  if (alreadyPresent) {
    return false
  }

  await commitFileChanges(
    [{ content: await readFile(sourcePath, 'utf8'), filePath: destinationPath }],
    { cwd },
  )

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
