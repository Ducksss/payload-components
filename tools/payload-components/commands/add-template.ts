import { buildInventory } from '../inventory'
import { detectProject } from '../project'
import { writeTemplateSeedScripts } from '../seed/template-seed'
import { loadTemplateManifest, type TemplateInstallManifest } from '../templates'
import { printHeader } from '../utils'

import { addCommand, warnWhenNoLocalesDeclared } from './add'
import { getPayloadRunCommand } from './seed'

const formatPlan = ({
  cwd,
  dryRun,
  installedNames,
  localized,
  template,
}: {
  cwd: string
  dryRun: boolean
  installedNames: string[]
  localized: boolean
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
    ...(localized
      ? [
          '',
          'Localization:',
          `  every block's text fields marked localized: true (${template.components.length} configs)`,
        ]
      : []),
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
  demo = false,
  dryRun = false,
  localized = false,
  templateSlug,
}: {
  cwd: string
  demo?: boolean
  dryRun?: boolean
  localized?: boolean
  templateSlug: string
}) => {
  const template = await loadTemplateManifest(templateSlug)

  /* Fail on an unsupported repo shape before installing anything, rather than
     part-way through a 20-block template. */
  const project = await detectProject(cwd)

  const inventory = await buildInventory({ cwd })
  const installedNames = inventory.entries
    .filter((entry) => entry.installed?.status === 'installed')
    .map(({ name }) => name)

  printHeader(formatPlan({ cwd, dryRun, installedNames, localized, template }))

  if (dryRun) {
    return
  }

  for (const componentName of template.components) {
    /* One notice for the template, not one per block: a 20-block template would
       otherwise repeat the same locale warning 20 times. */
    await addCommand({ componentName, cwd, deferLocaleNotice: true, localized })
  }

  if (localized) {
    await warnWhenNoLocalesDeclared({ cwd, project })
  }

  printHeader(
    [
      `payload-components: installed ${template.components.length} blocks for "${template.slug}".`,
      demo
        ? `  Next: run the ${template.pages.length} seed scripts below, then edit the drafts in /admin.`
        : `  Next: create the ${template.pages.length} pages above in /admin and add each page's blocks in order.`,
      `  Preview the concept: https://www.payload-components.xyz/templates/${template.slug}`,
    ].join('\n'),
  )

  if (!demo) {
    return
  }

  const plans = await writeTemplateSeedScripts({ cwd, project, template })

  printHeader(
    [
      `payload-components: wrote ${plans.length} seed script${plans.length === 1 ? '' : 's'} for "${template.slug}".`,
      '',
      'Run each one in this project:',
      ...plans.map(
        (plan) => `  ${getPayloadRunCommand(project.packageManager, plan.scriptRelPath)}`,
      ),
      '',
      'Each creates one draft Page and never publishes it:',
      ...plans.map((plan) => `  /${plan.slug} — ${plan.label}`),
      '',
      "Blocks are filled with each block's own sample content, not the curated copy on the",
      'template preview. Rewrite it in /admin — that is the point of a draft.',
    ].join('\n'),
  )
}
