import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'collections/server'

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

export async function getLLMText(page: SourcePage) {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
