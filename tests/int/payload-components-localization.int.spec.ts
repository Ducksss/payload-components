import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  compareInstalledFiles,
  copySharedSourceFile,
} from '../../tools/payload-components/component-files'
import {
  applyLocalizedFields,
  isBlockConfigFile,
  LOCALIZE_HELPER_FILE,
} from '../../tools/payload-components/project'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* `--localized` wraps an installed block config's field list in
 * localizeFields(...). The wrap has to land on the block's own top-level fields
 * array, survive a re-run, and cover shared family fields for free because they
 * are spread inside the array it wraps. */

const localizeHelperModule = '../../payload-components/source/blocks/shared/localizeFields'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

const CONFIG_SOURCE = [
  "import type { Block } from 'payload'",
  '',
  "import { heroFields } from '@/blocks/shared/heroFields'",
  '',
  'export const HeroBasic: Block = {',
  "  slug: 'heroBasic',",
  "  interfaceName: 'HeroBasicBlock',",
  '  fields: [',
  '    ...heroFields,',
  '    {',
  "      name: 'proofItems',",
  "      type: 'array',",
  '      fields: [',
  '        {',
  "          name: 'label',",
  "          type: 'text',",
  '          required: true,',
  '        },',
  '      ],',
  '    },',
  '  ],',
  '  labels: {',
  "    plural: 'Hero Basic Blocks',",
  "    singular: 'Hero Basic',",
  '  },',
  '}',
  '',
].join('\n')

const makeProject = async (files: Record<string, string> = {}) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-localize-'))
  tempDirs.push(dir)

  for (const [relPath, content] of Object.entries({
    'src/blocks/HeroBasic/config.ts': CONFIG_SOURCE,
    ...files,
  })) {
    await mkdir(path.join(dir, path.dirname(relPath)), { recursive: true })
    await writeFile(path.join(dir, relPath), content, 'utf8')
  }

  return dir
}

const readConfig = (dir: string) =>
  readFile(path.join(dir, 'src/blocks/HeroBasic/config.ts'), 'utf8')

describe('applyLocalizedFields', () => {
  it('wraps the block fields array and adds the helper import', async () => {
    const dir = await makeProject()

    const patched = await applyLocalizedFields({
      configFiles: ['src/blocks/HeroBasic/config.ts'],
      cwd: dir,
    })
    const source = await readConfig(dir)

    expect(patched).toEqual(['src/blocks/HeroBasic/config.ts'])
    expect(source).toContain("import { localizeFields } from '@/blocks/shared/localizeFields'")
    expect(source).toContain('  fields: localizeFields([')
    expect(source).toContain('  ]),')
    /* The shared base is inside the wrapped array, so one call covers it. */
    expect(source).toContain('...heroFields,')
    /* Nested arrays and everything after the field list stay untouched. */
    expect(source).toContain("      type: 'array',")
    expect(source).toContain("    singular: 'Hero Basic',")
  })

  it('is idempotent — a second pass changes nothing', async () => {
    const dir = await makeProject()

    await applyLocalizedFields({ configFiles: ['src/blocks/HeroBasic/config.ts'], cwd: dir })
    const afterFirst = await readConfig(dir)

    const patched = await applyLocalizedFields({
      configFiles: ['src/blocks/HeroBasic/config.ts'],
      cwd: dir,
    })

    expect(patched).toEqual([])
    expect(await readConfig(dir)).toEqual(afterFirst)
    expect(afterFirst.match(/localizeFields\(\[/g)).toHaveLength(1)
    expect(afterFirst.match(/import \{ localizeFields \}/g)).toHaveLength(1)
  })

  it('leaves a fields value that is already a helper call alone', async () => {
    const dir = await makeProject({
      'src/blocks/HeroBasic/config.ts': CONFIG_SOURCE.replace(
        '  fields: [',
        '  fields: myOwnTransform([',
      ).replace('  ],\n  labels', '  ]),\n  labels'),
    })

    const patched = await applyLocalizedFields({
      configFiles: ['src/blocks/HeroBasic/config.ts'],
      cwd: dir,
    })

    expect(patched).toEqual([])
    expect(await readConfig(dir)).toContain('myOwnTransform([')
  })

  it('fails loudly when the file is not a block config', async () => {
    const dir = await makeProject({
      'src/blocks/HeroBasic/config.ts': 'export const notABlock = { fields: [] }\n',
    })

    await expect(
      applyLocalizedFields({ configFiles: ['src/blocks/HeroBasic/config.ts'], cwd: dir }),
    ).rejects.toThrow('Unable to find an exported Payload Block object')
  })

  it('only treats config.ts files as block configs', () => {
    expect(isBlockConfigFile('src/blocks/HeroBasic/config.ts')).toBe(true)
    expect(isBlockConfigFile('src/blocks/HeroBasic/Component.tsx')).toBe(false)
    expect(isBlockConfigFile('src/blocks/shared/heroFields.ts')).toBe(false)
  })
})

describe('localizing the real shipped block configs', () => {
  /* The hand-written fixture above pins the transform's edge cases; this proves
   * it lands correctly on the actual bytes the registry ships, for a variant
   * whose fields come from a shared family base. */
  it.each(['hero-basic', 'faq-card', 'pricing-cards'])('wraps %s', async (componentName) => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents([componentName], {
      preseedSource: true,
    })

    tempDirs.push(fixtureDir)

    const [manifest] = manifests
    const configFiles = manifest.files.filter((filePath) => isBlockConfigFile(filePath))

    expect(configFiles).toHaveLength(1)

    const patched = await applyLocalizedFields({ configFiles, cwd: fixtureDir })

    expect(patched).toEqual(configFiles)

    const source = await readFile(path.join(fixtureDir, configFiles[0]), 'utf8')

    expect(source).toContain("import { localizeFields } from '@/blocks/shared/localizeFields'")
    expect(source).toContain('fields: localizeFields([')
    /* Balanced: the wrap must close before the sibling keys that follow. */
    expect(source).toContain('  ]),')
    expect(source).toContain('  labels: {')
  })
})

describe('drift detection for a localized install', () => {
  /* Without this, every localized component would read as permanently modified
   * and `update` would refuse to touch it without --force. */
  it('reads a localized component as clean', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(['hero-basic'], {
      preseedSource: true,
    })

    tempDirs.push(fixtureDir)

    const [manifest] = manifests

    await applyLocalizedFields({
      configFiles: manifest.files.filter((filePath) => isBlockConfigFile(filePath)),
      cwd: fixtureDir,
    })

    /* Judged against the shipped bytes, the wrap looks like a local edit. */
    await expect(compareInstalledFiles({ cwd: fixtureDir, manifest })).resolves.toMatchObject({
      modified: ['src/blocks/HeroBasic/config.ts'],
    })

    await expect(
      compareInstalledFiles({ cwd: fixtureDir, localized: true, manifest }),
    ).resolves.toMatchObject({ missing: [], modified: [] })
  })

  it('still reports a real edit made on top of a localized install', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(['hero-basic'], {
      preseedSource: true,
    })

    tempDirs.push(fixtureDir)

    const [manifest] = manifests
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await applyLocalizedFields({
      configFiles: ['src/blocks/HeroBasic/config.ts'],
      cwd: fixtureDir,
    })
    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')

    await expect(
      compareInstalledFiles({ cwd: fixtureDir, localized: true, manifest }),
    ).resolves.toMatchObject({ modified: ['src/blocks/HeroBasic/config.ts'] })
  })
})

describe('the shipped localizeFields helper', () => {
  it('is copied into the project once and never overwrites an edited copy', async () => {
    const dir = await makeProject()

    expect(await copySharedSourceFile({ cwd: dir, projectPath: LOCALIZE_HELPER_FILE })).toBe(true)

    const helper = await readFile(path.join(dir, LOCALIZE_HELPER_FILE), 'utf8')

    expect(helper).toContain('export const localizeFields')
    expect(helper).toContain("import type { Field } from 'payload'")

    await writeFile(path.join(dir, LOCALIZE_HELPER_FILE), '// edited\n', 'utf8')

    expect(await copySharedSourceFile({ cwd: dir, projectPath: LOCALIZE_HELPER_FILE })).toBe(false)
    expect(await readFile(path.join(dir, LOCALIZE_HELPER_FILE), 'utf8')).toBe('// edited\n')
  })

  it('refuses to copy a path that escapes the shipped source tree', async () => {
    const dir = await makeProject()

    await expect(
      copySharedSourceFile({ cwd: dir, projectPath: 'src/../../../etc/passwd' }),
    ).rejects.toThrow('outside')
  })

  it('marks prose leaves localized and leaves containers and other types alone', async () => {
    /* Exercise the shipped target code itself, so this asserts the exact bytes a
     * consumer receives rather than a copy of the logic. The specifier goes
     * through a variable on purpose: a static import would pull Payload target
     * code into tsc's program, and payload-components/source is excluded from
     * the build because this repo has no `payload` dependency. Vitest resolves
     * it at runtime, where the only Payload reference is a type-only import. */
    const { localizeFields } = (await import(localizeHelperModule)) as {
      localizeFields: (fields: unknown[]) => Array<Record<string, unknown>>
    }

    const result = localizeFields([
      { name: 'title', type: 'text' },
      { name: 'body', type: 'richText' },
      { name: 'blurb', type: 'textarea', localized: false },
      { name: 'appearance', type: 'select', options: [] },
      { name: 'image', type: 'upload', relationTo: 'media' },
      {
        fields: [
          { name: 'label', type: 'text' },
          { name: 'count', type: 'number' },
        ],
        name: 'items',
        type: 'array',
      },
    ])

    expect(result[0]).toMatchObject({ localized: true, name: 'title' })
    expect(result[1]).toMatchObject({ localized: true, name: 'body' })
    /* An explicit choice already on the field wins. */
    expect(result[2]).toMatchObject({ localized: false, name: 'blurb' })
    expect(result[3]).not.toHaveProperty('localized')
    expect(result[4]).not.toHaveProperty('localized')
    /* The container itself is never localized — Payload rejects a localized
     * field nested inside a localized parent — but its prose leaves are. */
    expect(result[5]).not.toHaveProperty('localized')
    expect((result[5] as { fields: Array<Record<string, unknown>> }).fields[0]).toMatchObject({
      localized: true,
      name: 'label',
    })
    expect((result[5] as { fields: Array<Record<string, unknown>> }).fields[1]).not.toHaveProperty(
      'localized',
    )
  })
})
