import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { copySharedSourceFile } from '../../tools/payload-components/component-files'
import {
  assertSafePackageManagerTargets,
  checkDependencyRequirements,
} from '../../tools/payload-components/dependencies'
import {
  readSafeProjectFile,
  removeSafeProjectFile,
  writeSafeProjectFile,
  writeSafeProjectJsonFile,
} from '../../tools/payload-components/safe-path'
import { loadState } from '../../tools/payload-components/state'
import { detectPackageManagerDetails } from '../../tools/payload-components/utils'

const fixtures: string[] = []

const makeFixture = async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'payload-components-safe-path-'))
  const project = path.join(fixture, 'project')
  const outside = path.join(fixture, 'outside')

  await Promise.all([mkdir(project), mkdir(outside)])
  fixtures.push(fixture)

  return { outside, project }
}

describe('canonical project filesystem boundary', () => {
  afterEach(async () => {
    await Promise.all(
      fixtures.splice(0).map((fixture) => rm(fixture, { force: true, recursive: true })),
    )
  })

  it('writes regular project files and JSON atomically', async () => {
    const { project } = await makeFixture()
    const textPath = path.join(project, 'src', 'safe.txt')
    const jsonPath = path.join(project, '.payload-components', 'state.json')

    await writeSafeProjectFile({ contents: 'safe\n', cwd: project, filePath: textPath })
    await writeSafeProjectJsonFile({ cwd: project, filePath: jsonPath, value: { version: 3 } })

    await expect(readSafeProjectFile({ cwd: project, filePath: textPath })).resolves.toBe('safe\n')
    await expect(readFile(jsonPath, 'utf8')).resolves.toBe('{\n  "version": 3\n}\n')
  })

  it('refuses reads, writes, and removals through a parent-directory symlink', async () => {
    const { outside, project } = await makeFixture()
    const outsideFile = path.join(outside, 'owned.txt')
    const escapedPath = path.join(project, 'src', 'owned.txt')

    await writeFile(outsideFile, 'outside stays intact\n', 'utf8')
    await symlink(outside, path.join(project, 'src'), 'dir')

    await expect(readSafeProjectFile({ cwd: project, filePath: escapedPath })).rejects.toThrow(
      /symbolic link/,
    )
    await expect(
      writeSafeProjectFile({ contents: 'changed\n', cwd: project, filePath: escapedPath }),
    ).rejects.toThrow(/symbolic link/)
    await expect(removeSafeProjectFile({ cwd: project, filePath: escapedPath })).rejects.toThrow(
      /symbolic link/,
    )
    await expect(readFile(outsideFile, 'utf8')).resolves.toBe('outside stays intact\n')
  })

  it('refuses a symlink leaf without changing its target', async () => {
    const { outside, project } = await makeFixture()
    const outsideFile = path.join(outside, 'owned.txt')
    const projectFile = path.join(project, 'owned.txt')

    await writeFile(outsideFile, 'outside stays intact\n', 'utf8')
    await symlink(outsideFile, projectFile)

    await expect(
      writeSafeProjectFile({ contents: 'changed\n', cwd: project, filePath: projectFile }),
    ).rejects.toThrow(/symbolic link/)
    await expect(removeSafeProjectFile({ cwd: project, filePath: projectFile })).rejects.toThrow(
      /symbolic link/,
    )
    await expect(readFile(outsideFile, 'utf8')).resolves.toBe('outside stays intact\n')
  })

  it('blocks the shared-source copy exploit used against add and init', async () => {
    const { outside, project } = await makeFixture()

    await symlink(outside, path.join(project, 'src'), 'dir')

    await expect(
      copySharedSourceFile({
        cwd: project,
        projectPath: 'src/utilities/ui.ts',
        sourceSubdirectory: 'base',
      }),
    ).rejects.toThrow(/symbolic link/)
    await expect(readFile(path.join(outside, 'utilities', 'ui.ts'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })

  it('fails closed when install state is a symlink', async () => {
    const { outside, project } = await makeFixture()
    const stateDir = path.join(project, '.payload-components')
    const outsideState = path.join(outside, 'state.json')

    await mkdir(stateDir)
    await writeFile(outsideState, '{"version":3,"components":{}}\n', 'utf8')
    await symlink(outsideState, path.join(stateDir, 'state.json'))

    await expect(loadState(project)).rejects.toThrow(/symbolic link/)
  })

  it('rejects symlinked package metadata and package-manager write targets', async () => {
    const packageFixture = await makeFixture()
    const outsidePackageJson = path.join(packageFixture.outside, 'package.json')

    await writeFile(outsidePackageJson, '{"dependencies":{"payload":"3.0.0"}}\n', 'utf8')
    await symlink(outsidePackageJson, path.join(packageFixture.project, 'package.json'))

    await expect(
      checkDependencyRequirements({
        allowMissing: false,
        cwd: packageFixture.project,
        dependencies: { payload: '^3.0.0' },
        label: 'dependencies',
      }),
    ).rejects.toThrow(/symbolic link/)

    const lockFixture = await makeFixture()

    await writeFile(path.join(lockFixture.project, 'package.json'), '{}\n', 'utf8')
    await writeFile(
      path.join(lockFixture.outside, 'pnpm-lock.yaml'),
      'lockfileVersion: 9\n',
      'utf8',
    )
    await symlink(
      path.join(lockFixture.outside, 'pnpm-lock.yaml'),
      path.join(lockFixture.project, 'pnpm-lock.yaml'),
    )

    await expect(detectPackageManagerDetails(lockFixture.project)).rejects.toThrow(/symbolic link/)

    const modulesFixture = await makeFixture()

    await writeFile(path.join(modulesFixture.project, 'package.json'), '{}\n', 'utf8')
    await symlink(modulesFixture.outside, path.join(modulesFixture.project, 'node_modules'), 'dir')

    await expect(
      assertSafePackageManagerTargets({ cwd: modulesFixture.project, packageManager: 'npm' }),
    ).rejects.toThrow(/symbolic link/)
  })
})
