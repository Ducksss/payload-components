import path from 'node:path'

import { getShadcnUiDir } from './registry'
import type {
  ComponentManifest,
  RegistryDefinition,
  ResolvedInstallPlan,
} from './types'
import { readJsonFile, repoRoot } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')

const toProjectPath = (cwd: string, absolutePath: string) =>
  path.relative(cwd, absolutePath).split(path.sep).join('/')

export const resolveInstallPlan = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: ComponentManifest
}): Promise<ResolvedInstallPlan> => {
  const registry = await readJsonFile<RegistryDefinition>(registryDefinitionPath)
  const registryItem = registry.items.find((item) => item.name === manifest.registryItemName)

  if (!registryItem) {
    throw new Error(
      `Manifest "${manifest.name}" references registry item "${manifest.registryItemName}", but no matching item exists in payload-components/registry.json.`,
    )
  }

  const uiDir = await getShadcnUiDir(cwd)
  const registryDependencies = [...new Set(registryItem.registryDependencies ?? [])]
    .sort()
    .map((name) => ({
      name,
      targetFile: toProjectPath(cwd, path.join(uiDir, `${name}.tsx`)),
    }))

  return {
    dependencies: manifest.dependencies,
    files: manifest.files,
    name: manifest.name,
    payloadFragments: manifest.payloadFragments,
    peerDependencies: manifest.peerDependencies,
    postInstall: manifest.postInstall,
    recovery: manifest.recovery,
    registryDependencies,
    registryItemName: manifest.registryItemName,
    version: manifest.version,
  }
}
