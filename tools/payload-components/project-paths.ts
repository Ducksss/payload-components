/* Project-relative paths shared by target detection (project.ts), fragment
 * wiring (payload-fragments.ts) and localization (payload-localization.ts). */

import path from 'node:path'

import type { ResolvedHostFiles } from './types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'

/* Manifests are authored against the canonical starter paths, so those double as
 * the default when a caller has not detected a project (tests, and the
 * verify/remove helpers used outside an install). */
export const CANONICAL_HOST_FILES: ResolvedHostFiles = {
  pagesLayout: PAGES_LAYOUT_FILE,
  renderBlocks: RENDER_BLOCKS_FILE,
}

const getAbsolutePath = (cwd: string, filePath: string) => path.join(cwd, filePath)

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

export { getAbsolutePath, normalizeFileList }
