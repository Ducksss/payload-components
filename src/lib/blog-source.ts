import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import { blog } from 'collections/server'

import { blogRoute } from '@/lib/site'

// `defineCollections({ type: 'doc' })` yields a flat page array (unlike
// `defineDocs`, which returns an object with `.toFumadocsSource()`), so we wrap
// it with the standalone helper. No meta tree — the blog is a flat surface.
export const blogSource = loader({
  baseUrl: blogRoute,
  source: toFumadocsSource(blog, []),
})

type BlogPage = (typeof blogSource)['$inferPage']

export function getBlogPages() {
  return [...blogSource.getPages()].sort((a, b) => {
    const dateDifference = new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    return dateDifference || a.data.publicationOrder - b.data.publicationOrder
  })
}

export async function getBlogLLMText(page: BlogPage) {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

Author: ${page.data.author}
Published: ${new Date(page.data.date).toISOString()}

${processed}`
}
