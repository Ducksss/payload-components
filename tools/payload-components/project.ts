import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  DetectedProject,
  ComponentManifest,
  PayloadFragment,
  ResolvedRegistryDependency,
  SupportMatrix,
} from './types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { detectPackageManagerDetails, extractMajor, readJsonFile, repoRoot } from './utils'

const supportMatrixPath = path.join(repoRoot, 'payload-components', 'support-matrix.json')
const renderBlocksAnchor = 'const blockComponents = {'
const pagesAnchor = 'export const Pages: CollectionConfig'

const getAbsolutePath = (cwd: string, filePath: string) => path.join(cwd, filePath)

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

type DelimiterRange = {
  end: number
  start: number
}

/* Mask comments and literal contents without changing offsets. Delimiters and
   newlines stay in place so the structural scanner can balance real objects and
   arrays while extracting an import's original quoted module path. */
const maskIgnoredSource = (source: string) => {
  const masked = source.split('')
  let mode: 'blockComment' | 'code' | 'doubleQuote' | 'lineComment' | 'singleQuote' | 'template' = 'code'

  const blank = (index: number) => {
    if (masked[index] !== '\n' && masked[index] !== '\r') {
      masked[index] = ' '
    }
  }

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    const nextCharacter = source[index + 1]

    if (mode === 'lineComment') {
      if (character === '\n' || character === '\r') {
        mode = 'code'
      } else {
        blank(index)
      }
      continue
    }

    if (mode === 'blockComment') {
      if (character === '*' && nextCharacter === '/') {
        blank(index)
        blank(index + 1)
        index += 1
        mode = 'code'
      } else {
        blank(index)
      }
      continue
    }

    if (mode !== 'code') {
      const closingDelimiter =
        mode === 'singleQuote' ? "'" : mode === 'doubleQuote' ? '"' : '`'

      if (character === '\\') {
        blank(index)
        if (index + 1 < source.length) {
          blank(index + 1)
          index += 1
        }
        continue
      }

      if (character === closingDelimiter) {
        mode = 'code'
      } else {
        blank(index)
      }
      continue
    }

    if (character === '/' && nextCharacter === '/') {
      blank(index)
      blank(index + 1)
      index += 1
      mode = 'lineComment'
      continue
    }

    if (character === '/' && nextCharacter === '*') {
      blank(index)
      blank(index + 1)
      index += 1
      mode = 'blockComment'
      continue
    }

    if (character === "'") {
      mode = 'singleQuote'
      continue
    }

    if (character === '"') {
      mode = 'doubleQuote'
      continue
    }

    if (character === '`') {
      mode = 'template'
    }
  }

  return masked.join('')
}

const findMatchingDelimiter = ({
  close,
  maskedSource,
  open,
  start,
}: {
  close: string
  maskedSource: string
  open: string
  start: number
}) => {
  let depth = 0

  for (let index = start; index < maskedSource.length; index += 1) {
    if (maskedSource[index] === open) {
      depth += 1
    }

    if (maskedSource[index] === close) {
      depth -= 1

      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

const isDirectlyWithin = (maskedSource: string, rangeStart: number, index: number) => {
  const depth = {
    braces: 0,
    brackets: 0,
    parentheses: 0,
  }

  for (let cursor = rangeStart; cursor < index; cursor += 1) {
    if (maskedSource[cursor] === '{') depth.braces += 1
    if (maskedSource[cursor] === '}') depth.braces -= 1
    if (maskedSource[cursor] === '[') depth.brackets += 1
    if (maskedSource[cursor] === ']') depth.brackets -= 1
    if (maskedSource[cursor] === '(') depth.parentheses += 1
    if (maskedSource[cursor] === ')') depth.parentheses -= 1
  }

  return depth.braces === 0 && depth.brackets === 0 && depth.parentheses === 0
}

const findTopLevelObject = (source: string, pattern: RegExp): DelimiterRange | undefined => {
  const maskedSource = maskIgnoredSource(source)

  for (const match of maskedSource.matchAll(pattern)) {
    if (typeof match.index !== 'number' || !isDirectlyWithin(maskedSource, 0, match.index)) {
      continue
    }

    const start = maskedSource.indexOf('{', match.index)
    const end = findMatchingDelimiter({
      close: '}',
      maskedSource,
      open: '{',
      start,
    })

    if (start !== -1 && end !== -1) {
      return { end, start }
    }
  }

  return undefined
}

const findRenderBlocksObject = (source: string) =>
  findTopLevelObject(source, /\bconst\s+blockComponents\s*=\s*\{/g)

const findTopLevelAnchor = (source: string, anchor: string) => {
  const maskedSource = maskIgnoredSource(source)
  let index = maskedSource.indexOf(anchor)

  while (index !== -1) {
    if (isDirectlyWithin(maskedSource, 0, index)) {
      return index
    }

    index = maskedSource.indexOf(anchor, index + anchor.length)
  }

  return -1
}

const hasNamedImport = (source: string, importName: string, importPath: string) => {
  const maskedSource = maskIgnoredSource(source)
  const importPattern = /\bimport\s*\{([^}]*)\}\s*from\s*(['"])/g

  for (const match of maskedSource.matchAll(importPattern)) {
    if (typeof match.index !== 'number' || !isDirectlyWithin(maskedSource, 0, match.index)) {
      continue
    }

    if (!new RegExp(`\\b${escapeRegExp(importName)}\\b`).test(match[1])) {
      continue
    }

    const quote = match[2]
    const quoteStart = match.index + match[0].lastIndexOf(quote)
    const quoteEnd = maskedSource.indexOf(quote, quoteStart + 1)

    if (quoteEnd !== -1 && source.slice(quoteStart + 1, quoteEnd) === importPath) {
      return true
    }
  }

  return false
}

const hasDirectObjectEntry = ({
  importName,
  key,
  range,
  source,
}: {
  importName: string
  key: string
  range: DelimiterRange
  source: string
}) => {
  const maskedSource = maskIgnoredSource(source)
  const entryPattern = new RegExp(
    `\\b${escapeRegExp(key)}\\s*:\\s*${escapeRegExp(importName)}\\b`,
    'g',
  )

  for (const match of maskedSource.matchAll(entryPattern)) {
    if (
      typeof match.index === 'number' &&
      match.index > range.start &&
      match.index < range.end &&
      isDirectlyWithin(maskedSource, range.start + 1, match.index)
    ) {
      return true
    }
  }

  return false
}

const findEnclosingObject = ({
  container,
  index,
  maskedSource,
}: {
  container: DelimiterRange
  index: number
  maskedSource: string
}): DelimiterRange | undefined => {
  const objectStack: number[] = []

  for (let cursor = container.start; cursor < index; cursor += 1) {
    if (maskedSource[cursor] === '{') {
      objectStack.push(cursor)
    }

    if (maskedSource[cursor] === '}') {
      objectStack.pop()
    }
  }

  const start = objectStack.at(-1)

  if (start === undefined) {
    return undefined
  }

  const end = findMatchingDelimiter({
    close: '}',
    maskedSource,
    open: '{',
    start,
  })

  if (end === -1 || end > container.end) {
    return undefined
  }

  return { end, start }
}

const findPagesLayoutBlocks = (source: string): DelimiterRange | undefined => {
  const pagesObject = findTopLevelObject(
    source,
    /\bexport\s+const\s+Pages\s*:\s*CollectionConfig\s*=\s*\{/g,
  )

  if (!pagesObject) {
    return undefined
  }

  const maskedSource = maskIgnoredSource(source)
  const namePattern = /\bname\s*:\s*(['"])/g

  for (const match of maskedSource.matchAll(namePattern)) {
    if (
      typeof match.index !== 'number' ||
      match.index <= pagesObject.start ||
      match.index >= pagesObject.end
    ) {
      continue
    }

    const quote = match[1]
    const quoteStart = match.index + match[0].lastIndexOf(quote)
    const quoteEnd = maskedSource.indexOf(quote, quoteStart + 1)

    if (quoteEnd === -1 || source.slice(quoteStart + 1, quoteEnd) !== 'layout') {
      continue
    }

    const layoutObject = findEnclosingObject({
      container: pagesObject,
      index: match.index,
      maskedSource,
    })

    if (
      !layoutObject ||
      !isDirectlyWithin(maskedSource, layoutObject.start + 1, match.index)
    ) {
      continue
    }

    const blocksPattern = /\bblocks\s*:\s*\[/g

    for (const blocksMatch of maskedSource.matchAll(blocksPattern)) {
      if (
        typeof blocksMatch.index !== 'number' ||
        blocksMatch.index <= layoutObject.start ||
        blocksMatch.index >= layoutObject.end ||
        !isDirectlyWithin(maskedSource, layoutObject.start + 1, blocksMatch.index)
      ) {
        continue
      }

      const start = maskedSource.indexOf('[', blocksMatch.index)
      const end = findMatchingDelimiter({
        close: ']',
        maskedSource,
        open: '[',
        start,
      })

      if (start !== -1 && end !== -1 && end < layoutObject.end) {
        return { end, start }
      }
    }
  }

  return undefined
}

const hasDirectArrayIdentifier = ({
  identifier,
  range,
  source,
}: {
  identifier: string
  range: DelimiterRange
  source: string
}) => {
  const maskedSource = maskIgnoredSource(source)
  const identifierPattern = new RegExp(`\\b${escapeRegExp(identifier)}\\b`, 'g')

  for (const match of maskedSource.matchAll(identifierPattern)) {
    if (
      typeof match.index === 'number' &&
      match.index > range.start &&
      match.index < range.end &&
      isDirectlyWithin(maskedSource, range.start + 1, match.index)
    ) {
      return true
    }
  }

  return false
}

const insertLineBeforeAnchor = ({
  anchor,
  isPresent,
  line,
  source,
}: {
  anchor: string
  isPresent?: (source: string) => boolean
  line: string
  source: string
}) => {
  if (isPresent ? isPresent(source) : source.split('\n').includes(line)) {
    return source
  }

  const anchorIndex = findTopLevelAnchor(source, anchor)

  if (anchorIndex === -1) {
    throw new Error(`Unable to find insertion anchor "${anchor}".`)
  }

  const lineStart = source.lastIndexOf('\n', anchorIndex - 1) + 1

  return `${source.slice(0, lineStart)}${line}\n${source.slice(lineStart)}`
}

const applyRenderBlocksFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const propertyLine = `  ${fragment.blockSlug}: ${fragment.importName},`
  const sourceWithImport = insertLineBeforeAnchor({
    anchor: renderBlocksAnchor,
    isPresent: (current) => hasNamedImport(current, fragment.importName, fragment.importPath),
    line: importLine,
    source,
  })
  const objectRange = findRenderBlocksObject(sourceWithImport)

  if (!objectRange) {
    throw new Error('Unable to find the blockComponents object in RenderBlocks.tsx.')
  }

  if (
    hasDirectObjectEntry({
      importName: fragment.importName,
      key: fragment.blockSlug,
      range: objectRange,
      source: sourceWithImport,
    })
  ) {
    return sourceWithImport
  }

  const closingLineStart = sourceWithImport.lastIndexOf('\n', objectRange.end - 1) + 1

  return `${sourceWithImport.slice(0, closingLineStart)}${propertyLine}\n${sourceWithImport.slice(closingLineStart)}`
}

const applyPagesLayoutFragment = (source: string, fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const sourceWithImport = insertLineBeforeAnchor({
    anchor: pagesAnchor,
    isPresent: (current) => hasNamedImport(current, fragment.importName, fragment.importPath),
    line: importLine,
    source,
  })
  const blocksRange = findPagesLayoutBlocks(sourceWithImport)

  if (!blocksRange) {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  if (
    hasDirectArrayIdentifier({
      identifier: fragment.blockName,
      range: blocksRange,
      source: sourceWithImport,
    })
  ) {
    return sourceWithImport
  }

  const currentEntries = sourceWithImport
    .slice(blocksRange.start + 1, blocksRange.end)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  const replacement = [...currentEntries, fragment.blockName].join(', ')

  return `${sourceWithImport.slice(0, blocksRange.start + 1)}${replacement}${sourceWithImport.slice(blocksRange.end)}`
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
  const { lockfilePath, packageManager } = await detectPackageManagerDetails(cwd)

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
      lockfilePath,
      nextMajor,
      packageManager,
      payloadMajor,
      target,
    }
  }

  const componentsJsonPresent = await readFile(path.join(cwd, 'components.json'), 'utf8')
    .then(() => true)
    .catch(() => false)

  if (!componentsJsonPresent) {
    throw new Error(
      `No components.json found in ${cwd}. This project isn't initialized for shadcn-style installs yet. Run "payload-components init" first, then re-run this command.`,
    )
  }

  throw new Error(
    `Unsupported project shape in ${cwd}. The install flow currently supports Payload website-style repos with components.json, ${RENDER_BLOCKS_FILE}, and ${PAGES_LAYOUT_FILE}.`,
  )
}

export const assertManifestSupport = (project: DetectedProject, manifest: ComponentManifest) => {
  if (!manifest.supportedTargets.includes(project.target.id)) {
    throw new Error(
      `Component "${manifest.name}" does not support the detected project target "${project.target.id}".`,
    )
  }

  if (!manifest.supports.payloadMajors.includes(project.payloadMajor)) {
    throw new Error(
      `Component "${manifest.name}" does not support Payload major version ${project.payloadMajor}.`,
    )
  }

  if (!manifest.supports.nextMajors.includes(project.nextMajor)) {
    throw new Error(`Component "${manifest.name}" does not support Next.js major version ${project.nextMajor}.`)
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
  manifest: Pick<ComponentManifest, 'files'> & {
    registryDependencies?: ResolvedRegistryDependency[]
  }
}) => {
  const missingFiles: string[] = []
  const missingRegistryDependencies: ResolvedRegistryDependency[] = []

  for (const filePath of manifest.files) {
    try {
      await access(getAbsolutePath(cwd, filePath))
    } catch {
      missingFiles.push(filePath)
    }
  }

  for (const dependency of manifest.registryDependencies ?? []) {
    try {
      await access(getAbsolutePath(cwd, dependency.targetFile))
    } catch {
      missingRegistryDependencies.push(dependency)
    }
  }

  return {
    isValid: missingFiles.length === 0 && missingRegistryDependencies.length === 0,
    missingFiles,
    missingRegistryDependencies,
  }
}

export const verifyInstalledPayloadFragments = async ({
  cwd,
  manifest,
}: {
  cwd: string
  manifest: Pick<ComponentManifest, 'payloadFragments'>
}) => {
  const missingFragments: string[] = []

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      const renderBlocksSource = await readFile(getAbsolutePath(cwd, RENDER_BLOCKS_FILE), 'utf8')

      if (!hasNamedImport(renderBlocksSource, fragment.importName, fragment.importPath)) {
        missingFragments.push(`renderBlocks.import:${fragment.importName}`)
      }

      const blockComponents = findRenderBlocksObject(renderBlocksSource)

      if (
        !blockComponents ||
        !hasDirectObjectEntry({
          importName: fragment.importName,
          key: fragment.blockSlug,
          range: blockComponents,
          source: renderBlocksSource,
        })
      ) {
        missingFragments.push(`renderBlocks.block:${fragment.blockSlug}`)
      }
    }

    if (fragment.kind === 'pagesLayout') {
      const pagesSource = await readFile(getAbsolutePath(cwd, PAGES_LAYOUT_FILE), 'utf8')

      if (!hasNamedImport(pagesSource, fragment.importName, fragment.importPath)) {
        missingFragments.push(`pagesLayout.import:${fragment.importName}`)
      }

      const blocksRange = findPagesLayoutBlocks(pagesSource)

      if (
        !blocksRange ||
        !hasDirectArrayIdentifier({
          identifier: fragment.blockName,
          range: blocksRange,
          source: pagesSource,
        })
      ) {
        missingFragments.push(`pagesLayout.block:${fragment.blockName}`)
      }
    }
  }

  return {
    isValid: missingFragments.length === 0,
    missingFragments,
  }
}
