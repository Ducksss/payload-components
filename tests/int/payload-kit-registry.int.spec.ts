import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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

  const mockRegistryUtils = async (runCommand: ReturnType<typeof vi.fn>) => {
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
  }

  const writeTargetComponentsConfig = async (targetDir: string) => {
    await mkdir(targetDir, { recursive: true })
    await writeFile(
      path.join(targetDir, 'components.json'),
      `${JSON.stringify(
        {
          aliases: {
            components: '@/components',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    )
  }

  it('installs missing public registry dependencies before wrapper installs', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-registry-test-'))
    const itemFilePath = path.join(tempDir, 'hero-basic.json')
    const targetDir = path.join(tempDir, 'target')
    const runCommand = vi.fn().mockResolvedValue(undefined)

    tempDirs.push(tempDir)
    await writeTargetComponentsConfig(targetDir)
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

    await mockRegistryUtils(runCommand)

    const { installRegistryItem } = await import('../../tools/payload-kit/registry')

    await installRegistryItem({
      itemFilePath,
      packageManager: 'pnpm',
      targetDir,
    })

    expect(runCommand).toHaveBeenNthCalledWith(1, {
      args: ['dlx', 'shadcn@4.7.0', 'add', 'badge', '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
    })
    expect(runCommand).toHaveBeenNthCalledWith(2, {
      args: ['dlx', 'shadcn@4.7.0', 'add', itemFilePath, '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
      stdin: expect.stringMatching(/^(n\n){20}$/),
    })

    expect(JSON.parse(await readFile(itemFilePath, 'utf8'))).not.toHaveProperty('registryDependencies')
  })

  it('skips existing public registry dependencies for wrapper installs', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-registry-test-'))
    const itemFilePath = path.join(tempDir, 'hero-basic.json')
    const targetDir = path.join(tempDir, 'target')
    const existingBadgePath = path.join(targetDir, 'src/components/ui/badge.tsx')
    const runCommand = vi.fn().mockResolvedValue(undefined)

    tempDirs.push(tempDir)
    await writeTargetComponentsConfig(targetDir)
    await mkdir(path.dirname(existingBadgePath), { recursive: true })
    await writeFile(existingBadgePath, 'export const Badge = () => null\n', 'utf8')
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

    await mockRegistryUtils(runCommand)

    const { installRegistryItem } = await import('../../tools/payload-kit/registry')

    await installRegistryItem({
      itemFilePath,
      packageManager: 'pnpm',
      targetDir,
    })

    expect(runCommand).toHaveBeenCalledOnce()
    expect(runCommand).toHaveBeenCalledWith({
      args: ['dlx', 'shadcn@4.7.0', 'add', itemFilePath, '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
      stdin: expect.stringMatching(/^(n\n){20}$/),
    })
    expect(JSON.parse(await readFile(itemFilePath, 'utf8'))).not.toHaveProperty('registryDependencies')
  })
})
