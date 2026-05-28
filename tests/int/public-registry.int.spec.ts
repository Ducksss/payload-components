import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

type RegistryFile = {
  content?: string
  path: string
  target?: string
  type: string
}

type RegistryItem = {
  $schema?: string
  description?: string
  docs?: string
  files?: RegistryFile[]
  meta?: {
    payloadKit?: {
      installMode?: 'payload-kit-required' | 'shadcn-native'
      installCommand?: string
      postInstall?: string[]
      requiresPayloadKitWrapper?: boolean
      supportedTargets?: string[]
    }
  }
  name: string
  registryDependencies?: string[]
  title?: string
  type?: string
}

type RegistryDefinition = {
  $schema?: string
  homepage: string
  items: RegistryItem[]
  name: string
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const expectedRegistryDependencies: Record<string, string[]> = {
  'author-card': ['badge', 'card'],
  'feature-grid-basic': ['badge', 'card'],
  'featured-post': ['badge', 'card'],
  'hero-basic': ['badge'],
  'newsletter-callout': ['input'],
  'post-archive': ['badge', 'card'],
  'post-card': ['badge', 'card'],
  'post-hero': ['badge'],
  'post-list': ['badge'],
  'related-posts': ['badge', 'card'],
}

const expectedInstallModes: Record<string, 'payload-kit-required' | 'shadcn-native'> = {
  'author-card': 'shadcn-native',
  'feature-grid-basic': 'payload-kit-required',
  'featured-post': 'shadcn-native',
  'hero-basic': 'payload-kit-required',
  'newsletter-callout': 'shadcn-native',
  'post-archive': 'shadcn-native',
  'post-card': 'shadcn-native',
  'post-hero': 'shadcn-native',
  'post-list': 'shadcn-native',
  'related-posts': 'shadcn-native',
}

const expectedItemTypes: Record<string, string> = {
  'author-card': 'registry:component',
  'feature-grid-basic': 'registry:block',
  'featured-post': 'registry:component',
  'hero-basic': 'registry:block',
  'newsletter-callout': 'registry:component',
  'post-archive': 'registry:component',
  'post-card': 'registry:component',
  'post-hero': 'registry:component',
  'post-list': 'registry:component',
  'related-posts': 'registry:component',
}

describe('public shadcn registry publication', () => {
  it('has deterministic scripts for building, checking, and publishing registry artifacts', async () => {
    const packageJson = await readJson<{
      devDependencies?: Record<string, string>
      scripts?: Record<string, string>
    }>(path.join(repoRoot, 'package.json'))

    expect(packageJson.devDependencies?.shadcn).toBeUndefined()
    expect(packageJson.scripts?.['registry:build']).toBe(
      'cross-env NODE_OPTIONS=--no-deprecation pnpm dlx shadcn@4.7.0 build payload-kits/registry.json --output public/r --cwd .',
    )
    expect(packageJson.scripts?.['registry:check']).toBe(
      'cross-env NODE_OPTIONS=--no-deprecation tsx tools/payload-kit/check-public-registry.ts',
    )
    expect(packageJson.scripts?.prebuild).toBe('pnpm registry:build')
  })

  it('defines directory-ready registry item metadata without embedded file content', async () => {
    const registry = await readJson<RegistryDefinition>(path.join(repoRoot, 'payload-kits', 'registry.json'))

    expect(registry).toMatchObject({
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      homepage: 'https://github.com/Ducksss/payload-components',
      name: 'payload-kits',
    })
    expect(registry.items.map((item) => item.name).sort()).toEqual([
      'author-card',
      'feature-grid-basic',
      'featured-post',
      'hero-basic',
      'newsletter-callout',
      'post-archive',
      'post-card',
      'post-hero',
      'post-list',
      'related-posts',
    ])

    for (const item of registry.items) {
      expect(item.type).toBe(expectedItemTypes[item.name])
      expect(item.title).toBeTruthy()
      expect(item.description).toBeTruthy()
      expect(item.docs).toContain(`pnpm dlx shadcn@latest add https://payload-components.xyz/r/${item.name}.json`)
      expect(item.docs).toContain(`pnpm dlx shadcn@latest add @payload-kits/${item.name}`)
      expect(item.docs).toContain('"@payload-kits":"https://payload-components.xyz/r/{name}.json"')

      if (expectedInstallModes[item.name] === 'payload-kit-required') {
        expect(item.docs).toContain(`pnpm dlx payload-kit add ${item.name}`)
        expect(item.docs).toContain('Direct shadcn installs copy files and shadcn UI dependencies only.')
        expect(item.docs).toContain(`payload-kit add ${item.name}`)
      } else {
        expect(item.docs).toContain('shadcn-native')
        expect(item.docs).not.toContain('payload-kit add')
      }
      expect(item.registryDependencies).toEqual(expectedRegistryDependencies[item.name])
      expect(item.meta?.payloadKit).toMatchObject({
        installMode: expectedInstallModes[item.name],
        installCommand:
          expectedInstallModes[item.name] === 'payload-kit-required'
            ? `payload-kit add ${item.name}`
            : `shadcn add @payload-kits/${item.name}`,
        postInstall:
          expectedInstallModes[item.name] === 'payload-kit-required'
            ? ['generate:types', 'generate:importmap']
            : [],
        requiresPayloadKitWrapper: expectedInstallModes[item.name] === 'payload-kit-required',
        supportedTargets: ['payload-website-starter'],
      })

      expect(item.files?.length).toBeGreaterThan(0)

      for (const file of item.files ?? []) {
        expect(file.content).toBeUndefined()
        expect(file.path).toMatch(/^src\/(blocks|components\/posts|utilities)\//)
        expect(file.target).toBe(`~/${file.path}`)
        expect(file.type).toBe('registry:file')
      }
    }
  })

  it('generates a flat public registry that matches the source registry', async () => {
    const { buildRegistryForCheck } = await import('../../tools/payload-kit/check-public-registry')
    const sourceRegistry = await readJson<RegistryDefinition>(path.join(repoRoot, 'payload-kits', 'registry.json'))
    const publicRegistryDir = await buildRegistryForCheck()
    const publicRegistryPath = path.join(publicRegistryDir, 'registry.json')

    try {
      expect(existsSync(publicRegistryPath)).toBe(true)

      const publicRegistry = await readJson<RegistryDefinition>(publicRegistryPath)
      expect(publicRegistry).toEqual(sourceRegistry)

      for (const registryItem of sourceRegistry.items) {
        const publicItemPath = path.join(publicRegistryDir, `${registryItem.name}.json`)

        expect(existsSync(publicItemPath)).toBe(true)

        const publicItem = await readJson<RegistryItem>(publicItemPath)

        expect(publicItem).toMatchObject({
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          description: registryItem.description,
          docs: registryItem.docs,
          meta: registryItem.meta,
          name: registryItem.name,
          registryDependencies: registryItem.registryDependencies,
          title: registryItem.title,
          type: registryItem.type,
        })
        expect(publicItem.files?.length).toBe(registryItem.files?.length)

        for (const generatedFile of publicItem.files ?? []) {
          const sourceFile = registryItem.files?.find((file) => file.path === generatedFile.path)

          expect(sourceFile).toBeTruthy()
          expect(generatedFile.type).toBe(sourceFile?.type)
          expect(generatedFile.target).toBe(sourceFile?.target)
          expect(generatedFile.content).toBe(await readFile(path.join(repoRoot, generatedFile.path), 'utf8'))
        }
      }
    } finally {
      await rm(publicRegistryDir, {
        force: true,
        recursive: true,
      })
    }
  }, 30000)
})
