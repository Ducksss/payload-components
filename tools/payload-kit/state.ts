import { access } from 'node:fs/promises'
import path from 'node:path'

import type { InstallState, KitManifest } from './types'

import { readJsonFile, writeJsonFile } from './utils'

const defaultState: InstallState = {
  kits: {},
  version: 1,
}

export const getStatePath = (cwd: string) => path.join(cwd, '.payload-kit', 'state.json')

export const loadState = async (cwd: string): Promise<InstallState> => {
  const statePath = getStatePath(cwd)

  try {
    await access(statePath)
    return await readJsonFile<InstallState>(statePath)
  } catch {
    return defaultState
  }
}

export const saveState = async (cwd: string, state: InstallState) => {
  await writeJsonFile(getStatePath(cwd), state)
}

export const recordInstallState = async ({
  cwd,
  manifest,
  status,
  touchedFiles,
}: {
  cwd: string
  manifest: KitManifest
  status: 'installed' | 'partial'
  touchedFiles: string[]
}) => {
  const state = await loadState(cwd)
  const touchedFilesSet = new Set(touchedFiles)

  state.kits[manifest.name] = {
    installedAt: new Date().toISOString(),
    manifestVersion: manifest.version,
    status,
    touchedFiles: [...touchedFilesSet].sort(),
  }

  await saveState(cwd, state)
}
