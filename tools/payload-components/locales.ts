/* The locale table behind `payload-components localize`.
 *
 * Payload accepts any string as a locale code, so this catalog is a convenience,
 * not a constraint: it supplies the native `label` an editor sees in the admin
 * locale switcher, and the `rtl` flag for the scripts that need it. A code that
 * is not listed still installs — it just labels itself, and the printed report
 * says so, because inventing an English name for someone's locale is worse than
 * leaving a one-word edit for them.
 *
 * Labels are written in the language they name. That is the whole point of the
 * switcher: an editor looking for Chinese is looking for 简体中文, not "Chinese
 * (Simplified)". */

export type LocaleDefinition = {
  code: string
  label: string
  /* Only set when true, so the rendered config stays quiet for the 90% case. */
  rtl?: boolean
}

export const LOCALE_CATALOG: readonly LocaleDefinition[] = [
  { code: 'en', label: 'English' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'zh', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'es-MX', label: 'Español (México)' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'sv', label: 'Svenska' },
  { code: 'da', label: 'Dansk' },
  { code: 'nb', label: 'Norsk bokmål' },
  { code: 'fi', label: 'Suomi' },
  { code: 'cs', label: 'Čeština' },
  { code: 'sk', label: 'Slovenčina' },
  { code: 'hu', label: 'Magyar' },
  { code: 'ro', label: 'Română' },
  { code: 'bg', label: 'Български' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'ca', label: 'Català' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'he', label: 'עברית', rtl: true },
  { code: 'fa', label: 'فارسی', rtl: true },
  { code: 'ur', label: 'اردو', rtl: true },
]

/* Locale codes end up inside generated TypeScript, so the shape is validated
 * rather than trusted: a loose BCP-47 subset (`en`, `zh-TW`, `es-419`) catches
 * typos and makes it impossible for an argument to break out of the string
 * literal it is written into. Casing is not part of the check — a catalog match
 * canonicalizes it, and an unlisted code is written exactly as typed. Payload
 * itself would accept more; nothing real is excluded. */
const LOCALE_CODE_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z\d]{2,8})*$/

const catalogByCode = new Map(LOCALE_CATALOG.map((locale) => [locale.code, locale]))

/* Case-insensitive lookup so `--locales EN,zh-tw` resolves, while the code that
 * lands in the config is always the catalog's canonical casing. */
const catalogByLowercaseCode = new Map(
  LOCALE_CATALOG.map((locale) => [locale.code.toLowerCase(), locale]),
)

export const findCatalogLocale = (code: string) =>
  catalogByCode.get(code) ?? catalogByLowercaseCode.get(code.toLowerCase())

export type ResolvedLocales = {
  defaultLocale: string
  /* Codes with no catalog entry, so callers can say which labels are guesses. */
  unlabelled: string[]
  locales: LocaleDefinition[]
}

export const parseLocaleCodes = (value: string) => {
  const codes = value
    .split(',')
    .map((code) => code.trim())
    .filter((code) => code.length > 0)

  if (codes.length === 0) {
    throw new Error('--locales needs at least one locale code, e.g. --locales en,zh.')
  }

  for (const code of codes) {
    if (!LOCALE_CODE_PATTERN.test(code)) {
      throw new Error(
        `"${code}" is not a usable locale code. Use a language tag like "en", "zh", or "pt-BR".`,
      )
    }
  }

  /* Deduplicate on the canonical code, so `--locales en,EN` is one locale
   * rather than a config Payload would reject. */
  const seen = new Map<string, string>()

  for (const code of codes) {
    const canonical = findCatalogLocale(code)?.code ?? code

    if (!seen.has(canonical.toLowerCase())) {
      seen.set(canonical.toLowerCase(), canonical)
    }
  }

  return [...seen.values()]
}

export const resolveLocales = ({
  codes,
  defaultLocale,
}: {
  codes: string[]
  defaultLocale?: string
}): ResolvedLocales => {
  const locales = codes.map((code) => {
    const known = findCatalogLocale(code)

    return known ? { ...known } : { code, label: code }
  })
  const resolvedDefault = defaultLocale
    ? (findCatalogLocale(defaultLocale)?.code ?? defaultLocale)
    : locales[0]?.code

  if (!resolvedDefault) {
    throw new Error('Localization needs at least one locale.')
  }

  if (!locales.some((locale) => locale.code === resolvedDefault)) {
    throw new Error(
      `--default-locale "${defaultLocale}" is not in the locale list (${codes.join(', ')}). Payload requires the default locale to be one of the configured locales.`,
    )
  }

  return {
    defaultLocale: resolvedDefault,
    locales,
    unlabelled: locales.filter((locale) => !findCatalogLocale(locale.code)).map(({ code }) => code),
  }
}

/* Single quotes and no trailing semicolons to match what the rest of the
 * installer writes into consumer projects. The escape is belt-and-braces: no
 * catalog label contains a quote, and codes are pattern-checked above. */
const quote = (value: string) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const renderLocaleEntry = (locale: LocaleDefinition) =>
  [
    `{ code: ${quote(locale.code)}`,
    `label: ${quote(locale.label)}`,
    ...(locale.rtl ? ['rtl: true'] : []),
  ].join(', ') + ' }'

export const renderLocalizationBlock = ({
  defaultLocale,
  fallback,
  indent = '  ',
  locales,
}: {
  defaultLocale: string
  fallback: boolean
  indent?: string
  locales: LocaleDefinition[]
}) =>
  [
    `${indent}localization: {`,
    `${indent}  defaultLocale: ${quote(defaultLocale)},`,
    `${indent}  fallback: ${fallback ? 'true' : 'false'},`,
    `${indent}  locales: [`,
    ...locales.map((locale) => `${indent}    ${renderLocaleEntry(locale)},`),
    `${indent}  ],`,
    `${indent}},`,
  ].join('\n')

export const formatLocaleList = (locales: LocaleDefinition[]) =>
  locales.map((locale) => `${locale.code} (${locale.label})`).join(', ')
