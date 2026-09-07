import { buildInventory, selectInstalled } from '../inventory'
import { writeCommandOutput } from '../command-output'

import type { InventoryEntry } from '../inventory'

const formatState = (entry: InventoryEntry) => {
  if (!entry.installed) {
    return 'available'
  }

  if (entry.installed.status === 'partial') {
    const stage = entry.installed.lastError ? ` at ${entry.installed.lastError.stage}` : ''

    return `partial${stage} — run "payload-components add ${entry.name}"`
  }

  if (entry.updateAvailable) {
    const suffix = entry.breakingUpdate
      ? ' — BREAKING, run "payload-components diff" first'
      : ` — run "payload-components update ${entry.name}"`

    return `${entry.installed.manifestVersion} → ${entry.version}${suffix}`
  }

  return `${entry.installed.manifestVersion} up to date`
}

const padRight = (value: string, width: number) => value.padEnd(width, ' ')

const formatRows = (entries: InventoryEntry[]) => {
  const nameWidth = Math.max(...entries.map(({ name }) => name.length))

  return entries.map((entry) => `  ${padRight(entry.name, nameWidth)}  ${formatState(entry)}`)
}

export const listCommand = async ({ cwd, json = false }: { cwd: string; json?: boolean }) => {
  const inventory = await buildInventory({ cwd })

  if (json) {
    writeCommandOutput(`${JSON.stringify(inventory, null, 2)}\n`)
    return
  }

  const installed = selectInstalled(inventory)
  const available = inventory.entries.filter((entry) => entry.installed === null)
  const lines = [
    `payload-components: ${inventory.entries.length} component${inventory.entries.length === 1 ? '' : 's'} in the registry, ${installed.length} recorded in ${cwd}`,
  ]

  if (installed.length > 0) {
    lines.push('', 'Installed:', ...formatRows(installed))
  }

  if (inventory.orphaned.length > 0) {
    lines.push(
      '',
      'Recorded without a matching manifest:',
      ...inventory.orphaned.map((componentName) => `  ${componentName}`),
    )
  }

  if (available.length > 0) {
    lines.push(
      '',
      `Available (${available.length}):`,
      ...available.map((entry) => `  ${entry.name}`),
    )
  }

  lines.push('', 'Add one with "payload-components add <component>".')

  writeCommandOutput(`${lines.join('\n')}\n`)
}
