import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:crypto', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:crypto')>()),
  randomUUID: () => '00000000-0000-4000-8000-000000000000',
}))

import { commitFileChanges } from '../../tools/payload-components/utils'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

const makeTempDir = async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-transaction-'))
  tempDirs.push(dir)
  return dir
}

describe('commitFileChanges', () => {
  it('commits replacements, creations, and deletions as one batch', async () => {
    const dir = await makeTempDir()
    const replaced = path.join(dir, 'replaced.ts')
    const created = path.join(dir, 'nested', 'created.ts')
    const deleted = path.join(dir, 'deleted.ts')

    await Promise.all([
      writeFile(replaced, 'before replacement\n', 'utf8'),
      writeFile(deleted, 'before deletion\n', 'utf8'),
    ])

    await commitFileChanges([
      { content: 'after replacement\n', filePath: replaced },
      { content: 'created\n', filePath: created },
      { content: null, filePath: deleted },
    ])

    await expect(readFile(replaced, 'utf8')).resolves.toBe('after replacement\n')
    await expect(readFile(created, 'utf8')).resolves.toBe('created\n')
    await expect(readFile(deleted, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('keeps a successful commit successful when private artifact cleanup fails', async () => {
    const dir = await makeTempDir()
    const replaced = path.join(dir, 'replaced.ts')
    const created = path.join(dir, 'created.ts')

    await writeFile(replaced, 'before replacement\n', 'utf8')

    await expect(
      commitFileChanges(
        [
          { content: 'after replacement\n', filePath: replaced },
          { content: 'created\n', filePath: created },
        ],
        {
          cleanupArtifact: async () => {
            throw new Error('simulated cleanup failure')
          },
        },
      ),
    ).resolves.toBeUndefined()

    await expect(readFile(replaced, 'utf8')).resolves.toBe('after replacement\n')
    await expect(readFile(created, 'utf8')).resolves.toBe('created\n')
  })

  it('rejects non-regular destinations before changing any file', async () => {
    const dir = await makeTempDir()
    const untouched = path.join(dir, 'untouched.ts')
    const directory = path.join(dir, 'not-a-file')

    await writeFile(untouched, 'original\n', 'utf8')
    await mkdir(directory)

    await expect(
      commitFileChanges([
        { content: 'changed\n', filePath: untouched },
        { content: 'replacement\n', filePath: directory },
      ]),
    ).rejects.toThrow('non-regular file')

    await expect(readFile(untouched, 'utf8')).resolves.toBe('original\n')
  })

  it('rejects a symlinked project destination before changing the batch', async () => {
    const dir = await makeTempDir()
    const project = path.join(dir, 'project')
    const outside = path.join(dir, 'outside')
    const untouched = path.join(project, 'untouched.ts')
    const escaped = path.join(project, 'linked', 'escaped.ts')

    await Promise.all([mkdir(project), mkdir(outside)])
    await writeFile(untouched, 'original\n', 'utf8')
    await symlink(outside, path.join(project, 'linked'), 'dir')

    await expect(
      commitFileChanges(
        [
          { content: 'changed\n', filePath: untouched },
          { content: 'escaped\n', filePath: escaped },
        ],
        { cwd: project },
      ),
    ).rejects.toThrow(/symbolic link/)

    await expect(readFile(untouched, 'utf8')).resolves.toBe('original\n')
    await expect(readFile(path.join(outside, 'escaped.ts'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })

  it('rolls back committed destinations without deleting a colliding foreign backup', async () => {
    const dir = await makeTempDir()
    const first = path.join(dir, 'first.ts')
    const second = path.join(dir, 'second.ts')
    const foreignBackup = `${second}.${process.pid}.00000000-0000-4000-8000-000000000000.bak`

    await Promise.all([
      writeFile(first, 'first:original\n', 'utf8'),
      writeFile(second, 'second:original\n', 'utf8'),
      writeFile(foreignBackup, 'not owned by the transaction\n', 'utf8'),
    ])

    await expect(
      commitFileChanges(
        [
          { content: 'first:changed\n', filePath: first },
          { content: 'second:changed\n', filePath: second },
        ],
        { cwd: dir },
      ),
    ).rejects.toMatchObject({ code: 'EEXIST' })

    await expect(readFile(first, 'utf8')).resolves.toBe('first:original\n')
    await expect(readFile(second, 'utf8')).resolves.toBe('second:original\n')
    await expect(readFile(foreignBackup, 'utf8')).resolves.toBe('not owned by the transaction\n')
  })
})
