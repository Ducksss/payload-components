import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const componentDocsDir = path.join(repoRoot, 'content', 'docs', 'components')
const provenancePath = path.join(repoRoot, 'payload-components', 'PROVENANCE.md')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')

const componentDocFiles = async () =>
  (await readdir(componentDocsDir))
    .filter((entry) => entry.endsWith('.mdx'))
    .map((entry) => path.join(componentDocsDir, entry))
    .sort()

describe('component documentation install commands', () => {
  it('uses the canonical www host for manual registry install URLs', async () => {
    const apexHostMatches: string[] = []
    const missingManualCommands: string[] = []

    for (const file of await componentDocFiles()) {
      const source = await readFile(file, 'utf8')
      const relative = path.relative(repoRoot, file)
      const slug = path.basename(file, '.mdx')

      if (source.includes('https://payload-components.xyz/r/')) {
        apexHostMatches.push(relative)
      }

      if (!source.includes(`https://www.payload-components.xyz/r/${slug}.json`)) {
        missingManualCommands.push(relative)
      }
    }

    expect(apexHostMatches).toEqual([])
    expect(missingManualCommands).toEqual([])
  })
})

describe('component provenance attribution', () => {
  it('keeps the PROVENANCE ledger, source comments, and docs footers in sync', async () => {
    const provenance = await readFile(provenancePath, 'utf8')
    const derivedSection = provenance
      .split('## Derived components (attributed)')[1]
      ?.split('\n## ')[0]
    const derivedSlugs = [...(derivedSection ?? '').matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map(
      (match) => match[1],
    )

    expect(derivedSlugs).toContain('testimonials-grid')

    const missingSourceComments: string[] = []
    const missingDocsFooters: string[] = []

    for (const slug of derivedSlugs) {
      const manifest = JSON.parse(
        await readFile(path.join(manifestsDir, `${slug}.json`), 'utf8'),
      ) as { files: string[] }
      const componentFile = manifest.files.find((file) => file.endsWith('Component.tsx'))
      if (!componentFile) {
        missingSourceComments.push(slug)
        continue
      }

      const source = await readFile(
        path.join(repoRoot, 'payload-components', 'source', componentFile.replace(/^src\//, '')),
        'utf8',
      )
      if (!source.includes('Layout adapted from tailark/blocks (MIT)')) {
        missingSourceComments.push(slug)
      }

      const docs = await readFile(path.join(componentDocsDir, `${slug}.mdx`), 'utf8')
      if (
        !docs.includes('adapted from [tailark/blocks](https://github.com/tailark/blocks) (MIT)')
      ) {
        missingDocsFooters.push(slug)
      }
    }

    expect(missingSourceComments).toEqual([])
    expect(missingDocsFooters).toEqual([])
  })
})
