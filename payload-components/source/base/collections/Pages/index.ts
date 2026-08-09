import type { CollectionConfig } from 'payload'

/**
 * The collection installed page blocks register themselves in.
 *
 * Mirrors the collection the Payload website starter ships at
 * `src/collections/Pages/index.ts`, reduced to the contract the installer needs:
 *
 *   - the slug `pages`, which generated demo seeds query
 *   - a `layout` field of type `blocks`, which is the anchor
 *     `payload-components add` patches to register a block
 *   - drafts enabled, which every generated seed requires before it will write
 *
 * Keep the `name: 'layout'` and `type: 'blocks'` lines intact, or project
 * detection stops recognising this repository.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      // payload-components registers installed page blocks in this array.
      blocks: [],
      required: true,
    },
  ],
  versions: {
    drafts: true,
  },
}
