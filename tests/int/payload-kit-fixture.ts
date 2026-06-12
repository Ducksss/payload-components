import { mkdir, mkdtemp as fsMkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { loadManifest } from '../../tools/payload-kit/manifest'

import type { KitManifest, PayloadFragment } from '../../tools/payload-kit/types'

const layoutAnchor = "name: 'layout'"

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const stripImportLine = (source: string, importName: string, importPath: string) =>
  source.replace(
    new RegExp(
      `^import \\{ ${escapeRegExp(importName)} \\} from '${escapeRegExp(importPath)}'\\n`,
      'm',
    ),
    '',
  )

const stripRenderBlocksFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>,
) => {
  const withoutImport = stripImportLine(source, fragment.importName, fragment.importPath)

  return withoutImport.replace(
    new RegExp(
      `^\\s*${escapeRegExp(fragment.blockSlug)}: ${escapeRegExp(fragment.importName)},\\n?`,
      'm',
    ),
    '',
  )
}

const stripPagesLayoutFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>,
) => {
  const withoutImport = stripImportLine(source, fragment.importName, fragment.importPath)
  const layoutIndex = withoutImport.indexOf(layoutAnchor)

  if (layoutIndex === -1) {
    throw new Error('Unable to find the layout tab in Pages collection config.')
  }

  const layoutSlice = withoutImport.slice(layoutIndex)
  const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!blocksMatch || typeof blocksMatch.index !== 'number') {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  const absoluteMatchStart = layoutIndex + blocksMatch.index
  const absoluteMatchEnd = absoluteMatchStart + blocksMatch[0].length
  const remainingEntries = blocksMatch[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => entry !== fragment.blockName)
  const replacement = `blocks: [${remainingEntries.join(', ')}],`

  return `${withoutImport.slice(0, absoluteMatchStart)}${replacement}${withoutImport.slice(absoluteMatchEnd)}`
}

const copyProjectFixture = async () => {
  const tempDir = await fsMkdtemp(path.join(os.tmpdir(), 'payload-kit-fixture-'))

  await Promise.all([
    mkdir(path.join(tempDir, 'src', 'app'), { recursive: true }),
    mkdir(path.join(tempDir, 'src', 'blocks'), { recursive: true }),
    mkdir(path.join(tempDir, 'src', 'collections', 'Pages'), { recursive: true }),
    mkdir(path.join(tempDir, 'src', 'components', 'ui'), { recursive: true }),
  ])

  await Promise.all([
    writeFile(
      path.join(tempDir, 'package.json'),
      `${JSON.stringify(
        {
          name: 'payload-kit-fixture-target',
          private: true,
          scripts: {
            'generate:importmap':
              "node -e \"require('fs').mkdirSync('src/app/(payload)/admin',{recursive:true}); require('fs').writeFileSync('src/app/(payload)/admin/importMap.js','export const importMap = {}\\\\n')\"",
            'generate:types':
              "node -e \"require('fs').writeFileSync('src/payload-types.ts','export type HeroBasicBlock = any; export type FeatureGridBasicBlock = any; export type Page = { layout: any[] }\\\\n')\"",
          },
          dependencies: {
            'class-variance-authority': '^0.7.0',
            clsx: '^2.1.1',
            'lucide-react': '^0.563.0',
            next: '^16.0.0',
            payload: '^3.0.0',
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'tailwind-merge': '^3.4.0',
          },
          devDependencies: {
            typescript: '^5.7.0',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
    writeFile(
      path.join(tempDir, 'components.json'),
      `${JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema.json',
          style: 'default',
          rsc: true,
          tsx: true,
          tailwind: {
            config: 'tailwind.config.mjs',
            css: 'src/app/globals.css',
            baseColor: 'slate',
            cssVariables: true,
            prefix: '',
          },
          aliases: {
            components: '@/components',
            utils: '@/utilities/ui',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
    writeFile(path.join(tempDir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8'),
    writeFile(path.join(tempDir, 'tailwind.config.mjs'), 'export default {}\n', 'utf8'),
    writeFile(
      path.join(tempDir, 'tsconfig.json'),
      `${JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } } }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(path.join(tempDir, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n', 'utf8'),
    writeFile(path.join(tempDir, 'src', 'payload.config.ts'), 'export default {}\n', 'utf8'),
    writeFile(
      path.join(tempDir, 'src', 'components', 'ui', 'badge.tsx'),
      [
        "import * as React from 'react'",
        '',
        'export function Badge(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="badge" {...props} />',
        '}',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      path.join(tempDir, 'src', 'components', 'ui', 'card.tsx'),
      [
        "import * as React from 'react'",
        '',
        'export function Card(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="card" {...props} />',
        '}',
        '',
        'export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="card-header" {...props} />',
        '}',
        '',
        'export function CardTitle(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="card-title" {...props} />',
        '}',
        '',
        'export function CardDescription(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="card-description" {...props} />',
        '}',
        '',
        'export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {',
        '  return <div data-slot="card-content" {...props} />',
        '}',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      path.join(tempDir, 'src', 'blocks', 'RenderBlocks.tsx'),
      [
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
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      path.join(tempDir, 'src', 'collections', 'Pages', 'index.ts'),
      [
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
      ].join('\n'),
      'utf8',
    ),
  ])

  await writeFile(
    path.join(tempDir, '.npmrc'),
    'legacy-peer-deps=true\nenable-pre-post-scripts=true\n',
    'utf8',
  )

  return tempDir
}

export const removeInstalledKitFromFixture = async ({
  fixtureDir,
  manifest,
}: {
  fixtureDir: string
  manifest: Pick<KitManifest, 'files' | 'payloadFragments'>
}) => {
  await Promise.all(
    manifest.files.map((filePath) =>
      rm(path.join(fixtureDir, filePath), { force: true, recursive: true }),
    ),
  )

  const renderBlocksPath = path.join(fixtureDir, 'src', 'blocks', 'RenderBlocks.tsx')
  const pagesIndexPath = path.join(fixtureDir, 'src', 'collections', 'Pages', 'index.ts')

  let renderBlocksSource = await readFile(renderBlocksPath, 'utf8')
  let pagesIndexSource = await readFile(pagesIndexPath, 'utf8')

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      renderBlocksSource = stripRenderBlocksFragment(renderBlocksSource, fragment)
      continue
    }

    pagesIndexSource = stripPagesLayoutFragment(pagesIndexSource, fragment)
  }

  await Promise.all([
    writeFile(renderBlocksPath, renderBlocksSource, 'utf8'),
    writeFile(pagesIndexPath, pagesIndexSource, 'utf8'),
  ])
}

export const createInstallFixture = async (kitName: string) => {
  const { fixtureDir, manifests } = await createInstallFixtureForKits([kitName])

  return {
    fixtureDir,
    manifest: manifests[0],
  }
}

export const createInstallFixtureForKits = async (kitNames: string[]) => {
  const fixtureDir = await copyProjectFixture()
  const manifests = await Promise.all(
    [...new Set(kitNames)].map((kitName) => loadManifest(kitName)),
  )

  for (const manifest of manifests) {
    await removeInstalledKitFromFixture({
      fixtureDir,
      manifest,
    })
  }

  return {
    fixtureDir,
    manifests,
  }
}
