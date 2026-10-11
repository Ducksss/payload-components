import { readdir, readFile } from 'node:fs/promises'
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

export async function getAllComponentManifests(): Promise<ComponentManifest[]> {
  const manifestDirectory = path.join(process.cwd(), registryRoot, 'manifests')
  const files = (await readdir(manifestDirectory)).filter((file) => file.endsWith('.json')).sort()

  const manifests = await Promise.all(
    files.map((file) => readJson<ComponentManifest>('manifests', file)),
  )

  return manifests.filter((manifest): manifest is ComponentManifest => manifest !== null)
}

export async function getComponentRegistryDependencies(slug: string): Promise<string[]> {
  const registry = await readJson<RegistryDefinition>('registry.json')
  return registry?.items.find((item) => item.name === slug)?.registryDependencies ?? []
}

export async function getSupportTarget(id: string): Promise<SupportedTarget | null> {
  const matrix = await readJson<SupportMatrix>('support-matrix.json')
  return matrix?.targets.find((target) => target.id === id) ?? null
}

/* One entry per Payload major a component supports, with the Next.js majors
 * that major actually pairs with. A manifest lists Payload and Next.js majors
 * separately, which reads as a cross product; support-matrix.json narrows it per
 * Payload major (Payload 4 dropped Next.js 15). This mirrors pairedNextMajors in
 * tools/payload-components/support-matrix.ts without importing CLI code. */
export type PayloadCompatibility = {
  experimental: boolean
  minimumVersions: { next?: string; node?: string }
  nextMajors: number[]
  payloadMajor: number
}

export async function getPayloadCompatibility(
  manifest: Pick<ComponentManifest, 'supportedTargets' | 'supports'>,
): Promise<PayloadCompatibility[]> {
  const matrix = await readJson<SupportMatrix>('support-matrix.json')
  const targets = (matrix?.targets ?? []).filter((target) =>
    manifest.supportedTargets.includes(target.id),
  )

  return manifest.supports.payloadMajors.map((payloadMajor) => {
    const entries = targets.map((target) => target.payloadMajorSupport?.[String(payloadMajor)])
    const paired = targets.length
      ? targets.flatMap((target, index) => entries[index]?.nextMajors ?? target.allowedNextMajors)
      : manifest.supports.nextMajors

    return {
      experimental: entries.some((entry) => entry?.experimental === true),
      minimumVersions: entries.find((entry) => entry?.minimumVersions)?.minimumVersions ?? {},
      nextMajors: manifest.supports.nextMajors.filter((major) => paired.includes(major)),
      payloadMajor,
    }
  })
}

/* "24.15.0" reads as "24.15"; a patch that matters ("16.2.6") stays. */
const shortVersion = (version: string) => version.replace(/\.0$/, '')

export const formatPayloadMajor = ({ experimental, payloadMajor }: PayloadCompatibility) =>
  `v${payloadMajor}${experimental ? ' (experimental)' : ''}`

/* "15 / 16", or "16 (16.2.6 or newer)" when the Payload major sets a minimum. */
export const formatPairedNext = ({ minimumVersions, nextMajors }: PayloadCompatibility) =>
  `${nextMajors.join(' / ')}${
    minimumVersions.next ? ` (${shortVersion(minimumVersions.next)} or newer)` : ''
  }`

const formatNodeMinimum = ({ minimumVersions }: PayloadCompatibility) =>
  minimumVersions.node ? `Node.js ${shortVersion(minimumVersions.node)} or newer` : undefined

/* "Payload v4 (experimental) with Next.js 16 (16.2.6 or newer) and Node.js 24.15
 * or newer" — one fragment per Payload major, for prose and markdown. */
export const describePayloadCompatibility = (compatibility: PayloadCompatibility) =>
  [
    `Payload ${formatPayloadMajor(compatibility)} with Next.js ${formatPairedNext(compatibility)}`,
    formatNodeMinimum(compatibility),
  ]
    .filter(Boolean)
    .join(' and ')

/* "Payload v4 support is experimental: it needs Next.js 16 (16.2.6 or newer) and
 * Node.js 24.15 or newer." */
export const describeExperimentalSupport = (compatibility: PayloadCompatibility) =>
  `Payload v${compatibility.payloadMajor} support is experimental: it needs ${[
    `Next.js ${formatPairedNext(compatibility)}`,
    formatNodeMinimum(compatibility),
  ]
    .filter(Boolean)
    .join(' and ')}.`
