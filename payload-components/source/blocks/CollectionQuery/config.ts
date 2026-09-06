import type { Block } from 'payload'

export const CollectionQuery: Block = {
  slug: 'collectionQuery',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_col_que',
  interfaceName: 'CollectionQueryBlock',
  fields: [
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Latest posts', value: 'collection' },
        { label: 'Manual selection', value: 'selection' },
      ],
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 6,
      max: 24,
      min: 1,
      required: true,
    },
    {
      name: 'sort',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: '-publishedAt',
      options: [
        { label: 'Newest first', value: '-publishedAt' },
        { label: 'Oldest first', value: 'publishedAt' },
        { label: 'Title A–Z', value: 'title' },
        { label: 'Title Z–A', value: '-title' },
      ],
      required: true,
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      relationTo: 'posts',
    },
    {
      name: 'enablePagination',
      type: 'checkbox',
      defaultValue: false,
      admin: { condition: (_, siblingData) => siblingData.populateBy === 'collection' },
    },
    {
      name: 'enableFilters',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description:
          'Show category links. Selecting categories above limits the available choices.',
      },
    },
    {
      name: 'queryKey',
      type: 'text',
      defaultValue: 'posts',
      admin: {
        description:
          'Fallback URL namespace when rendering outside a saved Page block. Use a unique key per instance.',
      },
    },
    {
      name: 'emptyMessage',
      type: 'text',
      defaultValue: 'No posts found. Try another category or check back soon.',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Featured', value: 'featured' },
      ],
      required: true,
    },
  ],
  labels: {
    plural: 'Collection Query Blocks',
    singular: 'Collection Query',
  },
}
