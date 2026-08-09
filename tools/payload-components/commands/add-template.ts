import { buildInventory } from '../inventory'
import { detectProject } from '../project'
import { loadTemplateManifest, type TemplateInstallManifest } from '../templates'
import { printHeader } from '../utils'

import { addCommand } from './add'

const formatPlan = ({
  cwd,
  dryRun,
  installedNames,
  template,
}: {
  cwd: string
  dryRun: boolean
  installedNames: string[]
  template: TemplateInstallManifest
}) => {
  const pending = template.components.filter((name) => !installedNames.includes(name))
  const lines = [
    dryRun
      ? `payload-components: dry run for template "${template.slug}" in ${cwd}`
      : `payload-components: installing template "${template.slug}" into ${cwd}`,
    `  ${template.title} — ${template.summary}`,
    '',
    `Blocks (${template.components.length}, ${pending.length} not yet installed):`,
    ...template.components.map(
      (name) => `  ${name}${installedNames.includes(name) ? ' (already installed)' : ''}`,
    ),
    '',
    'Pages to assemble in /admin:',
    ...template.pages.flatMap((page) => [
      `  /${page.path} — ${page.label}`,
      `    ${page.components.join(' → ')}`,
    ]),
  ]

  if (dryRun) {
    lines.push('', 'No files were changed and no commands ran.')
  }

  return lines.join('\n')
}

/* Install every block a template composes, in one command.
 *
 * A template is a block set plus a page plan, not a content import: it installs
 * and wires the blocks, then prints which blocks each page uses so you can
 * assemble the pages in the admin. The curated copy shown on the site's template
 * previews is not seeded — use "payload-components seed <component>" for
 * per-block demo content. */
export const addTemplateCommand = async ({
  cwd,
  dryRun = false,
  templateSlug,
}: {
  cwd: string
  dryRun?: boolean
  templateSlug: string
}) => {
  const template = await loadTemplateManifest(templateSlug)

  /* Fail on an unsupported repo shape before installing anything, rather than
     part-way through a 20-block template. */
  await detectProject(cwd)

  const inventory = await buildInventory({ cwd })
  const installedNames = inventory.entries
    .filter((entry) => entry.installed?.status === 'installed')
    .map(({ name }) => name)

  printHeader(formatPlan({ cwd, dryRun, installedNames, template }))

  if (dryRun) {
    return
  }

  for (const componentName of template.components) {
    await addCommand({ componentName, cwd })
  }

  printHeader(
    [
      `payload-components: installed ${template.components.length} blocks for "${template.slug}".`,
      `  Next: create the ${template.pages.length} pages above in /admin and add each page's blocks in order.`,
      `  Preview the concept: https://www.payload-components.xyz/templates/${template.slug}`,
    ].join('\n'),
  )
}
