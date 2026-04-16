import path from 'node:path'

import type { KitManifest } from './types'

import { readJsonFile, repoRoot } from './utils'

const requiredRootKeys: Array<keyof KitManifest> = [
  'description',
  'files',
  'name',
  'payloadFragments',
  'postInstall',
  'preview',
  'registryItemName',
  'sampleContent',
  'supportedTargets',
  'supports',
  'title',
  'version',
]

export const getManifestPath = (kitName: string) =>
  path.join(repoRoot, 'payload-kits', 'manifests', `${kitName}.json`)

export const loadManifest = async (kitName: string): Promise<KitManifest> => {
  const manifest = await readJsonFile<KitManifest>(getManifestPath(kitName))

  for (const key of requiredRootKeys) {
    if (!(key in manifest)) {
      throw new Error(`Manifest "${kitName}" is missing the required "${key}" field.`)
    }
  }

  if (!manifest.supportedTargets.length) {
    throw new Error(`Manifest "${kitName}" must declare at least one supported target.`)
  }

  if (!manifest.files.length) {
    throw new Error(`Manifest "${kitName}" must declare at least one installed file.`)
  }

  if (!manifest.payloadFragments.length) {
    throw new Error(`Manifest "${kitName}" must declare at least one Payload fragment.`)
  }

  return manifest
}
