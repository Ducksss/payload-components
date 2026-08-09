import { buildInventory } from '../inventory'
import { loadAllTemplateManifests } from '../templates'

export const templatesCommand = async ({
  cwd,
  json = false,
}: {
  cwd: string
  json?: boolean
}) => {
  const templates = await loadAllTemplateManifests()

  if (json) {
    process.stdout.write(`${JSON.stringify({ templates }, null, 2)}\n`)
    return
  }

  const inventory = await buildInventory({ cwd })
  const installedNames = new Set(
    inventory.entries
      .filter((entry) => entry.installed?.status === 'installed')
      .map(({ name }) => name),
  )
  const lines = [
    `payload-components: ${templates.length} template${templates.length === 1 ? '' : 's'}`,
    '',
  ]

  for (const template of templates) {
    const installed = template.components.filter((name) => installedNames.has(name)).length

    lines.push(
      `  ${template.slug}`,
      `    ${template.summary}`,
      `    ${template.components.length} blocks (${installed} already installed), ${template.pages.length} pages`,
    )
  }

  lines.push('', 'Install one with "payload-components add-template <template>".')

  process.stdout.write(`${lines.join('\n')}\n`)
}
