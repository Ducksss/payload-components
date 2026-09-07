import { lstat } from 'node:fs/promises'
import path from 'node:path'

import {
  readSafeProjectFile,
  removeSafeProjectFile,
  resolveSafeProjectPath,
  writeSafeProjectFile,
} from './safe-path'

const backupPath = '.payload-components/update-backup.json'
const statePath = '.payload-components/state.json'
type Backup = { version: 1; files: Array<{ path: string; contents: string | null; mode?: number }> }

const readOptional = async (cwd: string, filePath: string, encoding: BufferEncoding = 'utf8') => {
  try {
    return await readSafeProjectFile({ cwd, filePath: path.join(cwd, filePath), encoding })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

export const assertNoPendingUpdate = async (cwd: string) => {
  if ((await readOptional(cwd, backupPath)) !== null) {
    throw new Error(
      'An interrupted update has a backup at .payload-components/update-backup.json. Preserve any edits made since that update, then run "payload-components update --recover" to restore the saved files before retrying.',
    )
  }
}

export const createUpdateBackup = async (cwd: string, paths: string[]) => {
  await assertNoPendingUpdate(cwd)
  const files: Backup['files'] = []
  // Restore ownership last, only after all source and host files are restored.
  for (const filePath of [...new Set(paths.filter((file) => file !== statePath)), statePath]) {
    if (path.resolve(cwd, filePath) === path.resolve(cwd, backupPath)) {
      throw new Error('An update cannot replace its own recovery backup.')
    }
    const contents = await readOptional(cwd, filePath, 'base64')
    const stats = contents === null ? undefined : await lstat(path.join(cwd, filePath))
    if (stats && !stats.isFile()) throw new Error(`Cannot back up non-file ${filePath}.`)
    files.push({ path: filePath, contents, ...(stats ? { mode: stats.mode & 0o777 } : {}) })
  }
  await writeSafeProjectFile({
    cwd,
    filePath: path.join(cwd, backupPath),
    mode: 0o600,
    contents: JSON.stringify({ version: 1, files } satisfies Backup) + '\n',
  })
}

export const discardUpdateBackup = async (cwd: string) => {
  await removeSafeProjectFile({ cwd, filePath: path.join(cwd, backupPath) })
}

export const restoreUpdateBackup = async (cwd: string) => {
  const source = await readOptional(cwd, backupPath)
  if (source === null) throw new Error('No interrupted update backup exists in this project.')
  const backup: unknown = JSON.parse(source)
  if (
    !backup ||
    typeof backup !== 'object' ||
    !('version' in backup) ||
    backup.version !== 1 ||
    !('files' in backup) ||
    !Array.isArray(backup.files)
  )
    throw new Error('Invalid update backup; the file was preserved.')
  const files: Backup['files'] = []
  for (const entry of backup.files) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof entry.path !== 'string' ||
      (entry.contents !== null &&
        (typeof entry.contents !== 'string' ||
          Buffer.from(entry.contents, 'base64').toString('base64') !== entry.contents))
    ) {
      throw new Error('Invalid update backup entry; the file was preserved.')
    }
    if (
      entry.mode !== undefined &&
      (!Number.isInteger(entry.mode) || entry.mode < 0 || entry.mode > 0o777)
    ) {
      throw new Error('Invalid update backup file mode; the file was preserved.')
    }
    const resolved = await resolveSafeProjectPath({ cwd, targetPath: path.join(cwd, entry.path) })
    if (resolved.path === path.resolve(cwd, backupPath))
      throw new Error('Update backup cannot overwrite itself.')
    files.push(entry)
  }
  files.sort((a, b) => Number(a.path === statePath) - Number(b.path === statePath))
  for (const entry of files) {
    const filePath = path.join(cwd, entry.path)
    if (entry.contents === null) await removeSafeProjectFile({ cwd, filePath })
    else
      await writeSafeProjectFile({
        cwd,
        filePath,
        contents: Buffer.from(entry.contents, 'base64'),
        mode: entry.mode,
      })
  }
  await discardUpdateBackup(cwd)
}
