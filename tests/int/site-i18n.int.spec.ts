// @vitest-environment node

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { createTranslator } from 'next-intl'
import { describe, expect, it } from 'vitest'

import {
  isLocaleNeutralPath,
  localeAlternates,
  localeDetails,
  localizeHref,
  siteLocales,
  splitLocalePathname,
} from '../../src/i18n/config'
import { getSiteMessages } from '../../src/i18n/message-catalog'
import { getPublication, publicationRobots } from '../../src/i18n/publication'
import { componentCategories, composerAddLabel, composerRemoveLabel } from '../../src/lib/site'
import { flattenMessages, loadCatalogs, validateCatalogs } from '../../tools/i18n/catalog'

const repoRoot = process.cwd()

interface Messages {
  [key: string]: string | Messages
}

function messageArguments(message: string) {
  return [...message.matchAll(/\{([A-Za-z][\w-]*)/g)].map((match) => match[1]).sort()
}

describe('site internationalization', () => {
  it('keeps the supported locale contract explicit', () => {
    expect(siteLocales).toEqual([
      'en',
      'ar',
      'zh',
      'pl',
      'th',
      'de',
      'pt',
      'id',
      'es',
      'fr',
      'he',
      'tr',
      'nl',
      'uk',
      'vi',
      'it',
      'ja',
      'ko',
      'sr',
      'hu',
      'et',
      'fi',
    ])
    expect(localeDetails.en.htmlLang).toBe('en')
    expect(localeDetails.zh.htmlLang).toBe('zh-CN')
    expect(localeDetails.zh.openGraphLocale).toBe('zh_CN')
    expect(localeDetails.ar.direction).toBe('rtl')
    expect(localeDetails.he.direction).toBe('rtl')
    expect(localeDetails.ja.label).toBe('日本語')
  })

  it('adds, replaces, and removes locale prefixes without changing URL suffixes', () => {
    expect(splitLocalePathname('/docs')).toEqual({ locale: 'en', pathname: '/docs' })
    expect(splitLocalePathname('/en/docs')).toEqual({ locale: 'en', pathname: '/docs' })
    expect(splitLocalePathname('/zh')).toEqual({ locale: 'zh', pathname: '/' })
    expect(splitLocalePathname('/zh/docs')).toEqual({ locale: 'zh', pathname: '/docs' })
    expect(splitLocalePathname('/ar/components')).toEqual({
      locale: 'ar',
      pathname: '/components',
    })

    expect(localizeHref('/docs?tab=cli#install', 'zh')).toBe('/zh/docs?tab=cli#install')
    expect(localizeHref('/zh/docs?tab=cli#install', 'en')).toBe('/docs?tab=cli#install')
    expect(localizeHref('/zh/docs?tab=cli#install', 'zh')).toBe('/zh/docs?tab=cli#install')
    expect(localizeHref('/zh/docs?tab=cli#install', 'ja')).toBe('/ja/docs?tab=cli#install')
    expect(localizeHref('/ar', 'pt')).toBe('/pt')
    expect(localizeHref('/r/hero-basic.json', 'zh')).toBe('/r/hero-basic.json')
    expect(localizeHref('/api/search?q=hero', 'zh')).toBe('/api/search?q=hero')
    expect(localizeHref('https://github.com/Ducksss/payload-components', 'zh')).toBe(
      'https://github.com/Ducksss/payload-components',
    )
  })

  it('only publishes native-reviewed languages as search alternates', () => {
    const alternates = localeAlternates('/docs/installation')

    expect(alternates).toEqual({
      en: '/docs/installation',
      'x-default': '/docs/installation',
    })
    expect(localeAlternates('/components', ['zh'])).toEqual({
      en: '/components',
      'zh-CN': '/zh/components',
      'x-default': '/components',
    })
  })

  it('keeps machine translations and English fallbacks honest per resource', () => {
    const machine = getPublication('/components', 'zh')
    const fallback = getPublication('/docs/installation', 'zh')
    const privacyFallback = getPublication('/privacy', 'ja')

    expect(machine).toMatchObject({
      canonical: '/zh/components',
      contentLocale: 'zh',
      index: false,
      status: 'machine',
    })
    expect(machine.alternates).toEqual({ en: '/components', 'x-default': '/components' })
    expect(publicationRobots(machine).index).toBe(false)

    expect(fallback).toMatchObject({
      canonical: '/docs/installation',
      contentLocale: 'en',
      index: false,
      status: 'fallback',
    })
    expect(fallback.alternates).toEqual({
      en: '/docs/installation',
      'x-default': '/docs/installation',
    })
    expect(privacyFallback).toMatchObject({
      canonical: '/privacy',
      contentLocale: 'en',
      index: false,
      status: 'fallback',
    })

    expect(isLocaleNeutralPath('/opengraph-image')).toBe(true)
    expect(isLocaleNeutralPath('/api/search')).toBe(true)
    expect(isLocaleNeutralPath('/og/blog/example/image.png')).toBe(false)
  })

  it('keeps every localized message key and argument in parity with English', async () => {
    const catalogs = await Promise.all(
      siteLocales.map(
        async (locale) => [locale, (await getSiteMessages(locale)) as Messages] as const,
      ),
    )
    const catalogByLocale = Object.fromEntries(catalogs) as Record<
      (typeof siteLocales)[number],
      Messages
    >
    const englishMessages = catalogByLocale.en
    const chineseMessages = catalogByLocale.zh
    const english = flattenMessages(englishMessages)
    const englishKeys = Object.keys(english).sort()

    expect(englishKeys.length).toBeGreaterThan(100)

    for (const locale of siteLocales.filter((item) => item !== 'en')) {
      const localized = flattenMessages(catalogByLocale[locale])
      expect(Object.keys(localized).sort(), locale).toEqual(englishKeys)

      for (const key of englishKeys) {
        expect(localized[key], `${locale}:${key}`).not.toBe('')
        expect(messageArguments(localized[key]), `${locale}:${key}`).toEqual(
          messageArguments(english[key]),
        )
      }
    }

    const chinese = flattenMessages(chineseMessages)
    expect(chinese['Header.language']).toBe('语言')
    expect(chinese['Landing.hero.accent']).toBe('接好线，不只是复制。')
    expect(chinese['CatalogBrowser.search']).toBe('搜索组件')
    expect(flattenMessages(catalogByLocale.ar)['Header.language']).toBe('اللغة')
    expect(flattenMessages(catalogByLocale.ja)['Common.copy']).toBe('コピー')

    for (const category of Object.keys(componentCategories)) {
      expect(english[`CatalogBrowser.categories.${category}`], category).toBeTruthy()
      expect(chinese[`CatalogBrowser.categories.${category}`], category).toBeTruthy()
    }

    const translate = createTranslator({ locale: 'en', messages: englishMessages }) as unknown as (
      key: string,
      values?: Record<string, string>,
    ) => string
    expect(translate('Catalog.metadataDescription')).toContain(
      'npx payload-components add <component>',
    )

    /* The catalog composer e2e finds these buttons by accessible name through
       composerAddLabel / composerRemoveLabel. The English message has to render
       the identical string, or the selection flow stops being covered without
       anything going red. */
    expect(translate('CatalogBrowser.composerAdd', { slug: 'hero-basic' })).toBe(
      composerAddLabel('hero-basic'),
    )
    expect(translate('CatalogBrowser.composerRemove', { slug: 'hero-basic' })).toBe(
      composerRemoveLabel('hero-basic'),
    )
    /* Copy control: the button label and its confirmed state are swapped in by
       CommandCopyController, and the e2e asserts both accessible names. */
    expect(translate('Common.copy')).toBe('Copy')
    expect(translate('Common.copied')).toBe('Copied')

    /* consent.e2e drives the privacy page's live consent control by its visible
       English text, and the analytics contract spec reads the disclosure out of
       this catalogue. Both break silently if the English wording drifts. */
    expect(translate('Privacy.settings.turnOff')).toBe('Turn analytics off')
    expect(translate('Privacy.settings.turnOn')).toBe('Turn analytics on')
    expect(translate('Privacy.settings.on')).toBe('Google Analytics and PostHog are currently on.')
    expect(translate('Privacy.settings.off')).toBe(
      'Google Analytics and PostHog are currently off.',
    )
  })

  it('keeps every Crowdin catalogue structurally compatible with English', async () => {
    const { catalogs, english } = await loadCatalogs(repoRoot)

    expect(validateCatalogs(english, catalogs)).toEqual([])
    expect(Object.keys(catalogs.zh)).toEqual(Object.keys(english))
    expect(Object.keys(catalogs)).toEqual(siteLocales.slice(1))
  })

  it('rejects translation transport markers before they reach a page', async () => {
    const { catalogs, english } = await loadCatalogs(repoRoot)
    const markedCatalogs = {
      ...catalogs,
      ja: { ...catalogs.ja, 'Header.language': '言語 <<<46 >>>' },
    }

    expect(validateCatalogs(english, markedCatalogs)).toContain(
      'ja:Header.language contains a translation transport marker',
    )
  })

  it('renders locale-specific plural categories instead of flattening ICU branches', async () => {
    const arabic = (await getSiteMessages('ar')) as Messages
    const polish = (await getSiteMessages('pl')) as Messages
    const translateArabic = createTranslator({ locale: 'ar', messages: arabic }) as unknown as (
      key: string,
      values: Record<string, number>,
    ) => string
    const translatePolish = createTranslator({ locale: 'pl', messages: polish }) as unknown as (
      key: string,
      values: Record<string, number>,
    ) => string

    expect(translateArabic('Landing.catalog.blockCount', { count: 0 })).toBe('لا كتل')
    expect(translateArabic('Landing.catalog.blockCount', { count: 2 })).toBe('كتلتان')
    expect(translatePolish('CatalogBrowser.result', { count: 5 })).toBe('5 wyników')
  })

  it('only registers reviewed documentation-shell translations', async () => {
    const docsI18n = await readFile(path.join(repoRoot, 'src/lib/i18n.ts'), 'utf8')

    expect(docsI18n).toContain("import { zhCN } from '@fumadocs/language/zh-cn'")
    expect(docsI18n).toContain('zh: { displayName: localeDetails.zh.label, ...zhTranslations }')
    expect(docsI18n).not.toContain('fumadocs.json')
    expect(docsI18n).not.toContain('translatedFumadocsUI')
  })

  it('wires next-intl, Fumadocs fallback, request routing, and locale-aware links together', async () => {
    const [nextConfig, requestConfig, proxy, rootLayout, docsI18n, localizedLink, sitemap] =
      await Promise.all([
        readFile(path.join(repoRoot, 'next.config.mjs'), 'utf8'),
        readFile(path.join(repoRoot, 'src/i18n/request.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/proxy.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/app/[locale]/layout.tsx'), 'utf8'),
        readFile(path.join(repoRoot, 'src/lib/i18n.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/i18n/Link.tsx'), 'utf8'),
        readFile(path.join(repoRoot, 'src/app/sitemap.ts'), 'utf8'),
      ])

    expect(nextConfig).toContain('createNextIntlPlugin')
    expect(requestConfig).toContain('getRequestConfig')
    expect(proxy).toContain('createMiddleware(routing)')
    expect(proxy).toContain('isLocaleNeutralPath(request.nextUrl.pathname)')
    expect(proxy).toContain("'/llms.mdx/:path*'")
    expect(proxy).toContain("'/og/:path*'")
    expect(proxy).toContain('new URL(`/${locale}${destination}`, request.nextUrl)')
    expect(rootLayout).toContain('NextIntlClientProvider')
    expect(rootLayout).toContain('localeDetails[locale].htmlLang')
    expect(docsI18n).toContain("hideLocale: 'default-locale'")
    expect(docsI18n).toContain("fallbackLanguage: 'en'")
    expect(localizedLink).toContain('localizeHref')
    expect(sitemap).toContain('localeAlternates(path)')
  })
})
