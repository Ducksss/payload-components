import { rm } from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadTemplateManifest } from '../../tools/payload-components/templates'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* add-template installs the union of a template's blocks. The delegation to
 * `add` is stubbed — what matters here is that it refuses early on an
 * unsupported repo, installs each block exactly once in page order, and prints
 * the page plan the user has to assemble by hand. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.resetModules()
  vi.restoreAllMocks()
})

const setup = async () => {
  const addCommand = vi.fn().mockResolvedValue(undefined)
  const warnWhenNoLocalesDeclared = vi.fn().mockResolvedValue(undefined)
  const output: string[] = []

  vi.doMock('../../tools/payload-components/commands/add', () => ({
    addCommand,
    warnWhenNoLocalesDeclared,
  }))
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { addTemplateCommand } =
    await import('../../tools/payload-components/commands/add-template')

  return { addCommand, addTemplateCommand, output, warnWhenNoLocalesDeclared }
}

const makeFixture = async () => {
  const { fixtureDir } = await createInstallFixtureForComponents(['hero-basic'])

  fixtureDirs.push(fixtureDir)

  return fixtureDir
}

describe('add-template', () => {
  it('installs every block of the template exactly once', async () => {
    const { addCommand, addTemplateCommand, output } = await setup()
    const fixtureDir = await makeFixture()
    const template = await loadTemplateManifest('portfolio-solo')

    await addTemplateCommand({ cwd: fixtureDir, templateSlug: 'portfolio-solo' })

    expect(addCommand).toHaveBeenCalledTimes(template.components.length)
    expect(
      addCommand.mock.calls.map(
        ([options]) => (options as { componentName: string }).componentName,
      ),
    ).toEqual(template.components)
    expect(output.join('')).toContain(`installed ${template.components.length} blocks`)
  })

  it('prints the page plan so the pages can be assembled in the admin', async () => {
    const { addTemplateCommand, output } = await setup()
    const fixtureDir = await makeFixture()
    const template = await loadTemplateManifest('portfolio-solo')

    await addTemplateCommand({ cwd: fixtureDir, templateSlug: 'portfolio-solo' })

    const text = output.join('')

    expect(text).toContain('Pages to assemble in /admin:')

    for (const page of template.pages) {
      expect(text).toContain(`/${page.path} — ${page.label}`)
      expect(text).toContain(page.components.join(' → '))
    }
  })

  it('localizes every block of the template, reporting the locale situation once', async () => {
    const { addCommand, addTemplateCommand, output, warnWhenNoLocalesDeclared } = await setup()
    const fixtureDir = await makeFixture()
    const template = await loadTemplateManifest('portfolio-solo')

    await addTemplateCommand({ cwd: fixtureDir, localized: true, templateSlug: 'portfolio-solo' })

    expect(addCommand).toHaveBeenCalledTimes(template.components.length)

    for (const [options] of addCommand.mock.calls) {
      expect(options).toMatchObject({ deferLocaleNotice: true, localized: true })
    }

    /* Deferred per block and emitted once for the template — a 20-block template
       would otherwise repeat the same locale notice 20 times. */
    expect(warnWhenNoLocalesDeclared).toHaveBeenCalledTimes(1)
    expect(output.join('')).toContain('Localization:')
  })

  it('leaves blocks unlocalized without the flag', async () => {
    const { addCommand, addTemplateCommand, output, warnWhenNoLocalesDeclared } = await setup()
    const fixtureDir = await makeFixture()

    await addTemplateCommand({ cwd: fixtureDir, templateSlug: 'portfolio-solo' })

    for (const [options] of addCommand.mock.calls) {
      expect(options).toMatchObject({ localized: false })
    }

    expect(warnWhenNoLocalesDeclared).not.toHaveBeenCalled()
    expect(output.join('')).not.toContain('Localization:')
  })

  it('changes nothing under --dry-run', async () => {
    const { addCommand, addTemplateCommand, output } = await setup()
    const fixtureDir = await makeFixture()

    await addTemplateCommand({ cwd: fixtureDir, dryRun: true, templateSlug: 'portfolio-solo' })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('dry run for template "portfolio-solo"')
    expect(output.join('')).toContain('No files were changed and no commands ran.')
  })

  it('rejects an unknown template before touching the project', async () => {
    const { addCommand, addTemplateCommand } = await setup()
    const fixtureDir = await makeFixture()

    await expect(
      addTemplateCommand({ cwd: fixtureDir, templateSlug: 'no-such-template' }),
    ).rejects.toThrow('Unknown template')
    expect(addCommand).not.toHaveBeenCalled()
  })

  it('refuses an unsupported project shape before installing any block', async () => {
    const { addCommand, addTemplateCommand } = await setup()

    await expect(
      addTemplateCommand({ cwd: process.cwd(), templateSlug: 'portfolio-solo' }),
    ).rejects.toThrow()
    expect(addCommand).not.toHaveBeenCalled()
  })
})
