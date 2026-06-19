import path from 'node:path'

import { loadManifest } from '../manifest'
import {
  assertManifestSupport,
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { writeSeedScript, type SeedTarget } from '../seed/seed-script'
import { printHeader } from '../utils'

import type { ComponentManifest, PackageManager } from '../types'

const demoTarget = (manifest: ComponentManifest): SeedTarget => ({
  configImportPath: '../src/payload.config',
  placeholderRelPath: path.join('.payload-components', 'demo-placeholder.svg'),
  scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
  slug: `payload-components-demo-${manifest.name}`,
  title: `Payload Components — ${manifest.title} demo`,
})

const runScriptCommand = (packageManager: PackageManager, scriptRelPath: string) => {
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

/**
 * Write a labeled, opt-in demo seed script into the consumer project. The CLI
 * never connects to the database — it only writes a runnable script that the
 * user executes inside their own Payload toolchain (`payload run`), which
 * creates one clearly-labeled example Page they can study and delete.
 */
export const seedCommand = async ({ cwd, componentName }: { cwd: string; componentName: string }) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)

  assertManifestSupport(project, manifest)

  // Soft check: the seeded page references the block type, which only renders
  // once the block is registered in the Payload config. Warn (don't fail) so a
  // user can write the script first and install after.
  const [fileCheck, fragmentCheck] = await Promise.all([
    verifyInstalledManifestFiles({ cwd, manifest }),
    verifyInstalledPayloadFragments({ cwd, manifest }),
  ])

  if (!fileCheck.isValid || !fragmentCheck.isValid) {
    printHeader(
      `payload-components: "${manifest.name}" does not look installed yet. Run "payload-components add ${manifest.name}" before running the seed script below.`,
    )
  }

  const target = demoTarget(manifest)

  await writeSeedScript(cwd, [manifest], target)

  printHeader(
    [
      `payload-components: wrote ${target.scriptRelPath}`,
      '',
      'Run it against your database to create one example page:',
      `  ${runScriptCommand(project.packageManager, target.scriptRelPath)}`,
      '',
      `Then open /${target.slug} to see "${manifest.title}" filled in like the catalog preview.`,
      'The page is labeled and safe to delete — re-running the script replaces only that page.',
    ].join('\n'),
  )
}
