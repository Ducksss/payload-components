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
import { readSafeProjectFile, safeProjectFileExists, writeSafeProjectFile } from './safe-path'
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
  /* Against the original source, never the in-memory patched copy: nothing is
     written when a fragment fails, so an import this run would have added is
     still absent on disk. Listing one the file already has would have the user
     paste a duplicate. */
  const hasImportOnDisk = hasNamedImport(source, fragment.importName, fragment.importPath)
  const describeFailure = (missing: string) =>
    describeFragmentFailure({
      edits: [
        ...(hasImportOnDisk ? [] : [importLine]),
        `${propertyLine.trim()}  <- inside the blockComponents object`,
      ],
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
  const hasImportOnDisk = hasNamedImport(source, fragment.importName, fragment.importPath)
  const describeFailure = (missing: string) =>
    describeFragmentFailure({
      edits: [
        ...(hasImportOnDisk ? [] : [importLine]),
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

/* Every entry must resolve; an array entry is satisfied by any one of its paths. */
const hasRequiredFiles = async ({ cwd, requiredFiles }: { cwd: string; requiredFiles: RequiredFile[] }) => {
  for (const requirement of requiredFiles) {
    const candidates = Array.isArray(requirement) ? requirement : [requirement]
    const matches = await Promise.all(
      candidates.map((candidate) =>
        safeProjectFileExists({ cwd, filePath: path.join(cwd, candidate) }),
      ),
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
    const content = await readSafeProjectFile({
      cwd,
      filePath: path.join(cwd, candidate),
    }).catch(() => undefined)

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
  const packageJson = JSON.parse(
    await readSafeProjectFile({ cwd, filePath: path.join(cwd, 'package.json') }),
  ) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
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

  const componentsJsonPresent = await readSafeProjectFile({
    cwd,
    filePath: path.join(cwd, 'components.json'),
  })
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

    /* Only this CLI's own helper is an idempotent no-op. Treating an arbitrary
       transform as localized would let state bless bytes this command never
       changed. */
    if (maskedSource[valueStart] !== '[') {
      const helperCall = new RegExp(`^${LOCALIZE_HELPER}\\s*\\(`).exec(
        maskedSource.slice(valueStart),
      )

      if (
        helperCall &&
        hasNamedImport(source, LOCALIZE_HELPER, LOCALIZE_IMPORT_PATH)
      ) {
        const parenthesisStart = maskedSource.indexOf('(', valueStart)
        const parenthesisEnd = findMatchingDelimiter({
          close: ')',
          maskedSource,
          open: '(',
          start: parenthesisStart,
        })

        if (parenthesisEnd !== -1) {
          let afterCall = parenthesisEnd + 1

          while (/\s/.test(maskedSource[afterCall] ?? '')) afterCall += 1

          if (afterCall === blockObject.end || maskedSource[afterCall] === ',') {
            return source
          }
        }
      }

      throw new Error(
        `Unable to localize the block config fields because they are not an array or an imported ${LOCALIZE_HELPER}(...) call.`,
      )
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
    const existing = await readSafeProjectFile({ cwd, filePath })
    const updated = localizeBlockConfigSource(existing)

    if (updated !== existing) {
      await writeSafeProjectFile({ contents: updated, cwd, filePath })
      patchedFiles.push(projectPath)
    }
  }

  return normalizeFileList(patchedFiles)
}

export const isBlockConfigFile = (projectPath: string) => projectPath.endsWith('/config.ts')

/* ---------------------------------------------------------------------------
 * Config-level localization
 *
 * `localized: true` on a field does nothing until the Payload config declares
 * which locales exist, so `payload-components localize` patches both halves.
 * Same rules as every other patch in this file: text-anchored, idempotent, and
 * it reports rather than rewrites anything whose shape it cannot read. */

const findBuildConfigObject = (source: string) =>
  findTopLevelObject(source, /\bbuildConfig\s*\(\s*\{/g)

/* The indentation the object's own properties use, so an inserted block lines
 * up with its neighbours instead of with this file's assumptions. */
const detectObjectIndent = (source: string, objectStart: number) => {
  const firstLineBreak = source.indexOf('\n', objectStart)

  if (firstLineBreak === -1) {
    return '  '
  }

  const [, indent] = /^([ \t]+)\S/.exec(source.slice(firstLineBreak + 1)) ?? []

  return indent ?? '  '
}

/* Find an identifier or ordinary quoted key directly inside an object. String
 * contents are masked, so quoted keys are recovered from the original source
 * by offset instead of making every string visible to structural matching. */
const findDirectProperty = ({
  object,
  propertyName,
  source,
}: {
  object: DelimiterRange
  propertyName: string
  source: string
}) => {
  const maskedSource = maskIgnoredSource(source)
  const candidates: Array<{ start: number; valueStart: number }> = []
  const identifierPattern = new RegExp(`\\b${escapeRegExp(propertyName)}\\s*:\\s*`, 'g')

  for (const match of maskedSource.matchAll(identifierPattern)) {
    if (
      typeof match.index === 'number' &&
      match.index > object.start &&
      match.index < object.end &&
      isDirectlyWithin(maskedSource, object.start + 1, match.index)
    ) {
      candidates.push({ start: match.index, valueStart: match.index + match[0].length })
    }
  }

  for (const match of maskedSource.matchAll(/(['"])([ \t]*)\1\s*:\s*/g)) {
    if (
      typeof match.index !== 'number' ||
      match.index <= object.start ||
      match.index >= object.end ||
      !isDirectlyWithin(maskedSource, object.start + 1, match.index)
    ) {
      continue
    }

    const quoteEnd = match.index + 1 + match[2].length

    if (source.slice(match.index + 1, quoteEnd) === propertyName) {
      candidates.push({ start: match.index, valueStart: match.index + match[0].length })
    }
  }

  return candidates.sort((left, right) => left.start - right.start).at(-1)
}

const findDirectShorthand = ({
  object,
  propertyName,
  source,
}: {
  object: DelimiterRange
  propertyName: string
  source: string
}) => {
  const maskedSource = maskIgnoredSource(source)
  const pattern = new RegExp(`\\b${escapeRegExp(propertyName)}\\b`, 'g')
  let shorthand: { start: number; valueStart: number } | undefined

  for (const match of maskedSource.matchAll(pattern)) {
    if (
      typeof match.index !== 'number' ||
      match.index <= object.start ||
      match.index >= object.end ||
      !isDirectlyWithin(maskedSource, object.start + 1, match.index)
    ) {
      continue
    }

    let before = match.index - 1
    let after = match.index + match[0].length

    while (/\s/.test(maskedSource[before] ?? '')) before -= 1
    while (/\s/.test(maskedSource[after] ?? '')) after += 1

    if (
      (maskedSource[before] === '{' || maskedSource[before] === ',') &&
      (maskedSource[after] === ',' || maskedSource[after] === '}')
    ) {
      shorthand = { start: match.index, valueStart: match.index }
    }
  }

  return shorthand
}

const isDirectValueTerminated = ({
  containerEnd,
  maskedSource,
  valueEnd,
}: {
  containerEnd: number
  maskedSource: string
  valueEnd: number
}) => {
  let cursor = valueEnd + 1

  while (/\s/.test(maskedSource[cursor] ?? '')) cursor += 1

  return cursor === containerEnd || maskedSource[cursor] === ','
}

const findLastDirectSpread = ({ object, source }: { object: DelimiterRange; source: string }) => {
  const maskedSource = maskIgnoredSource(source)
  let lastSpread: number | undefined

  for (const spread of maskedSource.matchAll(/\.\.\./g)) {
    if (
      typeof spread.index === 'number' &&
      spread.index > object.start &&
      spread.index < object.end &&
      isDirectlyWithin(maskedSource, object.start + 1, spread.index)
    ) {
      lastSpread = spread.index
    }
  }

  return lastSpread
}

/* The `localization:` property directly inside buildConfig({ ... }), its value
 * span, and whether a comma follows after ignored comments or whitespace. */
const findLocalizationProperty = ({
  configObject,
  source,
}: {
  configObject: DelimiterRange
  source: string
}) => {
  const maskedSource = maskIgnoredSource(source)
  const lastDirectSpread = findLastDirectSpread({ object: configObject, source })
  const property = findDirectProperty({
    object: configObject,
    propertyName: 'localization',
    source,
  })
  const shorthand = findDirectShorthand({
    object: configObject,
    propertyName: 'localization',
    source,
  })

  if (shorthand && (!property || shorthand.start > property.start)) {
    return {
      readable: false as const,
      shadowedBySpread: lastDirectSpread !== undefined && lastDirectSpread > shorthand.start,
      ...shorthand,
    }
  }

  if (!property) {
    return undefined
  }

  const shadowedBySpread =
    lastDirectSpread !== undefined && lastDirectSpread > property.start

  if (maskedSource[property.valueStart] !== '{') {
    /* `localization: localizationConfig`, `true`, or `false`. Replacing a value
     * that is not an object literal remains an explicit refusal. */
    return { readable: false as const, shadowedBySpread, ...property }
  }

  const valueEnd = findMatchingDelimiter({
    close: '}',
    maskedSource,
    open: '{',
    start: property.valueStart,
  })

  if (valueEnd === -1) {
    return { readable: false as const, shadowedBySpread, ...property }
  }

  let commaIndex = valueEnd + 1

  while (/\s/.test(maskedSource[commaIndex] ?? '')) {
    commaIndex += 1
  }

  if (
    !isDirectValueTerminated({
      containerEnd: configObject.end,
      maskedSource,
      valueEnd,
    }) ||
    shadowedBySpread
  ) {
    /* Assertions such as `as const` are part of the value, and a later spread
     * can replace this property at runtime. Neither shape is safe to rewrite
     * as though the balanced object literal were the complete declaration. */
    return { readable: false as const, shadowedBySpread, ...property }
  }

  return {
    end: valueEnd + 1,
    hasTrailingComma: maskedSource[commaIndex] === ',',
    readable: true as const,
    ...property,
    valueEnd,
  }
}

export type LocalizationConfigPatch =
  | { block: string; kind: 'patched'; source: string }
  | { block: string; kind: 'replaced'; previous: string; source: string }
  /* `matches` distinguishes "already exactly this" (a clean no-op) from
   * "something else is configured" (needs an explicit --force). */
  | { existing: string; kind: 'already-configured'; matches: boolean }
  | { kind: 'existing-unreadable' }
  | { kind: 'no-build-config' }

/* Insert (or, with force, replace) the localization block in a Payload config.
 * The block is rendered by the caller so the locale table stays in one place. */
export const setPayloadLocalization = ({
  force = false,
  renderBlock,
  source,
}: {
  force?: boolean
  /* Called with the object's own indentation once it is known. */
  renderBlock: (indent: string) => string
  source: string
}): LocalizationConfigPatch => {
  const configObject = findBuildConfigObject(source)

  if (!configObject) {
    return { kind: 'no-build-config' }
  }

  const indent = detectObjectIndent(source, configObject.start)
  const block = renderBlock(indent)
  const existingProperty = findLocalizationProperty({ configObject, source })

  if (existingProperty && !existingProperty.readable) {
    return { kind: 'existing-unreadable' }
  }

  if (existingProperty?.readable) {
    const previous = source.slice(existingProperty.start, existingProperty.end).trimEnd()
    const replacementWithComma = block.trimStart()
    const replacementWithoutComma = replacementWithComma.replace(/,$/, '')

    const matches = previous === replacementWithoutComma

    if (matches || !force) {
      return { existing: previous, kind: 'already-configured', matches }
    }

    const replacement = existingProperty.hasTrailingComma
      ? replacementWithoutComma
      : replacementWithComma

    return {
      block,
      kind: 'replaced',
      previous,
      source: `${source.slice(0, existingProperty.start)}${replacement}${source.slice(
        existingProperty.end,
      )}`,
    }
  }

  /* Append after every existing property so a trailing spread cannot override
     the localization block this command just wrote. */
  const maskedSource = maskIgnoredSource(source)
  let closingIndex = configObject.end
  let lastContentIndex = closingIndex - 1
  let sourceWithComma = source

  while (/\s/.test(maskedSource[lastContentIndex] ?? '')) {
    lastContentIndex -= 1
  }

  if (
    lastContentIndex > configObject.start &&
    maskedSource[lastContentIndex] !== ','
  ) {
    sourceWithComma = `${source.slice(0, lastContentIndex + 1)},${source.slice(
      lastContentIndex + 1,
    )}`
    closingIndex += 1
  }

  const closingLineStart = sourceWithComma.lastIndexOf('\n', closingIndex - 1) + 1
  const closingLinePrefix = sourceWithComma.slice(closingLineStart, closingIndex)
  const closingOnOwnLine = closingLinePrefix.trim() === ''
  const insertAt = closingOnOwnLine ? closingLineStart : closingIndex
  const prefix = closingOnOwnLine ? '' : '\n'
  const suffix = `\n${sourceWithComma.slice(insertAt)}`

  return {
    block,
    kind: 'patched',
    source: `${sourceWithComma.slice(0, insertAt)}${prefix}${block}${suffix}`,
  }
}

export type ReadLocalization = {
  defaultLocale?: string
  defaultLocaleStatus: 'absent' | 'computed' | 'literal'
  disabled: boolean
  fallback?: boolean
  locales: string[]
  /* True when `locales` is the complete set, read straight from source. False
   * when the config declares localization but does not spell the locales out —
   * `locales: getLocales()`, or a whole `localization: config` reference. The
   * empty list then means "cannot tell", not "none", and the two must not be
   * confused: a project whose locales are computed at runtime is localized, and
   * telling it otherwise would both nag it and refuse to wrap its blocks. */
  localesEnumerable: boolean
  localesStatus: 'absent' | 'computed' | 'literal'
}

const trimIgnoredRange = (maskedSource: string, start: number, end: number) => {
  while (start < end && /\s/.test(maskedSource[start])) start += 1
  while (end > start && /\s/.test(maskedSource[end - 1])) end -= 1

  return { end, start }
}

const readDirectString = ({
  containerEnd,
  maskedSource,
  source,
  valueStart,
}: {
  containerEnd: number
  maskedSource: string
  source: string
  valueStart: number
}) => {
  const quote = maskedSource[valueStart]

  if (quote !== "'" && quote !== '"') {
    return undefined
  }

  const quoteEnd = maskedSource.indexOf(quote, valueStart + 1)

  if (
    quoteEnd === -1 ||
    !isDirectValueTerminated({ containerEnd, maskedSource, valueEnd: quoteEnd })
  ) {
    return undefined
  }

  const value = source.slice(valueStart + 1, quoteEnd)

  return value.includes('\\') ? undefined : value
}

const findDirectArrayEntries = ({
  end,
  maskedSource,
  start,
}: {
  end: number
  maskedSource: string
  start: number
}) => {
  const entries: DelimiterRange[] = []
  let entryStart = start + 1

  for (let cursor = entryStart; cursor < end; cursor += 1) {
    if (
      maskedSource[cursor] === ',' &&
      isDirectlyWithin(maskedSource, start + 1, cursor)
    ) {
      const entry = trimIgnoredRange(maskedSource, entryStart, cursor)

      if (entry.start < entry.end) entries.push(entry)
      entryStart = cursor + 1
    }
  }

  const lastEntry = trimIgnoredRange(maskedSource, entryStart, end)

  if (lastEntry.start < lastEntry.end) entries.push(lastEntry)

  return entries
}

/* A literal locale array is enumerable only when every direct entry has one
 * statically readable code. Any spread or computed entry makes the whole set
 * runtime-computed; returning a known prefix as complete would be worse than
 * returning no count. */
const readLiteralLocaleArray = ({
  end,
  source,
  start,
}: {
  end: number
  source: string
  start: number
}) => {
  const maskedSource = maskIgnoredSource(source)
  const locales: string[] = []

  for (const entry of findDirectArrayEntries({ end, maskedSource, start })) {
    const directString = readDirectString({
      containerEnd: entry.end,
      maskedSource,
      source,
      valueStart: entry.start,
    })

    if (directString !== undefined) {
      locales.push(directString)
      continue
    }

    if (maskedSource[entry.start] !== '{') {
      return undefined
    }

    const objectEnd = findMatchingDelimiter({
      close: '}',
      maskedSource,
      open: '{',
      start: entry.start,
    })

    if (objectEnd !== entry.end - 1) {
      return undefined
    }

    const object = { end: objectEnd, start: entry.start }

    for (const spread of maskedSource.matchAll(/\.\.\./g)) {
      if (
        typeof spread.index === 'number' &&
        spread.index > object.start &&
        spread.index < object.end &&
        isDirectlyWithin(maskedSource, object.start + 1, spread.index)
      ) {
        return undefined
      }
    }

    const codeProperty = findDirectProperty({ object, propertyName: 'code', source })
    const code = codeProperty
      ? readDirectString({
          containerEnd: object.end,
          maskedSource,
          source,
          valueStart: codeProperty.valueStart,
        })
      : undefined

    if (code === undefined) {
      return undefined
    }

    locales.push(code)
  }

  return locales
}

/* Read back what the config declares, for reporting only — doctor says how many
 * locales a project has, and localize prints the set it is about to keep. */
export const readPayloadLocalization = (source: string): ReadLocalization | undefined => {
  const configObject = findBuildConfigObject(source)

  if (!configObject) {
    return undefined
  }

  const property = findLocalizationProperty({ configObject, source })

  if (!property) {
    return undefined
  }

  if (!property.readable) {
    const disabled =
      !property.shadowedBySpread &&
      /^false\b/.test(maskIgnoredSource(source).slice(property.valueStart))

    return {
      defaultLocaleStatus: disabled ? 'absent' : 'computed',
      disabled,
      locales: [],
      localesEnumerable: disabled,
      localesStatus: disabled ? 'absent' : 'computed',
    }
  }

  const maskedSource = maskIgnoredSource(source)
  const object = { end: property.valueEnd, start: property.valueStart }
  const lastSpread = findLastDirectSpread({ object, source })
  const defaultProperty = findDirectProperty({
    object,
    propertyName: 'defaultLocale',
    source,
  })
  const defaultShorthand = findDirectShorthand({
    object,
    propertyName: 'defaultLocale',
    source,
  })
  const effectiveDefaultProperty =
    defaultShorthand && (!defaultProperty || defaultShorthand.start > defaultProperty.start)
      ? undefined
      : defaultProperty
  const defaultComputedBySpread =
    lastSpread !== undefined &&
    (!effectiveDefaultProperty || effectiveDefaultProperty.start < lastSpread)
  const defaultLocale = effectiveDefaultProperty && !defaultComputedBySpread
    ? readDirectString({
        containerEnd: object.end,
        maskedSource,
        source,
        valueStart: effectiveDefaultProperty.valueStart,
      })
    : undefined
  const defaultLocaleStatus = defaultComputedBySpread
    ? 'computed'
    : !effectiveDefaultProperty
    ? defaultShorthand
      ? 'computed'
      : 'absent'
    : defaultLocale === undefined
      ? 'computed'
      : 'literal'
  const fallbackProperty = findDirectProperty({ object, propertyName: 'fallback', source })
  const fallbackShorthand = findDirectShorthand({ object, propertyName: 'fallback', source })
  const fallbackValue =
    fallbackProperty &&
    (!fallbackShorthand || fallbackProperty.start > fallbackShorthand.start) &&
    (lastSpread === undefined || fallbackProperty.start > lastSpread)
    ? /^(true|false)\b/.exec(maskedSource.slice(fallbackProperty.valueStart))?.[1]
    : undefined
  const localesProperty = findDirectProperty({ object, propertyName: 'locales', source })
  const localesShorthand = findDirectShorthand({ object, propertyName: 'locales', source })
  const effectiveLocalesProperty =
    localesShorthand && (!localesProperty || localesShorthand.start > localesProperty.start)
      ? undefined
      : localesProperty
  const localesComputedBySpread =
    lastSpread !== undefined &&
    (!effectiveLocalesProperty || effectiveLocalesProperty.start < lastSpread)
  let locales: string[] = []
  let localesStatus: ReadLocalization['localesStatus'] = localesComputedBySpread
    ? 'computed'
    : effectiveLocalesProperty
    ? 'computed'
    : localesShorthand
      ? 'computed'
      : 'absent'

  if (effectiveLocalesProperty && !localesComputedBySpread) {
    if (maskedSource[effectiveLocalesProperty.valueStart] === '[') {
      const arrayEnd = findMatchingDelimiter({
        close: ']',
        maskedSource,
        open: '[',
        start: effectiveLocalesProperty.valueStart,
      })

      if (
        arrayEnd !== -1 &&
        isDirectValueTerminated({
          containerEnd: object.end,
          maskedSource,
          valueEnd: arrayEnd,
        })
      ) {
        const literalLocales = readLiteralLocaleArray({
          end: arrayEnd,
          source,
          start: effectiveLocalesProperty.valueStart,
        })

        if (literalLocales) {
          locales = literalLocales
          localesStatus = 'literal'
        }
      }
    }
  }

  return {
    ...(defaultLocale ? { defaultLocale } : {}),
    defaultLocaleStatus,
    disabled: false,
    ...(fallbackValue ? { fallback: fallbackValue === 'true' } : {}),
    locales,
    localesEnumerable: localesStatus !== 'computed',
    localesStatus,
  }
}

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
    if (await safeProjectFileExists({ cwd, filePath: path.join(cwd, candidate) })) {
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
      const existing = await readSafeProjectFile({ cwd, filePath })
      const updated = applyRenderBlocksFragment(existing, fragment, hostFiles.renderBlocks)

      if (updated !== existing) {
        await writeSafeProjectFile({ contents: updated, cwd, filePath })
      }

      touchedFiles.add(hostFiles.renderBlocks)
    }

    if (fragment.kind === 'pagesLayout') {
      const filePath = getAbsolutePath(cwd, hostFiles.pagesLayout)
      const existing = await readSafeProjectFile({ cwd, filePath })
      const updated = applyPagesLayoutFragment(existing, fragment, hostFiles.pagesLayout)

      if (updated !== existing) {
        await writeSafeProjectFile({ contents: updated, cwd, filePath })
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
    const existing = await readSafeProjectFile({ cwd, filePath })
    const updated =
      fragment.kind === 'renderBlocks'
        ? removeRenderBlocksFragment(existing, fragment)
        : removePagesLayoutFragment(existing, fragment)

    if (updated !== existing) {
      await writeSafeProjectFile({ contents: updated, cwd, filePath })
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
    if (!(await safeProjectFileExists({ cwd, filePath: getAbsolutePath(cwd, filePath) }))) {
      missingFiles.push(filePath)
    }
  }

  for (const dependency of manifest.registryDependencies ?? []) {
    if (
      !(await safeProjectFileExists({
        cwd,
        filePath: getAbsolutePath(cwd, dependency.targetFile),
      }))
    ) {
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
      const renderBlocksSource = await readSafeProjectFile({
        cwd,
        filePath: getAbsolutePath(cwd, hostFiles.renderBlocks),
      })

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
      const pagesSource = await readSafeProjectFile({
        cwd,
        filePath: getAbsolutePath(cwd, hostFiles.pagesLayout),
      })

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
