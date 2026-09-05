import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

// The real pin, resolved from the `shadcn` devDependency. `vi.doMock` is not
// hoisted, so this static import always binds the unmocked module.
import { shadcnCliPackage } from '../../tools/payload-components/utils'

describe('payload-components registry install', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
    vi.resetModules()
    vi.restoreAllMocks()
  })

  const mockRegistryUtils = async (runCommand: ReturnType<typeof vi.fn>) => {
    vi.doMock('../../tools/payload-components/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-components/utils')>(
        '../../tools/payload-components/utils',
      )

      return {
        ...actual,
        getShadcnCommand: vi.fn(() => ({
          args: ['dlx', shadcnCliPackage],
          command: 'pnpm',
        })),
        repoRoot: '/repo',
        runCommand,
      }
    })
  }

  const writeTargetComponentsConfig = async (targetDir: string) => {
    await mkdir(targetDir, { recursive: true })
    await Promise.all([
      writeFile(path.join(targetDir, 'package.json'), '{}\n', 'utf8'),
      writeFile(path.join(targetDir, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n', 'utf8'),
      writeFile(
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
      ),
    ])
  }

  it('installs missing public registry dependencies before wrapper installs', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-test-'))
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

    const { installRegistryItem } = await import('../../tools/payload-components/registry')

    await installRegistryItem({
      itemFilePath,
      packageManager: 'pnpm',
      targetDir,
    })

    expect(runCommand).toHaveBeenNthCalledWith(1, {
      args: ['dlx', shadcnCliPackage, 'add', 'badge', '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
    })
    expect(runCommand).toHaveBeenNthCalledWith(2, {
      args: ['dlx', shadcnCliPackage, 'add', itemFilePath, '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
      stdin: expect.stringMatching(/^(n\n){20}$/),
    })

    expect(JSON.parse(await readFile(itemFilePath, 'utf8'))).not.toHaveProperty(
      'registryDependencies',
    )
  })

  it('skips existing public registry dependencies for wrapper installs', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-test-'))
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

    const { installRegistryItem } = await import('../../tools/payload-components/registry')

    await installRegistryItem({
      itemFilePath,
      packageManager: 'pnpm',
      targetDir,
    })

    expect(runCommand).toHaveBeenCalledOnce()
    expect(runCommand).toHaveBeenCalledWith({
      args: ['dlx', shadcnCliPackage, 'add', itemFilePath, '--cwd', targetDir, '--yes'],
      command: 'pnpm',
      cwd: '/repo',
      stdin: expect.stringMatching(/^(n\n){20}$/),
    })
    expect(JSON.parse(await readFile(itemFilePath, 'utf8'))).not.toHaveProperty(
      'registryDependencies',
    )
  })

  it('validates the effective alias destination when a file omits target', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-test-'))
    const itemFilePath = path.join(tempDir, 'component.json')
    const targetDir = path.join(tempDir, 'target')
    const runCommand = vi.fn().mockResolvedValue(undefined)

    tempDirs.push(tempDir)
    await writeTargetComponentsConfig(targetDir)
    await writeFile(
      itemFilePath,
      `${JSON.stringify({
        files: [
          {
            content: 'export const Safe = true\n',
            path: 'registry/components/safe.tsx',
            type: 'registry:component',
          },
        ],
        name: 'safe-component',
        type: 'registry:component',
      })}\n`,
      'utf8',
    )

    await mockRegistryUtils(runCommand)
    const { installRegistryItem } = await import('../../tools/payload-components/registry')

    await installRegistryItem({ itemFilePath, packageManager: 'pnpm', targetDir })

    expect(runCommand).toHaveBeenCalledWith(
      expect.objectContaining({ args: expect.arrayContaining(['add', itemFilePath]) }),
    )
  })

  it.each([
    {
      file: {
        content: 'export const Escape = true\n',
        path: 'escape.tsx',
        target: '@components/escape.tsx',
        type: 'registry:component',
      },
      label: 'an @components target',
    },
    {
      file: {
        content: 'export const Escape = true\n',
        path: 'escape.tsx',
        type: 'registry:component',
      },
      label: 'an omitted target',
    },
  ])('refuses an escaping components alias for $label', async ({ file }) => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-test-'))
    const itemFilePath = path.join(tempDir, 'escape.json')
    const targetDir = path.join(tempDir, 'target')
    const runCommand = vi.fn().mockResolvedValue(undefined)

    tempDirs.push(tempDir)
    await writeTargetComponentsConfig(targetDir)
    await writeFile(
      path.join(targetDir, 'components.json'),
      `${JSON.stringify({ aliases: { components: '../../outside' } })}\n`,
      'utf8',
    )
    await writeFile(
      itemFilePath,
      `${JSON.stringify({ files: [file], name: 'escape', type: 'registry:component' })}\n`,
      'utf8',
    )

    await mockRegistryUtils(runCommand)
    const { installRegistryItem } = await import('../../tools/payload-components/registry')

    await expect(
      installRegistryItem({ itemFilePath, packageManager: 'pnpm', targetDir }),
    ).rejects.toThrow('resolves outside the target project')
    expect(runCommand).not.toHaveBeenCalled()
  })
})
