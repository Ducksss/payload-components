import { checkDependencyRequirements, getRuntimePatchedFiles } from './dependencies'
import { resolveInstallPlan } from './install-plan'
import { loadManifest } from './manifest'
import {
  assertManifestSupport,
  detectProject,
  resolveRecoveryPatchedFiles,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from './project'

export const prepareComponentInstall = async ({
  cwd,
  componentName,
}: {
  cwd: string
  componentName: string
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)
  const plan = await resolveInstallPlan({ cwd, manifest })

  assertManifestSupport(project, manifest)

  await checkDependencyRequirements({
    allowMissing: false,
    cwd,
    dependencies: plan.peerDependencies,
    label: 'peerDependencies',
  })

  const dependencyCheck = await checkDependencyRequirements({
    allowMissing: true,
    cwd,
    dependencies: plan.dependencies,
    label: 'dependencies',
  })
  const fileCheck = await verifyInstalledManifestFiles({
    cwd,
    manifest: plan,
  })
  const fragmentCheck = await verifyInstalledPayloadFragments({
    cwd,
    hostFiles: project.hostFiles,
    manifest: plan,
  })
  const patchedFiles = getRuntimePatchedFiles({
    dependencies: plan.dependencies,
    lockfilePath: project.lockfilePath,
    recoveryPatchedFiles: resolveRecoveryPatchedFiles({
      hostFiles: project.hostFiles,
      recoveryPatchedFiles: plan.recovery.patchedFiles,
    }),
  })
  return { manifest, project, plan, dependencyCheck, fileCheck, fragmentCheck, patchedFiles }
}
