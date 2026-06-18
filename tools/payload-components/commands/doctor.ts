import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { checkDependencyRequirements } from '../dependencies'
import { loadManifest } from '../manifest'
import {
  assertManifestSupport,
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState } from '../state'
import { repoRoot } from '../utils'

import type { ComponentManifest, InstallStateEntry } from '../types'

const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')

type PackageJson = {
  scripts?: Record<string, string>
}

const log = (status: 'ok' | 'warn' | 'error', message: string) => {
  process.stdout.write(`[${status}] ${message}\n`)
}

const formatList = (values: string[]) => values.join(', ')

const formatRecordedFiles = (values: string[]) =>
  values.length > 0 ? formatList(values) : 'none recorded'

const loadKnownManifests = async () => {
  const files = await readdir(manifestsDir)
  const names = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort()

  return await Promise.all(names.map((name) => loadManifest(name)))
}

const readPackageJson = async (cwd: string) =>
  JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8')) as PackageJson

const checkPostInstallScripts = async (cwd: string, manifests: ComponentManifest[]) => {
  const packageJson = await readPackageJson(cwd)
  const scripts = packageJson.scripts ?? {}
  const requiredScripts = [...new Set(manifests.flatMap((manifest) => manifest.postInstall))].sort()
  let isHealthy = true

  for (const script of requiredScripts) {
    if (scripts[script]) {
      log('ok', `scripts: ${script}`)
      continue
    }

    isHealthy = false
    log('error', `scripts: missing ${script}`)
  }

  return isHealthy
}

const checkRecordedComponent = async ({
  componentName,
  cwd,
  manifest,
  targetId,
  entry,
}: {
  componentName: string
  cwd: string
  manifest: ComponentManifest
  targetId: string
  entry: InstallStateEntry
}) => {
  let isHealthy = true

  if (entry.status === 'partial') {
    isHealthy = false
    const errorSuffix = entry.lastError
      ? ` (${entry.lastError.stage}: ${entry.lastError.message})`
      : ''

    log('error', `${componentName}: install is partial${errorSuffix}`)
    log(
      'warn',
      `${componentName}: owned component files ${formatRecordedFiles(entry.installedFiles)}`,
    )
    log('warn', `${componentName}: patched host files ${formatRecordedFiles(entry.patchedFiles)}`)
  }

  if (entry.manifestVersion !== manifest.version) {
    isHealthy = false
    log(
      'error',
      `${componentName}: state has manifest ${entry.manifestVersion}, current manifest is ${manifest.version}`,
    )
  }

  if (entry.registryItemName !== manifest.registryItemName) {
    isHealthy = false
    log(
      'error',
      `${componentName}: state has registry item ${entry.registryItemName}, manifest expects ${manifest.registryItemName}`,
    )
  }

  if (entry.targetId !== targetId) {
    isHealthy = false
    log('error', `${componentName}: state target ${entry.targetId}, detected target is ${targetId}`)
  }

  try {
    await checkDependencyRequirements({
      allowMissing: false,
      cwd,
      dependencies: manifest.peerDependencies,
      label: 'peerDependencies',
    })
    log('ok', `${componentName}: peer dependencies`)
  } catch (error) {
    isHealthy = false
    log(
      'error',
      `${componentName}: ${error instanceof Error ? error.message : 'peer dependency check failed'}`,
    )
  }

  try {
    const dependencyCheck = await checkDependencyRequirements({
      allowMissing: true,
      cwd,
      dependencies: manifest.dependencies,
      label: 'dependencies',
    })

    if (dependencyCheck.missing.length > 0) {
      isHealthy = false
      log('error', `${componentName}: missing dependencies ${formatList(dependencyCheck.missing)}`)
    } else {
      log('ok', `${componentName}: dependencies`)
    }
  } catch (error) {
    isHealthy = false
    log(
      'error',
      `${componentName}: ${error instanceof Error ? error.message : 'dependency check failed'}`,
    )
  }

  const fileCheck = await verifyInstalledManifestFiles({ cwd, manifest })

  if (fileCheck.isValid) {
    log('ok', `${componentName}: files`)
  } else {
    isHealthy = false
    log('error', `${componentName}: missing files ${formatList(fileCheck.missingFiles)}`)
  }

  const fragmentCheck = await verifyInstalledPayloadFragments({ cwd, manifest })

  if (fragmentCheck.isValid) {
    log('ok', `${componentName}: Payload fragments`)
  } else {
    isHealthy = false
    log(
      'error',
      `${componentName}: missing Payload fragments ${formatList(fragmentCheck.missingFragments)}`,
    )
  }

  if (!isHealthy) {
    log('warn', `Run "payload-components add ${componentName}" to retry the install.`)
  }

  return isHealthy
}

export const doctorCommand = async ({ cwd }: { cwd: string }) => {
  let isHealthy = true

  try {
    const [project, manifests] = await Promise.all([detectProject(cwd), loadKnownManifests()])

    log(
      'ok',
      `project: ${project.target.id} (Payload ${project.payloadMajor}, Next ${project.nextMajor}, ${project.packageManager})`,
    )

    for (const manifest of manifests) {
      try {
        assertManifestSupport(project, manifest)
      } catch (error) {
        isHealthy = false
        log(
          'error',
          `${manifest.name}: ${error instanceof Error ? error.message : 'unsupported manifest'}`,
        )
      }
    }

    if (!(await checkPostInstallScripts(cwd, manifests))) {
      isHealthy = false
    }

    const state = await loadState(cwd).catch((error) => {
      isHealthy = false
      log('error', `state: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return undefined
    })

    if (!state) {
      return false
    }

    const entries = Object.entries(state.components)

    if (entries.length === 0) {
      log('ok', 'state: no recorded components')
      return isHealthy
    }

    log('ok', `state: ${entries.length} recorded component${entries.length === 1 ? '' : 's'}`)

    for (const [componentName, entry] of entries) {
      const manifest = manifests.find((candidate) => candidate.name === componentName)

      if (!manifest) {
        isHealthy = false
        log('error', `${componentName}: no matching manifest`)
        continue
      }

      if (
        !(await checkRecordedComponent({
          componentName,
          cwd,
          entry,
          manifest,
          targetId: project.target.id,
        }))
      ) {
        isHealthy = false
      }
    }

    return isHealthy
  } catch (error) {
    log('error', `project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}
