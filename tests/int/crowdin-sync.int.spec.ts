import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { getSiteMessages } from '../../src/i18n/message-catalog'
import { componentEntries, upcomingComponents } from '../../src/lib/component-catalog'
import { flattenMessages, loadCatalogs, validateCatalogs } from '../../tools/i18n/catalog'
import { mergeCrowdinExport, mergeCrowdinMessages } from '../../tools/i18n/merge-crowdin'
import { translationRegressions } from '../../tools/i18n/translation-regressions'

const dirs: string[] = []
afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('Crowdin export safety', () => {
  it('preserves omitted translations, replaces translated values, and drops retired keys', () => {
    expect(
      mergeCrowdinMessages(
        { title: 'Hello', description: 'World' },
        { title: '你好', description: '世界', retired: '旧' },
        { title: '您好' },
      ),
    ).toEqual({ title: '您好', description: '世界' })
  })

  it('treats Crowdin JSON empty values as untranslated while retaining unknown keys for validation', () => {
    expect(
      mergeCrowdinMessages(
        { title: 'Hello', newDraft: 'New sentence' },
        { title: '你好' },
        { title: '', newDraft: ' ', unknown: '' },
      ),
    ).toEqual({ title: '你好', unknown: '' })
  })

  it('rejects English replacement even when the English source changed', () => {
    expect(
      translationRegressions({
        english: { title: 'New title', product: 'Payload' },
        previousEnglish: { title: 'Old title', product: 'Payload' },
        previous: { title: '标题', product: 'Payload' },
        next: { title: 'New title', product: 'Payload' },
        locale: 'zh',
      }),
    ).toEqual(['zh:title replaced an existing translation with English'])
  })

  it('rejects lost translations even in an optional draft namespace', () => {
    expect(
      translationRegressions({
        english: { 'Components.hero-basic.title': 'Hero Basic' },
        previousEnglish: { 'Components.hero-basic.title': 'Hero Basic' },
        previous: { 'Components.hero-basic.title': '基础首屏' },
        next: {},
        locale: 'ja',
      }),
    ).toEqual(['ja:Components.hero-basic.title lost an existing translation'])
  })

  it('rejects the English-only export that caused #556', async () => {
    const { english, catalogs } = await loadCatalogs()
    const errors = translationRegressions({
      english,
      previousEnglish: english,
      previous: catalogs.zh,
      next: english,
      locale: 'zh',
    })
    expect(errors.length).toBeGreaterThan(300)
  })

  it('merges a sparse export on disk without losing previously translated strings', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'crowdin-export-'))
    dirs.push(dir)
    await cp(path.join(process.cwd(), 'messages'), path.join(dir, 'messages'), { recursive: true })
    await writeFile(
      path.join(dir, 'messages/locales/zh.json'),
      JSON.stringify({ Common: { copy: '复制内容' } }),
    )
    await mergeCrowdinExport(process.cwd(), dir)
    const output = flattenMessages(
      JSON.parse(await readFile(path.join(dir, 'messages/locales/zh.json'), 'utf8')),
    )
    expect(output['Common.copy']).toBe('复制内容')
    expect(output['Components.hero-basic.title']).toBe('基础首屏')
    const { english, catalogs } = await loadCatalogs(dir)
    expect(validateCatalogs(english, catalogs)).toEqual([])
  })

  it('validates the entire export before writing merged files', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'crowdin-invalid-'))
    dirs.push(dir)
    await cp(path.join(process.cwd(), 'messages'), path.join(dir, 'messages'), { recursive: true })
    const file = path.join(dir, 'messages/locales/zh.json')
    const invalid = JSON.stringify({ Common: { copy: 'Copy' } })
    await writeFile(file, invalid)
    await expect(mergeCrowdinExport(process.cwd(), dir)).rejects.toThrow(
      'replaced an existing translation with English',
    )
    expect(await readFile(file, 'utf8')).toBe(invalid)
  })
})

describe('catalog translation rollout', () => {
  it('uses stable registry slugs with complete English and Chinese copy', async () => {
    const en = flattenMessages(await getSiteMessages('en'))
    const zh = flattenMessages(await getSiteMessages('zh'))
    for (const entry of [...componentEntries, ...upcomingComponents]) {
      for (const field of ['title', 'description', 'target'] as const) {
        const key = `Components.${entry.slug}.${field}`
        expect(en[key]).toBe(entry[field])
        expect(zh[key], key).not.toBe(en[key])
      }
    }
    expect(componentEntries[0].command).toBe('npx payload-components add hero-basic')
    expect(componentEntries[0].href).toBe('/docs/components/hero-basic')
  })

  it('allows English fallback only for catalog prose in the other draft locales', async () => {
    const { english, catalogs } = await loadCatalogs()
    expect(validateCatalogs(english, catalogs)).toEqual([])
    expect(catalogs.ja['Components.hero-basic.title']).toBeUndefined()
    expect(flattenMessages(await getSiteMessages('ja'))['Components.hero-basic.title']).toBe(
      'Hero Basic',
    )
    const broken = structuredClone(catalogs)
    delete broken.zh['Components.hero-basic.title']
    delete broken.ja['Common.copy']
    const errors = validateCatalogs(english, broken)
    expect(errors).toContain('zh:Components.hero-basic.title is missing')
    expect(errors).toContain('ja:Common.copy is missing')
  })
})
