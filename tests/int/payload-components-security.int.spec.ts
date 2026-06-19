import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getSafeEmbedUrl,
  getSafeFormAction,
  validateEmbedUrl,
  validateSameOriginFormAction,
} from '../../payload-components/source/blocks/shared/safeUrls'

const repoRoot = process.cwd()

const isPathInside = (parentPath: string, childPath: string) => {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath))

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

const loadManifestWithMockedRegistry = async () => {
  const readJsonFile = vi.fn(async (filePath: string) => {
    if (filePath.endsWith(path.join('payload-components', 'registry.json'))) {
      return {
        homepage: 'https://example.com',
        items: [{ name: 'hero-basic' }],
        name: 'payload-components',
      }
    }

    throw new Error(`Unexpected readJsonFile path: ${filePath}`)
  })

  vi.doMock('../../tools/payload-components/utils', () => ({
    getLockfileName: vi.fn(() => 'pnpm-lock.yaml'),
    isPathInside,
    readJsonFile,
    repoRoot: '/virtual/repo',
    runCommand: vi.fn(),
  }))

  const manifestModule = await import('../../tools/payload-components/manifest')

  return {
    loadManifest: manifestModule.loadManifest,
    readJsonFile,
  }
}

describe('payload-components security invariants', () => {
  afterEach(() => {
    vi.doUnmock('../../tools/payload-components/utils')
    vi.doUnmock('node:fs/promises')
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('rejects traversal component names before reading any manifest path', async () => {
    const { loadManifest, readJsonFile } = await loadManifestWithMockedRegistry()

    await expect(loadManifest('../registry')).rejects.toThrow('Unknown component "../registry"')
    expect(readJsonFile).not.toHaveBeenCalled()
  })

  it('rejects unknown component slugs before manifest lookup', async () => {
    const { loadManifest, readJsonFile } = await loadManifestWithMockedRegistry()

    await expect(loadManifest('missing-component')).rejects.toThrow('Unknown component "missing-component"')
    expect(readJsonFile).toHaveBeenCalledTimes(1)
    expect(readJsonFile).toHaveBeenCalledWith('/virtual/repo/payload-components/registry.json')
  })

  it('rejects registry file paths outside payload-components/source', async () => {
    const { resolveRegistrySourcePath } = await import('../../tools/payload-components/check-public-registry')

    expect(resolveRegistrySourcePath('payload-components/source/blocks/HeroBasic/config.ts')).toBe(
      path.join(repoRoot, 'payload-components', 'source', 'blocks', 'HeroBasic', 'config.ts'),
    )
    expect(() =>
      resolveRegistrySourcePath('payload-components/source/blocks/../../../package.json'),
    ).toThrow('outside payload-components/source')
    expect(() => resolveRegistrySourcePath('/tmp/evil.ts')).toThrow('relative')
  })

  it('rejects shadcn alias paths outside the target project', async () => {
    const { resolveAliasPath } = await import('../../tools/payload-components/registry')
    const targetDir = path.join(repoRoot, '.tmp', 'target')

    expect(resolveAliasPath(targetDir, '@/components/ui')).toBe(
      path.join(targetDir, 'src', 'components', 'ui'),
    )
    expect(() => resolveAliasPath(targetDir, '../../outside')).toThrow('outside the target project')
    expect(() => resolveAliasPath(targetDir, '/tmp/outside')).toThrow('outside the target project')
  })

  it('does not read escaped registry source paths for docs code samples', async () => {
    const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')
    const escapedPath = path.join(repoRoot, 'package.json')
    const safePath = path.join(repoRoot, 'payload-components', 'source', 'blocks', 'HeroBasic', 'config.ts')
    const readFileMock = vi.fn(async (filePath: string) => {
      if (filePath === registryPath) {
        return JSON.stringify({
          items: [
            {
              files: [
                {
                  path: 'payload-components/source/blocks/../../../package.json',
                  target: '~/src/package.json',
                },
                {
                  path: 'payload-components/source/blocks/HeroBasic/config.ts',
                  target: '~/src/blocks/HeroBasic/config.ts',
                },
              ],
              name: 'evil-component',
            },
          ],
        })
      }

      if (filePath === escapedPath) {
        return 'escaped source should not be read'
      }

      if (filePath === safePath) {
        return 'export const HeroBasic = {}\n'
      }

      throw new Error(`Unexpected readFile path: ${filePath}`)
    })

    vi.doMock('node:fs/promises', () => ({
      default: {
        readFile: readFileMock,
      },
      readFile: readFileMock,
    }))

    const { getComponentSources } = await import('../../src/lib/component-source')

    await expect(getComponentSources('evil-component')).resolves.toEqual([
      {
        code: 'export const HeroBasic = {}',
        lang: 'ts',
        title: 'src/blocks/HeroBasic/config.ts',
      },
    ])
    expect(readFileMock).not.toHaveBeenCalledWith(escapedPath, 'utf8')
  })

  it('validates embed URLs against approved HTTPS origins', async () => {
    expect(validateEmbedUrl('https://www.youtube.com/embed/VIDEO_ID')).toBe(true)
    expect(getSafeEmbedUrl('https://www.youtube.com/embed/VIDEO_ID')).toBe(
      'https://www.youtube.com/embed/VIDEO_ID',
    )
    expect(validateEmbedUrl('javascript:alert(1)')).toContain('approved HTTPS embed URL')
    expect(validateEmbedUrl('data:text/html,<script>alert(1)</script>')).toContain(
      'approved HTTPS embed URL',
    )
    expect(validateEmbedUrl('https://attacker.example/embed')).toContain('approved HTTPS embed URL')
  })

  it('validates signup form actions as same-origin paths', async () => {
    expect(validateSameOriginFormAction('/api/newsletter')).toBe(true)
    expect(getSafeFormAction('/api/newsletter?source=cta#form')).toBe('/api/newsletter?source=cta#form')
    expect(validateSameOriginFormAction('https://attacker.example/collect')).toContain(
      'same-origin path',
    )
    expect(validateSameOriginFormAction('javascript:alert(1)')).toContain('same-origin path')
    expect(validateSameOriginFormAction('//attacker.example/collect')).toContain('same-origin path')
  })

  it('ships embed iframes with sandboxing and narrowed permissions', async () => {
    const source = await readFile(
      path.join(repoRoot, 'payload-components', 'source', 'blocks', 'EmbedBasic', 'Component.tsx'),
      'utf8',
    )

    expect(source).toContain('sandbox="allow-forms allow-popups allow-presentation allow-scripts"')
    expect(source).toContain('src={safeUrl}')
    expect(source).not.toContain('clipboard-write')
    expect(source).not.toContain('web-share')
  })

  it('ships signup forms that fall back when the stored action is unsafe', async () => {
    const source = await readFile(
      path.join(
        repoRoot,
        'payload-components',
        'source',
        'blocks',
        'CallToActionSignup',
        'Component.tsx',
      ),
      'utf8',
    )

    expect(source).toContain("const formAction = getSafeFormAction(action) ?? '#'")
    expect(source).toContain('action={formAction}')
  })
})
