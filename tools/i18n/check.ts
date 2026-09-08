import { execFileSync } from 'node:child_process'
import { publishedSiteLocales } from '../../src/i18n/config'

import { flattenMessages, loadCatalogs, translatedSiteLocales, validateCatalogs } from './catalog'

import { translationRegressions } from './translation-regressions'

const { catalogs, english } = await loadCatalogs()
const includeDrafts = process.argv.includes('--drafts')
const locales = translatedSiteLocales.filter(
  (locale) => includeDrafts || publishedSiteLocales.includes(locale),
)
const errors = validateCatalogs(english, catalogs, locales)

const baseRef = process.env.I18N_BASE_REF
if (baseRef) {
  const readBase = (file: string) =>
    flattenMessages(
      JSON.parse(
        execFileSync('git', ['show', `${baseRef}:${file}`], {
          encoding: 'utf8',
          maxBuffer: 5_000_000,
        }),
      ),
    )
  const previousEnglish = readBase('messages/en.json')
  for (const locale of locales) {
    errors.push(
      ...translationRegressions({
        english,
        previousEnglish,
        previous: readBase(`messages/locales/${locale}.json`),
        next: catalogs[locale],
        locale,
      }),
    )
  }
}

if (errors.length) {
  console.error('Translation catalog check failed:\n')
  for (const error of errors) console.error(`- ${error}`)
  console.error('\nFix the source catalog or sync enabled translations through Crowdin.')
  process.exitCode = 1
} else {
  console.log(
    `Translation catalogs are structurally valid: ${Object.keys(english).length} English keys and ${locales.length} ${includeDrafts ? 'draft' : 'published'} translation catalogs.`,
  )
}
