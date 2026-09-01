import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'collections/server'

import { getComponentManifest, getComponentRegistryDependencies } from '@/lib/component-manifest'
import { regroupComponentTree } from '@/lib/component-page-tree'
import { docsContentRoute, docsImageRoute, docsRoute } from '@/lib/site'

export const source = loader({
  baseUrl: docsRoute,
  // Inline transformer (not a typed object) so it stays decoupled from the loader's
  // inferred storage generic — see the gotcha in component-page-tree.tsx.
  pageTree: { transformers: [{ root: regroupComponentTree }] },
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
})

type SourcePage = (typeof source)['$inferPage']

export function getPageImage(page: SourcePage) {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  }
}

export function getPageMarkdownUrl(page: SourcePage) {
  const segments = [...page.slugs, 'content.md']

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
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

export async function getLLMText(page: SourcePage) {
  const processed = await page.data.getText('processed')
  const contract =
    page.slugs.length === 2 && page.slugs[0] === 'components'
      ? await componentInstallContract(page)
      : ''

  return `# ${page.data.title} (${page.url})

${processed}${contract}`
}
