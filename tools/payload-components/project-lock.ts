import { createHash, randomUUID } from 'node:crypto'
import { mkdir, open, readFile, realpath, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

type LockOwner = {
  createdAt: string
  cwd: string
  operation: string
  pid: number
  token: string
}

const lockRoot = path.join(os.tmpdir(), 'payload-components-project-locks')

const processIsAlive = (pid: number) => {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM'
  }
}

const isLockOwner = (value: unknown): value is LockOwner => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<LockOwner>

  return (
    typeof candidate.createdAt === 'string' &&
    typeof candidate.cwd === 'string' &&
    typeof candidate.operation === 'string' &&
    Number.isSafeInteger(candidate.pid) &&
    Number(candidate.pid) > 0 &&
    typeof candidate.token === 'string'
  )
}

const readOwner = async (lockPath: string) =>
  readFile(lockPath, 'utf8')
    .then((source) => JSON.parse(source) as unknown)
    .then((owner) => (isLockOwner(owner) ? owner : undefined))
    .catch(() => undefined)

export const getProjectLockPath = async (cwd: string) => {
  const canonicalCwd = await realpath(cwd).catch(() => path.resolve(cwd))
  const key = createHash('sha256').update(canonicalCwd).digest('hex')

  return {
    canonicalCwd,
    lockPath: path.join(lockRoot, `${key}.lock`),
  }
}

/* One mutating CLI invocation owns a consumer project at a time. State writes
 * alone are not the whole critical section: package manifests, lockfiles, and
 * both Payload host files are read-modify-write operations too. A crashed owner
 * leaves a stale file, which the next invocation removes only after confirming
 * that its process no longer exists. */
export const withProjectMutationLock = async <T>({
  cwd,
  operation,
  run,
}: {
  cwd: string
  operation: string
  run: () => Promise<T>
}) => {
  await mkdir(lockRoot, { recursive: true })
  const { canonicalCwd, lockPath } = await getProjectLockPath(cwd)
  const owner: LockOwner = {
    createdAt: new Date().toISOString(),
    cwd: canonicalCwd,
    operation,
    pid: process.pid,
    token: randomUUID(),
  }
  let acquired = false

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let handle: Awaited<ReturnType<typeof open>> | undefined

    try {
      handle = await open(lockPath, 'wx', 0o600)

      try {
        await handle.writeFile(`${JSON.stringify(owner)}\n`, 'utf8')
      } finally {
        await handle.close()
      }
      acquired = true
      break
    } catch (error) {
      if (handle) {
        await rm(lockPath, { force: true })
      }

      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error
      }

      const existing = await readOwner(lockPath)

      /* Another process can observe the exclusive file in the tiny window
         between open() and writeFile(). Never delete unreadable metadata: it
         may belong to that live acquirer. A short retry lets a new owner finish
         its write or a fast owner release the lock; a persistently corrupt lock
         fails closed and is left for deliberate inspection. */
      if (!existing) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        continue
      }

      if (processIsAlive(existing.pid)) {
        throw new Error(
          `Another payload-components command is already changing ${canonicalCwd} (` +
            `${existing.operation}, pid ${existing.pid}, started ${existing.createdAt}). ` +
            'Wait for it to finish before running another mutating command.',
        )
      }

      await rm(lockPath, { force: true })
    }
  }

  if (!acquired) {
    throw new Error(
      `Unable to acquire the payload-components project lock for ${canonicalCwd}. ` +
        `The lock at ${lockPath} has unreadable owner metadata; confirm no command is running before removing it.`,
    )
  }

  try {
    return await run()
  } finally {
    const currentOwner = await readOwner(lockPath)

    if (currentOwner?.token === owner.token) {
      await rm(lockPath, { force: true })
    }
  }
}
