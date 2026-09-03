import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import type { Folder, Node, Root } from 'fumadocs-core/page-tree'
import { docs } from 'collections/server'

import { getComponentManifest, getComponentRegistryDependencies } from '@/lib/component-manifest'
import { regroupComponentTree } from '@/lib/component-page-tree'
import {
  defaultSiteLocale,
  localePathPrefix,
  localizeHref,
  normalizeSiteLocale,
  type SiteLocale,
} from '@/i18n/config'
import { fumadocsI18n } from '@/lib/i18n'
import { docsContentRoute, docsImageRoute, docsRoute } from '@/lib/site'

export const source = loader({
  baseUrl: docsRoute,
  i18n: fumadocsI18n,
  // Inline transformer (not a typed object) so it stays decoupled from the loader's
  // inferred storage generic — see the gotcha in component-page-tree.tsx.
  pageTree: { transformers: [{ root: regroupComponentTree }] },
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
})

type SourcePage = (typeof source)['$inferPage']

function localizeTreeNode(node: Node, locale: SiteLocale): Node {
  if (node.type === 'page') return { ...node, url: localizeHref(node.url, locale) }
  if (node.type === 'separator') return { ...node }

  const folder: Folder = {
    ...node,
    children: node.children.map((child) => localizeTreeNode(child, locale)),
    index: node.index ? { ...node.index, url: localizeHref(node.index.url, locale) } : undefined,
  }

  return folder
}

/** Fallback pages retain their English source URL; clone the tree so its links
 * still stay inside the visitor's selected locale. */
function localizeTreeRoot(tree: Root, locale: SiteLocale): Root {
  return {
    ...tree,
    children: tree.children.map((node) => localizeTreeNode(node, locale)),
    fallback: tree.fallback ? localizeTreeRoot(tree.fallback, locale) : undefined,
  }
}

export function getLocalizedPageTree(locale: SiteLocale): Root {
  return localizeTreeRoot(source.getPageTree(locale), locale)
}

export function getPageImage(page: SourcePage, locale = normalizeSiteLocale(page.locale)) {
  const segments = [...page.slugs, 'image.png']
  const localePrefix = localePathPrefix(locale)

  return {
    segments,
    url: `${localePrefix}${docsImageRoute}/${segments.join('/')}`,
  }
}

export function getPageMarkdownUrl(page: SourcePage, locale = normalizeSiteLocale(page.locale)) {
  const segments = [...page.slugs, 'content.md']
  const localePrefix = localePathPrefix(locale)

  return {
    segments,
    url: `${localePrefix}${docsContentRoute}/${segments.join('/')}`,
  }
}

/* Component doc pages carry their richest facts in server components
   (<ComponentWiring>, <ComponentRequirements>, <ComponentUsage>), which the
   processed-markdown serializer emits as inert JSX tags — so the .md twins and
   /llms-full.txt delivered stubs. Render the same manifest-derived facts as
   plain markdown so an agent reading the markdown twin can answer "what does
   this install actually change". */
async function componentInstallContract(page: SourcePage) {
  const slug = page.slugs[1]
  const manifest = slug ? await getComponentManifest(slug) : null

  if (!manifest) return ''

  const deps = await getComponentRegistryDependencies(manifest.name)
  const patched = manifest.recovery.patchedFiles
  const pagesPath =
    patched.find((p) => p.includes('collections/Pages')) ?? 'src/collections/Pages/index.ts'
  const renderPath =
    patched.find((p) => p.includes('RenderBlocks')) ?? 'src/blocks/RenderBlocks.tsx'
  const layout = manifest.payloadFragments.find((fragment) => fragment.kind === 'pagesLayout')
  const blockName = layout && 'blockName' in layout ? layout.blockName : manifest.name

  const edits = [
    `- Registers the block in \`${pagesPath}\``,
    `- Maps the renderer in \`${renderPath}\``,
  ]
  if (manifest.postInstall.includes('generate:types')) {
    edits.push('- Regenerates types (`src/payload-types.ts`)')
  }
  if (manifest.postInstall.includes('generate:importmap')) {
    edits.push('- Regenerates the admin import map (`src/app/(payload)/admin/importMap.js`)')
  }

  return [
    '',
    '',
    '## Install contract',
    '',
    `Copies ${manifest.files.length} source ${manifest.files.length === 1 ? 'file' : 'files'}:`,
    '',
    ...manifest.files.map((file) => `- \`${file}\``),
    '',
    `Wiring edits made by \`npx payload-components add ${manifest.name}\`:`,
    '',
    ...edits,
    '',
    'Re-running the install converges: existing wiring is detected and skipped, and install state is recorded in `.payload-components/state.json`.',
    '',
    `Requirements: target ${manifest.supportedTargets.join(', ')}; Payload v${manifest.supports.payloadMajors.join(' / v')}; Next.js ${manifest.supports.nextMajors.join(' / ')}; shadcn UI dependencies: ${deps.length ? deps.join(', ') : 'none'}.`,
    '',
    `Admin usage: add the \`${blockName}\` block to a Page's layout, fill its fields, and publish — it renders through \`RenderBlocks\`, fully typed.`,
  ].join('\n')
}

/* A Chinese route that falls back to the English source keeps `page.url` at
   /docs/…; the heading has to name the URL the agent actually requested. */
export async function getLLMText(page: SourcePage, locale: SiteLocale = defaultSiteLocale) {
  const processed = await page.data.getText('processed')
  const contract =
    page.slugs.length === 2 && page.slugs[0] === 'components'
      ? await componentInstallContract(page)
      : ''

  return `# ${page.data.title} (${localizeHref(page.url, locale)})

${processed}${contract}`
}
