import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { checkManifestProjectRequirements } from '../../tools/payload-components/project'
import { runCommand } from '../../tools/payload-components/utils'
import { createInstallFixture } from './payload-components-fixture'

const dirs: string[] = []
const root = process.cwd()
afterEach(async () => {
  await Promise.all(dirs.splice(0).map((cwd) => rm(cwd, { recursive: true, force: true })))
})
const fixture = async () => {
  const value = await createInstallFixture('collection-query', { preseedSource: true })
  dirs.push(value.fixtureDir)
  return value
}
const imports =
  "import { buildConfig } from 'payload'\nimport { Posts } from './collections/Posts'\nimport { Categories } from './collections/Categories'\n"

describe('component-specific host prerequisites', () => {
  it('accepts real starter declarations and rejects comment/string decoys for quoted anchors', async () => {
    const { fixtureDir: cwd, manifest } = await fixture()
    expect(await checkManifestProjectRequirements({ cwd, manifest })).toEqual([])
    const posts = path.join(cwd, 'src/collections/Posts/index.ts')
    const real = await readFile(posts, 'utf8')
    for (const decoy of [
      `/* ${real} */`,
      `const fixture = ${JSON.stringify(real)}`,
      `const fixture = \`${real}\``,
    ]) {
      await writeFile(posts, decoy)
      expect(
        (await checkManifestProjectRequirements({ cwd, manifest })).some(
          (failure) => failure.label === 'Posts collection',
        ),
      ).toBe(true)
    }
    await writeFile(posts, `/* decoy */\n${real}`)
    expect(await checkManifestProjectRequirements({ cwd, manifest })).toEqual([])
  })

  it.each([
    'export default buildConfig({ collections: [] })',
    'export default buildConfig({ collections: [/* Posts, Categories */] })',
    "export default buildConfig({ collections: ['Posts', 'Categories'] })",
    'export default buildConfig({ collections: [OtherPosts, OtherCategories] })',
    'export default buildConfig({ collections: [wrap(Posts), Categories] })',
    'export default buildConfig({ collections: [Posts, Categories], collections: [] })',
    'export default buildConfig({ collections: [Posts, Categories], collections })',
    'export default buildConfig({ collections: [Posts, Categories], ...other })',
    "export default buildConfig({ collections: [Posts, Categories], ['collections']: [] })",
    'export default buildConfig({ collections: [Posts, Categories].filter(Boolean) })',
    'export default buildConfig({ collections: getCollections(Posts, Categories) })',
    'export default buildConfig({ collections })',
    'export default { collections: [Posts, Categories] }',
    'export default buildConfig({ nested: { collections: [Posts, Categories] } })',
  ])('refuses unproven collection registration: %s', async (config) => {
    const { fixtureDir: cwd, manifest } = await fixture()
    await writeFile(path.join(cwd, 'src/payload.config.ts'), imports + config)
    const failures = await checkManifestProjectRequirements({ cwd, manifest })
    expect(failures.some((failure) => failure.label === 'Posts and Categories registration')).toBe(
      true,
    )
    expect(failures.map((failure) => failure.message).join(' ')).toContain('include both directly')
  })

  it('allows direct registrations after earlier config spreads and with unrelated collection entries', async () => {
    const { fixtureDir: cwd, manifest } = await fixture()
    await writeFile(
      path.join(cwd, 'src/payload.config.ts'),
      imports +
        'export default buildConfig({ ...other, collections: [Pages, Posts, /* comment */ Categories, ...extras], cors: ["https://example.com"] })',
    )
    expect(await checkManifestProjectRequirements({ cwd, manifest })).toEqual([])
  })

  it('rejects missing Categories before add writes and reports a lost registration through doctor', async () => {
    const { fixtureDir: cwd, manifest } = await fixture()
    const categories = path.join(cwd, 'src/collections/Categories.ts')
    const categoriesSource = await readFile(categories, 'utf8')
    await rm(categories)
    const command = (...args: string[]) =>
      runCommand({
        command: process.execPath,
        args: [path.join(root, 'bin/payload-components.mjs'), ...args, '--cwd', cwd],
        cwd: root,
        captureOutput: true,
        timeoutMs: 60_000,
      })
    const failure = await command('add', 'collection-query').catch(
      (error: Error & { stderr: string }) => error,
    )
    expect(failure).toBeInstanceOf(Error)
    expect((failure as Error & { stderr: string }).stderr).toContain('Categories collection')
    await expect(readFile(path.join(cwd, '.payload-components/state.json'))).rejects.toThrow()
    await writeFile(categories, categoriesSource)
    await command('add', 'collection-query')
    await writeFile(
      path.join(cwd, 'src/payload.config.ts'),
      imports + 'export default buildConfig({ collections: [Posts] })',
    )
    const doctor = await command('doctor').catch((error: Error & { stdout: string }) => error)
    expect(doctor).toBeInstanceOf(Error)
    expect((doctor as Error & { stdout: string }).stdout).toContain(
      'Categories directly in buildConfig.collections',
    )
    expect(manifest.requires?.projectFiles).toHaveLength(3)
  }, 120_000)
})
