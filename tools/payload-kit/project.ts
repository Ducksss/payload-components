import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { DetectedProject, KitManifest, PayloadFragment, SupportMatrix } from './types'

import { detectPackageManager, extractMajor, readJsonFile, repoRoot } from './utils'

const supportMatrixPath = path.join(repoRoot, 'payload-kits', 'support-matrix.json')

const insertBeforeAnchor = (source: string, text: string, anchor: string) => {
  if (source.includes(text)) {
    return source
  }

  const anchorIndex = source.indexOf(anchor)

  if (anchorIndex === -1) {
    throw new Error(`Unable to find insertion anchor "${anchor}".`)
  }

  return `${source.slice(0, anchorIndex)}${text}\n${source.slice(anchorIndex)}`
}

const applyRenderBlocksFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>) => {
  const importStatement = `import { ${fragment.importName} } from '${fragment.importPath}'`
  let updated = insertBeforeAnchor(source, `${importStatement}\n`, 'const blockComponents = {')

  if (updated.includes(`${fragment.blockSlug}: ${fragment.importName}`)) {
    return updated
  }

  updated = updated.replace(
    /const blockComponents = \{([\s\S]*?)\n\}/,
    (match, body: string) =>
      `const blockComponents = {${body}\n  ${fragment.blockSlug}: ${fragment.importName},\n}`,
  )

  if (!updated.includes(`${fragment.blockSlug}: ${fragment.importName}`)) {
    throw new Error('Unable to register the block inside RenderBlocks.tsx.')
  }

  return updated
}

const applyPagesLayoutFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>) => {
  const importStatement = `import { ${fragment.importName} } from '${fragment.importPath}'`
  let updated = insertBeforeAnchor(source, `${importStatement}\n`, 'export const Pages: CollectionConfig')

  updated = updated.replace(/blocks:\s*\[([\s\S]*?)\],/, (match, blockList: string) => {
    if (blockList.includes(fragment.blockName)) {
      return match
    }

    const trimmed = blockList.trim()
    const suffix = trimmed.length > 0 ? `${trimmed}, ${fragment.blockName}` : fragment.blockName

    return `blocks: [${suffix}],`
  })

  const layoutBlocksMatch = updated.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!layoutBlocksMatch?.[1]?.includes(fragment.blockName)) {
    throw new Error('Unable to register the block in Pages collection layout blocks.')
  }

  return updated
}

export const detectProject = async (cwd: string): Promise<DetectedProject> => {
  const supportMatrix = await readJsonFile<SupportMatrix>(supportMatrixPath)
  const packageJson = await readJsonFile<{
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }>(path.join(cwd, 'package.json'))
  const dependencies = {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  }
  const payloadMajor = extractMajor(dependencies.payload, 'payload')
  const nextMajor = extractMajor(dependencies.next, 'next')
  const packageManager = await detectPackageManager(cwd)

  for (const target of supportMatrix.targets) {
    if (!target.allowedPayloadMajors.includes(payloadMajor)) {
      continue
    }

    if (!target.allowedNextMajors.includes(nextMajor)) {
      continue
    }

    const requiredFilesPresent = await Promise.all(
      target.requiredFiles.map(async (file) => {
        try {
          await readFile(path.join(cwd, file), 'utf8')
          return true
        } catch {
          return false
        }
      }),
    )

    if (requiredFilesPresent.includes(false)) {
      continue
    }

    const requiredAnchorsPresent = await Promise.all(
      target.requiredAnchors.map(async ({ file, text }) => {
        const content = await readFile(path.join(cwd, file), 'utf8')
        return content.includes(text)
      }),
    )

    if (requiredAnchorsPresent.includes(false)) {
      continue
    }

    return {
      cwd,
      nextMajor,
      packageManager,
      payloadMajor,
      target,
    }
  }

  throw new Error(
    `Unsupported project shape in ${cwd}. The POC currently supports Payload website-style repos with components.json, src/blocks/RenderBlocks.tsx, and src/collections/Pages/index.ts.`,
  )
}

export const assertManifestSupport = (project: DetectedProject, manifest: KitManifest) => {
  if (!manifest.supportedTargets.includes(project.target.id)) {
    throw new Error(
      `Kit "${manifest.name}" does not support the detected project target "${project.target.id}".`,
    )
  }

  if (!manifest.supports.payloadMajors.includes(project.payloadMajor)) {
    throw new Error(
      `Kit "${manifest.name}" does not support Payload major version ${project.payloadMajor}.`,
    )
  }

  if (!manifest.supports.nextMajors.includes(project.nextMajor)) {
    throw new Error(`Kit "${manifest.name}" does not support Next.js major version ${project.nextMajor}.`)
  }
}

export const applyPayloadFragments = async (cwd: string, fragments: PayloadFragment[]) => {
  const touchedFiles = new Set<string>()

  for (const fragment of fragments) {
    if (fragment.kind === 'renderBlocks') {
      const filePath = path.join(cwd, 'src/blocks/RenderBlocks.tsx')
      const existing = await readFile(filePath, 'utf8')
      const updated = applyRenderBlocksFragment(existing, fragment)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
        touchedFiles.add('src/blocks/RenderBlocks.tsx')
      }
    }

    if (fragment.kind === 'pagesLayout') {
      const filePath = path.join(cwd, 'src/collections/Pages/index.ts')
      const existing = await readFile(filePath, 'utf8')
      const updated = applyPagesLayoutFragment(existing, fragment)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
        touchedFiles.add('src/collections/Pages/index.ts')
      }
    }
  }

  return [...touchedFiles]
}

export const isKitAlreadyPresent = async (cwd: string, manifest: KitManifest) => {
  const installedFilesPresent = await Promise.all(
    manifest.files.map(async (file) => {
      try {
        await access(path.join(cwd, file))
        return true
      } catch {
        return false
      }
    }),
  )

  if (installedFilesPresent.includes(false)) {
    return false
  }

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      const renderBlocksSource = await readFile(path.join(cwd, 'src/blocks/RenderBlocks.tsx'), 'utf8')

      if (!renderBlocksSource.includes(`${fragment.blockSlug}: ${fragment.importName}`)) {
        return false
      }
    }

    if (fragment.kind === 'pagesLayout') {
      const pagesSource = await readFile(path.join(cwd, 'src/collections/Pages/index.ts'), 'utf8')
      const layoutBlocksMatch = pagesSource.match(/blocks:\s*\[([\s\S]*?)\],/)

      if (!layoutBlocksMatch?.[1]?.includes(fragment.blockName)) {
        return false
      }
    }
  }

  return true
}
