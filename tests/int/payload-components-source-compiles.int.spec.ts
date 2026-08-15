import { mkdtemp, readFile, readdir, rm, writeFile, mkdir } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import ts from 'typescript'
import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import { applyPayloadFragments } from '../../tools/payload-components/project'

/* Everything under payload-components/source is target code: it is shipped into
 * consumer repos and never runs here, so tsconfig excludes it and this repo has
 * no `payload` dependency to typecheck it against. That blind spot is how v1.3.0
 * shipped a starter base that could not compile — three bugs passed every gate
 * because no gate ever looked at the shipped bytes.
 *
 * Parsing is the part that needs no dependencies at all, so it covers the whole
 * tree. The patch and typecheck checks focus on the starter base, which is the
 * code the installer rewrites and the only shipped file whose imports resolve
 * here.
 *
 * The full proof is `pnpm test:fresh -- --scenario bare`, which compiles the
 * bundle inside a real Payload app. It needs network and a database, so it runs
 * in CI rather than on every save. These checks are the fast half: they cost
 * milliseconds, run in the normal gate, and would have caught two of those three
 * bugs on the first run.
 *
 * The directory is enumerated rather than listed, so a new shipped file is
 * covered the moment it is added. */

const repoRoot = process.cwd()
const sourceDir = path.join(repoRoot, 'payload-components', 'source')
const baseDir = path.join(sourceDir, 'base')

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

const listFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)

      return entry.isDirectory() ? await listFiles(entryPath) : [entryPath]
    }),
  )

  return files.flat().sort()
}

/* Syntactic diagnostics only — a parse error means the file cannot compile in
   any project, whatever its dependencies resolve to. The label is separate from
   the path because the path decides the script kind: a `.tsx` file parsed as
   `.ts` rejects every JSX tag in it. */
const expectParses = ({
  filePath,
  label = filePath,
  source,
}: {
  filePath: string
  label?: string
  source: string
}) => {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.ESNext,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const errors = (
    (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics ?? []
  ).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '))

  expect(errors, `${label} must parse as TypeScript`).toEqual([])
}

describe('shipped target source', () => {
  it('parses every file it ships', async () => {
    const files = (await listFiles(sourceDir)).filter(
      (filePath) => filePath.endsWith('.ts') || filePath.endsWith('.tsx'),
    )

    /* Guard the guard: an empty walk would make every assertion below vacuous. */
    expect(files.length).toBeGreaterThanOrEqual(100)

    for (const filePath of files) {
      expectParses({
        filePath: path.relative(repoRoot, filePath),
        source: await readFile(filePath, 'utf8'),
      })
    }
  })

  it('still parses the starter base after the installer patches real blocks into it', async () => {
    /* The v1.3.0 bug: the shipped renderer declared `const blockComponents = {}`
       with both braces on one line, so the installer wrote each block's entry
       above the declaration and the file stopped parsing after the first `add`.
       Both files parse on their own — only the patched result exposes it. */
    const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-base-compile-'))
    tempDirs.push(dir)

    for (const projectPath of ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts']) {
      const sourcePath = path.join(baseDir, projectPath.replace(/^src\//, ''))

      await mkdir(path.join(dir, path.dirname(projectPath)), { recursive: true })
      await writeFile(path.join(dir, projectPath), await readFile(sourcePath, 'utf8'), 'utf8')
    }

    for (const componentName of ['hero-basic', 'faq-card']) {
      const manifest = await loadManifest(componentName)

      await applyPayloadFragments(dir, manifest.payloadFragments)
    }

    for (const projectPath of ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts']) {
      const patched = await readFile(path.join(dir, projectPath), 'utf8')

      expectParses({
        filePath: projectPath,
        label: `${projectPath} (after two installs)`,
        source: patched,
      })

      /* Entries must land inside the structures they belong to, not merely
         somewhere in a file that happens to parse. */
      if (projectPath.endsWith('RenderBlocks.tsx')) {
        const declaration = patched.indexOf('const blockComponents')

        expect(declaration).toBeGreaterThan(-1)
        expect(patched.indexOf('heroBasic:')).toBeGreaterThan(declaration)
        expect(patched.indexOf('faqCard:')).toBeGreaterThan(declaration)
      } else {
        expect(patched).toMatch(/blocks:\s*\[[^\]]*HeroBasic[^\]]*FaqCard[^\]]*\]/)
      }
    }
  })

  it('typechecks the renderer once blocks are installed into it', async () => {
    /* The other v1.3.0 bug: indexing the block map types as `never` while it is
       empty — the only state this repo could ever observe — and stopped
       compiling the moment a block was installed. The renderer imports nothing
       but React, so a real typecheck runs here without a Payload app. */
    const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-base-typecheck-'))
    tempDirs.push(dir)

    await mkdir(path.join(dir, 'src', 'blocks'), { recursive: true })
    await writeFile(
      path.join(dir, 'src', 'blocks', 'RenderBlocks.tsx'),
      await readFile(path.join(baseDir, 'blocks', 'RenderBlocks.tsx'), 'utf8'),
      'utf8',
    )

    /* Stand-ins for the block components an install would add, typed the way a
       real block is: its own props, not a shared shape. */
    await writeFile(
      path.join(dir, 'src', 'blocks', 'stubs.tsx'),
      [
        "import React from 'react'",
        '',
        'export const HeroBasicBlock: React.FC<{ title?: null | string }> = () => null',
        'export const FaqCardBlock: React.FC<{ questions?: null | string[] }> = () => null',
        '',
      ].join('\n'),
      'utf8',
    )

    const rendererPath = path.join(dir, 'src', 'blocks', 'RenderBlocks.tsx')
    const renderer = await readFile(rendererPath, 'utf8')

    await writeFile(
      rendererPath,
      renderer
        .replace(
          "import React, { Fragment } from 'react'",
          [
            "import React, { Fragment } from 'react'",
            '',
            "import { FaqCardBlock, HeroBasicBlock } from './stubs'",
          ].join('\n'),
        )
        .replace(
          'const blockComponents = {\n}',
          'const blockComponents = {\n  heroBasic: HeroBasicBlock,\n  faqCard: FaqCardBlock,\n}',
        ),
      'utf8',
    )

    const program = ts.createProgram([rendererPath], {
      baseUrl: dir,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      /* The scratch project sits outside the repo, so module resolution never
         walks up to node_modules. React is the renderer's only import; point at
         the copy this repo already installs. */
      paths: {
        react: [path.join(repoRoot, 'node_modules', '@types', 'react')],
        'react/jsx-runtime': [
          path.join(repoRoot, 'node_modules', '@types', 'react', 'jsx-runtime'),
        ],
      },
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ESNext,
    })
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .filter((diagnostic) => diagnostic.file?.fileName === rendererPath.replaceAll(path.sep, '/'))
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '))

    expect(diagnostics, 'the populated renderer must typecheck').toEqual([])
  })
})
