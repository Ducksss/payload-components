import path from 'node:path'

import { checkDependencyRequirements } from '../dependencies'
import { resolveInstallPlan } from '../install-plan'
import { loadManifest } from '../manifest'
import {
  assertManifestSupport,
  detectProject,
  findExistingRequiredFile,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { writeSeedScript, type SeedTarget } from '../seed/seed-script'
import { loadState } from '../state'
import { printHeader } from '../utils'

import type { ComponentManifest, DetectedProject, PackageManager } from '../types'

const configFilePattern = /(?:^|\/)payload\.config\.(?:[cm]?[jt]s)$/

/* A target may allow the config at more than one path (src/ vs repo root), so
 * pick the one this project actually has rather than the first declared. */
export const getPayloadConfigFile = async (project: DetectedProject) => {
  const configFile = await findExistingRequiredFile({
    cwd: project.cwd,
    pattern: configFilePattern,
    requiredFiles: project.target.requiredFiles,
  })

  if (!configFile) {
    throw new Error(
      `Detected target "${project.target.id}" does not declare a Payload config file in requiredFiles that exists in ${project.cwd}.`,
    )
  }

  return configFile
}

const createDemoSeedTarget = async ({
  manifest,
  project,
}: {
  manifest: ComponentManifest
  project: DetectedProject
}): Promise<SeedTarget> => ({
  configFileRelPath: await getPayloadConfigFile(project),
  marker: `payload-components:demo:${manifest.name}`,
  ownershipStateRelPath: path.join(
    '.payload-components',
    'demo-state',
    `${manifest.name}.json`,
  ),
  scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
  slug: `payload-components-demo-${manifest.name}`,
  title: `Payload Components demo — ${manifest.title}`,
})

export const getPayloadRunCommand = (packageManager: PackageManager, scriptRelPath: string) => {
  if (packageManager === 'pnpm') {
    return `pnpm exec payload run ${scriptRelPath}`
  }

  if (packageManager === 'yarn') {
    return `yarn payload run ${scriptRelPath}`
  }

  if (packageManager === 'bun') {
    return `bunx payload run ${scriptRelPath}`
  }

  return `npx payload run ${scriptRelPath}`
}

const formatInstallPreconditionError = ({
  manifest,
  missingFiles,
  missingFragments,
  missingRegistryDependencies,
}: {
  manifest: ComponentManifest
  missingFiles: string[]
  missingFragments: string[]
  missingRegistryDependencies: Array<{ name: string; targetFile: string }>
}) => {
  const details = [
    ...(missingFiles.length > 0
      ? [`Missing manifest files: ${missingFiles.join(', ')}`]
      : []),
    ...(missingFragments.length > 0
      ? [`Missing Payload fragments: ${missingFragments.join(', ')}`]
      : []),
    ...(missingRegistryDependencies.length > 0
      ? [
          `Missing registry dependencies: ${missingRegistryDependencies
            .map(({ name, targetFile }) => `${name} (${targetFile})`)
            .join(', ')}`,
        ]
      : []),
  ]

  return [
    `"${manifest.name}" is not fully installed; no demo seed script was written.`,
    ...details,
    `Run "payload-components add ${manifest.name}" successfully, then retry the seed command.`,
  ].join('\n')
}

/* Every precondition a seed script depends on: the component supports this
 * project, its install is recorded and complete, its declared dependencies are
 * present, and its files and Payload wiring are actually on disk. Extracted so a
 * template seed can run the same gate for every block of every page instead of
 * re-implementing a weaker version. Returns the loaded manifest. */
export const assertSeedableInstall = async ({
  componentName,
  cwd,
  project,
}: {
  componentName: string
  cwd: string
  project: DetectedProject
}) => {
  const manifest = await loadManifest(componentName)

  assertManifestSupport(project, manifest)
  const plan = await resolveInstallPlan({ cwd, manifest })
  const state = await loadState(cwd)
  const installEntry = state.components[manifest.name]

  if (!installEntry) {
    throw new Error(
      [
        `"${manifest.name}" has no matching installed-state record; no demo seed script was written.`,
        `Run "payload-components add ${manifest.name}" successfully, then retry the seed command.`,
      ].join('\n'),
    )
  }

  if (installEntry?.status === 'partial') {
    const failureDetail = installEntry.lastError
      ? `Last failed stage: ${installEntry.lastError.stage}. Last error: ${installEntry.lastError.message}.`
      : 'The recorded install did not complete.'

    throw new Error(
      [
        `"${manifest.name}" has a recorded partial install; no demo seed script was written.`,
        failureDetail,
        `Run "payload-components add ${manifest.name}" successfully, then retry the seed command.`,
      ].join('\n'),
    )
  }

  const stateMismatches = [
    ...(installEntry.manifestVersion !== manifest.version
      ? [
          `state has manifest ${installEntry.manifestVersion}, current manifest is ${manifest.version}.`,
        ]
      : []),
    ...(installEntry.registryItemName !== manifest.registryItemName
      ? [
          `state has registry item ${installEntry.registryItemName}, manifest expects ${manifest.registryItemName}.`,
        ]
      : []),
    ...(installEntry.targetId !== project.target.id
      ? [
          `state target ${installEntry.targetId}, detected target is ${project.target.id}.`,
        ]
      : []),
  ]

  if (stateMismatches.length > 0) {
    throw new Error(
      [
        `"${manifest.name}" has stale or mismatched install state; no demo seed script was written.`,
        ...stateMismatches,
        `Run "payload-components add ${manifest.name}" successfully, then retry the seed command.`,
      ].join('\n'),
    )
  }

  await Promise.all([
    checkDependencyRequirements({
      allowMissing: false,
      cwd,
      dependencies: plan.peerDependencies,
      label: 'peerDependencies',
    }),
    checkDependencyRequirements({
      allowMissing: false,
      cwd,
      dependencies: plan.dependencies,
      label: 'dependencies',
    }),
  ])

  const [fileCheck, fragmentCheck] = await Promise.all([
    verifyInstalledManifestFiles({ cwd, manifest: plan }),
    verifyInstalledPayloadFragments({ cwd, hostFiles: project.hostFiles, manifest: plan }),
  ])

  if (!fileCheck.isValid || !fragmentCheck.isValid) {
    throw new Error(
      formatInstallPreconditionError({
        manifest,
        missingFiles: fileCheck.missingFiles,
        missingFragments: fragmentCheck.missingFragments,
        missingRegistryDependencies: fileCheck.missingRegistryDependencies,
      }),
    )
  }

  return manifest
}

export const seedCommand = async ({
  cwd,
  componentName,
}: {
  cwd: string
  componentName: string
}) => {
  const project = await detectProject(cwd)
  const manifest = await assertSeedableInstall({ componentName, cwd, project })
  const target = await createDemoSeedTarget({ manifest, project })

  await writeSeedScript(cwd, [manifest], target)

  printHeader(
    [
      `payload-components: wrote ${target.scriptRelPath}`,
      '',
      'Run the generated script in this project:',
      `  ${getPayloadRunCommand(project.packageManager, target.scriptRelPath)}`,
      '',
      `It requires Pages drafts and creates or updates the draft Page /${target.slug}.`,
      'Reruns require the private local ownership record and reuse only its exact Page and Media IDs.',
    ].join('\n'),
  )
}
