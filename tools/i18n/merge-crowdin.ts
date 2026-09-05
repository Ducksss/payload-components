import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  flattenMessages,
  loadCatalogs,
  translatedSiteLocales,
  validateCatalogs,
  type FlatMessages,
  type MessageTree,
} from './catalog'
import { translationRegressions } from './translation-regressions'

export function mergeCrowdinMessages(
  english: FlatMessages,
  previous: FlatMessages,
  downloaded: FlatMessages,
): FlatMessages {
  // Preserve translations absent from a sparse export; remove obsolete source
  // keys, but retain unknown downloaded keys so validation can reject them.
  return {
    ...Object.fromEntries(Object.entries(previous).filter(([key]) => key in english)),
    ...downloaded,
  }
}

function unflatten(messages: FlatMessages): MessageTree {
  const tree: MessageTree = {}
  for (const [key, value] of Object.entries(messages)) {
    const segments = key.split('.')
    let node = tree
    for (const segment of segments.slice(0, -1)) {
      // Source identifiers cannot escape the object or create prototype keys.
      if (['__proto__', 'prototype', 'constructor'].includes(segment))
        throw new Error(`Invalid key: ${key}`)
      node[segment] ??= {}
      if (typeof node[segment] === 'string') throw new Error(`Conflicting key: ${key}`)
      node = node[segment] as MessageTree
    }
    const leaf = segments.at(-1)!
    if (['__proto__', 'prototype', 'constructor'].includes(leaf))
      throw new Error(`Invalid key: ${key}`)
    node[leaf] = value
  }
  return tree
}

export async function mergeCrowdinExport(baselineRoot: string, cwd = process.cwd()) {
  const baseline = await loadCatalogs(baselineRoot)
  const english = flattenMessages(
    JSON.parse(await readFile(path.join(cwd, 'messages/en.json'), 'utf8')),
  )
  const catalogs = {} as typeof baseline.catalogs
  const errors: string[] = []
  for (const locale of translatedSiteLocales) {
    const file = path.join(cwd, 'messages/locales', `${locale}.json`)
    const downloaded = await readFile(file, 'utf8')
      .then((value) => flattenMessages(JSON.parse(value)))
      .catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return {}
        throw error
      })
    catalogs[locale] = mergeCrowdinMessages(english, baseline.catalogs[locale], downloaded)
    errors.push(
      ...translationRegressions({
        english,
        previousEnglish: baseline.english,
        previous: baseline.catalogs[locale],
        next: catalogs[locale],
        locale,
      }),
    )
  }
  errors.push(...validateCatalogs(english, catalogs))
  if (errors.length)
    throw new Error(`Crowdin export rejected before publication:\n${errors.join('\n')}`)
  for (const locale of translatedSiteLocales) {
    await writeFile(
      path.join(cwd, 'messages/locales', `${locale}.json`),
      `${JSON.stringify(unflatten(catalogs[locale]), null, 2)}\n`,
    )
  }
}
