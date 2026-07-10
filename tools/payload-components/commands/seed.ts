import path from 'node:path'

import { loadManifest } from '../manifest'
import {
  assertManifestSupport,
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { writeSeedScript, type SeedTarget } from '../seed/seed-script'
import { loadState } from '../state'
import { printHeader } from '../utils'

import type { ComponentManifest, DetectedProject, PackageManager } from '../types'

const configFilePattern = /(?:^|\/)payload\.config\.(?:[cm]?[jt]s)$/

const getPayloadConfigFile = (project: DetectedProject) => {
  const configFile = project.target.requiredFiles.find((filePath) =>
    configFilePattern.test(filePath.replaceAll('\\', '/')),
  )

  if (!configFile) {
    throw new Error(
      `Detected target "${project.target.id}" does not declare a Payload config file in requiredFiles.`,
    )
  }

  return configFile
}

const createDemoSeedTarget = ({
  manifest,
  project,
}: {
  manifest: ComponentManifest
  project: DetectedProject
}): SeedTarget => ({
  configFileRelPath: getPayloadConfigFile(project),
  marker: `payload-components:demo:${manifest.name}`,
  pageStatus: 'draft',
  scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
  slug: `payload-components-demo-${manifest.name}`,
  title: `Payload Components demo — ${manifest.title}`,
})

const getPayloadRunCommand = (packageManager: PackageManager, scriptRelPath: string) => {
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
}: {
  manifest: ComponentManifest
  missingFiles: string[]
  missingFragments: string[]
}) => {
  const details = [
    ...(missingFiles.length > 0
      ? [`Missing manifest files: ${missingFiles.join(', ')}`]
      : []),
    ...(missingFragments.length > 0
      ? [`Missing Payload fragments: ${missingFragments.join(', ')}`]
      : []),
  ]

  return [
    `"${manifest.name}" is not fully installed; no demo seed script was written.`,
    ...details,
    `Run "payload-components add ${manifest.name}" successfully, then retry the seed command.`,
  ].join('\n')
}

export const seedCommand = async ({
  cwd,
  componentName,
}: {
  cwd: string
  componentName: string
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)

  assertManifestSupport(project, manifest)

  const [fileCheck, fragmentCheck, state] = await Promise.all([
    verifyInstalledManifestFiles({ cwd, manifest }),
    verifyInstalledPayloadFragments({ cwd, manifest }),
    loadState(cwd),
  ])
  const installEntry = state.components[manifest.name]

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

  if (!fileCheck.isValid || !fragmentCheck.isValid) {
    throw new Error(
      formatInstallPreconditionError({
        manifest,
        missingFiles: fileCheck.missingFiles,
        missingFragments: fragmentCheck.missingFragments,
      }),
    )
  }

  const target = createDemoSeedTarget({ manifest, project })

  await writeSeedScript(cwd, [manifest], target)

  printHeader(
    [
      `payload-components: wrote ${target.scriptRelPath}`,
      '',
      'Run the generated script in this project:',
      `  ${getPayloadRunCommand(project.packageManager, target.scriptRelPath)}`,
      '',
      `It requires Pages drafts and creates or updates the draft Page /${target.slug}.`,
      'Reruns update only the exact generated marker/title and reuse owned placeholder media.',
    ].join('\n'),
  )
}
