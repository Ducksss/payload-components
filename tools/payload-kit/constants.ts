export const PACKAGE_JSON_FILE = 'package.json'
export const RENDER_BLOCKS_FILE = 'src/blocks/RenderBlocks.tsx'
export const PAGES_LAYOUT_FILE = 'src/collections/Pages/index.ts'
export const SHARED_PATCHED_FILES = [RENDER_BLOCKS_FILE, PAGES_LAYOUT_FILE] as const
export const CURRENT_ALPHA_TARGET_ID = 'payload-website-starter'

export const INSTALL_STAGES = [
  'registry-build',
  'registry-add',
  'dependency-install',
  'fragment-apply',
  'post-install',
] as const
