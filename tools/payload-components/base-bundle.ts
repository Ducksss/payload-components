import path from 'node:path'

import { setBaseCollections } from './project'
import { copySharedSourceFile } from './component-files'
import { readSafeProjectFile, writeSafeProjectFile } from './safe-path'

/* The starter primitives every installed block imports.
 *
 * Across all 154 shipped source files there are exactly four consumer imports
 * outside shadcn UI — `@/utilities/ui`, `@/components/Media`, `@/components/Link`,
 * and `@/fields/linkGroup` — plus the two host files the installer patches. A
 * project scaffolded by `create-payload-app` has none of them, which is why a
 * bare app could not accept an install before this bundle existed.
 *
 * These are copied, never `shadcn add`ed: they are not catalog components, they
 * carry no Payload wiring of their own, and they must not appear in the catalog.
 * An existing file is always left alone — a project that already has its own
 * `cn` or `Media` keeps it. */

export const BASE_BUNDLE_FILES = [
  'src/utilities/ui.ts',
  'src/fields/link.ts',
  'src/fields/linkGroup.ts',
  'src/components/Link/index.tsx',
  'src/components/Media/index.tsx',
  'src/collections/Media.ts',
  'src/collections/Pages/index.ts',
  'src/blocks/RenderBlocks.tsx',
] as const

/* npm packages the copied files import that a bare Payload app does not have. */
export const BASE_BUNDLE_DEPENDENCIES = {
  clsx: '^2.1.1',
  'tailwind-merge': '^3.0.0',
} as const

export const copyBaseBundle = async ({ cwd }: { cwd: string }) => {
  const created: string[] = []
  const skipped: string[] = []

  for (const projectPath of BASE_BUNDLE_FILES) {
    const wrote = await copySharedSourceFile({
      cwd,
      projectPath,
      sourceSubdirectory: 'base',
    })

    ;(wrote ? created : skipped).push(projectPath)
  }

  return { created, skipped }
}

/* Register the two collections in the project's Payload config.
 *
 * Text-anchored like the rest of the installer's patching, and idempotent: a
 * config that already names a collection is left as it is, so a re-run adds
 * nothing. A config with no `collections:` array at all is reported rather than
 * rewritten — guessing at the shape of someone's buildConfig call is exactly the
 * kind of edit that is hard to review. */
export const registerBaseCollections = async ({
  configFileRelPath,
  cwd,
}: {
  configFileRelPath: string
  cwd: string
}) => {
  const configPath = path.join(cwd, configFileRelPath)
  const source = await readSafeProjectFile({ cwd, filePath: configPath })
  const result = setBaseCollections(source)
  if (!result) return { patched: false, reason: 'no-collections-array' as const }
  if (!result.registered.length) return { patched: false, reason: 'already-registered' as const }
  await writeSafeProjectFile({ contents: result.source, cwd, filePath: configPath })
  return { patched: true, reason: 'registered' as const, registered: result.registered }
}
