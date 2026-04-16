import path from 'node:path'

import Ajv2020 from 'ajv/dist/2020.js'
import type { ErrorObject, ValidateFunction } from 'ajv'
import semver from 'semver'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { validateDependencyMap } from './dependencies'
import type { KitManifest } from './types'

import { readJsonFile, repoRoot } from './utils'

import type { RegistryDefinition } from './types'

const manifestSchemaPath = path.join(repoRoot, 'payload-kits', 'schema', 'poc-manifest.schema.json')
const registryDefinitionPath = path.join(repoRoot, 'payload-kits', 'registry.json')
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
})
let validatorPromise: Promise<ValidateFunction<KitManifest>> | undefined

export const getManifestPath = (kitName: string) =>
  path.join(repoRoot, 'payload-kits', 'manifests', `${kitName}.json`)

const getExpectedPatchedFiles = (manifest: KitManifest) => {
  const patchedFiles = new Set<string>()

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      patchedFiles.add(RENDER_BLOCKS_FILE)
    }

    if (fragment.kind === 'pagesLayout') {
      patchedFiles.add(PAGES_LAYOUT_FILE)
    }
  }

  return [...patchedFiles].sort()
}

const getManifestValidator = async () => {
  if (!validatorPromise) {
    validatorPromise = readJsonFile<object>(manifestSchemaPath).then(
      (schema) => ajv.compile(schema) as ValidateFunction<KitManifest>,
    )
  }

  return validatorPromise
}

const formatValidationErrorPath = (error: ErrorObject) => {
  if (error.keyword === 'required' && typeof error.params.missingProperty === 'string') {
    const basePath = error.instancePath.replace(/^\//, '').replaceAll('/', '.')

    return [basePath, error.params.missingProperty].filter(Boolean).join('.')
  }

  return error.instancePath.replace(/^\//, '').replaceAll('/', '.') || 'manifest'
}

const ensureRegistryItemExists = async (manifest: KitManifest) => {
  const registry = await readJsonFile<RegistryDefinition>(registryDefinitionPath)
  const registryItem = registry.items.find((item) => item.name === manifest.registryItemName)

  if (!registryItem) {
    throw new Error(
      `Manifest "${manifest.name}" references registry item "${manifest.registryItemName}", but no matching item exists in payload-kits/registry.json.`,
    )
  }
}

const ensureRecoveryMatchesFragments = (manifest: KitManifest) => {
  const expectedPatchedFiles = getExpectedPatchedFiles(manifest)

  for (const filePath of expectedPatchedFiles) {
    if (!manifest.recovery.patchedFiles.includes(filePath)) {
      throw new Error(
        `Manifest "${manifest.name}" must include "${filePath}" in recovery.patchedFiles because its payloadFragments patch that target file.`,
      )
    }
  }
}

export const loadManifest = async (kitName: string): Promise<KitManifest> => {
  const manifest = await readJsonFile<KitManifest>(getManifestPath(kitName))
  const validateManifest = await getManifestValidator()

  if (!validateManifest(manifest)) {
    const [firstError] = validateManifest.errors ?? []

    if (!firstError) {
      throw new Error(`Manifest "${kitName}" is invalid.`)
    }

    const fieldPath = formatValidationErrorPath(firstError)
    const fieldSuffix = fieldPath === 'manifest' ? '' : ` at "${fieldPath}"`

    throw new Error(`Manifest "${kitName}" is invalid${fieldSuffix}: ${firstError.message}.`)
  }

  if (!semver.valid(manifest.version)) {
    throw new Error(`Manifest "${kitName}" must declare a valid semantic version. Received "${manifest.version}".`)
  }

  validateDependencyMap({
    dependencies: manifest.dependencies,
    fieldName: 'dependencies',
  })
  validateDependencyMap({
    dependencies: manifest.peerDependencies,
    fieldName: 'peerDependencies',
  })

  await ensureRegistryItemExists(manifest)
  ensureRecoveryMatchesFragments(manifest)

  return manifest
}
