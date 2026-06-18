import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readRepoFile = (filePath: string) => readFile(path.join(repoRoot, filePath), 'utf8')
const readManifest = async (slug: string) =>
  JSON.parse(await readRepoFile(path.join('payload-components', 'manifests', `${slug}.json`))) as {
    sampleContent: unknown
  }

describe('fresh Payload smoke seed generation', () => {
  it('ships usable sample content for required nested team avatar uploads', async () => {
    const roster = await readManifest('team-roster')
    const grid = await readManifest('team-grid')
    const source = await readRepoFile('tools/payload-components/smoke/fresh-payload-repo.ts')

    expect(JSON.stringify(roster.sampleContent)).toContain('"avatar"')
    expect(JSON.stringify(grid.sampleContent)).toContain('"avatar"')
    expect(source).toContain("members: addUploadReference(block.members, 'avatar', mediaID)")
    expect(source).toContain('groups: addGroupMemberUploadReferences(block.groups')
  })

  it('keeps team variants in the default fresh-smoke component set', async () => {
    const source = await readRepoFile('tools/payload-components/smoke/fresh-payload-repo.ts')

    expect(source).toContain("'team-roster'")
    expect(source).toContain("'team-grid'")
  })
})
