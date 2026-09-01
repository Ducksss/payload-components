// @vitest-environment node

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { createTranslator } from 'next-intl'
import { describe, expect, it } from 'vitest'

import {
  localeAlternates,
  localeDetails,
  localizeHref,
  siteLocales,
  splitLocalePathname,
} from '../../src/i18n/config'
import { componentCategories, composerAddLabel, composerRemoveLabel } from '../../src/lib/site'

const repoRoot = process.cwd()

interface Messages {
  [key: string]: string | Messages
}

function flattenMessages(messages: Messages, prefix = ''): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages).flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      return typeof value === 'string'
        ? [[fullKey, value]]
        : Object.entries(flattenMessages(value, fullKey))
    }),
  )
}

function messageArguments(message: string) {
  return [...message.matchAll(/\{([A-Za-z][\w-]*)/g)].map((match) => match[1]).sort()
}

describe('site internationalization', () => {
  it('keeps the supported locale contract explicit', () => {
    expect(siteLocales).toEqual(['en', 'zh'])
    expect(localeDetails.en.htmlLang).toBe('en')
    expect(localeDetails.zh.htmlLang).toBe('zh-CN')
    expect(localeDetails.zh.openGraphLocale).toBe('zh_CN')
  })

  it('adds and removes the Chinese prefix without changing URL suffixes', () => {
    expect(splitLocalePathname('/docs')).toEqual({ locale: 'en', pathname: '/docs' })
    expect(splitLocalePathname('/zh')).toEqual({ locale: 'zh', pathname: '/' })
    expect(splitLocalePathname('/zh/docs')).toEqual({ locale: 'zh', pathname: '/docs' })

    expect(localizeHref('/docs?tab=cli#install', 'zh')).toBe('/zh/docs?tab=cli#install')
    expect(localizeHref('/zh/docs?tab=cli#install', 'en')).toBe('/docs?tab=cli#install')
    expect(localizeHref('/zh/docs?tab=cli#install', 'zh')).toBe('/zh/docs?tab=cli#install')
    expect(localizeHref('/r/hero-basic.json', 'zh')).toBe('/r/hero-basic.json')
    expect(localizeHref('/api/search?q=hero', 'zh')).toBe('/api/search?q=hero')
    expect(localizeHref('https://github.com/Ducksss/payload-components', 'zh')).toBe(
      'https://github.com/Ducksss/payload-components',
    )
  })

  it('publishes English, Chinese, and default alternates for localized routes', () => {
    expect(localeAlternates('/docs/installation')).toEqual({
      en: '/docs/installation',
      'zh-CN': '/zh/docs/installation',
      'x-default': '/docs/installation',
    })
  })

  it('keeps every English and Chinese message key and argument in parity', async () => {
    const [englishMessages, chineseMessages] = await Promise.all(
      siteLocales.map(async (locale) => {
        const source = await readFile(path.join(repoRoot, 'messages', `${locale}.json`), 'utf8')
        return JSON.parse(source) as Messages
      }),
    )
    const english = flattenMessages(englishMessages)
    const chinese = flattenMessages(chineseMessages)
    const englishKeys = Object.keys(english).sort()
    const chineseKeys = Object.keys(chinese).sort()

    expect(chineseKeys).toEqual(englishKeys)
    expect(englishKeys.length).toBeGreaterThan(100)

    for (const key of englishKeys) {
      expect(chinese[key], key).not.toBe('')
      expect(messageArguments(chinese[key]), key).toEqual(messageArguments(english[key]))
    }

    expect(chinese['Header.language']).toBe('语言')
    expect(chinese['Landing.hero.accent']).toBe('接好线，不只是复制。')
    expect(chinese['CatalogBrowser.search']).toBe('搜索组件')

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

  it('wires next-intl, Fumadocs fallback, request routing, and locale-aware links together', async () => {
    const [nextConfig, requestConfig, proxy, rootLayout, docsI18n, localizedLink, sitemap] =
      await Promise.all([
        readFile(path.join(repoRoot, 'next.config.mjs'), 'utf8'),
        readFile(path.join(repoRoot, 'src/i18n/request.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/proxy.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/app/layout.tsx'), 'utf8'),
        readFile(path.join(repoRoot, 'src/lib/i18n.ts'), 'utf8'),
        readFile(path.join(repoRoot, 'src/i18n/Link.tsx'), 'utf8'),
        readFile(path.join(repoRoot, 'src/app/sitemap.ts'), 'utf8'),
      ])

    expect(nextConfig).toContain('createNextIntlPlugin')
    expect(requestConfig).toContain('getRequestConfig')
    expect(proxy).toContain('localeRequestHeader')
    expect(proxy).toContain("if (locale === 'zh') return rewrite(pathname)")
    expect(rootLayout).toContain('NextIntlClientProvider')
    expect(rootLayout).toContain('localeDetails[locale].htmlLang')
    expect(docsI18n).toContain("hideLocale: 'default-locale'")
    expect(docsI18n).toContain("fallbackLanguage: 'en'")
    expect(localizedLink).toContain('localizeHref')
    expect(sitemap).toContain("'zh-CN': `${siteUrl}${localizeHref(path, 'zh')}`")
  })
})
