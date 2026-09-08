import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import Ajv2020 from 'ajv/dist/2020.js'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { AuthorCard } from '../../payload-components/source/components/AuthorCard/Component'
import { NewsletterCallout } from '../../payload-components/source/components/NewsletterCallout/Component'
import { PostHero } from '../../payload-components/source/components/PostHero/Component'
import { buildRegistryForCheck } from '../../tools/payload-components/check-public-registry'
import { loadManifest } from '../../tools/payload-components/manifest'
import { runCommand } from '../../tools/payload-components/utils'
import { createInstallFixture } from './payload-components-fixture'

const root = process.cwd()
const tempDirs: string[] = []
let registryDir: string
const bin = path.join(root, 'bin/payload-components.mjs')

beforeAll(async () => {
  registryDir = await buildRegistryForCheck()
}, 60_000)
afterAll(async () => {
  if (registryDir) await rm(registryDir, { recursive: true, force: true })
})
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

const cli = (cwd: string, ...args: string[]) =>
  runCommand({
    command: process.execPath,
    args: [bin, ...args, '--cwd', cwd],
    cwd: root,
    captureOutput: true,
    timeoutMs: 60_000,
  })

describe('file-only article components', () => {
  it('requires an explicit file-only contract and preserves page-block requirements', async () => {
    const schema = JSON.parse(
      await readFile(path.join(root, 'payload-components/schema/poc-manifest.schema.json'), 'utf8'),
    )
    const validate = new Ajv2020({ strict: false }).compile(schema)
    const article = await loadManifest('post-hero')
    const block = await loadManifest('hero-basic')
    expect(validate(article)).toBe(true)
    expect(validate({ ...article, installMode: undefined })).toBe(false)
    expect(validate({ ...article, postInstall: ['generate:types'] })).toBe(false)
    expect(validate({ ...article, payloadFragments: block.payloadFragments })).toBe(false)
    expect(validate({ ...block, payloadFragments: [] })).toBe(false)
    expect(validate({ ...block, postInstall: [] })).toBe(false)
  })

  it('typechecks the actual distributed components against React without Payload stubs', () => {
    const program = ts.createProgram(
      ['AuthorCard', 'NewsletterCallout', 'PostHero'].map((name) =>
        path.join(root, 'payload-components/source/components', name, 'Component.tsx'),
      ),
      {
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        jsx: ts.JsxEmit.ReactJSX,
        types: ['react'],
      },
    )
    expect(
      ts
        .getPreEmitDiagnostics(program)
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')),
    ).toEqual([])
  }, 30_000)

  it('renders optional article data, a single heading, and a stable UTC date', () => {
    const html = renderToStaticMarkup(
      <PostHero
        title="An article"
        publishedAt="2026-08-12T23:30:00-04:00"
        categories={['Publishing']}
        author="Alex"
        description="A summary"
        image={<span>Cover</span>}
        id="article"
      />,
    )
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('August 13, 2026')
    expect(html).toContain('dateTime="2026-08-13T03:30:00.000Z"')
    expect(html).toContain('Cover')
    expect(html).toContain('id="article"')
    const minimal = renderToStaticMarkup(<PostHero title="Minimal" publishedAt="invalid" />)
    expect(minimal).not.toContain('<time')
    expect(minimal).not.toContain('Invalid Date')
    expect(
      renderToStaticMarkup(
        <PostHero title="Locale" publishedAt="2026-08-12" locale="not_a_locale" />,
      ),
    ).toContain('August 12, 2026')
  })

  it('renders a public author profile with optional slots and rejects unsafe profile URLs', () => {
    const html = renderToStaticMarkup(
      <AuthorCard name="Alex Morgan" role="Editor" bio="Writes stories" href="/authors/alex" />,
    )
    expect(html).toContain('About the author')
    expect(html).toContain('AM')
    expect(html).toContain('href="/authors/alex"')
    expect(html).not.toMatch(/<h[1-6]/)
    for (const href of [
      'javascript:alert(1)',
      'data:text/html,bad',
      '//evil.example',
      '/\\evil.example',
    ]) {
      expect(renderToStaticMarkup(<AuthorCard name="Alex" href={href} />)).not.toContain('<a ')
    }
    expect(
      renderToStaticMarkup(<AuthorCard name="Alex" avatar={<span>Avatar</span>} label="作者" />),
    ).toContain('Avatar')
  })

  it('renders an accessible newsletter form for a consumer-owned endpoint', () => {
    const html = renderToStaticMarkup(
      <NewsletterCallout
        id="newsletter"
        title="Keep reading"
        description="Get new articles."
        action="/api/newsletter"
        legalText="Unsubscribe anytime."
      />,
    )
    expect(html).toContain('action="/api/newsletter"')
    expect(html).toContain('method="post"')
    expect(html).toContain('type="email"')
    expect(html).toContain('autoComplete="email"')
    expect(html).toContain('required=""')
    expect(html).toContain('for="newsletter-email"')
    expect(html).toContain('aria-labelledby="newsletter-title"')
  })

  it('renders post-card dates identically on servers and browsers in different timezones', async () => {
    const source = await readFile(
      path.join(root, 'payload-components/source/blocks/shared/PostCard.tsx'),
      'utf8',
    )
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
      },
    }).outputText
    const exports: {
      PostCard?: React.ComponentType<{ post: { title: string; slug: string; publishedAt: string } }>
    } = {}
    const primitive = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
    new Function('require', 'exports', compiled)((id: string) => {
      if (id === 'react') return React
      if (id === 'next/link') return primitive
      if (id === '@/components/Media') return { Media: primitive }
      if (id === '@/utilities/ui') return { cn: () => '' }
      if (id === '@/components/ui/badge') return { Badge: primitive }
      if (id === '@/components/ui/card')
        return Object.fromEntries(
          ['Card', 'CardContent', 'CardDescription', 'CardHeader', 'CardTitle'].map((name) => [
            name,
            primitive,
          ]),
        )
      throw new Error(`Unexpected PostCard dependency: ${id}`)
    }, exports)
    const PostCard = exports.PostCard!
    try {
      const renders = ['UTC', 'America/Los_Angeles', 'Asia/Singapore'].map((timeZone) => {
        vi.stubEnv('TZ', timeZone)
        return renderToStaticMarkup(
          <PostCard post={{ title: 'Post', slug: 'post', publishedAt: '2026-08-13T00:30:00Z' }} />,
        )
      })
      expect(new Set(renders).size).toBe(1)
      expect(renders[0]).toContain('Aug 13, 2026')
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it.each(['post-hero', 'author-card', 'newsletter-callout'])(
    'delivers %s through direct shadcn and tracks/removes it without host edits',
    async (slug) => {
      const { fixtureDir, manifest } = await createInstallFixture(slug)
      tempDirs.push(fixtureDir)
      const hosts = [
        'src/blocks/RenderBlocks.tsx',
        'src/collections/Pages/index.ts',
        'src/payload.config.ts',
      ]
      const before = await Promise.all(
        hosts.map((file) => readFile(path.join(fixtureDir, file), 'utf8')),
      )
      // Failing generators prove both the direct install and tracked lifecycle never invoke them.
      const pkgPath = path.join(fixtureDir, 'package.json')
      const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
      pkg.scripts = { 'generate:types': 'exit 9', 'generate:importmap': 'exit 9' }
      await writeFile(pkgPath, JSON.stringify(pkg))
      expect(manifest.installMode).toBe('file-only')
      expect(manifest.payloadFragments).toEqual([])
      expect(manifest.postInstall).toEqual([])
      expect(manifest.recovery.patchedFiles).toEqual([])
      await runCommand({
        command: 'pnpm',
        args: [
          'exec',
          'shadcn',
          'add',
          path.join(registryDir, `${slug}.json`),
          '--cwd',
          fixtureDir,
          '--yes',
        ],
        cwd: root,
        captureOutput: true,
        timeoutMs: 60_000,
      })
      for (const file of manifest.files) {
        expect(await readFile(path.join(fixtureDir, file), 'utf8')).toContain(
          `export function ${
            {
              'post-hero': 'PostHero',
              'author-card': 'AuthorCard',
              'newsletter-callout': 'NewsletterCallout',
            }[slug]
          }`,
        )
      }
      await cli(fixtureDir, 'add', slug)
      const statePath = path.join(fixtureDir, '.payload-components/state.json')
      const firstState = await readFile(statePath, 'utf8')
      await cli(fixtureDir, 'add', slug)
      expect(await readFile(statePath, 'utf8')).toBe(firstState)
      await cli(fixtureDir, 'diff', slug)
      expect(
        await Promise.all(hosts.map((file) => readFile(path.join(fixtureDir, file), 'utf8'))),
      ).toEqual(before)
      await cli(fixtureDir, 'remove', slug)
      for (const file of manifest.files)
        await expect(readFile(path.join(fixtureDir, file), 'utf8')).rejects.toThrow()
      expect(
        await Promise.all(hosts.map((file) => readFile(path.join(fixtureDir, file), 'utf8'))),
      ).toEqual(before)
    },
    120_000,
  )

  it('skips file-only content before semantic localization policy checks', async () => {
    const { fixtureDir } = await createInstallFixture('post-hero', { preseedSource: true })
    tempDirs.push(fixtureDir)
    await cli(fixtureDir, 'add', 'post-hero')
    const output = await cli(fixtureDir, 'localize', 'post-hero', '--locales', 'en,zh', '--dry-run')
    expect(output.stdout).toContain('accepts content as props')
    expect(output.stdout).not.toContain('Semantic localization policies are missing')
    const plan = await cli(fixtureDir, 'remove', 'post-hero', '--dry-run')
    expect(plan.stdout).toContain('none owned by this file-only component')
    expect(plan.stdout).not.toContain('migrate or delete this block data')
  }, 30_000)

  it('refuses editor-only flags before creating project files', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'article-flags-'))
    tempDirs.push(cwd)
    for (const flag of ['--localized', '--demo']) {
      const error = await cli(cwd, 'add', 'post-hero', flag).catch(
        (error: Error & { stderr: string }) => error,
      )
      expect(error).toBeInstanceOf(Error)
      expect((error as Error & { stderr: string }).stderr).toContain('file-only article component')
    }
    expect((await loadManifest('post-hero')).files).toHaveLength(1)
  })
})
