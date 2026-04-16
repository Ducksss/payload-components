import { rm } from 'node:fs/promises'
import path from 'node:path'

import { loadManifest } from '../manifest'
import {
  detectProject,
  assertManifestSupport,
  applyPayloadFragments,
  isKitAlreadyPresent,
} from '../project'
import { buildRegistry, installRegistryItem } from '../registry'
import { loadState, recordInstallState } from '../state'
import { getRunScriptCommand, printHeader, runCommand } from '../utils'

const postInstallEnv = {
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET ?? 'payload-kit-poc-cron-secret',
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'payload-kit-poc-secret',
  POSTGRES_URL: process.env.POSTGRES_URL ?? 'postgres://127.0.0.1:5432/payload-kits-poc',
  PREVIEW_SECRET: process.env.PREVIEW_SECRET ?? 'payload-kit-poc-preview-secret',
}

export const addCommand = async ({
  cwd,
  kitName,
}: {
  cwd: string
  kitName: string
}) => {
  const manifest = await loadManifest(kitName)
  const project = await detectProject(cwd)

  assertManifestSupport(project, manifest)

  const existingState = await loadState(cwd)
  const installedEntry = existingState.kits[manifest.name]

  if (installedEntry?.manifestVersion === manifest.version && installedEntry.status === 'installed') {
    printHeader(`payload-kit: "${manifest.name}" is already installed.`)
    return
  }

  if (await isKitAlreadyPresent(cwd, manifest)) {
    await recordInstallState({
      cwd,
      manifest,
      status: 'installed',
      touchedFiles: [
        ...manifest.files,
        'src/blocks/RenderBlocks.tsx',
        'src/collections/Pages/index.ts',
      ],
    })

    printHeader(`payload-kit: "${manifest.name}" is already present. Recorded local install state.`)
    return
  }

  printHeader(`payload-kit: installing "${manifest.name}" into ${cwd}`)

  const registryOutputDir = await buildRegistry(project.packageManager)
  const registryItemPath = path.join(registryOutputDir, `${manifest.registryItemName}.json`)

  try {
    await installRegistryItem({
      itemFilePath: registryItemPath,
      packageManager: project.packageManager,
      targetDir: cwd,
    })
  } finally {
    await rm(registryOutputDir, { force: true, recursive: true })
  }

  const touchedFiles = [...manifest.files]
  const patchedFiles = await applyPayloadFragments(cwd, manifest.payloadFragments)

  touchedFiles.push(...patchedFiles)

  await recordInstallState({
    cwd,
    manifest,
    status: 'partial',
    touchedFiles,
  })

  for (const script of manifest.postInstall) {
    const command = getRunScriptCommand(project.packageManager, script)

    await runCommand({
      args: command.args,
      command: command.command,
      cwd,
      env: postInstallEnv,
    })
  }

  await recordInstallState({
    cwd,
    manifest,
    status: 'installed',
    touchedFiles,
  })

  printHeader(`payload-kit: installed "${manifest.name}" successfully.`)
}
