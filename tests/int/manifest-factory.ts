import type { ComponentManifest } from '../../tools/payload-components/types'

/* Canonical hero-basic-shaped manifest for unit specs. Spec-specific shapes
 * (e.g. a single postInstall script, a narrower peer range) come through
 * `overrides`, so the shared structure can't silently drift between specs.
 *
 * This module is intentionally import-light (type-only) so specs that mock the
 * CLI via `vi.doMock` + dynamic import can pull in the factory without eagerly
 * loading the real `tools/payload-components` modules and defeating their mock. */
export const makeTestManifest = (overrides: Partial<ComponentManifest> = {}): ComponentManifest => ({
  $schema: '../schema/poc-manifest.schema.json',
  dependencies: {},
  description: 'Test manifest',
  files: ['src/blocks/HeroBasic/config.ts', 'src/blocks/HeroBasic/Component.tsx'],
  name: 'hero-basic',
  payloadFragments: [
    {
      blockSlug: 'heroBasic',
      importName: 'HeroBasicBlock',
      importPath: '@/blocks/HeroBasic/Component',
      kind: 'renderBlocks',
    },
    {
      blockName: 'HeroBasic',
      importName: 'HeroBasic',
      importPath: '../../blocks/HeroBasic/config',
      kind: 'pagesLayout',
    },
  ],
  peerDependencies: {
    next: '^15.0.0 || ^16.0.0',
    payload: '^3.0.0',
  },
  postInstall: ['generate:types', 'generate:importmap'],
  preview: {
    summary: 'Preview summary',
  },
  recovery: {
    patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
  },
  registryItemName: 'hero-basic',
  sampleContent: {
    blockType: 'heroBasic',
  },
  supportedTargets: ['payload-website-starter'],
  supports: {
    nextMajors: [15, 16],
    payloadMajors: [3],
  },
  title: 'Hero Basic',
  version: '0.1.0',
  ...overrides,
})
