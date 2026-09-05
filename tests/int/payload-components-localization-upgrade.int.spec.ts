import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { updateCommand } from '../../tools/payload-components/commands/update'
import { hashSource } from '../../tools/payload-components/component-files'
import {
  applyPayloadFragments,
  localizeBlockConfigSource,
  LOCALIZE_HELPER_FILE,
} from '../../tools/payload-components/project'
import { loadState, recordInstalledState, saveState } from '../../tools/payload-components/state'
import { createInstallFixtureForComponents } from './payload-components-fixture'

const directories: string[] = []
afterEach(async () => {
  await Promise.all(directories.splice(0).map((cwd) => rm(cwd, { recursive: true, force: true })))
})

async function legacyInstall(names = ['hero-basic']) {
  const { fixtureDir: cwd, manifests } = await createInstallFixtureForComponents(names, {
    preseedSource: true,
  })
  directories.push(cwd)
  for (const manifest of manifests) {
    await applyPayloadFragments(cwd, manifest.payloadFragments)
    for (const file of manifest.files.filter((file) => file.endsWith('/config.ts'))) {
      const filePath = path.join(cwd, file)
      await writeFile(filePath, localizeBlockConfigSource(await readFile(filePath, 'utf8')))
    }
    await recordInstalledState({
      cwd,
      manifest,
      localized: true,
      rewrittenFiles: manifest.files,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
  }
  const helper = await readFile('tests/int/fixtures/localize-fields-legacy.ts.txt', 'utf8')
  await writeFile(path.join(cwd, LOCALIZE_HELPER_FILE), helper)
  const state = await loadState(cwd)
  for (const entry of Object.values(state.components)) delete entry.localizationPolicy
  await saveState(cwd, state)
  return { cwd, helper, manifests }
}

describe('real update → add localization migration', { timeout: 30_000 }, () => {
  it('reconciles a targeted same-version update without a policy flag', async () => {
    const {
      fixtureDir: cwd,
      manifests: [manifest],
    } = await createInstallFixtureForComponents(['hero-basic'], { preseedSource: true })
    directories.push(cwd)
    await applyPayloadFragments(cwd, manifest.payloadFragments)
    const configPath = path.join(cwd, 'src/blocks/HeroBasic/config.ts')
    await writeFile(
      configPath,
      `${await readFile(configPath, 'utf8')}\n// pristine previous release\n`,
    )
    await recordInstalledState({
      cwd,
      manifest,
      rewrittenFiles: manifest.files,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
    const before = (await loadState(cwd)).components['hero-basic']
    expect(await updateCommand({ cwd, componentNames: ['hero-basic'] })).toBe(true)
    const after = (await loadState(cwd)).components['hero-basic']
    expect(after.manifestVersion).toBe(before.manifestVersion)
    expect(after.fileHashes['src/blocks/HeroBasic/config.ts']).not.toBe(
      before.fileHashes['src/blocks/HeroBasic/config.ts'],
    )
    expect(after.fileHashes['src/blocks/HeroBasic/config.ts']).toBe(
      hashSource(await readFile(configPath, 'utf8')),
    )
    expect(
      await readFile(path.join(cwd, 'src/app/(payload)/admin/importMap.js'), 'utf8'),
    ).toContain('importMap')
  })

  it('upgrades the helper, regenerates artifacts, and records same-version rewrites', async () => {
    const {
      cwd,
      manifests: [manifest],
    } = await legacyInstall()
    // A pristine previous source revision with the same manifest version.
    const configPath = path.join(cwd, 'src/blocks/HeroBasic/config.ts')
    const oldSource = `${await readFile(configPath, 'utf8')}\n// previous release\n`
    await writeFile(configPath, oldSource)
    const before = await loadState(cwd)
    before.components['hero-basic'].fileHashes['src/blocks/HeroBasic/config.ts'] =
      hashSource(oldSource)
    await saveState(cwd, before)

    expect(await updateCommand({ cwd, acceptLocalizationPolicyChange: true })).toBe(true)
    const after = (await loadState(cwd)).components['hero-basic']
    expect(after.localizationPolicy).toBe('semantic-v1')
    expect(after.manifestVersion).toBe(manifest.version)
    expect(await readFile(path.join(cwd, LOCALIZE_HELPER_FILE), 'utf8')).toBe(
      await readFile('payload-components/source/blocks/shared/localizeFields.ts', 'utf8'),
    )
    for (const file of manifest.files)
      expect(after.fileHashes[file]).toBe(hashSource(await readFile(path.join(cwd, file), 'utf8')))
    expect(await readFile(path.join(cwd, 'src/payload-types.ts'), 'utf8')).toContain(
      'HeroBasicBlock',
    )
    expect(
      await readFile(path.join(cwd, 'src/app/(payload)/admin/importMap.js'), 'utf8'),
    ).toContain('importMap')
    const recorded = JSON.stringify(await loadState(cwd))
    await updateCommand({ cwd })
    expect(JSON.stringify(await loadState(cwd))).toBe(recorded)
  })

  it('preserves an edited helper and component source even with --force', async () => {
    const { cwd, helper } = await legacyInstall()
    const edited = `${helper}\n// consumer customization\n`
    await writeFile(path.join(cwd, LOCALIZE_HELPER_FILE), edited)
    const before = await readFile(path.join(cwd, 'src/blocks/HeroBasic/config.ts'), 'utf8')
    await expect(
      updateCommand({ cwd, force: true, acceptLocalizationPolicyChange: true }),
    ).rejects.toThrow('edited or unrecognized')
    expect(await readFile(path.join(cwd, LOCALIZE_HELPER_FILE), 'utf8')).toBe(edited)
    expect(await readFile(path.join(cwd, 'src/blocks/HeroBasic/config.ts'), 'utf8')).toBe(before)
  })

  it('requires all legacy owners, including a different family, to migrate together', async () => {
    const { cwd, helper } = await legacyInstall(['hero-basic', 'faq-card'])
    await expect(
      updateCommand({ cwd, componentNames: ['hero-basic'], acceptLocalizationPolicyChange: true }),
    ).rejects.toThrow('all its legacy owners together')
    expect(await readFile(path.join(cwd, LOCALIZE_HELPER_FILE), 'utf8')).toBe(helper)
    expect(await updateCommand({ cwd, acceptLocalizationPolicyChange: true })).toBe(true)
    expect(
      Object.values((await loadState(cwd)).components).every(
        (entry) => entry.localizationPolicy === 'semantic-v1',
      ),
    ).toBe(true)
  })
})
