import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getComponentDatasheet } from '@/lib/component-datasheet'
import type { Datasheet } from '@/lib/datasheet'
import { benchTour } from '@/lib/site'

/* Build-time data for the landing bench: the datasheet of every part it shows,
 * and the ledger for the part it installs (hero-basic). Every figure is read
 * from the registry, so the bench can't drift from what the CLI writes. */

type RegistryItem = { files: { path: string }[]; name: string }

export type BenchLedgerRow = {
  action: 'copied' | 'patched' | 'regenerated'
  detail: string
  label: string
}

/* What each host-file patch adds, by construction (tools/payload-components/
 * project.ts): the renderer gains an import and one map entry; the Pages
 * collection gains an import, and its `blocks: [...]` line is rewritten with
 * the block appended. */
const PATCH_STATS = { pages: '+2 −1', renderer: '+2' } as const

export async function getBenchParts(): Promise<Datasheet[]> {
  const datasheets = await Promise.all(benchTour.map((slug) => getComponentDatasheet(slug)))
  return datasheets.filter((datasheet): datasheet is Datasheet => datasheet !== null)
}

async function sourceLines(slug: string) {
  const registry = JSON.parse(
    await readFile(path.join(process.cwd(), 'payload-components', 'registry.json'), 'utf8'),
  ) as { items: RegistryItem[] }
  const item = registry.items.find(({ name }) => name === slug)
  const files = item?.files ?? []
  const counts = await Promise.all(
    files.map(async (file) => {
      const text = await readFile(path.join(process.cwd(), file.path), 'utf8')
      const lines = text.split('\n').length
      return text.endsWith('\n') ? lines - 1 : lines
    }),
  )
  return { files: files.length, lines: counts.reduce((sum, count) => sum + count, 0) }
}

/* One row per output pin, in the drawing's order: the copied source, the two
   patched host files, then what Payload's generators rewrite. */
export async function getBenchLedger(datasheet: Datasheet): Promise<BenchLedgerRow[]> {
  const source = await sourceLines(datasheet.slug)
  const patched = datasheet.outputs.length - 3

  return datasheet.outputs.map((label, index) => {
    if (index === 0) {
      return { action: 'copied', detail: `+${source.lines} · ${source.files} files`, label }
    }
    if (index <= patched) {
      const detail = label.includes('RenderBlocks') ? PATCH_STATS.renderer : PATCH_STATS.pages
      return { action: 'patched', detail, label }
    }
    return { action: 'regenerated', detail: 'by Payload', label }
  })
}
