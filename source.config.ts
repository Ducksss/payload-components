import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // Fumadocs exports the latest Git author date for each tracked source file.
    // Unknown dates stay undefined, so the sitemap can omit them safely.
    lastModified: true,
    schema: pageSchema.extend({
      seoTitle: z.string().optional(),
    }),
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
  postprocess: {
    includeProcessedMarkdown: true,
  },
  schema: pageSchema.extend({
    author: z.string(),
    cover: z.object({
      alt: z.string().min(20),
      src: z.string().regex(/^\/blog\/[a-z0-9-]+\/cover\.webp$/),
    }),
    date: z.string().date().or(z.date()),
    publicationOrder: z.number().int().min(1),
    series: z.enum([
      'project-notes',
      'foundations',
      'installer-internals',
      'component-design',
      'production-guides',
      'open-source',
    ]),
    tags: z.array(z.string()).min(2).max(4),
  }),
})

export default defineConfig()
