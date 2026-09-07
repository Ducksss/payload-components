import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { hashSource, resolveCanonicalFiles } from './component-files'
import { listComponentNames, loadManifest } from './manifest'
import { isBlockConfigFile, localizeBlockConfigSource } from './project'
import { repoRoot } from './utils'

export const currentInstallBaselines = async () => {
  const components: Record<
    string,
    Record<string, Record<string, { default: string; localized?: string }>>
  > = {}
  for (const name of await listComponentNames()) {
    const manifest = await loadManifest(name)
    const files: Record<string, { default: string; localized?: string }> = {}
    for (const [projectPath, file] of await resolveCanonicalFiles(manifest.registryItemName)) {
      const source = await readFile(file.sourcePath, 'utf8')
      files[projectPath] = {
        default: hashSource(source),
        ...(isBlockConfigFile(projectPath)
          ? { localized: hashSource(localizeBlockConfigSource(source)) }
          : {}),
      }
    }
    components[name] = { [manifest.version]: files }
  }
  return components
}

export const snapshotInstallBaselines = async () => {
  const filePath = path.join(repoRoot, 'payload-components/install-baselines.json')
  const baseline = JSON.parse(await readFile(filePath, 'utf8'))
  const current = await currentInstallBaselines()
  for (const [name, versions] of Object.entries(current)) {
    baseline.components[name] ??= {}
    for (const [version, files] of Object.entries(versions)) {
      const previous = baseline.components[name][version]
      if (previous && JSON.stringify(previous) !== JSON.stringify(files)) {
        throw new Error(
          `${name}@${version} source changed. Bump its manifest version and changelog; published baselines cannot be rewritten.`,
        )
      }
      baseline.components[name][version] = files
    }
  }
  await writeFile(filePath, JSON.stringify(baseline, null, 2) + '\n')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await snapshotInstallBaselines()
}
