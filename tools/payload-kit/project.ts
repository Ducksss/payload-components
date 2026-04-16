import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { DetectedProject, KitManifest, PayloadFragment, SupportMatrix } from './types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { detectPackageManager, extractMajor, readJsonFile, repoRoot } from './utils'

const supportMatrixPath = path.join(repoRoot, 'payload-kits', 'support-matrix.json')
const renderBlocksAnchor = 'const blockComponents = {'
const pagesAnchor = 'export const Pages: CollectionConfig'
const layoutAnchor = "name: 'layout'"

const getAbsolutePath = (cwd: string, filePath: string) => path.join(cwd, filePath)

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

const insertLineBeforeAnchor = ({
  anchor,
  line,
  source,
}: {
  anchor: string
  line: string
  source: string
}) => {
  const lines = source.split('\n')

  if (lines.includes(line)) {
    return source
  }

  const anchorIndex = lines.findIndex((currentLine) => currentLine.includes(anchor))

  if (anchorIndex === -1) {
    throw new Error(`Unable to find insertion anchor "${anchor}".`)
  }

  lines.splice(anchorIndex, 0, line)

  return lines.join('\n')
}

const applyRenderBlocksFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const propertyLine = `  ${fragment.blockSlug}: ${fragment.importName},`
  const lines = insertLineBeforeAnchor({
    anchor: renderBlocksAnchor,
    line: importLine,
    source,
  }).split('\n')

  const objectStartIndex = lines.findIndex((line) => line.includes(renderBlocksAnchor))

  if (objectStartIndex === -1) {
    throw new Error('Unable to find the blockComponents object in RenderBlocks.tsx.')
  }

  const objectEndIndex = lines.findIndex((line, index) => index > objectStartIndex && line === '}')

  if (objectEndIndex === -1) {
    throw new Error('Unable to find the end of the blockComponents object in RenderBlocks.tsx.')
  }

  const objectLines = lines.slice(objectStartIndex, objectEndIndex + 1)

  if (objectLines.includes(propertyLine)) {
    return lines.join('\n')
  }

  lines.splice(objectEndIndex, 0, propertyLine)

  return lines.join('\n')
}

const applyPagesLayoutFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const sourceWithImport = insertLineBeforeAnchor({
    anchor: pagesAnchor,
    line: importLine,
    source,
  })
  const layoutIndex = sourceWithImport.indexOf(layoutAnchor)

  if (layoutIndex === -1) {
    throw new Error('Unable to find the layout tab in Pages collection config.')
  }

  const layoutSlice = sourceWithImport.slice(layoutIndex)
  const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!blocksMatch || typeof blocksMatch.index !== 'number') {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  const absoluteMatchStart = layoutIndex + blocksMatch.index
  const absoluteMatchEnd = absoluteMatchStart + blocksMatch[0].length
  const currentEntries = blocksMatch[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (currentEntries.includes(fragment.blockName)) {
    return sourceWithImport
  }

  const replacement = `blocks: [${[...currentEntries, fragment.blockName].join(', ')}],`

  return `${sourceWithImport.slice(0, absoluteMatchStart)}${replacement}${sourceWithImport.slice(absoluteMatchEnd)}`
}

export const getExpectedPatchedFiles = (manifest: Pick<KitManifest, 'payloadFragments'>) =>
  normalizeFileList(
    manifest.payloadFragments.map((fragment) =>
      fragment.kind === 'renderBlocks' ? RENDER_BLOCKS_FILE : PAGES_LAYOUT_FILE,
    ),
  )

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
    `Unsupported project shape in ${cwd}. The alpha install flow currently supports Payload website-style repos with components.json, ${RENDER_BLOCKS_FILE}, and ${PAGES_LAYOUT_FILE}.`,
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
      const filePath = getAbsolutePath(cwd, RENDER_BLOCKS_FILE)
      const existing = await readFile(filePath, 'utf8')
      const updated = applyRenderBlocksFragment(existing, fragment)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
      }

      touchedFiles.add(RENDER_BLOCKS_FILE)
    }

    if (fragment.kind === 'pagesLayout') {
      const filePath = getAbsolutePath(cwd, PAGES_LAYOUT_FILE)
      const existing = await readFile(filePath, 'utf8')
      const updated = applyPagesLayoutFragment(existing, fragment)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
      }

      touchedFiles.add(PAGES_LAYOUT_FILE)
    }
  }

  return normalizeFileList([...touchedFiles])
}

export const verifyInstalledManifestFiles = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: Pick<KitManifest, 'files'>
}) => {
  const missingFiles: string[] = []

  for (const filePath of manifest.files) {
    try {
      await access(getAbsolutePath(cwd, filePath))
    } catch {
      missingFiles.push(filePath)
    }
  }

  return {
    isValid: missingFiles.length === 0,
    missingFiles,
  }
}

export const verifyInstalledPayloadFragments = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: Pick<KitManifest, 'payloadFragments'>
}) => {
  const missingFragments: string[] = []

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      const renderBlocksSource = await readFile(getAbsolutePath(cwd, RENDER_BLOCKS_FILE), 'utf8')

      if (!renderBlocksSource.includes(`import { ${fragment.importName} } from '${fragment.importPath}'`)) {
        missingFragments.push(`renderBlocks.import:${fragment.importName}`)
      }

      if (!renderBlocksSource.includes(`${fragment.blockSlug}: ${fragment.importName}`)) {
        missingFragments.push(`renderBlocks.block:${fragment.blockSlug}`)
      }
    }

    if (fragment.kind === 'pagesLayout') {
      const pagesSource = await readFile(getAbsolutePath(cwd, PAGES_LAYOUT_FILE), 'utf8')

      if (!pagesSource.includes(`import { ${fragment.importName} } from '${fragment.importPath}'`)) {
        missingFragments.push(`pagesLayout.import:${fragment.importName}`)
      }

      const layoutIndex = pagesSource.indexOf(layoutAnchor)
      const layoutSlice = layoutIndex === -1 ? '' : pagesSource.slice(layoutIndex)
      const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

      if (!blocksMatch?.[1]?.split(',').map((entry) => entry.trim()).includes(fragment.blockName)) {
        missingFragments.push(`pagesLayout.block:${fragment.blockName}`)
      }
    }
  }

  return {
    isValid: missingFragments.length === 0,
    missingFragments,
  }
}

export const isKitAlreadyPresent = async (cwd: string, manifest: KitManifest) => {
  const fileCheck = await verifyInstalledManifestFiles({
    cwd,
    manifest,
  })

  if (!fileCheck.isValid) {
    return false
  }

  const fragmentCheck = await verifyInstalledPayloadFragments({
    cwd,
    manifest,
  })

  return fragmentCheck.isValid
}
