import path from 'node:path'

import type {
  DetectedProject,
  ComponentManifest,
  HostFileRequirement,
  RequiredFile,
  ResolvedHostFiles,
  ResolvedRegistryDependency,
  SupportMatrix,
} from './types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { resolveDeclaredVersion } from './dependencies'
import { getAbsolutePath, normalizeFileList } from './project-paths'
import { readSafeProjectFile, safeProjectFileExists } from './safe-path'
import {
  findBuildConfigObject,
  findDirectArrayEntries,
  findDirectProperty,
  findDirectShorthand,
  findLastDirectSpread,
  findMatchingDelimiter,
  findNamedImportRange,
  isDirectValueTerminated,
  isDirectlyWithin,
  maskIgnoredSource,
} from './source-scanner'
import {
  detectPackageManagerDetails,
  extractMajor,
  readJsonFile,
  repoRoot,
} from './utils'

/* project.ts keeps target detection and host-file resolution, the manifest
 * support, prerequisite and installed-file checks, and base-collection
 * registration. It is also the entry point the commands and tests import from:
 * the fragment and localization patchers live in their own modules and are
 * re-exported here, so every existing import of './project' keeps working.
 *
 *   payload-fragments.ts     RenderBlocks/Pages wiring: apply, remove, verify
 *   payload-localization.ts  the localizeFields wrap and buildConfig localization
 *   source-scanner.ts        the masking scanner all of the patching is built on
 *   project-paths.ts         canonical host files and project path helpers */
export { CANONICAL_HOST_FILES } from './project-paths'
export {
  applyPayloadFragments,
  preparePayloadFragmentRemoval,
  removePayloadFragments,
  verifyInstalledPayloadFragments,
} from './payload-fragments'
export {
  LOCALIZE_HELPER_FILE,
  applyLocalizedFields,
  isBlockConfigFile,
  localizeBlockConfigSource,
  readPayloadLocalization,
  setPayloadLocalization,
} from './payload-localization'
export type { LocalizationConfigPatch, ReadLocalization } from './payload-localization'

const supportMatrixPath = path.join(repoRoot, 'payload-components', 'support-matrix.json')

/* Every entry must resolve; an array entry is satisfied by any one of its paths. */
const hasRequiredFiles = async ({
  cwd,
  requiredFiles,
}: {
  cwd: string
  requiredFiles: RequiredFile[]
}) => {
  for (const requirement of requiredFiles) {
    const candidates = Array.isArray(requirement) ? requirement : [requirement]
    const matches = await Promise.all(
      candidates.map((candidate) =>
        safeProjectFileExists({ cwd, filePath: path.join(cwd, candidate) }),
      ),
    )

    if (!matches.includes(true)) {
      return false
    }
  }

  return true
}

/* First candidate that both exists and carries every anchor. Anchors are what
 * make the text-based patching safe, so a file at the right path with the wrong
 * shape is not a match. */
const resolveHostFile = async ({
  cwd,
  requirement,
}: {
  cwd: string
  requirement: HostFileRequirement
}) => {
  for (const candidate of requirement.candidates) {
    const content = await readSafeProjectFile({
      cwd,
      filePath: path.join(cwd, candidate),
    }).catch(() => undefined)

    if (content === undefined) {
      continue
    }

    if (requirement.anchors.every((anchor) => content.includes(anchor))) {
      return candidate
    }
  }

  return undefined
}

export const detectProject = async (cwd: string): Promise<DetectedProject> => {
  const supportMatrix = await readJsonFile<SupportMatrix>(supportMatrixPath)
  const packageJson = JSON.parse(
    await readSafeProjectFile({ cwd, filePath: path.join(cwd, 'package.json') }),
  ) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const dependencies = {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  }
  const payloadMajor = extractMajor(
    await resolveDeclaredVersion({ cwd, declared: dependencies.payload, dependencyName: 'payload' }),
    'payload',
  )
  const nextMajor = extractMajor(
    await resolveDeclaredVersion({ cwd, declared: dependencies.next, dependencyName: 'next' }),
    'next',
  )
  const { lockfilePath, packageManager } = await detectPackageManagerDetails(cwd)

  for (const target of supportMatrix.targets) {
    if (!target.allowedPayloadMajors.includes(payloadMajor)) {
      continue
    }

    if (!target.allowedNextMajors.includes(nextMajor)) {
      continue
    }

    if (!(await hasRequiredFiles({ cwd, requiredFiles: target.requiredFiles }))) {
      continue
    }

    const pagesLayout = await resolveHostFile({ cwd, requirement: target.hostFiles.pagesLayout })
    const renderBlocks = await resolveHostFile({ cwd, requirement: target.hostFiles.renderBlocks })

    if (!pagesLayout || !renderBlocks) {
      continue
    }

    return {
      cwd,
      hostFiles: { pagesLayout, renderBlocks },
      lockfilePath,
      nextMajor,
      packageManager,
      payloadMajor,
      target,
    }
  }

  const componentsJsonPresent = await readSafeProjectFile({
    cwd,
    filePath: path.join(cwd, 'components.json'),
  })
    .then(() => true)
    .catch(() => false)

  if (!componentsJsonPresent) {
    throw new Error(
      `No components.json found in ${cwd}. This project isn't initialized for shadcn-style installs yet. Run "payload-components init" first, then re-run this command.`,
    )
  }

  const supportedShapes = supportMatrix.targets
    .map(
      (target) =>
        `  ${target.id}: a blocks renderer at ${target.hostFiles.renderBlocks.candidates.join(' or ')} containing "${target.hostFiles.renderBlocks.anchors.join('", "')}", and a Pages collection at ${target.hostFiles.pagesLayout.candidates.join(' or ')} with a blocks-typed "layout" field.`,
    )
    .join('\n')

  throw new Error(
    `Unsupported project shape in ${cwd}. The install flow supports these shapes:\n${supportedShapes}`,
  )
}

/* Every path a target may require, with any-of groups flattened. Used for
   display and for picking the candidate a project actually has on disk. */
export const flattenRequiredFiles = (requiredFiles: RequiredFile[]) =>
  requiredFiles.flatMap((requirement) => (Array.isArray(requirement) ? requirement : [requirement]))

export const findExistingRequiredFile = async ({
  cwd,
  pattern,
  requiredFiles,
}: {
  cwd: string
  pattern: RegExp
  requiredFiles: RequiredFile[]
}) => {
  const candidates = flattenRequiredFiles(requiredFiles).filter((filePath) =>
    pattern.test(filePath.replaceAll('\\', '/')),
  )

  for (const candidate of candidates) {
    if (await safeProjectFileExists({ cwd, filePath: path.join(cwd, candidate) })) {
      return candidate
    }
  }

  return undefined
}

/* Manifests declare the canonical starter paths in recovery.patchedFiles. Map
 * them onto wherever this project actually keeps those files so recorded state
 * and doctor output point at real paths. */
export const resolveRecoveryPatchedFiles = ({
  hostFiles,
  recoveryPatchedFiles,
}: {
  hostFiles: ResolvedHostFiles
  recoveryPatchedFiles: string[]
}) =>
  normalizeFileList(
    recoveryPatchedFiles.map((filePath) => {
      if (filePath === RENDER_BLOCKS_FILE) {
        return hostFiles.renderBlocks
      }

      if (filePath === PAGES_LAYOUT_FILE) {
        return hostFiles.pagesLayout
      }

      return filePath
    }),
  )

export const assertManifestSupport = (project: DetectedProject, manifest: ComponentManifest) => {
  if (!manifest.supportedTargets.includes(project.target.id)) {
    throw new Error(
      `Component "${manifest.name}" does not support the detected project target "${project.target.id}".`,
    )
  }

  if (!manifest.supports.payloadMajors.includes(project.payloadMajor)) {
    throw new Error(
      `Component "${manifest.name}" does not support Payload major version ${project.payloadMajor}.`,
    )
  }

  if (!manifest.supports.nextMajors.includes(project.nextMajor)) {
    throw new Error(
      `Component "${manifest.name}" does not support Next.js major version ${project.nextMajor}.`,
    )
  }
}

export type ProjectRequirementFailure = {
  label: string
  message: string
}

/* Retain exact quoted values while rejecting identical text hidden in a comment
 * or string literal. Both masks preserve offsets and quote delimiters. */
const hasActiveSourceAnchor = (source: string, anchor: string) => {
  const masked = maskIgnoredSource(source)
  const maskedAnchor = maskIgnoredSource(anchor)
  let offset = source.indexOf(anchor)
  while (offset !== -1) {
    if (masked.slice(offset, offset + anchor.length) === maskedAnchor) return true
    offset = source.indexOf(anchor, offset + 1)
  }
  return false
}

const missingCollectionRequirements = (source: string, identifiers: string[]): string[] => {
  const config = findBuildConfigObject(source)
  const unreadable = 'a statically readable buildConfig({ collections: [...] }) array (computed or shadowed collection lists cannot be verified)'
  if (!config) return [unreadable]
  const property = findDirectProperty({ object: config, propertyName: 'collections', source })
  const shorthand = findDirectShorthand({ object: config, propertyName: 'collections', source })
  const spread = findLastDirectSpread({ object: config, source })
  const maskedSource = maskIgnoredSource(source)
  if (!property || (shorthand && shorthand.start > property.start) ||
      (spread !== undefined && spread > property.start) || maskedSource[property.valueStart] !== '[') {
    return [unreadable]
  }
  // A later computed key could evaluate to "collections" and replace this list.
  for (let index = property.start + 1; index < config.end; index += 1) {
    if (maskedSource[index] === '[' && isDirectlyWithin(maskedSource, config.start + 1, index)) {
      let before = index - 1
      while (/\s/.test(maskedSource[before] ?? '')) before -= 1
      if (maskedSource[before] === ',' || maskedSource[before] === '{') return [unreadable]
    }
  }
  const end = findMatchingDelimiter({ close: ']', maskedSource, open: '[', start: property.valueStart })
  if (end === -1 || !isDirectValueTerminated({ containerEnd: config.end, maskedSource, valueEnd: end })) return [unreadable]
  const entries = findDirectArrayEntries({ end, maskedSource, start: property.valueStart })
    .map((entry) => maskedSource.slice(entry.start, entry.end).trim())
  return identifiers.filter((identifier) => !entries.includes(identifier))
    .map((identifier) => `${identifier} directly in buildConfig.collections`)
}

/* Target detection proves the shared Pages/RenderBlocks shape. Data-driven
 * blocks can require more without making that capability mandatory for every
 * component, so manifests declare their own candidate files and anchors. */
export const checkManifestProjectRequirements = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: ComponentManifest
}): Promise<ProjectRequirementFailure[]> => {
  const failures: ProjectRequirementFailure[] = []

  for (const requirement of manifest.requires?.projectFiles ?? []) {
    const inspected: Array<{ missingAnchors: string[]; path: string }> = []
    let matched = false

    for (const candidate of requirement.paths) {
      const source = await readSafeProjectFile({
        cwd,
        filePath: path.join(cwd, candidate),
      }).catch(() => undefined)

      if (source === undefined) continue

      const missingAnchors = requirement.anchors.filter((anchor) => !hasActiveSourceAnchor(source, anchor))
      if (requirement.collectionIdentifiers?.length) {
        missingAnchors.push(...missingCollectionRequirements(source, requirement.collectionIdentifiers))
      }

      if (missingAnchors.length === 0) {
        matched = true
        break
      }

      inspected.push({ missingAnchors, path: candidate })
    }

    if (matched) continue

    const detail =
      inspected.length > 0
        ? inspected
            .map(
              ({ missingAnchors, path: candidate }) =>
                `${candidate} is missing ${missingAnchors.map((anchor) => `"${anchor}"`).join(', ')}`,
            )
            .join('; ')
        : `none of ${requirement.paths.join(', ')} exists`

    failures.push({
      label: requirement.label,
      message: `${requirement.label}: ${detail}. ${requirement.help}`,
    })
  }

  return failures
}

export const assertManifestProjectRequirements = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: ComponentManifest
}) => {
  const failures = await checkManifestProjectRequirements({ cwd, manifest })

  if (failures.length > 0) {
    throw new Error(
      `Component "${manifest.name}" cannot be installed because its project prerequisites are missing:\n${failures
        .map((failure) => `- ${failure.message}`)
        .join('\n')}`,
    )
  }
}

export const verifyInstalledManifestFiles = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: Pick<ComponentManifest, 'files'> & {
    registryDependencies?: ResolvedRegistryDependency[]
  }
}) => {
  const missingFiles: string[] = []
  const missingRegistryDependencies: ResolvedRegistryDependency[] = []

  for (const filePath of manifest.files) {
    if (!(await safeProjectFileExists({ cwd, filePath: getAbsolutePath(cwd, filePath) }))) {
      missingFiles.push(filePath)
    }
  }

  for (const dependency of manifest.registryDependencies ?? []) {
    if (
      !(await safeProjectFileExists({
        cwd,
        filePath: getAbsolutePath(cwd, dependency.targetFile),
      }))
    ) {
      missingRegistryDependencies.push(dependency)
    }
  }

  return {
    isValid: missingFiles.length === 0 && missingRegistryDependencies.length === 0,
    missingFiles,
    missingRegistryDependencies,
  }
}

/** Patch only the literal collections array directly owned by buildConfig.
 * Comments, imports and nested plugin options are not registrations. */
export const setBaseCollections = (source: string) => {
  const object = findBuildConfigObject(source)
  if (!object) return undefined
  const maskedSource = maskIgnoredSource(source)
  const property = findDirectProperty({ object, propertyName: 'collections', source })
  if (!property || maskedSource[property.valueStart] !== '[') return undefined
  const spread = findLastDirectSpread({ object, source })
  const shorthand = findDirectShorthand({ object, propertyName: 'collections', source })
  if ((spread !== undefined && spread > property.start) ||
      (shorthand && shorthand.start > property.start)) return undefined
  const end = findMatchingDelimiter({ close: ']', maskedSource, open: '[', start: property.valueStart })
  if (end < 0 || !isDirectValueTerminated({ containerEnd: object.end, maskedSource, valueEnd: end })) return undefined
  const entries = findDirectArrayEntries({ end, maskedSource, start: property.valueStart })
    .map((entry) => maskedSource.slice(entry.start, entry.end).trim())
  // A spread or factory could already contain these slugs. Refuse to guess.
  if (entries.some((entry) => !/^[A-Za-z_$][\w$]*$/.test(entry))) return undefined
  const imports: string[] = []
  const missing: string[] = []
  for (const name of ['Pages', 'Media']) {
    const importPath = `./collections/${name}`
    const range = findNamedImportRange({ importName: name, importPath, source })
    let binding = name
    if (range) {
      const specifiers = maskedSource.slice(range.braceStart + 1, range.braceEnd).split(',').map((part) => part.trim())
      const specifier = specifiers.find((part) => new RegExp(`^${name}(?:\\s+as\\s+[A-Za-z_$][\\w$]*)?$`).test(part))
      if (!specifier) return undefined
      binding = specifier.split(/\s+as\s+/)[1] ?? name
    } else if (!entries.includes(name)) {
      // An unrelated binding with this name would make a new import ambiguous.
      if (new RegExp(`\\b${name}\\b`).test(maskedSource)) return undefined
      imports.push(`import { ${name} } from '${importPath}'`)
    }
    if (!entries.includes(binding)) missing.push(binding)
  }
  if (!missing.length) return { source, registered: missing }
  const insertAt = property.valueStart + 1
  return {
    source: `${imports.length ? `${imports.join('\n')}\n` : ''}${source.slice(0, insertAt)}${missing.join(', ')}, ${source.slice(insertAt)}`,
    registered: missing,
  }
}
