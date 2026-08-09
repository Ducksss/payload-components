import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import type { PayloadFragment } from '../../tools/payload-components/types'

import { partitionOwnedFiles } from '../../tools/payload-components/component-files'
import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from '../../tools/payload-components/constants'
import {
  applyPayloadFragments,
  removePayloadFragments,
  verifyInstalledPayloadFragments,
} from '../../tools/payload-components/project'

/* removePayloadFragments is the inverse of applyPayloadFragments, so the
 * contract these tests pin is a round trip: apply then remove must return the
 * consumer's file to the byte it started at, and removal must never touch a
 * sibling variant's wiring or a shared family file. */

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

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

const heroFragments: PayloadFragment[] = [
  {
    blockSlug: 'heroBasic',
    importName: 'HeroBasicBlock',
    importPath: '@/blocks/HeroBasic/Component',
    kind: 'renderBlocks',
  },
  {
    blockName: 'HeroBasic',
    importName: 'HeroBasic',
    importPath: '@/blocks/HeroBasic/config',
    kind: 'pagesLayout',
  },
]

const faqFragments: PayloadFragment[] = [
  {
    blockSlug: 'faqCard',
    importName: 'FaqCardBlock',
    importPath: '@/blocks/FaqCard/Component',
    kind: 'renderBlocks',
  },
  {
    blockName: 'FaqCard',
    importName: 'FaqCard',
    importPath: '@/blocks/FaqCard/config',
    kind: 'pagesLayout',
  },
]

const makeProject = async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-remove-'))
  tempDirs.push(dir)

  await mkdir(path.join(dir, path.dirname(RENDER_BLOCKS_FILE)), { recursive: true })
  await writeFile(path.join(dir, RENDER_BLOCKS_FILE), CANONICAL_RENDER_BLOCKS, 'utf8')
  await mkdir(path.join(dir, path.dirname(PAGES_LAYOUT_FILE)), { recursive: true })
  await writeFile(path.join(dir, PAGES_LAYOUT_FILE), CANONICAL_PAGES_LAYOUT, 'utf8')

  return dir
}

const readRenderBlocks = (dir: string) => readFile(path.join(dir, RENDER_BLOCKS_FILE), 'utf8')
const readPagesLayout = (dir: string) => readFile(path.join(dir, PAGES_LAYOUT_FILE), 'utf8')

describe('removePayloadFragments', () => {
  it('restores both host files byte-for-byte after an apply', async () => {
    const dir = await makeProject()

    await applyPayloadFragments(dir, heroFragments)
    expect(await readRenderBlocks(dir)).toContain('heroBasic: HeroBasicBlock,')

    const touched = await removePayloadFragments(dir, heroFragments)

    expect(touched).toEqual([RENDER_BLOCKS_FILE, PAGES_LAYOUT_FILE])
    expect(await readRenderBlocks(dir)).toEqual(CANONICAL_RENDER_BLOCKS)
    expect(await readPagesLayout(dir)).toEqual(CANONICAL_PAGES_LAYOUT)
  })

  it('leaves a sibling variant fully wired', async () => {
    const dir = await makeProject()

    await applyPayloadFragments(dir, heroFragments)
    await applyPayloadFragments(dir, faqFragments)
    await removePayloadFragments(dir, heroFragments)

    const renderBlocks = await readRenderBlocks(dir)
    const pagesLayout = await readPagesLayout(dir)

    expect(renderBlocks).not.toContain('HeroBasicBlock')
    expect(renderBlocks).toContain('faqCard: FaqCardBlock,')
    expect(renderBlocks).toContain("import { FaqCardBlock } from '@/blocks/FaqCard/Component'")
    expect(pagesLayout).not.toContain('HeroBasic')
    expect(pagesLayout).toContain('blocks: [FaqCard],')

    await expect(
      verifyInstalledPayloadFragments({ cwd: dir, manifest: { payloadFragments: faqFragments } }),
    ).resolves.toMatchObject({ isValid: true })
  })

  it('is idempotent and treats already-absent wiring as a no-op', async () => {
    const dir = await makeProject()

    await applyPayloadFragments(dir, heroFragments)
    await removePayloadFragments(dir, heroFragments)
    const afterFirst = await readRenderBlocks(dir)

    const touched = await removePayloadFragments(dir, heroFragments)

    expect(touched).toEqual([])
    expect(await readRenderBlocks(dir)).toEqual(afterFirst)
  })

  it('narrows a shared import statement instead of deleting it', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-remove-'))
    tempDirs.push(dir)

    await mkdir(path.join(dir, path.dirname(RENDER_BLOCKS_FILE)), { recursive: true })
    await writeFile(
      path.join(dir, RENDER_BLOCKS_FILE),
      [
        "import { HeroBasicBlock, Untouched } from '@/blocks/HeroBasic/Component'",
        '',
        'const blockComponents = {',
        '  heroBasic: HeroBasicBlock,',
        '}',
        '',
      ].join('\n'),
      'utf8',
    )

    await removePayloadFragments(dir, [heroFragments[0]])

    const source = await readRenderBlocks(dir)

    expect(source).toContain("import { Untouched } from '@/blocks/HeroBasic/Component'")
    expect(source).not.toContain('HeroBasicBlock')
    expect(source).toContain('const blockComponents = {\n}')
  })
})

describe('partitionOwnedFiles', () => {
  const heroBasicFiles = [
    'src/blocks/shared/heroFields.ts',
    'src/blocks/HeroBasic/config.ts',
    'src/blocks/HeroBasic/Component.tsx',
  ]

  it('treats every file as exclusive when nothing else is installed', () => {
    expect(partitionOwnedFiles({ files: heroBasicFiles, retainedManifests: [] })).toEqual({
      exclusiveFiles: [...heroBasicFiles].sort(),
      sharedFiles: [],
    })
  })

  it('keeps a shared family base that a retained variant still ships', () => {
    const { exclusiveFiles, sharedFiles } = partitionOwnedFiles({
      files: heroBasicFiles,
      retainedManifests: [
        {
          files: ['src/blocks/shared/heroFields.ts', 'src/blocks/HeroVideo/config.ts'],
          name: 'hero-video',
        },
      ],
    })

    expect(exclusiveFiles).toEqual([
      'src/blocks/HeroBasic/Component.tsx',
      'src/blocks/HeroBasic/config.ts',
    ])
    expect(sharedFiles).toEqual([
      { owners: ['hero-video'], projectPath: 'src/blocks/shared/heroFields.ts' },
    ])
  })
})
