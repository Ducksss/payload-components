import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  DetectedProject,
  ComponentManifest,
  HostFileRequirement,
  PayloadFragment,
  RequiredFile,
  ResolvedHostFiles,
  ResolvedRegistryDependency,
  SupportMatrix,
} from './types'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from './constants'
import { detectPackageManagerDetails, extractMajor, readJsonFile, repoRoot } from './utils'

/* Manifests are authored against the canonical starter paths, so those double as
 * the default when a caller has not detected a project (tests, and the
 * verify/remove helpers used outside an install). */
export const CANONICAL_HOST_FILES: ResolvedHostFiles = {
  pagesLayout: PAGES_LAYOUT_FILE,
  renderBlocks: RENDER_BLOCKS_FILE,
}

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
    /\bexport\s+const\s+Pages\s*:\s*CollectionConfig(?:\s*<[^>]+>)?\s*=\s*\{/g,
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
        (!isDirectlyWithin(maskedSource, layoutObject.start + 1, blocksMatch.index) &&
          !/\btype\s*:\s*['"]blocks['"][\s\S]*$/.test(
            source.slice(layoutObject.start, blocksMatch.index),
          ))
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

  // Payload's current website starter nests the field metadata between the
  // `name` and `blocks` properties; use the field's explicit type as a
  // bounded fallback when delimiter ancestry is obscured by that nesting.
  const layoutField = /name\s*:\s*['"]layout['"][\s\S]{0,1200}?type\s*:\s*['"]blocks['"][\s\S]{0,400}?blocks\s*:\s*\[/m.exec(source)
  if (layoutField && layoutField.index !== undefined) {
    const start = maskedSource.indexOf('[', layoutField.index)
    const end = findMatchingDelimiter({ close: ']', maskedSource, open: '[', start })
    if (start !== -1 && end !== -1 && start > pagesObject.start) return { start, end }
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
  describeMissingAnchor,
  isPresent,
  line,
  source,
}: {
  anchor: string
  /* Consumer-file callers pass this to replace the bare anchor error with one
     naming the file and the edits. Omitted for files this CLI wrote itself,
     where the shape is known and the bare message is already precise. */
  describeMissingAnchor?: () => string
  isPresent?: (source: string) => boolean
  line: string
  source: string
}) => {
  if (isPresent ? isPresent(source) : source.split('\n').includes(line)) {
    return source
  }

  const anchorIndex = findTopLevelAnchor(source, anchor)

  if (anchorIndex === -1) {
    throw new Error(describeMissingAnchor?.() ?? `Unable to find insertion anchor "${anchor}".`)
  }

  const lineStart = source.lastIndexOf('\n', anchorIndex - 1) + 1

  return `${source.slice(0, lineStart)}${line}\n${source.slice(lineStart)}`
}

/* Locate a named import so it can be narrowed or dropped. Returns the brace
   span (to rewrite the specifier list) and the statement span (to delete the
   whole line when the removed name was the only specifier). */
const findNamedImportRange = ({
  importName,
  importPath,
  source,
}: {
  importName: string
  importPath: string
  source: string
}) => {
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

    if (quoteEnd === -1 || source.slice(quoteStart + 1, quoteEnd) !== importPath) {
      continue
    }

    const braceStart = maskedSource.indexOf('{', match.index)
    const braceEnd = maskedSource.indexOf('}', braceStart + 1)

    if (braceStart === -1 || braceEnd === -1) {
      continue
    }

    let statementEnd = quoteEnd + 1

    if (source[statementEnd] === ';') {
      statementEnd += 1
    }

    return { braceEnd, braceStart, statementEnd, statementStart: match.index }
  }

  return undefined
}

/* Grow a span to swallow the line it sits on, but only when the span is alone
   on that line — never take a neighbour's code with it. */
const expandToOwnLine = ({
  end,
  maskedSource,
  source,
  start,
}: {
  end: number
  maskedSource: string
  source: string
  start: number
}) => {
  const lineStart = source.lastIndexOf('\n', start - 1) + 1
  const expandedStart = source.slice(lineStart, start).trim() === '' ? lineStart : start
  let cursor = end

  while (maskedSource[cursor] === ' ' || maskedSource[cursor] === '\t') {
    cursor += 1
  }

  if (maskedSource[cursor] === '\r') {
    cursor += 1
  }

  if (maskedSource[cursor] === '\n') {
    return { end: cursor + 1, start: expandedStart }
  }

  return { end, start }
}

const removeNamedImport = ({
  importName,
  importPath,
  source,
}: {
  importName: string
  importPath: string
  source: string
}) => {
  const range = findNamedImportRange({ importName, importPath, source })

  if (!range) {
    return source
  }

  const remainingSpecifiers = source
    .slice(range.braceStart + 1, range.braceEnd)
    .split(',')
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .filter(
      (specifier) => specifier !== importName && !specifier.startsWith(`${importName} as `),
    )

  if (remainingSpecifiers.length > 0) {
    return `${source.slice(0, range.braceStart + 1)} ${remainingSpecifiers.join(', ')} ${source.slice(range.braceEnd)}`
  }

  const { end, start } = expandToOwnLine({
    end: range.statementEnd,
    maskedSource: maskIgnoredSource(source),
    source,
    start: range.statementStart,
  })

  return `${source.slice(0, start)}${source.slice(end)}`
}

const removeRenderBlocksFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>,
) => {
  const objectRange = findRenderBlocksObject(source)
  let sourceWithoutEntry = source

  if (objectRange) {
    const maskedSource = maskIgnoredSource(source)
    const entryPattern = new RegExp(
      `\\b${escapeRegExp(fragment.blockSlug)}\\s*:\\s*${escapeRegExp(fragment.importName)}\\b`,
      'g',
    )

    for (const match of maskedSource.matchAll(entryPattern)) {
      if (
        typeof match.index !== 'number' ||
        match.index <= objectRange.start ||
        match.index >= objectRange.end ||
        !isDirectlyWithin(maskedSource, objectRange.start + 1, match.index)
      ) {
        continue
      }

      let entryEnd = match.index + match[0].length

      while (maskedSource[entryEnd] === ' ' || maskedSource[entryEnd] === '\t') {
        entryEnd += 1
      }

      if (maskedSource[entryEnd] === ',') {
        entryEnd += 1
      }

      const { end, start } = expandToOwnLine({
        end: entryEnd,
        maskedSource,
        source,
        start: match.index,
      })

      sourceWithoutEntry = `${source.slice(0, start)}${source.slice(end)}`
      break
    }
  }

  return removeNamedImport({
    importName: fragment.importName,
    importPath: fragment.importPath,
    source: sourceWithoutEntry,
  })
}

const removePagesLayoutFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>,
) => {
  const blocksRange = findPagesLayoutBlocks(source)
  let sourceWithoutEntry = source

  if (blocksRange) {
    const currentEntries = source
      .slice(blocksRange.start + 1, blocksRange.end)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)

    if (currentEntries.includes(fragment.blockName)) {
      const replacement = currentEntries
        .filter((entry) => entry !== fragment.blockName)
        .join(', ')

      sourceWithoutEntry = `${source.slice(0, blocksRange.start + 1)}${replacement}${source.slice(blocksRange.end)}`
    }
  }

  return removeNamedImport({
    importName: fragment.importName,
    importPath: fragment.importPath,
    source: sourceWithoutEntry,
  })
}

/* Anchor failures are the likeliest way a real consumer project stalls: the file
   is present, the CLI refuses to guess at a shape it does not recognize, and the
   user is left holding an install that stopped halfway. Naming only the anchor
   makes that a research task. Name the file, what was missing, and the exact
   lines the install would have written, so the fallback is a paste. */
const describeFragmentFailure = ({
  edits,
  filePath,
  missing,
}: {
  edits: string[]
  filePath: string
  missing: string
}) =>
  [
    `Unable to wire ${filePath}: ${missing}. The file was left unchanged.`,
    'Apply these edits by hand, then re-run this command:',
    ...edits.map((edit) => `  ${edit}`),
  ].join('\n')

const applyRenderBlocksFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'renderBlocks' }>,
  filePath: string,
) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const propertyLine = `  ${fragment.blockSlug}: ${fragment.importName},`
  const describeFailure = (missing: string) =>
    describeFragmentFailure({
      edits: [importLine, `${propertyLine.trim()}  <- inside the blockComponents object`],
      filePath,
      missing,
    })
  const sourceWithImport = insertLineBeforeAnchor({
    anchor: renderBlocksAnchor,
    describeMissingAnchor: () =>
      describeFailure(`the insertion anchor "${renderBlocksAnchor}" is missing`),
    isPresent: (current) => hasNamedImport(current, fragment.importName, fragment.importPath),
    line: importLine,
    source,
  })
  const objectRange = findRenderBlocksObject(sourceWithImport)

  if (!objectRange) {
    throw new Error(describeFailure('the blockComponents object could not be read'))
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

  /* An empty object written as `= {}` puts its closing brace on the same line as
     its opening one, so there is no line above the brace to insert into —
     inserting there would put the entry above the declaration and produce a file
     that does not parse. Break the object open instead. */
  if (sourceWithImport.slice(closingLineStart, objectRange.end).trim() !== '') {
    return `${sourceWithImport.slice(0, objectRange.end)}\n${propertyLine}\n${sourceWithImport.slice(objectRange.end)}`
  }

  return `${sourceWithImport.slice(0, closingLineStart)}${propertyLine}\n${sourceWithImport.slice(closingLineStart)}`
}

const applyPagesLayoutFragment = (
  source: string,
  fragment: Extract<PayloadFragment, { kind: 'pagesLayout' }>,
  filePath: string,
) => {
  const importLine = `import { ${fragment.importName} } from '${fragment.importPath}'`
  const describeFailure = (missing: string) =>
    describeFragmentFailure({
      edits: [
        importLine,
        `${fragment.blockName}  <- added to the "layout" field's blocks: [] list`,
      ],
      filePath,
      missing,
    })
  const sourceWithImport = insertLineBeforeAnchor({
    anchor: pagesAnchor,
    describeMissingAnchor: () => describeFailure(`the insertion anchor "${pagesAnchor}" is missing`),
    isPresent: (current) => hasNamedImport(current, fragment.importName, fragment.importPath),
    line: importLine,
    source,
  })
  const blocksRange = findPagesLayoutBlocks(sourceWithImport)

  if (!blocksRange) {
    throw new Error(
      describeFailure('the "layout" field\'s blocks: [] list could not be read'),
    )
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

const fileExists = async (absolutePath: string) => {
  try {
    await access(absolutePath)
    return true
  } catch {
    return false
  }
}

/* Every entry must resolve; an array entry is satisfied by any one of its paths. */
const hasRequiredFiles = async ({ cwd, requiredFiles }: { cwd: string; requiredFiles: RequiredFile[] }) => {
  for (const requirement of requiredFiles) {
    const candidates = Array.isArray(requirement) ? requirement : [requirement]
    const matches = await Promise.all(
      candidates.map((candidate) => fileExists(path.join(cwd, candidate))),
    )

    if (!matches.includes(true)) {
      return false
    }
  }

  return true
}

/* First candidate that both exists and carries every anchor. Anchors are what
 * make the text-based patching safe, so a file at the right path with the wrong
 * shape is not a match. */
const resolveHostFile = async ({
  cwd,
  requirement,
}: {
  cwd: string
  requirement: HostFileRequirement
}) => {
  for (const candidate of requirement.candidates) {
    const content = await readFile(path.join(cwd, candidate), 'utf8').catch(() => undefined)

    if (content === undefined) {
      continue
    }

    if (requirement.anchors.every((anchor) => content.includes(anchor))) {
      return candidate
    }
  }

  return undefined
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

    if (!(await hasRequiredFiles({ cwd, requiredFiles: target.requiredFiles }))) {
      continue
    }

    const pagesLayout = await resolveHostFile({ cwd, requirement: target.hostFiles.pagesLayout })
    const renderBlocks = await resolveHostFile({ cwd, requirement: target.hostFiles.renderBlocks })

    if (!pagesLayout || !renderBlocks) {
      continue
    }

    return {
      cwd,
      hostFiles: { pagesLayout, renderBlocks },
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

  const supportedShapes = supportMatrix.targets
    .map(
      (target) =>
        `  ${target.id}: a blocks renderer at ${target.hostFiles.renderBlocks.candidates.join(' or ')} containing "${target.hostFiles.renderBlocks.anchors.join('", "')}", and a Pages collection at ${target.hostFiles.pagesLayout.candidates.join(' or ')} with a blocks-typed "layout" field.`,
    )
    .join('\n')

  throw new Error(
    `Unsupported project shape in ${cwd}. The install flow supports these shapes:\n${supportedShapes}`,
  )
}

const LOCALIZE_HELPER_FILE = 'src/blocks/shared/localizeFields.ts'
const LOCALIZE_IMPORT_PATH = '@/blocks/shared/localizeFields'
const LOCALIZE_HELPER = 'localizeFields'

export { LOCALIZE_HELPER_FILE }

/* Wrap an installed block config's field list in localizeFields(...). The
   anchor is a file this CLI wrote, so the shape is known: one exported
   `Block` object with a top-level `fields:` array. Already-wrapped configs are
   returned untouched so --localized stays idempotent across re-runs. */
export const localizeBlockConfigSource = (source: string) => {
  const blockObject = findTopLevelObject(
    source,
    /\bexport\s+const\s+\w+\s*:\s*Block\s*=\s*\{/g,
  )

  if (!blockObject) {
    throw new Error('Unable to find an exported Payload Block object to localize.')
  }

  const maskedSource = maskIgnoredSource(source)
  const fieldsPattern = /\bfields\s*:\s*/g
  let bracketStart = -1

  for (const match of maskedSource.matchAll(fieldsPattern)) {
    if (
      typeof match.index !== 'number' ||
      match.index <= blockObject.start ||
      match.index >= blockObject.end ||
      !isDirectlyWithin(maskedSource, blockObject.start + 1, match.index)
    ) {
      continue
    }

    const valueStart = match.index + match[0].length

    /* Already wrapped (or wrapped in some other helper) — leave it alone. */
    if (maskedSource[valueStart] !== '[') {
      return source
    }

    bracketStart = valueStart
    break
  }

  if (bracketStart === -1) {
    throw new Error('Unable to find the block config fields array to localize.')
  }

  const bracketEnd = findMatchingDelimiter({
    close: ']',
    maskedSource,
    open: '[',
    start: bracketStart,
  })

  if (bracketEnd === -1) {
    throw new Error('Unable to find the end of the block config fields array.')
  }

  const withWrappedFields = `${source.slice(0, bracketStart)}${LOCALIZE_HELPER}(${source.slice(
    bracketStart,
    bracketEnd + 1,
  )})${source.slice(bracketEnd + 1)}`

  if (hasNamedImport(withWrappedFields, LOCALIZE_HELPER, LOCALIZE_IMPORT_PATH)) {
    return withWrappedFields
  }

  return insertLineBeforeAnchor({
    anchor: 'export const',
    line: `import { ${LOCALIZE_HELPER} } from '${LOCALIZE_IMPORT_PATH}'\n`,
    source: withWrappedFields,
  })
}

/* Turn installed block configs into localized ones. Only files that look like a
   block config are touched; shared field bases are covered automatically because
   they are spread into the wrapped array. */
export const applyLocalizedFields = async ({
  configFiles,
  cwd,
}: {
  configFiles: string[]
  cwd: string
}) => {
  const patchedFiles: string[] = []

  for (const projectPath of configFiles) {
    const filePath = getAbsolutePath(cwd, projectPath)
    const existing = await readFile(filePath, 'utf8')
    const updated = localizeBlockConfigSource(existing)

    if (updated !== existing) {
      await writeFile(filePath, updated, 'utf8')
      patchedFiles.push(projectPath)
    }
  }

  return normalizeFileList(patchedFiles)
}

export const isBlockConfigFile = (projectPath: string) => projectPath.endsWith('/config.ts')

/* Every path a target may require, with any-of groups flattened. Used for
   display and for picking the candidate a project actually has on disk. */
export const flattenRequiredFiles = (requiredFiles: RequiredFile[]) =>
  requiredFiles.flatMap((requirement) => (Array.isArray(requirement) ? requirement : [requirement]))

export const findExistingRequiredFile = async ({
  cwd,
  pattern,
  requiredFiles,
}: {
  cwd: string
  pattern: RegExp
  requiredFiles: RequiredFile[]
}) => {
  const candidates = flattenRequiredFiles(requiredFiles).filter((filePath) =>
    pattern.test(filePath.replaceAll('\\', '/')),
  )

  for (const candidate of candidates) {
    if (await fileExists(path.join(cwd, candidate))) {
      return candidate
    }
  }

  return undefined
}

/* Manifests declare the canonical starter paths in recovery.patchedFiles. Map
 * them onto wherever this project actually keeps those files so recorded state
 * and doctor output point at real paths. */
export const resolveRecoveryPatchedFiles = ({
  hostFiles,
  recoveryPatchedFiles,
}: {
  hostFiles: ResolvedHostFiles
  recoveryPatchedFiles: string[]
}) =>
  normalizeFileList(
    recoveryPatchedFiles.map((filePath) => {
      if (filePath === RENDER_BLOCKS_FILE) {
        return hostFiles.renderBlocks
      }

      if (filePath === PAGES_LAYOUT_FILE) {
        return hostFiles.pagesLayout
      }

      return filePath
    }),
  )

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

export const applyPayloadFragments = async (
  cwd: string,
  fragments: PayloadFragment[],
  hostFiles: ResolvedHostFiles = CANONICAL_HOST_FILES,
) => {
  const touchedFiles = new Set<string>()

  for (const fragment of fragments) {
    if (fragment.kind === 'renderBlocks') {
      const filePath = getAbsolutePath(cwd, hostFiles.renderBlocks)
      const existing = await readFile(filePath, 'utf8')
      const updated = applyRenderBlocksFragment(existing, fragment, hostFiles.renderBlocks)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
      }

      touchedFiles.add(hostFiles.renderBlocks)
    }

    if (fragment.kind === 'pagesLayout') {
      const filePath = getAbsolutePath(cwd, hostFiles.pagesLayout)
      const existing = await readFile(filePath, 'utf8')
      const updated = applyPagesLayoutFragment(existing, fragment, hostFiles.pagesLayout)

      if (updated !== existing) {
        await writeFile(filePath, updated, 'utf8')
      }

      touchedFiles.add(hostFiles.pagesLayout)
    }
  }

  return normalizeFileList([...touchedFiles])
}

/* Exact inverse of applyPayloadFragments: unregister the block and drop the
   import it added. Missing wiring is not an error — removal has to be as
   idempotent as install, so a half-removed repo can be finished off safely. */
export const removePayloadFragments = async (
  cwd: string,
  fragments: PayloadFragment[],
  hostFiles: ResolvedHostFiles = CANONICAL_HOST_FILES,
) => {
  const touchedFiles = new Set<string>()

  for (const fragment of fragments) {
    const projectPath =
      fragment.kind === 'renderBlocks' ? hostFiles.renderBlocks : hostFiles.pagesLayout
    const filePath = getAbsolutePath(cwd, projectPath)
    const existing = await readFile(filePath, 'utf8')
    const updated =
      fragment.kind === 'renderBlocks'
        ? removeRenderBlocksFragment(existing, fragment)
        : removePagesLayoutFragment(existing, fragment)

    if (updated !== existing) {
      await writeFile(filePath, updated, 'utf8')
      touchedFiles.add(projectPath)
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
  hostFiles = CANONICAL_HOST_FILES,
  manifest,
}: {
  cwd: string
  hostFiles?: ResolvedHostFiles
  manifest: Pick<ComponentManifest, 'payloadFragments'>
}) => {
  const missingFragments: string[] = []

  for (const fragment of manifest.payloadFragments) {
    if (fragment.kind === 'renderBlocks') {
      const renderBlocksSource = await readFile(getAbsolutePath(cwd, hostFiles.renderBlocks), 'utf8')

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
      const pagesSource = await readFile(getAbsolutePath(cwd, hostFiles.pagesLayout), 'utf8')

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
