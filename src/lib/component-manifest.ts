import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  ComponentManifest,
  RegistryDefinition,
  SupportedTarget,
  SupportMatrix,
} from '../../tools/payload-components/types'

/**
 * Build-time readers for the kit registry data that powers the data-driven doc
 * sections (ComponentWiring / ComponentRequirements / ComponentUsage). Each reads JSON as text and
 * never imports or executes Payload target code, so the site/target boundary holds.
 * Type-only imports of the manifest/registry/support-matrix types keep these in
 * sync with the CLI without any runtime coupling. Runs server-side at build (kit
 * pages are statically generated).
 */
export type { ComponentManifest, SupportedTarget } from '../../tools/payload-components/types'

async function readJson<T>(relativePath: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), relativePath), 'utf8')) as T
  } catch {
    return null
  }
}

export function getComponentManifest(slug: string): Promise<ComponentManifest | null> {
  return readJson<ComponentManifest>(path.join('payload-components', 'manifests', `${slug}.json`))
}

export async function getComponentRegistryDependencies(slug: string): Promise<string[]> {
  const registry = await readJson<RegistryDefinition>(
    path.join('payload-components', 'registry.json'),
  )
  return registry?.items.find((item) => item.name === slug)?.registryDependencies ?? []
}

export async function getSupportTarget(id: string): Promise<SupportedTarget | null> {
  const matrix = await readJson<SupportMatrix>(
    path.join('payload-components', 'support-matrix.json'),
  )
  return matrix?.targets.find((target) => target.id === id) ?? null
}
