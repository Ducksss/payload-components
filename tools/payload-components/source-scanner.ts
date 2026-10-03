/* The masking scanner behind the CLI's text-anchored patches and checks.
 *
 * Consumer files are read as text, never parsed into an AST. maskIgnoredSource
 * blanks comments and literal contents without moving any offset, and the
 * helpers below balance delimiters on that masked copy to find top-level
 * objects, imports, anchors and direct properties. Everything here is a pure
 * function of source text. The fragment patcher (payload-fragments.ts), the
 * localization patcher (payload-localization.ts) and the project checks in
 * project.ts share it. */

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
  let mode: 'blockComment' | 'code' | 'doubleQuote' | 'lineComment' | 'singleQuote' | 'template' =
    'code'

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
      const closingDelimiter = mode === 'singleQuote' ? "'" : mode === 'doubleQuote' ? '"' : '`'

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

const findBuildConfigObject = (source: string) =>
  findTopLevelObject(source, /\bbuildConfig\s*\(\s*\{/g)

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

const trimIgnoredRange = (maskedSource: string, start: number, end: number) => {
  while (start < end && /\s/.test(maskedSource[start])) start += 1
  while (end > start && /\s/.test(maskedSource[end - 1])) end -= 1

  return { end, start }
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
    if (maskedSource[cursor] === ',' && isDirectlyWithin(maskedSource, start + 1, cursor)) {
      const entry = trimIgnoredRange(maskedSource, entryStart, cursor)

      if (entry.start < entry.end) entries.push(entry)
      entryStart = cursor + 1
    }
  }

  const lastEntry = trimIgnoredRange(maskedSource, entryStart, end)

  if (lastEntry.start < lastEntry.end) entries.push(lastEntry)

  return entries
}

export type { DelimiterRange }

export {
  escapeRegExp,
  findBuildConfigObject,
  findDirectArrayEntries,
  findDirectProperty,
  findDirectShorthand,
  findLastDirectSpread,
  findMatchingDelimiter,
  findNamedImportRange,
  findTopLevelObject,
  hasNamedImport,
  insertLineBeforeAnchor,
  isDirectValueTerminated,
  isDirectlyWithin,
  maskIgnoredSource,
}
