import path from 'node:path'

import { assertSeedableInstall, getPayloadConfigFile } from '../commands/seed'
import { writeSeedScript, type SeedTarget } from './seed-script'

import type { ComponentManifest, DetectedProject } from '../types'
import type { TemplateInstallManifest, TemplateInstallPage } from '../templates'

/* Seeding a template means one draft Page per page of the concept, not one page
 * with every block of every page stacked on it. Each page therefore gets its own
 * generated script, and `writeSeedScript` is reused exactly as it is — the same
 * ownership record, operation-token journalling, and adopt-or-refuse rules that
 * back a single-component seed.
 *
 * The one thing that could not be reused as-is is the ownership key. It used to
 * be derived from the first manifest, and every shipped template starts three to
 * five of its pages with the same block, so those pages would all have claimed
 * the same record. Each page now declares its own identity instead. */

export type TemplateSeedPlan = {
  componentNames: string[]
  label: string
  scriptRelPath: string
  slug: string
}

/* A page path of '' is the template's home page — a slug has to be non-empty or
 * the generated find-clause matches nothing. */
export const templatePageKey = (page: Pick<TemplateInstallPage, 'path'>) =>
  page.path === '' ? 'home' : page.path

export const buildTemplateSeedTarget = ({
  configFileRelPath,
  page,
  template,
}: {
  configFileRelPath: string
  page: TemplateInstallPage
  template: TemplateInstallManifest
}): SeedTarget => {
  const pageKey = templatePageKey(page)
  const identity = `${template.slug}-${pageKey}`

  return {
    configFileRelPath,
    marker: `payload-components:demo:template:${identity}`,
    ownership: {
      id: `template:${template.slug}:${pageKey}`,
      /* The template revision changes exactly when its composition does, so a
         stale record is refused rather than silently reused against new blocks. */
      version: `${template.revision}.0.0`,
    },
    ownershipStateRelPath: path.join(
      '.payload-components',
      'demo-state',
      `template-${identity}.json`,
    ),
    scriptRelPath: path.join('payload-components', `seed-template-${identity}.ts`),
    slug: `payload-components-demo-${identity}`,
    title: `${template.title} — ${page.label}`,
  }
}

/* Writes one seed script per template page. Every block of every page runs the
 * same install gate a standalone `seed` runs, so a half-installed template fails
 * before anything is written. */
export const writeTemplateSeedScripts = async ({
  cwd,
  project,
  template,
}: {
  cwd: string
  project: DetectedProject
  template: TemplateInstallManifest
}): Promise<TemplateSeedPlan[]> => {
  const configFileRelPath = await getPayloadConfigFile(project)
  const manifests = new Map<string, ComponentManifest>()

  for (const componentName of template.components) {
    manifests.set(
      componentName,
      await assertSeedableInstall({ componentName, cwd, project }),
    )
  }

  const plans: TemplateSeedPlan[] = []

  for (const page of template.pages) {
    const target = buildTemplateSeedTarget({ configFileRelPath, page, template })
    const pageManifests = page.components.map((componentName) => {
      const manifest = manifests.get(componentName)

      if (!manifest) {
        throw new Error(
          `Template "${template.slug}" page "${page.label}" references "${componentName}", which is not in the template's component list.`,
        )
      }

      return manifest
    })

    await writeSeedScript(cwd, pageManifests, target)

    plans.push({
      componentNames: page.components,
      label: page.label,
      scriptRelPath: target.scriptRelPath,
      slug: target.slug,
    })
  }

  return plans
}
