import { readdir } from 'node:fs/promises'
import path from 'node:path'

import { isPathInside, readJsonFile, repoRoot } from './utils'

const templatesDir = path.join(repoRoot, 'payload-components', 'templates')
const templateSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type TemplateInstallPage = {
  components: string[]
  label: string
  path: string
  title: string
}

export type TemplateInstallManifest = {
  category: string
  components: string[]
  description: string
  pages: TemplateInstallPage[]
  revision: number
  slug: string
  summary: string
  title: string
  version: 1
}

const unknownTemplateError = (slug: string) =>
  new Error(
    `Unknown template "${slug}". Run "payload-components templates" to see the available templates.`,
  )

export const listTemplateSlugs = async () => {
  const files = await readdir(templatesDir).catch(() => [] as string[])

  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort()
}

export const loadTemplateManifest = async (slug: string): Promise<TemplateInstallManifest> => {
  if (!templateSlugPattern.test(slug)) {
    throw unknownTemplateError(slug)
  }

  const manifestPath = path.resolve(templatesDir, `${slug}.json`)

  if (!isPathInside(templatesDir, manifestPath)) {
    throw unknownTemplateError(slug)
  }

  const manifest = await readJsonFile<TemplateInstallManifest>(manifestPath).catch(() => {
    throw unknownTemplateError(slug)
  })

  if (manifest.version !== 1) {
    throw new Error(
      `Template "${slug}" declares unsupported manifest version "${String(manifest.version)}".`,
    )
  }

  if (manifest.slug !== slug) {
    throw new Error(`Template "${slug}" declares mismatched slug "${manifest.slug}".`)
  }

  if (manifest.components.length === 0) {
    throw new Error(`Template "${slug}" lists no components.`)
  }

  return manifest
}

export const loadAllTemplateManifests = async () => {
  const slugs = await listTemplateSlugs()

  return await Promise.all(slugs.map((slug) => loadTemplateManifest(slug)))
}
