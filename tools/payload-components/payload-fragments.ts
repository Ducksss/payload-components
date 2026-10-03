/* Payload fragment wiring: register an installed block in the consumer's
 * RenderBlocks map and in the Pages layout field's blocks list, remove that
 * wiring again, and verify it is in place.
 *
 * Patching is text-anchored with a dedup check before every insert, so a re-run
 * is a no-op. When an anchor is missing the file is left unchanged and the error
 * names the exact edits to make by hand. Callers pass the host files that
 * detectProject resolved; the canonical starter paths are the default. */

import type { ComponentManifest, PayloadFragment, ResolvedHostFiles } from './types'
import type { DelimiterRange } from './source-scanner'

import { CANONICAL_HOST_FILES, getAbsolutePath, normalizeFileList } from './project-paths'
import { readSafeProjectFile } from './safe-path'
import {
  escapeRegExp,
  findMatchingDelimiter,
  findNamedImportRange,
  findTopLevelObject,
  hasNamedImport,
  insertLineBeforeAnchor,
  isDirectlyWithin,
  maskIgnoredSource,
} from './source-scanner'
import { commitFileChanges } from './utils'

const renderBlocksAnchor = 'const blockComponents = {'
const pagesAnchor = 'export const Pages: CollectionConfig'

const findRenderBlocksObject = (source: string) =>
  findTopLevelObject(source, /\bconst\s+blockComponents\s*=\s*\{/g)

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

    if (!layoutObject || !isDirectlyWithin(maskedSource, layoutObject.start + 1, match.index)) {
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
  const layoutField =
    /name\s*:\s*['"]layout['"][\s\S]{0,1200}?type\s*:\s*['"]blocks['"][\s\S]{0,400}?blocks\s*:\s*\[/m.exec(
      source,
    )
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
    .filter((specifier) => specifier !== importName && !specifier.startsWith(`${importName} as `))

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
      const replacement = currentEntries.filter((entry) => entry !== fragment.blockName).join(', ')

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
    describeMissingAnchor: () =>
      describeFailure(`the insertion anchor "${pagesAnchor}" is missing`),
    isPresent: (current) => hasNamedImport(current, fragment.importName, fragment.importPath),
    line: importLine,
    source,
  })
  const blocksRange = findPagesLayoutBlocks(sourceWithImport)

  if (!blocksRange) {
    throw new Error(describeFailure('the "layout" field\'s blocks: [] list could not be read'))
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

export const applyPayloadFragments = async (
  cwd: string,
  fragments: PayloadFragment[],
  hostFiles: ResolvedHostFiles = CANONICAL_HOST_FILES,
) => {
  const touchedFiles = new Set<string>()
  const originalSources = new Map<string, string>()
  const sources = new Map<string, string>()

  for (const fragment of fragments) {
    const projectPath =
      fragment.kind === 'renderBlocks' ? hostFiles.renderBlocks : hostFiles.pagesLayout
    const filePath = getAbsolutePath(cwd, projectPath)
    const existing =
      sources.get(projectPath) ?? (await readSafeProjectFile({ cwd, filePath }))
    originalSources.set(projectPath, originalSources.get(projectPath) ?? existing)
    const updated =
      fragment.kind === 'renderBlocks'
        ? applyRenderBlocksFragment(existing, fragment, hostFiles.renderBlocks)
        : applyPagesLayoutFragment(existing, fragment, hostFiles.pagesLayout)

    sources.set(projectPath, updated)
    touchedFiles.add(projectPath)
  }

  await commitFileChanges(
    [...sources.entries()]
      .filter(([projectPath, content]) => content !== originalSources.get(projectPath))
      .map(([projectPath, content]) => ({
        content,
        filePath: getAbsolutePath(cwd, projectPath),
      })),
    { cwd },
  )

  return normalizeFileList([...touchedFiles])
}

/* Exact inverse of applyPayloadFragments: unregister the block and drop the
   import it added. Missing wiring is not an error — removal has to be as
   idempotent as install, so a half-removed repo can be finished off safely. */
export const preparePayloadFragmentRemoval = async (
  cwd: string,
  fragments: PayloadFragment[],
  hostFiles: ResolvedHostFiles = CANONICAL_HOST_FILES,
) => {
  const touchedFiles = new Set<string>()
  const originalSources = new Map<string, string>()
  const sources = new Map<string, string>()

  for (const fragment of fragments) {
    const projectPath =
      fragment.kind === 'renderBlocks' ? hostFiles.renderBlocks : hostFiles.pagesLayout
    const filePath = getAbsolutePath(cwd, projectPath)
    const existing =
      sources.get(projectPath) ?? (await readSafeProjectFile({ cwd, filePath }))
    originalSources.set(projectPath, originalSources.get(projectPath) ?? existing)
    const updated =
      fragment.kind === 'renderBlocks'
        ? removeRenderBlocksFragment(existing, fragment)
        : removePagesLayoutFragment(existing, fragment)

    if (updated !== existing) {
      sources.set(projectPath, updated)
      touchedFiles.add(projectPath)
    }
  }

  const changes = [...sources.entries()]
    .filter(([projectPath, content]) => content !== originalSources.get(projectPath))
    .map(([projectPath, content]) => ({
      content,
      filePath: getAbsolutePath(cwd, projectPath),
    }))

  return { changes, touchedFiles: normalizeFileList([...touchedFiles]) }
}

export const removePayloadFragments = async (
  cwd: string,
  fragments: PayloadFragment[],
  hostFiles: ResolvedHostFiles = CANONICAL_HOST_FILES,
) => {
  const prepared = await preparePayloadFragmentRemoval(cwd, fragments, hostFiles)

  await commitFileChanges(prepared.changes, { cwd })

  return prepared.touchedFiles
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
