import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import type { PayloadFragment } from '../../tools/payload-components/types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from '../../tools/payload-components/constants'
import {
  applyPayloadFragments,
  verifyInstalledPayloadFragments,
} from '../../tools/payload-components/project'
import { captureRejection } from './payload-components-assertions'

/* Fragment patching is text-anchor based and deliberately fragile: it expects
 * the canonical Payload-website-starter file shapes (detectProject's
 * requiredAnchors gate enforces that before any patching runs). These tests pin
 * the contract for that canonical shape — correct insertion + idempotency — and,
 * crucially, that a deviating/missing anchor makes the CLI fail loudly and leave
 * the consumer's file untouched instead of silently corrupting it. */

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

const makeProject = async ({
  pagesLayout,
  renderBlocks,
}: {
  pagesLayout?: string
  renderBlocks?: string
}) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-fragment-'))
  tempDirs.push(dir)

  if (renderBlocks !== undefined) {
    await mkdir(path.join(dir, path.dirname(RENDER_BLOCKS_FILE)), { recursive: true })
    await writeFile(path.join(dir, RENDER_BLOCKS_FILE), renderBlocks, 'utf8')
  }

  if (pagesLayout !== undefined) {
    await mkdir(path.join(dir, path.dirname(PAGES_LAYOUT_FILE)), { recursive: true })
    await writeFile(path.join(dir, PAGES_LAYOUT_FILE), pagesLayout, 'utf8')
  }

  return dir
}

const readRenderBlocks = (dir: string) => readFile(path.join(dir, RENDER_BLOCKS_FILE), 'utf8')
const readPagesLayout = (dir: string) => readFile(path.join(dir, PAGES_LAYOUT_FILE), 'utf8')

/* Mirrors the canonical fixture in payload-components-fixture.ts. */
const CANONICAL_RENDER_BLOCKS = [
  "import React, { Fragment } from 'react'",
  '',
  'const blockComponents = {',
  '}',
  '',
  'export const RenderBlocks: React.FC<{ blocks?: Array<{ blockType?: string }> }> = ({ blocks }) => {',
  '  if (!blocks?.length) return null',
  '',
  '  return <Fragment>{blocks.map((_block, index) => <div key={index} />)}</Fragment>',
  '}',
  '',
].join('\n')

const CANONICAL_PAGES_LAYOUT = [
  "import type { CollectionConfig } from 'payload'",
  '',
  'export const Pages: CollectionConfig = {',
  "  slug: 'pages',",
  '  fields: [',
  '    {',
  "      name: 'layout',",
  "      type: 'blocks',",
  '      blocks: [],',
  '    },',
  '  ],',
  '}',
  '',
].join('\n')

const renderBlocksFragment: Extract<PayloadFragment, { kind: 'renderBlocks' }> = {
  blockSlug: 'heroBasic',
  importName: 'HeroBasicBlock',
  importPath: '@/blocks/HeroBasic/Component',
  kind: 'renderBlocks',
}

const pagesLayoutFragment: Extract<PayloadFragment, { kind: 'pagesLayout' }> = {
  blockName: 'HeroBasic',
  importName: 'HeroBasic',
  importPath: '@/blocks/HeroBasic/config',
  kind: 'pagesLayout',
}

describe('applyPayloadFragments — renderBlocks', () => {
  it('wires the import and registration into the canonical blockComponents object', async () => {
    const dir = await makeProject({ renderBlocks: CANONICAL_RENDER_BLOCKS })

    const touched = await applyPayloadFragments(dir, [renderBlocksFragment])
    const source = await readRenderBlocks(dir)

    expect(touched).toContain(RENDER_BLOCKS_FILE)
    expect(source).toContain("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'")
    expect(source).toContain('  heroBasic: HeroBasicBlock,')
  })

  it('breaks an empty one-line object open instead of writing above it', async () => {
    /* Regression: `const blockComponents = {}` puts the closing brace on the
       opening brace's line, so there is no line above it to insert into. The
       inserted entry used to land above the declaration, producing a file that
       does not parse — and that shape satisfies the detection anchor, so a real
       consumer could hit it. Caught by the bare-app smoke scenario. */
    const dir = await makeProject({
      renderBlocks: [
        "import React from 'react'",
        '',
        'const blockComponents = {}',
        '',
        'export const RenderBlocks = () => null',
        '',
      ].join('\n'),
    })

    await applyPayloadFragments(dir, [renderBlocksFragment])

    const source = await readRenderBlocks(dir)

    expect(source).toContain('const blockComponents = {\n  heroBasic: HeroBasicBlock,\n}')
    expect(source).toContain("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'")
    /* The entry must never precede the declaration. */
    expect(source.indexOf('const blockComponents')).toBeLessThan(
      source.indexOf('heroBasic: HeroBasicBlock'),
    )

    await expect(
      verifyInstalledPayloadFragments({
        cwd: dir,
        manifest: { payloadFragments: [renderBlocksFragment] },
      }),
    ).resolves.toMatchObject({ isValid: true })
  })

  it('is idempotent — a second apply adds nothing', async () => {
    const dir = await makeProject({ renderBlocks: CANONICAL_RENDER_BLOCKS })

    await applyPayloadFragments(dir, [renderBlocksFragment])
    const afterFirst = await readRenderBlocks(dir)
    await applyPayloadFragments(dir, [renderBlocksFragment])
    const afterSecond = await readRenderBlocks(dir)

    expect(afterSecond).toEqual(afterFirst)
    expect(afterSecond.match(/heroBasic: HeroBasicBlock,/g)).toHaveLength(1)
    expect(afterSecond.match(/import \{ HeroBasicBlock \}/g)).toHaveLength(1)
  })

  /* A drifted consumer file is the one failure the user has to repair by hand, so
     the error has to carry the whole repair: which file, what was missing, and
     both lines the install would have written. Asserting the pieces individually
     keeps the wording free to change without pinning a whole paragraph. */
  it('fails loudly and leaves the file untouched when the anchor is missing', async () => {
    const renderBlocks = "import React from 'react'\n\nexport const RenderBlocks = () => null\n"
    const dir = await makeProject({ renderBlocks })

    const error = await captureRejection(applyPayloadFragments(dir, [renderBlocksFragment]))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(RENDER_BLOCKS_FILE)
    expect(error.message).toContain('insertion anchor "const blockComponents = {"')
    expect(error.message).toContain("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'")
    expect(error.message).toContain('heroBasic: HeroBasicBlock,')
    expect(await readRenderBlocks(dir)).toEqual(renderBlocks)
  })

  it('reports the same repair when the blockComponents object cannot be read', async () => {
    const renderBlocks = "import React from 'react'\n\nconst blockComponents = {\n"
    const dir = await makeProject({ renderBlocks })

    const error = await captureRejection(applyPayloadFragments(dir, [renderBlocksFragment]))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(RENDER_BLOCKS_FILE)
    expect(error.message).toContain('blockComponents object')
    expect(error.message).toContain("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'")
    expect(error.message).toContain('heroBasic: HeroBasicBlock,')
    expect(await readRenderBlocks(dir)).toEqual(renderBlocks)
  })

  /* The repair is meant to be pasted, so it must not re-add an import the file
     already has. Nothing is written when a fragment fails, so "already there"
     is decided against the file on disk, not the in-memory patched copy. */
  it('omits the import from the repair when the file already has it', async () => {
    const renderBlocks = [
      "import React from 'react'",
      "import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'",
      '',
      'const blockComponents = {',
      '',
    ].join('\n')
    const dir = await makeProject({ renderBlocks })

    const error = await captureRejection(applyPayloadFragments(dir, [renderBlocksFragment]))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).not.toContain(
      "import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'",
    )
    expect(error.message).toContain('heroBasic: HeroBasicBlock,')
  })
})

describe('applyPayloadFragments — pagesLayout', () => {
  it('appends the block to an empty layout blocks array', async () => {
    const dir = await makeProject({ pagesLayout: CANONICAL_PAGES_LAYOUT })

    await applyPayloadFragments(dir, [pagesLayoutFragment])
    const source = await readPagesLayout(dir)

    expect(source).toContain("import { HeroBasic } from '@/blocks/HeroBasic/config'")
    expect(source).toContain('blocks: [HeroBasic],')
  })

  it('preserves existing layout blocks when appending', async () => {
    const pagesLayout = CANONICAL_PAGES_LAYOUT.replace('blocks: [],', 'blocks: [Existing],')
    const dir = await makeProject({ pagesLayout })

    await applyPayloadFragments(dir, [pagesLayoutFragment])
    const source = await readPagesLayout(dir)

    expect(source).toContain('blocks: [Existing, HeroBasic],')
  })

  it('is idempotent — a second apply does not duplicate the block', async () => {
    const dir = await makeProject({ pagesLayout: CANONICAL_PAGES_LAYOUT })

    await applyPayloadFragments(dir, [pagesLayoutFragment])
    const afterFirst = await readPagesLayout(dir)
    await applyPayloadFragments(dir, [pagesLayoutFragment])
    const afterSecond = await readPagesLayout(dir)

    expect(afterSecond).toEqual(afterFirst)
    expect(afterSecond.match(/blocks: \[HeroBasic\],/g)).toHaveLength(1)
    expect(afterSecond.match(/import \{ HeroBasic \}/g)).toHaveLength(1)
  })

  it('fails loudly when the layout anchor is missing', async () => {
    const pagesLayout = [
      "import type { CollectionConfig } from 'payload'",
      '',
      'export const Pages: CollectionConfig = {',
      "  slug: 'pages',",
      '  fields: [],',
      '}',
      '',
    ].join('\n')
    const dir = await makeProject({ pagesLayout })

    const error = await captureRejection(applyPayloadFragments(dir, [pagesLayoutFragment]))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(PAGES_LAYOUT_FILE)
    expect(error.message).toContain('blocks: []')
    expect(error.message).toContain("import { HeroBasic } from '@/blocks/HeroBasic/config'")
    expect(error.message).toContain('HeroBasic')
    expect(await readPagesLayout(dir)).toEqual(pagesLayout)
  })

  it('reports the repair when the Pages collection anchor is missing', async () => {
    const pagesLayout =
      "import type { CollectionConfig } from 'payload'\n\nexport const Other = {}\n"
    const dir = await makeProject({ pagesLayout })

    const error = await captureRejection(applyPayloadFragments(dir, [pagesLayoutFragment]))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(PAGES_LAYOUT_FILE)
    expect(error.message).toContain('insertion anchor "export const Pages: CollectionConfig"')
    expect(error.message).toContain("import { HeroBasic } from '@/blocks/HeroBasic/config'")
    expect(error.message).toContain('blocks: [] list')
    expect(await readPagesLayout(dir)).toEqual(pagesLayout)
  })
})

describe('verifyInstalledPayloadFragments', () => {
  it('ignores imports and registrations inside comments and strings', async () => {
    const dir = await makeProject({
      pagesLayout: [
        `// import { ${pagesLayoutFragment.importName} } from '${pagesLayoutFragment.importPath}'`,
        `const importExample = "import { ${pagesLayoutFragment.importName} } from '${pagesLayoutFragment.importPath}'"`,
        "import type { CollectionConfig } from 'payload'",
        '',
        'export const Pages: CollectionConfig = {',
        '  fields: [',
        '    {',
        "      name: 'layout',",
        "      type: 'blocks',",
        '      blocks: [',
        `        // ${pagesLayoutFragment.blockName},`,
        '      ],',
        '    },',
        '  ],',
        '}',
        '',
      ].join('\n'),
      renderBlocks: [
        `// import { ${renderBlocksFragment.importName} } from '${renderBlocksFragment.importPath}'`,
        `const importExample = \`import { ${renderBlocksFragment.importName} } from '${renderBlocksFragment.importPath}'\``,
        '',
        'const blockComponents = {',
        `  // ${renderBlocksFragment.blockSlug}: ${renderBlocksFragment.importName},`,
        '}',
        '',
      ].join('\n'),
    })

    const result = await verifyInstalledPayloadFragments({
      cwd: dir,
      manifest: {
        payloadFragments: [renderBlocksFragment, pagesLayoutFragment],
      },
    })

    expect(result.missingFragments).toEqual([
      'renderBlocks.import:HeroBasicBlock',
      'renderBlocks.block:heroBasic',
      'pagesLayout.import:HeroBasic',
      'pagesLayout.block:HeroBasic',
    ])
  })

  it('requires registrations in the anchored objects and direct layout blocks array', async () => {
    const dir = await makeProject({
      pagesLayout: [
        "const pageLabel = '🚀'",
        `import { ${pagesLayoutFragment.importName} } from '${pagesLayoutFragment.importPath}'`,
        "import type { CollectionConfig } from 'payload'",
        '',
        'export const Pages: CollectionConfig = {',
        '  fields: [',
        '    {',
        "      name: 'layout',",
        '      admin: {',
        `        blocks: [${pagesLayoutFragment.blockName}],`,
        '      },',
        "      type: 'blocks',",
        '      blocks: [],',
        '    },',
        '  ],',
        '}',
        '',
      ].join('\n'),
      renderBlocks: [
        "const rendererLabel = '🚀'",
        `import { ${renderBlocksFragment.importName} } from '${renderBlocksFragment.importPath}'`,
        '',
        'const blockComponents = {',
        '}',
        '',
        `const previewComponents = { ${renderBlocksFragment.blockSlug}: ${renderBlocksFragment.importName} }`,
        '',
      ].join('\n'),
    })

    const result = await verifyInstalledPayloadFragments({
      cwd: dir,
      manifest: {
        payloadFragments: [renderBlocksFragment, pagesLayoutFragment],
      },
    })

    expect(result.missingFragments).toEqual([
      'renderBlocks.block:heroBasic',
      'pagesLayout.block:HeroBasic',
    ])
  })
})
