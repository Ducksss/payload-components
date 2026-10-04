/* Payload localization, both halves.
 *
 * Field level: wrap an installed block config's top-level `fields` array in
 * localizeFields(...). Config level: insert, replace, or read back the
 * `localization` block in the consumer's buildConfig({ ... }) call. Both anchor
 * with the masking scanner in source-scanner.ts. */

import type { DelimiterRange } from './source-scanner'

import { getAbsolutePath, normalizeFileList } from './project-paths'
import { readSafeProjectFile } from './safe-path'
import {
  findBuildConfigObject,
  findDirectArrayEntries,
  findDirectProperty,
  findDirectShorthand,
  findLastDirectSpread,
  findMatchingDelimiter,
  findTopLevelObject,
  hasNamedImport,
  insertLineBeforeAnchor,
  isDirectValueTerminated,
  isDirectlyWithin,
  maskIgnoredSource,
} from './source-scanner'
import { commitFileChanges } from './utils'

const LOCALIZE_HELPER_FILE = 'src/blocks/shared/localizeFields.ts'
const LOCALIZE_IMPORT_PATH = '@/blocks/shared/localizeFields'
const LOCALIZE_HELPER = 'localizeFields'

export { LOCALIZE_HELPER_FILE }

/* Wrap an installed block config's field list in localizeFields(...). The
   anchor is a file this CLI wrote, so the shape is known: one exported
   `Block` object with a top-level `fields:` array. Already-wrapped configs are
   returned untouched so --localized stays idempotent across re-runs. */
export const localizeBlockConfigSource = (source: string) => {
  const blockObject = findTopLevelObject(source, /\bexport\s+const\s+\w+\s*:\s*Block\s*=\s*\{/g)

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

      if (helperCall && hasNamedImport(source, LOCALIZE_HELPER, LOCALIZE_IMPORT_PATH)) {
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
  const changes: Array<{ content: string; filePath: string }> = []
  const patchedFiles: string[] = []

  for (const projectPath of configFiles) {
    const filePath = getAbsolutePath(cwd, projectPath)
    const existing = await readSafeProjectFile({ cwd, filePath })
    const updated = localizeBlockConfigSource(existing)

    if (updated !== existing) {
      changes.push({ content: updated, filePath })
      patchedFiles.push(projectPath)
    }
  }

  await commitFileChanges(changes, { cwd })

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

  const shadowedBySpread = lastDirectSpread !== undefined && lastDirectSpread > property.start

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

  if (lastContentIndex > configObject.start && maskedSource[lastContentIndex] !== ',') {
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
  const defaultLocale =
    effectiveDefaultProperty && !defaultComputedBySpread
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
