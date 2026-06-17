import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  KitManifest,
  RegistryDefinition,
  SupportedTarget,
  SupportMatrix,
} from '../../tools/payload-kit/types'

/**
 * Build-time readers for the kit registry data that powers the data-driven doc
 * sections (KitWiring / KitRequirements / KitUsage). Each reads JSON as text and
 * never imports or executes Payload target code, so the site/target boundary holds.
 * Type-only imports of the manifest/registry/support-matrix types keep these in
 * sync with the CLI without any runtime coupling. Runs server-side at build (kit
 * pages are statically generated).
 */
export type { KitManifest, SupportedTarget } from '../../tools/payload-kit/types'

async function readJson<T>(relativePath: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), relativePath), 'utf8')) as T
  } catch {
    return null
  }
}

export function getKitManifest(slug: string): Promise<KitManifest | null> {
  return readJson<KitManifest>(path.join('payload-kits', 'manifests', `${slug}.json`))
}

export async function getKitRegistryDependencies(slug: string): Promise<string[]> {
  const registry = await readJson<RegistryDefinition>(path.join('payload-kits', 'registry.json'))
  return registry?.items.find((item) => item.name === slug)?.registryDependencies ?? []
}

export async function getSupportTarget(id: string): Promise<SupportedTarget | null> {
  const matrix = await readJson<SupportMatrix>(path.join('payload-kits', 'support-matrix.json'))
  return matrix?.targets.find((target) => target.id === id) ?? null
}
