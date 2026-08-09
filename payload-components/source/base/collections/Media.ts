import type { CollectionConfig } from 'payload'

/**
 * The upload collection installed blocks point at.
 *
 * Mirrors the collection the Payload website starter ships at
 * `src/collections/Media.ts`, trimmed to what the registry needs: any block that
 * renders `<Media resource={…} />` stores a relation to `media`, so the
 * collection has to exist under that exact slug.
 *
 * `alt` is required on purpose — every `Media` render emits it, and an upload
 * with no alt text is an accessibility defect the CMS should refuse to create.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
