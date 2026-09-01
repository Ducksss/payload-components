import { access, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  parseLocaleCodes,
  renderLocalizationBlock,
  resolveLocales,
} from '../../tools/payload-components/locales'
import {
  applyPayloadFragments,
  readPayloadLocalization,
  setPayloadLocalization,
  LOCALIZE_HELPER_FILE,
} from '../../tools/payload-components/project'
import { loadState, recordInstalledState } from '../../tools/payload-components/state'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* `localize` is the command that makes Payload internationalization actually
 * work end to end: the config has to declare locales, and the installed block
 * configs have to mark their prose localized. These specs pin both halves, the
 * refusals that keep the edit reviewable, and the state bookkeeping that stops
 * `diff` from reading the wrap as consumer drift. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.restoreAllMocks()
  process.exitCode = undefined
})

const CONFIG_SOURCE = [
  "import { postgresAdapter } from '@payloadcms/db-postgres'",
  "import { buildConfig } from 'payload'",
  '',
  "import { Pages } from './collections/Pages'",
  '',
  'export default buildConfig({',
  '  collections: [Pages],',
  "  secret: process.env.PAYLOAD_SECRET || '',",
  '  db: postgresAdapter({}),',
  '})',
  '',
].join('\n')

const configPathOf = (fixtureDir: string) => path.join(fixtureDir, 'src', 'payload.config.ts')

const setup = async () => {
  const output: string[] = []

  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { localizeCommand } = await import('../../tools/payload-components/commands/localize')

  return { localizeCommand, output: () => output.join('') }
}

const installFixture = async ({
  componentNames,
  configSource = CONFIG_SOURCE,
}: {
  componentNames: string[]
  configSource?: string
}) => {
  const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames, {
    preseedSource: true,
  })

  fixtureDirs.push(fixtureDir)
  await writeFile(configPathOf(fixtureDir), configSource, 'utf8')

  for (const manifest of manifests) {
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalledState({
      cwd: fixtureDir,
      manifest,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
  }

  return { fixtureDir, manifests }
}

const readConfig = (fixtureDir: string) => readFile(configPathOf(fixtureDir), 'utf8')

const readBlockConfig = (fixtureDir: string, blockDir: string) =>
  readFile(path.join(fixtureDir, 'src', 'blocks', blockDir, 'config.ts'), 'utf8')

describe('locale resolution', () => {
  it('parses, canonicalizes, and deduplicates locale codes', () => {
    expect(parseLocaleCodes('en, zh ,pt-BR')).toEqual(['en', 'zh', 'pt-BR'])
    /* Catalog casing wins, and a repeat under different casing is one locale —
       Payload rejects a duplicated code. */
    expect(parseLocaleCodes('EN,zh-tw,en')).toEqual(['en', 'zh-TW'])
    expect(parseLocaleCodes('EN-us-u-ca-gregory,de-de-x-phonebk')).toEqual([
      'en-US-u-ca-gregory',
      'de-DE-x-phonebk',
    ])
  })

  it('rejects codes that are not language tags', () => {
    expect(() => parseLocaleCodes('')).toThrow('--locales needs at least one locale code')
    expect(() => parseLocaleCodes("en','; rm -rf /")).toThrow('is not a usable locale code')
    expect(() => parseLocaleCodes('en_US')).toThrow('is not a usable locale code')
  })

  it('labels known locales in their own language and flags right-to-left scripts', () => {
    const { defaultLocale, locales, unlabelled } = resolveLocales({ codes: ['en', 'zh', 'ar'] })

    expect(defaultLocale).toBe('en')
    expect(unlabelled).toEqual([])
    expect(locales).toEqual([
      { code: 'en', label: 'English' },
      { code: 'zh', label: '简体中文' },
      { code: 'ar', label: 'العربية', rtl: true },
    ])
  })

  it('falls back to the code for an unlisted locale and says which ones', () => {
    const { locales, unlabelled } = resolveLocales({ codes: ['en', 'gsw'] })

    expect(locales.at(-1)).toEqual({ code: 'gsw', label: 'gsw' })
    expect(unlabelled).toEqual(['gsw'])
    expect(resolveLocales({ codes: ['custom_locale'] }).locales).toEqual([
      { code: 'custom_locale', label: 'custom_locale' },
    ])
  })

  it('derives writing direction for an unlisted right-to-left locale', () => {
    const { locales, unlabelled } = resolveLocales({ codes: parseLocaleCodes('yi') })

    expect(locales).toEqual([{ code: 'yi', label: 'yi', rtl: true }])
    expect(unlabelled).toEqual(['yi'])
  })

  it('requires the default locale to be one of the configured locales', () => {
    expect(() => resolveLocales({ codes: ['en', 'zh'], defaultLocale: 'ja' })).toThrow(
      'is not in the locale list',
    )
    expect(resolveLocales({ codes: ['en', 'zh'], defaultLocale: 'zh' }).defaultLocale).toBe('zh')
    expect(
      resolveLocales({ codes: parseLocaleCodes('gsw'), defaultLocale: 'GSW' }).defaultLocale,
    ).toBe('gsw')
    expect(() => resolveLocales({ codes: ['en'], defaultLocale: 'en_US' })).toThrow(
      'is not a usable locale code',
    )
  })

  it('escapes anything that would break out of the generated string literal', () => {
    /* Catalog labels are tame and codes are pattern-checked, but a helper that
       emits TypeScript has to survive whatever it is handed — a raw line
       terminator inside a single-quoted literal is a syntax error. */
    const rendered = renderLocalizationBlock({
      defaultLocale: 'en',
      fallback: true,
      locales: [{ code: 'en', label: "O'Brien\r\n\u2028\u2029\\x" }],
    })

    expect(rendered).toContain(String.raw`{ code: 'en', label: 'O\'Brien\r\n\u2028\u2029\\x' }`)
    /* One line per locale — nothing leaked a real newline into the output. */
    expect(rendered.split('\n').filter((line) => line.includes('code:'))).toHaveLength(1)
  })

  it('renders a Payload localization block at the given indentation', () => {
    expect(
      renderLocalizationBlock({
        defaultLocale: 'zh',
        fallback: false,
        locales: resolveLocales({ codes: ['zh', 'he'] }).locales,
      }),
    ).toBe(
      [
        '  localization: {',
        "    defaultLocale: 'zh',",
        '    fallback: false,',
        '    locales: [',
        "      { code: 'zh', label: '简体中文' },",
        "      { code: 'he', label: 'עברית', rtl: true },",
        '    ],',
        '  },',
      ].join('\n'),
    )
  })
})

describe('setPayloadLocalization', () => {
  const renderBlock = (indent: string) =>
    renderLocalizationBlock({
      defaultLocale: 'en',
      fallback: true,
      indent,
      locales: resolveLocales({ codes: ['en', 'zh'] }).locales,
    })

  it('reports a config with no buildConfig call instead of rewriting it', () => {
    expect(setPayloadLocalization({ renderBlock, source: 'export default {}\n' })).toEqual({
      kind: 'no-build-config',
    })
  })

  it('matches the indentation the config already uses', () => {
    const source = ['export default buildConfig({', '    collections: [],', '})', ''].join('\n')
    const patch = setPayloadLocalization({ renderBlock, source })

    expect(patch.kind).toBe('patched')
    expect(patch.kind === 'patched' && patch.source).toContain('    localization: {')
    expect(patch.kind === 'patched' && patch.source).toContain("      defaultLocale: 'en',")
  })

  it('ignores a localization key that is not the config object', () => {
    const source = [
      'export default buildConfig({',
      '  admin: {',
      '    components: { localization: { views: {} } },',
      '  },',
      '})',
      '',
    ].join('\n')
    const patch = setPayloadLocalization({ renderBlock, source })

    expect(patch.kind).toBe('patched')
    expect(patch.kind === 'patched' && readPayloadLocalization(patch.source)).toMatchObject({
      locales: ['en', 'zh'],
      localesStatus: 'literal',
    })
  })

  it('recognizes a quoted localization key instead of adding a duplicate', () => {
    const source = [
      'export default buildConfig({',
      "  'localization': { locales: ['fr'] },",
      '})',
      '',
    ].join('\n')

    expect(setPayloadLocalization({ renderBlock, source })).toMatchObject({
      kind: 'already-configured',
      matches: false,
    })
  })

  it('reads and replaces the last duplicate key because it wins at runtime', () => {
    const source = [
      'export default buildConfig({',
      "  localization: { defaultLocale: 'fr', locales: ['fr'] },",
      "  localization: { defaultLocale: 'de', locales: ['de'] },",
      '})',
      '',
    ].join('\n')

    expect(readPayloadLocalization(source)).toMatchObject({
      defaultLocale: 'de',
      locales: ['de'],
    })

    const forced = setPayloadLocalization({ force: true, renderBlock, source })

    expect(forced.kind).toBe('replaced')
    expect(forced.kind === 'replaced' && readPayloadLocalization(forced.source)).toMatchObject({
      defaultLocale: 'en',
      locales: ['en', 'zh'],
    })
  })

  it('treats a later shorthand as the runtime winner', () => {
    const source = [
      'export default buildConfig({',
      "  localization: { defaultLocale: 'fr', locales: ['fr'] },",
      '  localization,',
      '})',
      '',
    ].join('\n')

    expect(readPayloadLocalization(source)).toMatchObject({
      defaultLocaleStatus: 'computed',
      localesStatus: 'computed',
    })
    expect(setPayloadLocalization({ force: true, renderBlock, source })).toEqual({
      kind: 'existing-unreadable',
    })

    expect(
      readPayloadLocalization(
        [
          'export default buildConfig({',
          "  localization: { defaultLocale: 'en', locales: ['en'], locales },",
          '})',
        ].join('\n'),
      ),
    ).toMatchObject({
      defaultLocale: 'en',
      localesStatus: 'computed',
    })
  })

  it('refuses a shorthand localization property instead of adding a duplicate', () => {
    const source = [
      'export default buildConfig({',
      '  localization,',
      '  collections: [],',
      '})',
    ].join('\n')

    expect(setPayloadLocalization({ force: true, renderBlock, source })).toEqual({
      kind: 'existing-unreadable',
    })
  })

  it.each([' as const', ' satisfies LocalizationConfig'])(
    'refuses an object literal with the %s suffix instead of corrupting it',
    (suffix) => {
      const source = [
        'export default buildConfig({',
        `  localization: { locales: ['fr'] }${suffix},`,
        '  collections: [],',
        '})',
        '',
      ].join('\n')

      expect(setPayloadLocalization({ force: true, renderBlock, source })).toEqual({
        kind: 'existing-unreadable',
      })
    },
  )

  it('inserts after a trailing spread so the requested localization wins', () => {
    const source = [
      'export default buildConfig({',
      '  collections: [],',
      '  ...baseConfig,',
      '})',
      '',
    ].join('\n')
    const patch = setPayloadLocalization({ renderBlock, source })

    expect(patch.kind).toBe('patched')
    expect(patch.kind === 'patched' && patch.source.indexOf('localization:')).toBeGreaterThan(
      patch.kind === 'patched' ? patch.source.indexOf('...baseConfig') : 0,
    )
  })

  it('refuses to replace a localization block that a later spread can override', () => {
    const source = [
      'export default buildConfig({',
      "  localization: { locales: ['fr'] },",
      '  ...baseConfig,',
      '})',
      '',
    ].join('\n')

    expect(setPayloadLocalization({ force: true, renderBlock, source })).toEqual({
      kind: 'existing-unreadable',
    })
    expect(readPayloadLocalization(source)).toEqual({
      defaultLocaleStatus: 'computed',
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })
  })

  it('refuses to replace a localization value it cannot read', () => {
    const source = [
      'export default buildConfig({',
      '  localization: localizationConfig,',
      '})',
      '',
    ].join('\n')

    expect(setPayloadLocalization({ force: true, renderBlock, source })).toEqual({
      kind: 'existing-unreadable',
    })
  })

  it('replaces a readable localization block only with force, leaving no stray comma', () => {
    const source = [
      'export default buildConfig({',
      '  localization: {',
      "    locales: ['en'],",
      '  },',
      '  collections: [],',
      '})',
      '',
    ].join('\n')

    expect(setPayloadLocalization({ renderBlock, source })).toMatchObject({
      kind: 'already-configured',
      matches: false,
    })

    const forced = setPayloadLocalization({ force: true, renderBlock, source })

    expect(forced.kind).toBe('replaced')
    expect(forced.kind === 'replaced' && forced.source).toBe(
      [
        'export default buildConfig({',
        '  localization: {',
        "    defaultLocale: 'en',",
        '    fallback: true,',
        '    locales: [',
        "      { code: 'en', label: 'English' },",
        "      { code: 'zh', label: '简体中文' },",
        '    ],',
        '  },',
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
    )
  })

  it('preserves one comma when a comment follows the replaced block', () => {
    const source = [
      'export default buildConfig({',
      "  localization: { locales: ['fr'] } /* keep */,",
      '  collections: [],',
      '})',
      '',
    ].join('\n')
    const patch = setPayloadLocalization({ force: true, renderBlock, source })

    expect(patch.kind).toBe('replaced')
    expect(patch.kind === 'replaced' && patch.source).toContain('  } /* keep */,\n')
    expect(patch.kind === 'replaced' && patch.source).not.toContain('/* keep */,,')
  })
})

describe('readPayloadLocalization', () => {
  it('reads the object form, the shorthand array form, and reports neither', () => {
    expect(
      readPayloadLocalization(
        [
          'export default buildConfig({',
          '  localization: {',
          "    defaultLocale: 'zh',",
          '    fallback: false,',
          "    locales: [{ code: 'zh', label: '简体中文' }, { code: 'en', label: 'English' }],",
          '  },',
          '})',
        ].join('\n'),
      ),
    ).toEqual({
      defaultLocaleStatus: 'literal',
      defaultLocale: 'zh',
      disabled: false,
      fallback: false,
      locales: ['zh', 'en'],
      localesEnumerable: true,
      localesStatus: 'literal',
    })

    expect(
      readPayloadLocalization(
        ['export default buildConfig({', "  localization: { locales: ['en', 'ja'] },", '})'].join(
          '\n',
        ),
      ),
    ).toEqual({
      defaultLocaleStatus: 'absent',
      disabled: false,
      locales: ['en', 'ja'],
      localesEnumerable: true,
      localesStatus: 'literal',
    })

    expect(
      readPayloadLocalization(
        ['export default buildConfig({', '  collections: [],', '})'].join('\n'),
      ),
    ).toBeUndefined()
  })

  /* An empty list is two different answers, and conflating them is what made
   * `add` nag a localized project and `localize` refuse to wrap its blocks. */
  it('separates a computed locale set from a genuinely empty one', () => {
    expect(
      readPayloadLocalization(
        [
          'export default buildConfig({',
          '  localization: {',
          "    defaultLocale: 'en',",
          '    locales: getLocales(),',
          '  },',
          '})',
        ].join('\n'),
      ),
    ).toEqual({
      defaultLocale: 'en',
      defaultLocaleStatus: 'literal',
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })

    /* A whole localization object built elsewhere reads the same way. */
    expect(
      readPayloadLocalization(
        ['export default buildConfig({', '  localization: localizationConfig,', '})'].join('\n'),
      ),
    ).toEqual({
      defaultLocaleStatus: 'computed',
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })

    /* `locales: []` is a literal answer — empty, and a misconfiguration. */
    expect(
      readPayloadLocalization(
        ['export default buildConfig({', '  localization: { locales: [] },', '})'].join('\n'),
      ),
    ).toEqual({
      defaultLocaleStatus: 'absent',
      disabled: false,
      locales: [],
      localesEnumerable: true,
      localesStatus: 'literal',
    })
  })

  it('distinguishes missing, disabled, partial, and commented locale declarations', () => {
    const read = (localization: string) =>
      readPayloadLocalization(
        ['export default buildConfig({', `  localization: ${localization},`, '})'].join('\n'),
      )

    expect(read("{ defaultLocale: 'en' }")).toMatchObject({
      disabled: false,
      locales: [],
      localesEnumerable: true,
      localesStatus: 'absent',
    })
    expect(read('false')).toEqual({
      defaultLocaleStatus: 'absent',
      disabled: true,
      locales: [],
      localesEnumerable: true,
      localesStatus: 'absent',
    })
    expect(read("{ locales: ['en', ...moreLocales] }")).toMatchObject({
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })
    expect(read("{ defaultLocale: getDefaultLocale(), locales: ['en', 'zh'] }")).toMatchObject({
      defaultLocaleStatus: 'computed',
      locales: ['en', 'zh'],
      localesStatus: 'literal',
    })
    expect(read('{ locales, defaultLocale }')).toMatchObject({
      defaultLocaleStatus: 'computed',
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })
    expect(
      read(["{ defaultLocale: 'en',", "    // locales: ['en', 'zh']", '  }'].join('\n')),
    ).toMatchObject({
      locales: [],
      localesStatus: 'absent',
    })
  })

  it('respects direct spread precedence inside the localization object', () => {
    const read = (localization: string) =>
      readPayloadLocalization(
        ['export default buildConfig({', `  localization: ${localization},`, '})'].join('\n'),
      )

    expect(read("{ defaultLocale: 'en', locales: ['en'], ...runtimeLocalization }")).toEqual({
      defaultLocaleStatus: 'computed',
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })
    expect(read("{ ...runtimeLocalization, locales: ['en'] }")).toEqual({
      defaultLocaleStatus: 'computed',
      disabled: false,
      locales: ['en'],
      localesEnumerable: true,
      localesStatus: 'literal',
    })
  })

  it('respects root spread precedence for localization: false', () => {
    const read = (properties: string[]) =>
      readPayloadLocalization(
        ['export default buildConfig({', ...properties.map((line) => `  ${line}`), '})'].join('\n'),
      )

    expect(read(['localization: false,', '...baseConfig,'])).toEqual({
      defaultLocaleStatus: 'computed',
      disabled: false,
      locales: [],
      localesEnumerable: false,
      localesStatus: 'computed',
    })
    expect(read(['...baseConfig,', 'localization: false,'])).toEqual({
      defaultLocaleStatus: 'absent',
      disabled: true,
      locales: [],
      localesEnumerable: true,
      localesStatus: 'absent',
    })
  })
})

describe('localizeCommand', () => {
  it('declares the locales, wraps the installed blocks, and records the choice', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic', 'faq-card'] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh,ar' })

    const config = await readConfig(fixtureDir)

    expect(config).toContain('  localization: {')
    expect(config).toContain("    defaultLocale: 'en',")
    expect(config).toContain('    fallback: true,')
    expect(config).toContain("      { code: 'zh', label: '简体中文' },")
    expect(config).toContain("      { code: 'ar', label: 'العربية', rtl: true },")
    /* The rest of the config is left exactly as authored. */
    expect(config).toContain('  collections: [Pages],')
    expect(config).toContain("import { buildConfig } from 'payload'")

    for (const blockDir of ['HeroBasic', 'FaqCard']) {
      const blockConfig = await readBlockConfig(fixtureDir, blockDir)

      expect(blockConfig).toContain(
        "import { localizeFields } from '@/blocks/shared/localizeFields'",
      )
      expect(blockConfig).toContain('fields: localizeFields([')
    }

    await expect(access(path.join(fixtureDir, LOCALIZE_HELPER_FILE))).resolves.toBeUndefined()

    const state = await loadState(fixtureDir)

    expect(state.components['hero-basic']?.localized).toBe(true)
    expect(state.components['faq-card']?.localized).toBe(true)
    expect(output()).toContain('Locales: en (English), zh (简体中文), ar (العربية)')
    expect(output()).toContain('const RTL_LOCALES = new Set(["ar"])')
    expect(output()).toContain('Payload does not backfill existing values')
    expect(process.exitCode).toBeUndefined()
  })

  it('prints the Bun executable runner for generated Payload types', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })

    await rm(path.join(fixtureDir, 'pnpm-lock.yaml'))
    await writeFile(path.join(fixtureDir, 'bun.lock'), '', 'utf8')

    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(output()).toContain('Regenerate types: bunx payload generate:types')
  })

  it('gives future-install guidance when the project has no recorded components', async () => {
    const { fixtureDir } = await installFixture({ componentNames: [] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(output()).toContain(
      'no recorded components — use --localized on future installs, or re-run localize afterward',
    )
    expect(process.exitCode).toBeUndefined()
  })

  it('leaves diff clean, so the wrap does not read as consumer drift', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    const { diffCommand } = await import('../../tools/payload-components/commands/diff')

    await expect(diffCommand({ cwd: fixtureDir })).resolves.toBe(true)
  })

  it('is idempotent — a second run rewrites nothing', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    const config = await readConfig(fixtureDir)
    const blockConfig = await readBlockConfig(fixtureDir, 'HeroBasic')

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(await readConfig(fixtureDir)).toBe(config)
    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).toBe(blockConfig)
    expect(config.match(/localization: \{/g)).toHaveLength(1)
    expect(output()).toContain('already declares exactly these locales')
    expect(output()).toContain('(already localized)')
    expect(process.exitCode).toBeUndefined()
  })

  it('recreates a deleted localization helper for an already wrapped block', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })
    await rm(path.join(fixtureDir, LOCALIZE_HELPER_FILE))
    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    await expect(access(path.join(fixtureDir, LOCALIZE_HELPER_FILE))).resolves.toBeUndefined()
  })

  it('keeps the locales the config already declares when no --locales is given', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,ja' })

    const config = await readConfig(fixtureDir)

    /* The common second run: more blocks installed, same languages. */
    await localizeCommand({ cwd: fixtureDir })

    expect(await readConfig(fixtureDir)).toBe(config)
    expect(output()).toContain('keeping the locales it already declares')
    expect(output()).toContain('Locales: en (English), ja (日本語)')
  })

  it('refuses to guess when neither the config nor the flags name a language', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await expect(localizeCommand({ cwd: fixtureDir })).rejects.toThrow(
      'does not declare any locales yet',
    )
    expect(await readConfig(fixtureDir)).toBe(CONFIG_SOURCE)
  })

  it('treats localization: false as disabled rather than runtime-computed locales', async () => {
    const disabled = CONFIG_SOURCE.replace(
      '  collections: [Pages],',
      ['  localization: false,', '  collections: [Pages],'].join('\n'),
    )
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      configSource: disabled,
    })
    const { localizeCommand } = await setup()

    await expect(localizeCommand({ cwd: fixtureDir })).rejects.toThrow(
      'does not declare any locales yet',
    )
    expect(await readConfig(fixtureDir)).toBe(disabled)
    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).not.toContain('localizeFields')
  })

  it('rejects a locale flag that would be silently dropped without --locales', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,ja' })

    /* The config already declares locales, so these no longer fail the
       "nothing to localize into" check — but neither would they reach the
       config, because only --locales renders a new block. */
    await expect(localizeCommand({ cwd: fixtureDir, defaultLocale: 'ja' })).rejects.toThrow(
      '--default-locale only applies to the localization block this command writes',
    )
    await expect(localizeCommand({ cwd: fixtureDir, fallback: false })).rejects.toThrow(
      '--no-fallback only applies to the localization block this command writes',
    )
    /* The suggestion names the locales the project actually has. */
    await expect(localizeCommand({ cwd: fixtureDir, defaultLocale: 'ja' })).rejects.toThrow(
      'payload-components localize --locales en,ja --default-locale ja',
    )
  })

  it('changes nothing under --dry-run but prints the whole plan', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, dryRun: true, locales: 'en,zh' })

    expect(await readConfig(fixtureDir)).toBe(CONFIG_SOURCE)
    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).not.toContain('localizeFields')
    await expect(access(path.join(fixtureDir, LOCALIZE_HELPER_FILE))).rejects.toThrow()
    expect((await loadState(fixtureDir)).components['hero-basic']?.localized).toBeUndefined()

    const printed = output()

    expect(printed).toContain('dry run for localizing')
    expect(printed).toContain('would add the localization block')
    expect(printed).toContain('would wrap fields in localizeFields')
  })

  it('honours --default-locale and --no-fallback', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await localizeCommand({
      cwd: fixtureDir,
      defaultLocale: 'zh-TW',
      fallback: false,
      locales: 'en,zh-TW',
    })

    const config = await readConfig(fixtureDir)

    expect(config).toContain("    defaultLocale: 'zh-TW',")
    expect(config).toContain('    fallback: false,')
  })

  it('reports an unlabelled locale rather than inventing a name for it', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,gsw' })

    expect(await readConfig(fixtureDir)).toContain("      { code: 'gsw', label: 'gsw' },")
    expect(output()).toContain('no catalog label for gsw')
  })

  it('only touches the components it was given', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic', 'faq-card'] })
    const { localizeCommand } = await setup()

    await localizeCommand({
      componentNames: ['hero-basic'],
      cwd: fixtureDir,
      locales: 'en,zh',
    })

    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).toContain('localizeFields')
    expect(await readBlockConfig(fixtureDir, 'FaqCard')).not.toContain('localizeFields')

    const state = await loadState(fixtureDir)

    expect(state.components['hero-basic']?.localized).toBe(true)
    expect(state.components['faq-card']?.localized).toBeUndefined()
  })

  it('names a recorded block config that is not on disk instead of printing an empty entry', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()

    await rm(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))
    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(output()).toContain(
      'src/blocks/HeroBasic/config.ts (missing — run "payload-components add hero-basic")',
    )
    expect((await loadState(fixtureDir)).components['hero-basic']?.localized).toBeUndefined()
    /* In scope and not wrapped, so the run reports itself incomplete. */
    expect(process.exitCode).toBe(1)
  })

  /* The config computes its locales, so this command cannot name them — but the
     project IS localized, and refusing to wrap its blocks was the bug. */
  it('wraps blocks for a config whose locales are computed at runtime', async () => {
    const computed = CONFIG_SOURCE.replace(
      '  collections: [Pages],',
      [
        '  localization: {',
        "    defaultLocale: 'en',",
        '    locales: getLocales(),',
        '  },',
        '  collections: [Pages],',
      ].join('\n'),
    )
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      configSource: computed,
    })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir })

    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).toContain('fields: localizeFields([')
    /* The config is read, never rewritten, on this path. */
    expect(await readConfig(fixtureDir)).toBe(computed)
    expect((await loadState(fixtureDir)).components['hero-basic']?.localized).toBe(true)
    expect(output()).toContain('computed at runtime — this command cannot name them')
    expect(process.exitCode).toBeUndefined()
  })

  it('rejects a component that is not recorded as installed', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand } = await setup()

    await expect(
      localizeCommand({ componentNames: ['faq-card'], cwd: fixtureDir, locales: 'en,zh' }),
    ).rejects.toThrow('payload-components add faq-card --localized')
  })

  it('skips a locally edited block config until --force, and still fixes the config', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { localizeCommand, output } = await setup()
    const blockConfigPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')
    const edited = (await readFile(blockConfigPath, 'utf8')).replace(
      "slug: 'heroBasic',",
      "slug: 'heroBasic', // our own note",
    )

    await writeFile(blockConfigPath, edited, 'utf8')
    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(await readFile(blockConfigPath, 'utf8')).toBe(edited)
    /* The config half is not held hostage by a block-level edit. */
    expect(await readConfig(fixtureDir)).toContain('  localization: {')
    expect((await loadState(fixtureDir)).components['hero-basic']?.localized).toBeUndefined()
    expect(output()).toContain('skipped — 1 locally modified block config')
    expect(process.exitCode).toBe(1)

    process.exitCode = undefined
    await localizeCommand({ cwd: fixtureDir, force: true, locales: 'en,zh' })

    const forced = await readFile(blockConfigPath, 'utf8')

    expect(forced).toContain('fields: localizeFields([')
    expect(forced).toContain('// our own note')
    expect((await loadState(fixtureDir)).components['hero-basic']?.localized).toBe(true)
  })

  it('keeps an existing localization block until --force and exits non-zero', async () => {
    const existing = CONFIG_SOURCE.replace(
      '  collections: [Pages],',
      ['  localization: {', "    locales: ['en', 'fr'],", '  },', '  collections: [Pages],'].join(
        '\n',
      ),
    )
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      configSource: existing,
    })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(await readConfig(fixtureDir)).toBe(existing)
    expect(output()).toContain('already declares a different localization block')
    expect(process.exitCode).toBe(1)
    /* The block half still runs — the two halves fail independently. */
    expect(await readBlockConfig(fixtureDir, 'HeroBasic')).toContain('localizeFields')

    process.exitCode = undefined
    await localizeCommand({ cwd: fixtureDir, force: true, locales: 'en,zh' })

    const config = await readConfig(fixtureDir)

    expect(config).toContain("      { code: 'zh', label: '简体中文' },")
    expect(config).not.toContain("locales: ['en', 'fr']")
    expect(process.exitCode).toBeUndefined()
  })

  it('reports a config it cannot patch instead of rewriting it', async () => {
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      configSource: 'export default {}\n',
    })
    const { localizeCommand, output } = await setup()

    await localizeCommand({ cwd: fixtureDir, locales: 'en,zh' })

    expect(await readConfig(fixtureDir)).toBe('export default {}\n')
    expect(output()).toContain('no buildConfig({ ... }) call found')
    expect(process.exitCode).toBe(1)
  })
})
