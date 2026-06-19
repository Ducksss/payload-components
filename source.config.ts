import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
})

// The blog is a flat collection (no sidebar/meta tree). We extend the shared
// pageSchema with the post metadata the blog index and post header render.
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    author: z.string(),
    date: z.string().date().or(z.date()),
  }),
})

export default defineConfig()
