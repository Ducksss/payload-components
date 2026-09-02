import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { parse, TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser'

import {
  defaultSiteLocale,
  localeDetails,
  siteLocales,
  type SiteLocale,
} from '../../src/i18n/config'

export type FlatMessages = Record<string, string>
export type MessageTree = { [key: string]: MessageTree | string }

export const translatedSiteLocales = siteLocales.filter(
  (locale): locale is Exclude<SiteLocale, 'en'> => locale !== defaultSiteLocale,
)

export const catalogPaths = (repoRoot = process.cwd()) => ({
  english: path.join(repoRoot, 'messages', 'en.json'),
  locales: path.join(repoRoot, 'messages', 'locales'),
})

export function flattenMessages(messages: MessageTree, prefix = ''): FlatMessages {
  return Object.fromEntries(
    Object.entries(messages).flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      return typeof value === 'string'
        ? [[fullKey, value]]
        : Object.entries(flattenMessages(value, fullKey))
    }),
  )
}

function keyDifference(actual: string[], expected: string[]) {
  const expectedSet = new Set(expected)
  return actual.filter((key) => !expectedSet.has(key))
}

type MessageShape = {
  arguments: Set<string>
  plurals: Map<string, { ordinal: boolean; options: Set<string> }>
  selects: Map<string, Set<string>>
  tags: Set<string>
}

function inspectElements(elements: MessageFormatElement[], shape: MessageShape) {
  for (const element of elements) {
    switch (element.type) {
      case TYPE.argument:
        shape.arguments.add(`argument:${element.value}`)
        break
      case TYPE.number:
        shape.arguments.add(`number:${element.value}`)
        break
      case TYPE.date:
        shape.arguments.add(`date:${element.value}`)
        break
      case TYPE.time:
        shape.arguments.add(`time:${element.value}`)
        break
      case TYPE.select:
        shape.arguments.add(`select:${element.value}`)
        shape.selects.set(element.value, new Set(Object.keys(element.options)))
        for (const option of Object.values(element.options)) inspectElements(option.value, shape)
        break
      case TYPE.plural:
        shape.arguments.add(`plural:${element.value}`)
        shape.plurals.set(element.value, {
          ordinal: element.pluralType === 'ordinal',
          options: new Set(Object.keys(element.options)),
        })
        for (const option of Object.values(element.options)) inspectElements(option.value, shape)
        break
      case TYPE.tag:
        shape.tags.add(element.value)
        inspectElements(element.children, shape)
        break
    }
  }
}

function inspectMessage(message: string): MessageShape {
  const shape: MessageShape = {
    arguments: new Set(),
    plurals: new Map(),
    selects: new Map(),
    tags: new Set(),
  }
  inspectElements(parse(message), shape)
  return shape
}

function sameSet(left: Set<string>, right: Set<string>) {
  return [...left].sort().join('\0') === [...right].sort().join('\0')
}

function validateMessage(
  errors: string[],
  english: string,
  localized: string,
  locale: Exclude<SiteLocale, 'en'>,
  location: string,
) {
  try {
    const source = inspectMessage(english)
    const target = inspectMessage(localized)

    if (!sameSet(source.arguments, target.arguments)) {
      errors.push(`${location} changes ICU argument names or types`)
    }
    if (!sameSet(source.tags, target.tags)) {
      errors.push(`${location} changes rich-text tags`)
    }

    for (const [name, sourceOptions] of source.selects) {
      const targetOptions = target.selects.get(name)
      if (!targetOptions || !sameSet(sourceOptions, targetOptions)) {
        errors.push(`${location} changes select branches for {${name}}`)
      }
    }

    for (const [name, sourcePlural] of source.plurals) {
      const targetPlural = target.plurals.get(name)
      if (!targetPlural) continue
      if (sourcePlural.ordinal !== targetPlural.ordinal) {
        errors.push(`${location} changes the plural type for {${name}}`)
        continue
      }
      if (!targetPlural.options.has('other')) {
        errors.push(`${location} plural {${name}} is missing its other branch`)
      }

      const rules = new Intl.PluralRules(localeDetails[locale].htmlLang, {
        type: targetPlural.ordinal ? 'ordinal' : 'cardinal',
      }).resolvedOptions().pluralCategories
      for (const category of rules) {
        if (!targetPlural.options.has(category)) {
          errors.push(
            `${location} plural {${name}} is missing the ${category} branch for ${locale}`,
          )
        }
      }
    }
  } catch (error) {
    errors.push(
      `${location} is not valid ICU: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export function validateCatalogs(
  english: FlatMessages,
  catalogs: Record<Exclude<SiteLocale, 'en'>, FlatMessages>,
): string[] {
  const errors: string[] = []
  const englishKeys = Object.keys(english)

  for (const locale of translatedSiteLocales) {
    const localized = catalogs[locale] ?? {}
    const localizedKeys = Object.keys(localized)

    for (const key of keyDifference(localizedKeys, englishKeys)) {
      errors.push(`${locale}:${key} has no English source message`)
    }
    for (const key of keyDifference(englishKeys, localizedKeys)) {
      errors.push(`${locale}:${key} is missing`)
    }

    for (const key of englishKeys) {
      const value = localized[key]
      if (!value?.trim()) {
        errors.push(`${locale}:${key} is empty`)
        continue
      }
      validateMessage(errors, english[key], value, locale, `${locale}:${key}`)
    }
  }

  return errors
}

export async function loadCatalogs(repoRoot = process.cwd()) {
  const paths = catalogPaths(repoRoot)
  const [englishSource, ...localeSources] = await Promise.all([
    readFile(paths.english, 'utf8'),
    ...translatedSiteLocales.map((locale) =>
      readFile(path.join(paths.locales, `${locale}.json`), 'utf8'),
    ),
  ])
  const englishTree = JSON.parse(englishSource) as MessageTree
  const localeTrees = Object.fromEntries(
    translatedSiteLocales.map((locale, index) => [
      locale,
      JSON.parse(localeSources[index]) as MessageTree,
    ]),
  ) as Record<Exclude<SiteLocale, 'en'>, MessageTree>

  return {
    catalogs: Object.fromEntries(
      translatedSiteLocales.map((locale) => [locale, flattenMessages(localeTrees[locale])]),
    ) as Record<Exclude<SiteLocale, 'en'>, FlatMessages>,
    english: flattenMessages(englishTree),
    englishTree,
    localeTrees,
    paths,
  }
}
