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
