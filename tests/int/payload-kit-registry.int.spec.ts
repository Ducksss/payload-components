import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

describe('payload-kit registry install', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('strips public registry dependencies and skips existing shadcn files for wrapper installs', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-registry-test-'))
    const itemFilePath = path.join(tempDir, 'hero-basic.json')
    const runCommand = vi.fn().mockResolvedValue(undefined)

    tempDirs.push(tempDir)
    await writeFile(
      itemFilePath,
      `${JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          files: [],
          name: 'hero-basic',
          registryDependencies: ['badge'],
          type: 'registry:block',
        },
        null,
        2,
      )}\n`,
      'utf8',
    )

    vi.doMock('../../tools/payload-kit/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-kit/utils')>(
        '../../tools/payload-kit/utils',
      )

      return {
        ...actual,
        getShadcnCommand: vi.fn(() => ({
          args: ['dlx', 'shadcn@4.7.0'],
          command: 'pnpm',
        })),
        repoRoot: '/repo',
        runCommand,
      }
    })

    const { installRegistryItem } = await import('../../tools/payload-kit/registry')

    await installRegistryItem({
      itemFilePath,
      packageManager: 'pnpm',
      targetDir: '/target',
    })

    expect(runCommand).toHaveBeenCalledWith({
      args: ['dlx', 'shadcn@4.7.0', 'add', itemFilePath, '--cwd', '/target', '--yes'],
      command: 'pnpm',
      cwd: '/repo',
      stdin: expect.stringMatching(/^(n\n){20}$/),
    })

    expect(JSON.parse(await readFile(itemFilePath, 'utf8'))).not.toHaveProperty('registryDependencies')
  })
})
