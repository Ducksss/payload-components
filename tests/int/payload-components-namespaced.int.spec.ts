import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  isNamespacedItem,
  parseNamespacedItem,
  resolveNamespacedRegistry,
} from '../../tools/payload-components/namespaced'
import { loadState } from '../../tools/payload-components/state'

import { createInstallFixture } from './payload-components-fixture'

/* `@scope/item` installs from someone else's registry. The contract is narrow on
 * purpose: files only, no Payload wiring, and nothing recorded in install state —
 * because there is no manifest behind it to record a contract against. */

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.resetModules()
  vi.restoreAllMocks()
})

const makeProject = async (registries?: unknown) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-namespace-'))
  tempDirs.push(dir)

  await writeFile(
    path.join(dir, 'components.json'),
    `${JSON.stringify(registries ? { registries } : {}, null, 2)}\n`,
    'utf8',
  )

  return dir
}

describe('namespaced item parsing', () => {
  it('recognises a namespaced item and splits it', () => {
    expect(isNamespacedItem('@acme/hero')).toBe(true)
    expect(isNamespacedItem('hero-basic')).toBe(false)
    expect(parseNamespacedItem('@acme/hero')).toEqual({ item: 'hero', scope: '@acme' })
  })

  it('rejects malformed namespaces', () => {
    expect(() => parseNamespacedItem('@acme')).toThrow('not a valid namespaced registry item')
    expect(() => parseNamespacedItem('@/hero')).toThrow('not a valid namespaced registry item')
    expect(() => parseNamespacedItem('@acme/../escape')).toThrow(
      'not a valid namespaced registry item',
    )
  })
})

describe('resolving a namespaced registry', () => {
  it('reads a scope configured as a plain URL', async () => {
    const cwd = await makeProject({ '@acme': 'https://acme.test/r/{name}.json' })

    await expect(resolveNamespacedRegistry({ cwd, scope: '@acme' })).resolves.toBe(
      'https://acme.test/r/{name}.json',
    )
  })

  it('reads a scope configured as an object with a url', async () => {
    const cwd = await makeProject({ '@acme': { url: 'https://acme.test/r/{name}.json' } })

    await expect(resolveNamespacedRegistry({ cwd, scope: '@acme' })).resolves.toBe(
      'https://acme.test/r/{name}.json',
    )
  })

  it('names the file to edit when the scope is not configured', async () => {
    const cwd = await makeProject()

    await expect(resolveNamespacedRegistry({ cwd, scope: '@acme' })).rejects.toThrow(
      /Unknown registry "@acme"[\s\S]*components\.json/,
    )
  })

  it('refuses a registry that is not served over https', async () => {
    for (const url of ['http://acme.test/r/{name}.json', 'file:///tmp/r/{name}.json']) {
      const cwd = await makeProject({ '@acme': url })

      await expect(resolveNamespacedRegistry({ cwd, scope: '@acme' })).rejects.toThrow(
        'not an https URL',
      )
    }
  })
})

describe('add for a namespaced item', () => {
  const setup = async () => {
    const runCommand = vi.fn().mockResolvedValue({ stderr: '', stdout: '' })
    const output: string[] = []

    vi.doMock('../../tools/payload-components/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-components/utils')>(
        '../../tools/payload-components/utils',
      )

      return { ...actual, runCommand }
    })
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk))
      return true
    })

    const { addCommand } = await import('../../tools/payload-components/commands/add')

    return { addCommand, output, runCommand }
  }

  const makeConfiguredFixture = async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    await writeFile(
      path.join(fixtureDir, 'components.json'),
      `${JSON.stringify({ registries: { '@acme': 'https://acme.test/r/{name}.json' } }, null, 2)}\n`,
      'utf8',
    )

    return fixtureDir
  }

  it('delegates to shadcn and records no install state', async () => {
    const { addCommand, output, runCommand } = await setup()
    const fixtureDir = await makeConfiguredFixture()

    await addCommand({ componentName: '@acme/hero', cwd: fixtureDir })

    expect(runCommand).toHaveBeenCalledOnce()

    const [call] = runCommand.mock.calls as Array<[{ args: string[]; command: string }]>

    expect(call[0].args).toContain('add')
    expect(call[0].args).toContain('@acme/hero')
    expect(call[0].args).toContain('--yes')

    /* The whole point of the boundary: nothing is claimed as managed. */
    expect((await loadState(fixtureDir)).components).toEqual({})
    expect(output.join('')).toContain('third-party registry item: files only')
    expect(output.join('')).toContain('No Payload wiring is applied')
  })

  it('refuses flags that need a manifest', async () => {
    const { addCommand, runCommand } = await setup()
    const fixtureDir = await makeConfiguredFixture()

    for (const flags of [{ demo: true }, { localized: true }]) {
      await expect(
        addCommand({ componentName: '@acme/hero', cwd: fixtureDir, ...flags }),
      ).rejects.toThrow('need a payload-components manifest')
    }

    expect(runCommand).not.toHaveBeenCalled()
  })

  it('changes nothing under --dry-run', async () => {
    const { addCommand, output, runCommand } = await setup()
    const fixtureDir = await makeConfiguredFixture()

    await addCommand({ componentName: '@acme/hero', cwd: fixtureDir, dryRun: true })

    expect(runCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('No Payload wiring, no install state.')
  })

  it('refuses an unconfigured scope before running anything', async () => {
    const { addCommand, runCommand } = await setup()
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    await expect(addCommand({ componentName: '@acme/hero', cwd: fixtureDir })).rejects.toThrow(
      'Unknown registry "@acme"',
    )
    expect(runCommand).not.toHaveBeenCalled()
  })
})
