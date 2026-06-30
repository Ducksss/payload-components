import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const componentDocsDir = path.join(repoRoot, 'content', 'docs', 'components')

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
