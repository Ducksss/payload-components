import path from 'node:path'

import Ajv2020 from 'ajv/dist/2020.js'
import type { ErrorObject, ValidateFunction } from 'ajv'
import semver from 'semver'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { validateDependencyMap } from './dependencies'
import type { ComponentManifest } from './types'

import { isPathInside, readJsonFile, repoRoot } from './utils'

import type { RegistryDefinition } from './types'

const manifestSchemaPath = path.join(repoRoot, 'payload-components', 'schema', 'poc-manifest.schema.json')
const manifestDir = path.join(repoRoot, 'payload-components', 'manifests')
const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')
const componentNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
})
let validatorPromise: Promise<ValidateFunction<ComponentManifest>> | undefined

const unknownComponentError = (componentName: string) =>
  new Error(`Unknown component "${componentName}". Run "payload-components --help" to see available components.`)

const assertSafeComponentName = (componentName: string) => {
  if (!componentNamePattern.test(componentName)) {
    throw unknownComponentError(componentName)
  }
}

export const getManifestPath = (componentName: string) => {
  assertSafeComponentName(componentName)

  const manifestPath = path.resolve(manifestDir, `${componentName}.json`)

  if (!isPathInside(manifestDir, manifestPath)) {
    throw unknownComponentError(componentName)
  }

  return manifestPath
}

const getExpectedPatchedFiles = (manifest: ComponentManifest) => {
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
      (schema) => ajv.compile(schema) as ValidateFunction<ComponentManifest>,
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

const ensureRegistryItemExists = async (manifest: ComponentManifest) => {
  const registry = await readJsonFile<RegistryDefinition>(registryDefinitionPath)
  const registryItem = registry.items.find((item) => item.name === manifest.registryItemName)

  if (!registryItem) {
    throw new Error(
      `Manifest "${manifest.name}" references registry item "${manifest.registryItemName}", but no matching item exists in payload-components/registry.json.`,
    )
  }
}

const ensureKnownComponentName = async (componentName: string) => {
  assertSafeComponentName(componentName)

  const registry = await readJsonFile<RegistryDefinition>(registryDefinitionPath)

  if (!registry.items.some((item) => item.name === componentName)) {
    throw unknownComponentError(componentName)
  }
}

const ensureRecoveryMatchesFragments = (manifest: ComponentManifest) => {
  const expectedPatchedFiles = getExpectedPatchedFiles(manifest)

  for (const filePath of expectedPatchedFiles) {
    if (!manifest.recovery.patchedFiles.includes(filePath)) {
      throw new Error(
        `Manifest "${manifest.name}" must include "${filePath}" in recovery.patchedFiles because its payloadFragments patch that target file.`,
      )
    }
  }
}

export const loadManifest = async (componentName: string): Promise<ComponentManifest> => {
  await ensureKnownComponentName(componentName)

  const manifest = await readJsonFile<ComponentManifest>(getManifestPath(componentName))
  const validateManifest = await getManifestValidator()

  if (!validateManifest(manifest)) {
    const [firstError] = validateManifest.errors ?? []

    if (!firstError) {
      throw new Error(`Manifest "${componentName}" is invalid.`)
    }

    const fieldPath = formatValidationErrorPath(firstError)
    const fieldSuffix = fieldPath === 'manifest' ? '' : ` at "${fieldPath}"`

    throw new Error(`Manifest "${componentName}" is invalid${fieldSuffix}: ${firstError.message}.`)
  }

  if (!semver.valid(manifest.version)) {
    throw new Error(`Manifest "${componentName}" must declare a valid semantic version. Received "${manifest.version}".`)
  }

  if (manifest.name !== componentName) {
    throw new Error(`Manifest "${componentName}" declares mismatched component name "${manifest.name}".`)
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
