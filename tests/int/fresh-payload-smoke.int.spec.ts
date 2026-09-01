import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readRepoFile = (filePath: string) => readFile(path.join(repoRoot, filePath), 'utf8')
const listRepoFiles = async (dirPath: string): Promise<string[]> => {
  const entries = await readdir(path.join(repoRoot, dirPath), { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name)

      return entry.isDirectory() ? listRepoFiles(entryPath) : [entryPath]
    }),
  )

  return nested.flat()
}
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
    expect(source).toContain("item[fieldName] === ''")
    expect(source).toContain('isMissingUploadReference(item, fieldName) ? mediaID : item[fieldName]')
  })

  it('keeps team variants in the default fresh-smoke component set', async () => {
    const source = await readRepoFile('tools/payload-components/smoke/fresh-payload-repo.ts')

    expect(source).toContain("'team-roster'")
    expect(source).toContain("'team-grid'")
  })

  it('keeps long CTA link-group DB identifiers under Payload limits without collisions', async () => {
    const centered = await readRepoFile(
      'payload-components/source/blocks/CallToActionCentered/config.ts',
    )
    const boxed = await readRepoFile('payload-components/source/blocks/CallToActionBoxed/config.ts')

    expect(centered).toMatch(/dbName:\s*'cta_centered_links'/)
    expect(boxed).toMatch(/dbName:\s*'cta_boxed_links'/)
  })

  it('creates fresh shared Payload field objects for each block config', async () => {
    const configFiles = (await listRepoFiles('payload-components/source/blocks')).filter((file) =>
      file.endsWith('/config.ts'),
    )
    const configSource = (await Promise.all(configFiles.map((file) => readRepoFile(file)))).join(
      '\n',
    )

    expect(configSource).not.toMatch(
      /\.\.\.(contentFields|featureFields|integrationFields|logoCloudFields|teamFields|callToActionFields|heroFields)\b/,
    )
    expect(configSource).not.toMatch(/\bfields:\s*teamMemberFields\b/)
    expect(configSource).not.toMatch(/\bintegrationFeaturedMark,\s*$/m)
  })
})
