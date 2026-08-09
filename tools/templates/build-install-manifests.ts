import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { templateShowcases } from '../../src/lib/templates/registry'

/* Templates are authored once, as site data under src/lib/templates. The CLI
 * cannot import that — it ships as a bundled package with no site code — so this
 * derives the install contract (which blocks each template and page needs) into
 * plain JSON the CLI reads at runtime. Curated section copy stays site-side: the
 * install contract is about which blocks to wire, not what to write in them.
 *
 * Generated files are committed and checked for reproducibility by
 * tests/int/template-install-manifests.int.spec.ts, the same way the public
 * registry is. Run `pnpm templates:build` after editing any template. */

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

const repoRoot = process.cwd()

export const templateManifestsDir = path.join(repoRoot, 'payload-components', 'templates')

export const buildTemplateInstallManifest = (
  template: (typeof templateShowcases)[number],
): TemplateInstallManifest => {
  const pages = template.pages.map((page) => ({
    /* Section order is the page's block order, deduplicated: installing the same
     * block twice is a no-op, but the list reads as the wiring checklist. */
    components: [...new Set(page.sections.map((section) => section.componentSlug))],
    label: page.label,
    path: page.path,
    title: page.title,
  }))

  return {
    category: template.category,
    components: [...new Set(pages.flatMap((page) => page.components))].sort(),
    description: template.description,
    pages,
    revision: template.revision,
    slug: template.slug,
    summary: template.summary,
    title: template.title,
    version: 1,
  }
}

export const buildTemplateInstallManifests = () =>
  templateShowcases.map((template) => buildTemplateInstallManifest(template))

export const serializeTemplateInstallManifest = (manifest: TemplateInstallManifest) =>
  `${JSON.stringify(manifest, null, 2)}\n`

const main = async () => {
  const manifests = buildTemplateInstallManifests()
  const expectedFiles = new Set(manifests.map(({ slug }) => `${slug}.json`))

  await mkdir(templateManifestsDir, { recursive: true })

  const existingFiles = await readdir(templateManifestsDir).catch(() => [] as string[])

  for (const fileName of existingFiles) {
    if (fileName.endsWith('.json') && !expectedFiles.has(fileName)) {
      await rm(path.join(templateManifestsDir, fileName))
      process.stdout.write(`Removed stale ${fileName}\n`)
    }
  }

  for (const manifest of manifests) {
    await writeFile(
      path.join(templateManifestsDir, `${manifest.slug}.json`),
      serializeTemplateInstallManifest(manifest),
      'utf8',
    )
    process.stdout.write(
      `Generated ${manifest.slug}.json (${manifest.components.length} components, ${manifest.pages.length} pages)\n`,
    )
  }

  process.stdout.write(`Generated ${manifests.length} template install manifests.\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]).includes('build-install-manifests')) {
  await main()
}
