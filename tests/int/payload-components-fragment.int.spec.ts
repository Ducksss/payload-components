import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import type { PayloadFragment } from '../../tools/payload-components/types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from '../../tools/payload-components/constants'
import { applyPayloadFragments } from '../../tools/payload-components/project'

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

  it('fails loudly and leaves the file untouched when the anchor is missing', async () => {
    const renderBlocks = "import React from 'react'\n\nexport const RenderBlocks = () => null\n"
    const dir = await makeProject({ renderBlocks })

    await expect(applyPayloadFragments(dir, [renderBlocksFragment])).rejects.toThrow(/insertion anchor/i)
    expect(await readRenderBlocks(dir)).toEqual(renderBlocks)
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

    await expect(applyPayloadFragments(dir, [pagesLayoutFragment])).rejects.toThrow(/layout/i)
    expect(await readPagesLayout(dir)).toEqual(pagesLayout)
  })
})
