import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  ComponentManifest,
  RegistryDefinition,
  SupportedTarget,
  SupportMatrix,
} from '../../tools/payload-components/types'

/**
 * Build-time readers for the component registry data that powers the data-driven doc
 * sections (ComponentWiring / ComponentRequirements / ComponentUsage). Each reads JSON as text and
 * never imports or executes Payload target code, so the site/target boundary holds.
 * Type-only imports of the manifest/registry/support-matrix types keep these in
 * sync with the CLI without any runtime coupling. Runs server-side at build (component
 * pages are statically generated).
 */
export type { ComponentManifest, SupportedTarget } from '../../tools/payload-components/types'

const registryRoot = 'payload-components'

async function readJson<T>(...segments: string[]): Promise<T | null> {
  try {
    const json = await readFile(path.join(process.cwd(), registryRoot, ...segments), 'utf8')
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export function getComponentManifest(slug: string): Promise<ComponentManifest | null> {
  return readJson<ComponentManifest>('manifests', `${slug}.json`)
}

export async function getComponentRegistryDependencies(slug: string): Promise<string[]> {
  const registry = await readJson<RegistryDefinition>('registry.json')
  return registry?.items.find((item) => item.name === slug)?.registryDependencies ?? []
}

export async function getSupportTarget(id: string): Promise<SupportedTarget | null> {
  const matrix = await readJson<SupportMatrix>('support-matrix.json')
  return matrix?.targets.find((target) => target.id === id) ?? null
}
