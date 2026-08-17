import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  getProjectLockPath,
  withProjectMutationLock,
} from '../../tools/payload-components/project-lock'

describe('payload-components project mutation lock', () => {
  const tempDirs: string[] = []
  const lockPaths: string[] = []

  afterEach(async () => {
    await Promise.all([
      ...tempDirs.splice(0).map((tempDir) => rm(tempDir, { force: true, recursive: true })),
      ...lockPaths.splice(0).map((lockPath) => rm(lockPath, { force: true })),
    ])
  })

  const createProject = async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'payload-components-lock-'))
    const { lockPath } = await getProjectLockPath(cwd)

    tempDirs.push(cwd)
    lockPaths.push(lockPath)
    return cwd
  }

  it('rejects a concurrent mutating command and releases after the owner finishes', async () => {
    const cwd = await createProject()
    let releaseOwner = () => {}
    let markStarted = () => {}
    const ownerStarted = new Promise<void>((resolve) => {
      markStarted = resolve
    })
    const holdOwner = new Promise<void>((resolve) => {
      releaseOwner = resolve
    })
    const first = withProjectMutationLock({
      cwd,
      operation: 'add hero-basic',
      run: async () => {
        markStarted()
        await holdOwner
        return 'first'
      },
    })

    await ownerStarted
    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'remove hero-basic',
        run: async () => 'second',
      }),
    ).rejects.toThrow('Another payload-components command is already changing')

    releaseOwner()
    await expect(first).resolves.toBe('first')
    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'update',
        run: async () => 'after',
      }),
    ).resolves.toBe('after')
  })

  it('reclaims a lock whose owner process is no longer alive', async () => {
    const cwd = await createProject()
    const { canonicalCwd, lockPath } = await getProjectLockPath(cwd)

    await mkdir(path.dirname(lockPath), { recursive: true })
    await writeFile(
      lockPath,
      `${JSON.stringify({
        createdAt: '2026-01-01T00:00:00.000Z',
        cwd: canonicalCwd,
        operation: 'stale update',
        pid: 2_147_483_647,
        token: 'stale-owner',
      })}\n`,
      'utf8',
    )

    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'add hero-basic',
        run: async () => 'recovered',
      }),
    ).resolves.toBe('recovered')
  })

  it('serializes concurrent contenders reclaiming the same stale lock', async () => {
    const cwd = await createProject()
    const { canonicalCwd, lockPath } = await getProjectLockPath(cwd)
    let active = 0
    let maxActive = 0

    await mkdir(path.dirname(lockPath), { recursive: true })
    await writeFile(
      lockPath,
      `${JSON.stringify({
        createdAt: '2026-01-01T00:00:00.000Z',
        cwd: canonicalCwd,
        operation: 'stale update',
        pid: 2_147_483_647,
        token: 'stale-owner',
      })}\n`,
      'utf8',
    )

    const results = await Promise.allSettled(
      Array.from({ length: 12 }, (_, index) =>
        withProjectMutationLock({
          cwd,
          operation: `contender ${index}`,
          run: async () => {
            active += 1
            maxActive = Math.max(maxActive, active)
            await new Promise((resolve) => setTimeout(resolve, 100))
            active -= 1
            return index
          },
        }),
      ),
    )

    expect(maxActive).toBe(1)
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1)
  })

  it('fails closed instead of deleting a lock with unreadable owner metadata', async () => {
    const cwd = await createProject()
    const { lockPath } = await getProjectLockPath(cwd)

    await mkdir(path.dirname(lockPath), { recursive: true })
    await writeFile(lockPath, '{ half-written', 'utf8')

    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'remove hero-basic',
        run: async () => 'unsafe',
      }),
    ).rejects.toThrow('unreadable owner metadata')
  })

  it('releases the lock when the mutating command throws', async () => {
    const cwd = await createProject()
    let attempts = 0

    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'add hero-basic',
        run: async () => {
          attempts += 1
          throw Object.assign(new Error('destination already exists'), { code: 'EEXIST' })
        },
      }),
    ).rejects.toThrow('destination already exists')
    expect(attempts).toBe(1)

    await expect(
      withProjectMutationLock({
        cwd,
        operation: 'doctor repair',
        run: async () => 'retried',
      }),
    ).resolves.toBe('retried')
  })
})
