import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { repoRoot, runCommand, shadcnCliPackage } from './utils'

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
  meta?: unknown
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

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const assertEqual = (actual: unknown, expected: unknown, message: string) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message)
  }
}

const assertNoEmbeddedSourceContent = (registry: RegistryDefinition) => {
  for (const item of registry.items) {
    for (const file of item.files ?? []) {
      if (typeof file.content === 'string') {
        throw new Error(`Source registry item "${item.name}" embeds content for "${file.path}".`)
      }
    }
  }
}

export const buildRegistryForCheck = async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-check-'))

  await runCommand({
    args: ['dlx', shadcnCliPackage, 'build', 'payload-components/registry.json', '--output', outputDir, '--cwd', '.'],
    command: 'pnpm',
    cwd: repoRoot,
  })

  return outputDir
}

export const assertGeneratedRegistryMatchesSource = async (publicRegistryDir: string) => {
  const publicRegistryPath = path.join(publicRegistryDir, 'registry.json')

  if (!existsSync(publicRegistryPath)) {
    throw new Error('Missing generated registry.json.')
  }

  const sourceRegistry = await readJson<RegistryDefinition>(registryDefinitionPath)
  const publicRegistry = await readJson<RegistryDefinition>(publicRegistryPath)

  assertNoEmbeddedSourceContent(sourceRegistry)
  assertEqual(publicRegistry, sourceRegistry, 'generated registry.json is out of date with payload-components/registry.json.')

  for (const sourceItem of sourceRegistry.items) {
    const publicItemPath = path.join(publicRegistryDir, `${sourceItem.name}.json`)

    if (!existsSync(publicItemPath)) {
      throw new Error(`Missing generated registry item ${sourceItem.name}.json.`)
    }

    const publicItem = await readJson<RegistryItem>(publicItemPath)

    assertEqual(
      {
        description: publicItem.description,
        docs: publicItem.docs,
        files: publicItem.files?.map(({ content: _content, ...file }) => file),
        meta: publicItem.meta,
        name: publicItem.name,
        registryDependencies: publicItem.registryDependencies,
        title: publicItem.title,
        type: publicItem.type,
      },
      {
        description: sourceItem.description,
        docs: sourceItem.docs,
        files: sourceItem.files,
        meta: sourceItem.meta,
        name: sourceItem.name,
        registryDependencies: sourceItem.registryDependencies,
        title: sourceItem.title,
        type: sourceItem.type,
      },
      `${sourceItem.name}.json metadata is out of date.`,
    )

    for (const generatedFile of publicItem.files ?? []) {
      if (typeof generatedFile.content !== 'string') {
        throw new Error(`Generated file "${generatedFile.path}" in "${sourceItem.name}" is missing content.`)
      }

      const sourceContent = await readFile(path.join(repoRoot, generatedFile.path), 'utf8')

      if (generatedFile.content !== sourceContent) {
        throw new Error(`Generated content for "${generatedFile.path}" in "${sourceItem.name}" is out of date.`)
      }
    }
  }
}

export const checkPublicRegistry = async () => {
  const outputDir = await buildRegistryForCheck()

  try {
    await assertGeneratedRegistryMatchesSource(outputDir)
  } finally {
    await rm(outputDir, {
      force: true,
      recursive: true,
    })
  }
}

const isMain = () => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  checkPublicRegistry()
    .then(() => {
      process.stdout.write('public shadcn registry artifacts are reproducible.\n')
    })
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
}
