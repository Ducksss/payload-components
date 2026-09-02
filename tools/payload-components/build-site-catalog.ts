import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ComponentManifest, RegistryDefinition } from './types'
import { readJsonFile, repoRoot, writeJsonFile } from './utils'

const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')
const manifestsPath = path.join(repoRoot, 'payload-components', 'manifests')
export const siteCatalogPath = path.join(repoRoot, 'src', 'generated', 'component-catalog.json')

export type SiteCatalog = {
  components: Array<{
    slug: string
    version: string
  }>
  version: 1
}

/* Technical catalog facts come from the install contract and are projected
 * into a small client-safe artifact. Site code can keep editorial grouping and
 * sample field labels without importing 77 full manifests into its client
 * graph or duplicating install versions and commands by hand. */
export const createSiteCatalog = async (): Promise<SiteCatalog> => {
  const registry = await readJsonFile<RegistryDefinition>(registryPath)
  const components = await Promise.all(
    registry.items.map(async ({ name }) => {
      const manifest = await readJsonFile<ComponentManifest>(
        path.join(manifestsPath, `${name}.json`),
      )

      if (manifest.name !== name) {
        throw new Error(`Registry item "${name}" has no matching manifest contract.`)
      }

      return {
        slug: manifest.name,
        version: manifest.version,
      }
    }),
  )

  return { components, version: 1 }
}

export const buildSiteCatalog = async () => {
  const catalog = await createSiteCatalog()

  await writeJsonFile(siteCatalogPath, catalog)
  return catalog
}

const isDirectRun = (() => {
  if (!process.argv[1]) return false

  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
})()

if (isDirectRun) {
  buildSiteCatalog().catch((error) => {
    process.stderr.write(
      `payload-components: ${error instanceof Error ? error.message : 'catalog build failed'}\n`,
    )
    process.exitCode = 1
  })
}
