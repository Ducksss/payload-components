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
  'feature-grid-basic': ['badge', 'card'],
  'hero-basic': ['badge'],
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
    expect(packageJson.scripts?.prebuild).toBe('pnpm source:build && pnpm registry:build')
  })

  it('defines directory-ready registry item metadata without embedded file content', async () => {
    const registry = await readJson<RegistryDefinition>(
      path.join(repoRoot, 'payload-kits', 'registry.json'),
    )

    expect(registry).toMatchObject({
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      homepage: 'https://github.com/Ducksss/payload-components',
      name: 'payload-kits',
    })
    expect(registry.items.map((item) => item.name).sort()).toEqual([
      'feature-grid-basic',
      'hero-basic',
    ])

    for (const item of registry.items) {
      expect(item.type).toBe('registry:block')
      expect(item.title).toBeTruthy()
      expect(item.description).toBeTruthy()
      expect(item.docs).toContain(`payload-kit add ${item.name}`)
      expect(item.docs).toContain(`/r/${item.name}.json`)
      expect(item.registryDependencies).toEqual(expectedRegistryDependencies[item.name])
      expect(item.meta?.payloadKit).toMatchObject({
        installCommand: `payload-kit add ${item.name}`,
        postInstall: ['generate:types', 'generate:importmap'],
        requiresPayloadKitWrapper: true,
        supportedTargets: ['payload-website-starter'],
      })

      expect(item.files?.length).toBeGreaterThan(0)

      for (const file of item.files ?? []) {
        expect(file.content).toBeUndefined()
        expect(file.path).toMatch(/^payload-kits\/source\/blocks\//)
        expect(file.target).toBe(file.path.replace(/^payload-kits\/source/, '~/src'))
        expect(file.type).toBe('registry:file')
      }
    }
  })

  it('generates a flat public registry that matches the source registry', async () => {
    const { buildRegistryForCheck } = await import('../../tools/payload-kit/check-public-registry')
    const sourceRegistry = await readJson<RegistryDefinition>(
      path.join(repoRoot, 'payload-kits', 'registry.json'),
    )
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
          expect(generatedFile.content).toBe(
            await readFile(path.join(repoRoot, generatedFile.path), 'utf8'),
          )
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
