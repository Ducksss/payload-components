import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { ComponentManifest } from '../types'

/**
 * Shared seed-script generator.
 *
 * Emits a standalone TypeScript script that, run inside a consumer Payload
 * project (`payload run` / `tsx`), creates ONE labeled, deletable Page whose
 * layout is pre-filled from each manifest's `sampleContent`. Used by both the
 * fresh-project smoke harness and the user-facing `payload-components seed`
 * command, so the seeding logic never forks.
 *
 * This module must stay free of `@playwright/test` (and any heavy import): the
 * published CLI bundles `cli.ts`, whose runtime deps are contractually limited
 * to `ajv` + `semver`. The smoke harness keeps its Playwright import; it just
 * imports these builders from here.
 */

export type SmokeSampleBlock = ComponentManifest['sampleContent'] & {
  avatars?: Array<Record<string, unknown>>
  integrations?: Array<Record<string, unknown>>
  logos?: Array<Record<string, unknown>>
}

export type SeedTarget = {
  /** Module specifier the script imports the Payload config from, relative to the script. */
  configImportPath: string
  /** Path (relative to the project root) for the throwaway placeholder SVG. */
  placeholderRelPath: string
  /** Path (relative to the project root) the seed script is written to. */
  scriptRelPath: string
  /** Slug of the single demo Page the script creates and re-creates. */
  slug: string
  /** Title of the demo Page. */
  title: string
}

/** Default target used by the fresh-project smoke harness. */
export const SMOKE_SEED_TARGET: SeedTarget = {
  configImportPath: '../src/payload.config',
  placeholderRelPath: path.join('.payload-components', 'smoke-placeholder.svg'),
  scriptRelPath: path.join('.payload-components', 'smoke-seed.ts'),
  slug: 'payload-components-smoke',
  title: 'Payload Component Smoke',
}

const isMissingUploadReference = (item: Record<string, unknown>, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

export const sampleContentNeedsSmokeMedia = (sampleContent: ComponentManifest['sampleContent']) => {
  const block = sampleContent as SmokeSampleBlock

  return (
    block.logos?.some((item) => isMissingUploadReference(item, 'logo')) ||
    block.integrations?.some((item) => isMissingUploadReference(item, 'logo')) ||
    block.avatars?.some((item) => isMissingUploadReference(item, 'avatar')) ||
    false
  )
}

export const buildSeedScript = ({
  manifests,
  target,
}: {
  manifests: ComponentManifest[]
  target: SeedTarget
}): string => {
  const layout = manifests.map((manifest) => manifest.sampleContent)
  const needsSmokeMedia = manifests.some((manifest) =>
    sampleContentNeedsSmokeMedia(manifest.sampleContent),
  )

  return `import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'

const { default: config } = await import(${JSON.stringify(target.configImportPath)})

type SmokeSampleItem = Record<string, unknown>
type SmokeSampleBlock = SmokeSampleItem & {
  avatars?: SmokeSampleItem[]
  integrations?: SmokeSampleItem[]
  logos?: SmokeSampleItem[]
}

const rawLayout = ${JSON.stringify(layout, null, 2)} satisfies SmokeSampleBlock[]
const needsSmokeMedia = ${JSON.stringify(needsSmokeMedia)}

const addUploadReference = (items: SmokeSampleItem[] | undefined, fieldName: string, mediaID: unknown) =>
  items?.map((item) => ({
    ...item,
    [fieldName]: item[fieldName] ?? mediaID,
  }))

const addSmokeUploadReferences = (block: SmokeSampleBlock, mediaID: unknown): SmokeSampleBlock => ({
  ...block,
  ...(block.avatars ? { avatars: addUploadReference(block.avatars, 'avatar', mediaID) } : {}),
  ...(block.integrations ? { integrations: addUploadReference(block.integrations, 'logo', mediaID) } : {}),
  ...(block.logos ? { logos: addUploadReference(block.logos, 'logo', mediaID) } : {}),
})

const createSmokeMedia = async () => {
  const mediaPath = path.join(process.cwd(), ${JSON.stringify(target.placeholderRelPath)})

  await mkdir(path.dirname(mediaPath), { recursive: true })
  await writeFile(
    mediaPath,
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#f4f4f5"/><path d="M27 52h42v8H27zM27 36h42v8H27z" fill="#18181b"/></svg>',
  )

  return payload.create({
    collection: 'media',
    data: {
      alt: ${JSON.stringify(`${target.title} placeholder`)},
    },
    filePath: mediaPath,
    overrideAccess: true,
  })
}

const payload = await getPayload({ config })
const slug = ${JSON.stringify(target.slug)}
const smokeMedia = needsSmokeMedia ? await createSmokeMedia() : undefined
const layout = smokeMedia
  ? rawLayout.map((block) => addSmokeUploadReferences(block, smokeMedia.id))
  : rawLayout

await payload.delete({
  collection: 'pages',
  context: {
    disableRevalidate: true,
  },
  overrideAccess: true,
  where: {
    slug: {
      equals: slug,
    },
  },
}).catch(() => undefined)

await payload.create({
  collection: 'pages',
  context: {
    disableRevalidate: true,
  },
  data: {
    title: ${JSON.stringify(target.title)},
    slug,
    layout,
    _status: 'published',
  },
  overrideAccess: true,
})

console.log('Seeded /' + slug)
`
}

export const writeSeedScript = async (
  targetPath: string,
  manifests: ComponentManifest[],
  target: SeedTarget = SMOKE_SEED_TARGET,
): Promise<string> => {
  const scriptPath = path.join(targetPath, target.scriptRelPath)

  await mkdir(path.dirname(scriptPath), { recursive: true })
  await writeFile(scriptPath, buildSeedScript({ manifests, target }))

  return scriptPath
}
