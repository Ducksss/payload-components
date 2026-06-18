import type { ReactNode } from 'react'

import type { PageTreeTransformer } from 'fumadocs-core/source'
import { Blocks, FileText, Images, LayoutGrid, LayoutPanelTop, Megaphone, MonitorPlay, Plug } from 'lucide-react'

import { componentEntries } from '@/lib/site'

/**
 * Sidebar grouping for the component docs.
 *
 * The component doc pages live flat in `content/docs/components/` (URLs stay `/docs/components/<slug>`),
 * but the sidebar reads better grouped by install-mode → family → variant:
 *
 *   Page blocks
 *     Hero      → Hero Basic
 *     Feature   → Feature Grid Basic · Split · Bento · Steps
 *   Post components   (only once post components have docs pages)
 *
 * This is a pure page-tree transform applied at render time — it never touches the
 * filesystem, meta.json, URLs, or `componentEntries`, so search/sitemap/structured-data and
 * every `/docs/components/<slug>` link are unaffected. Registered via
 * `loader({ pageTree: { transformers: [regroupComponentTree] } })` in `src/lib/source.ts`.
 */

// Derive the page-tree node types from the transformer signature itself, so we don't
// depend on a specific fumadocs node-type export path. `Parameters<>` drops the `this`
// param, leaving the Root node; its children are the Item | Separator | Folder union.
type RootHook = NonNullable<PageTreeTransformer['root']>
type Root = Parameters<RootHook>[0]
type TreeNode = Root['children'][number]
type Folder = Extract<TreeNode, { type: 'folder' }>
type Item = Extract<TreeNode, { type: 'page' }>

type InstallMode = 'pages' | 'posts'

/* Install modes, in display order. `key` matches `componentEntries[].family`. */
const MODES: { icon: ReactNode; key: InstallMode; label: string }[] = [
  { icon: <Blocks />, key: 'pages', label: 'Page blocks' },
  { icon: <FileText />, key: 'posts', label: 'Post components' },
]

/* Family taxonomy, in display order. A component belongs to a family when its slug equals
   the family key or starts with `<key>-` (hero-basic → Hero; feature-split → Feature).
   Unknown prefixes fall back to a humanized label so new components still group sensibly. */
const FAMILIES: { icon: ReactNode; key: string; label: string }[] = [
  { icon: <LayoutPanelTop />, key: 'hero', label: 'Hero' },
  { icon: <LayoutGrid />, key: 'feature', label: 'Feature' },
  { icon: <MonitorPlay />, key: 'embed', label: 'Embed' },
  { icon: <Images />, key: 'logo-cloud', label: 'Logo cloud' },
  { icon: <Plug />, key: 'integration', label: 'Integration' },
  { icon: <Megaphone />, key: 'call-to-action', label: 'Call to action' },
]

const slugOf = (url: string) => url.split('/').filter(Boolean).pop() ?? ''

const modeOfSlug = (slug: string): InstallMode => {
  // Widened to string: every current component entry is a page block (so the literal type is
  // just 'pages'), but this stays correct once post components (family 'posts') ship.
  const family: string | undefined = componentEntries.find((component) => component.slug === slug)?.family
  return family === 'posts' ? 'posts' : 'pages'
}

export const familyOfSlug = (slug: string): { icon?: ReactNode; key: string; label: string } => {
  const known = FAMILIES.find((family) => slug === family.key || slug.startsWith(`${family.key}-`))
  if (known) return known

  const head = slug.split('-')[0] || slug
  return { key: head, label: head.charAt(0).toUpperCase() + head.slice(1) }
}

const familyRank = (key: string) => {
  const index = FAMILIES.findIndex((family) => family.key === key)
  return index === -1 ? Number.POSITIVE_INFINITY : index
}

/* The components folder is the only top-level folder whose pages live under /docs/components/. */
const isComponentsFolder = (node: TreeNode): node is Folder =>
  node.type === 'folder' &&
  node.children.some((child) => child.type === 'page' && child.url.startsWith('/docs/components/'))

/* Bucket the flat component pages into mode → family folders, preserving each page node
   verbatim (so its already-resolved icon and URL carry over). Empty modes are skipped. */
const buildComponentGroups = (items: Item[]): Folder[] =>
  MODES.flatMap((mode): Folder[] => {
    const modeItems = items.filter((item) => modeOfSlug(slugOf(item.url)) === mode.key)
    if (modeItems.length === 0) return []

    const byFamily = new Map<string, { icon?: ReactNode; items: Item[]; label: string }>()
    for (const item of modeItems) {
      const family = familyOfSlug(slugOf(item.url))
      const bucket = byFamily.get(family.key)
      if (bucket) {
        bucket.items.push(item)
      } else {
        byFamily.set(family.key, { icon: family.icon, items: [item], label: family.label })
      }
    }

    const familyFolders: Folder[] = [...byFamily.entries()]
      .sort(([a], [b]) => familyRank(a) - familyRank(b))
      .map(
        ([, family]): Folder => ({
          children: family.items,
          collapsible: true,
          defaultOpen: true,
          icon: family.icon,
          name: family.label,
          type: 'folder',
        }),
      )

    return [
      {
        children: familyFolders,
        collapsible: true,
        defaultOpen: true,
        icon: mode.icon,
        name: mode.label,
        type: 'folder',
      },
    ]
  })

/* The `root` page-tree transformer hook, kept as a plain Root → Root function so it stays
   decoupled from the loader's storage generic (see source.ts registration). */
export function regroupComponentTree(root: Root): Root {
  const index = root.children.findIndex(isComponentsFolder)
  if (index === -1) return root

  const componentsFolder = root.children[index] as Folder
  const items = componentsFolder.children.filter((child): child is Item => child.type === 'page')
  const groups = buildComponentGroups(items)
  if (groups.length === 0) return root

  const children = [...root.children]
  children.splice(index, 1, ...groups)
  return { ...root, children }
}
