import path from 'node:path'

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

const CONFIG_COLLECTIONS_ANCHOR = /collections:\s*\[/

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
  const anchor = CONFIG_COLLECTIONS_ANCHOR.exec(source)

  if (!anchor || anchor.index === undefined) {
    return { patched: false, reason: 'no-collections-array' as const }
  }

  const missing = (['Pages', 'Media'] as const).filter(
    (collection) => !new RegExp(`\\b${collection}\\b`).test(source),
  )

  if (missing.length === 0) {
    return { patched: false, reason: 'already-registered' as const }
  }

  const imports = missing
    .map((collection) =>
      collection === 'Pages'
        ? "import { Pages } from './collections/Pages'"
        : "import { Media } from './collections/Media'",
    )
    .join('\n')
  const insertAt = anchor.index + anchor[0].length
  const patched = `${imports}\n${source.slice(0, insertAt)}${missing.join(', ')}, ${source.slice(insertAt)}`

  await writeSafeProjectFile({ contents: patched, cwd, filePath: configPath })

  return { patched: true, reason: 'registered' as const, registered: missing }
}
