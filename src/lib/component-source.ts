import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Reads every source file a kit installs, as text, for the docs preview's "Code"
 * tab — the Payload block `config.ts` (the schema), the frontend `Component.tsx`,
 * and any shared `*Fields.ts`. Resolved through `payload-components/registry.json` (the
 * source of truth for each kit's files) so it never drifts from what installs.
 *
 * Reads the target code as a string to *display* it — it never imports or executes
 * it, so the "don't run Payload target code in the site" boundary holds. Runs
 * server-side at build (kit pages are statically generated).
 */
type RegistryFile = { path: string; target: string }
type RegistryItem = { files?: RegistryFile[]; name: string }
type Registry = { items: RegistryItem[] }

export type ComponentSourceFile = { code: string; lang: string; title: string }

/* Block schema first, then the renderer, then shared field bases. */
const fileRank = (target: string) =>
  target.endsWith('config.ts') ? 0 : target.endsWith('Component.tsx') ? 1 : 2

export async function getComponentSources(slug: string): Promise<ComponentSourceFile[]> {
  const repoRoot = process.cwd()

  let registry: Registry
  try {
    registry = JSON.parse(
      await readFile(path.join(repoRoot, 'payload-components', 'registry.json'), 'utf8'),
    ) as Registry
  } catch {
    return []
  }

  const files = registry.items.find((item) => item.name === slug)?.files ?? []

  const sources = await Promise.all(
    [...files]
      .sort((a, b) => fileRank(a.target) - fileRank(b.target))
      .map(async (file): Promise<ComponentSourceFile | null> => {
        try {
          const code = (await readFile(path.join(repoRoot, file.path), 'utf8')).trimEnd()
          const title = file.target.replace(/^~\//, '')
          return { code, lang: title.endsWith('.tsx') ? 'tsx' : 'ts', title }
        } catch {
          return null
        }
      }),
  )

  return sources.filter((source): source is ComponentSourceFile => source !== null)
}
