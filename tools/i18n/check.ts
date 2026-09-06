import { loadCatalogs, validateCatalogs } from './catalog'

const { catalogs, english } = await loadCatalogs()
const errors = validateCatalogs(english, catalogs)

if (errors.length) {
  console.error('Translation catalog check failed:\n')
  for (const error of errors) console.error(`- ${error}`)
  console.error('\nUpdate the matching messages/locales/*.json files or sync them through Crowdin.')
  process.exitCode = 1
} else {
  console.log(
    `Translation catalogs are structurally valid: ${Object.keys(english).length} keys across ${Object.keys(catalogs).length} locales.`,
  )
}
