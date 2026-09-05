import type { Block } from 'payload'

import { validateEmbedUrl } from '@/blocks/shared/safeUrls'

export const EmbedBasic: Block = {
  slug: 'embedBasic',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_emb_bas',
  interfaceName: 'EmbedBasicBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      custom: { payloadComponents: { localization: 'global' } },
      required: true,
      validate: validateEmbedUrl,
      admin: {
        description: 'Approved HTTPS embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID).',
      },
    },
    {
      name: 'title',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
      admin: {
        description: 'Accessible title announced to screen readers for the embedded frame.',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      required: true,
      defaultValue: '16:9',
      options: [
        { label: '16:9 (widescreen video)', value: '16:9' },
        { label: '4:3 (standard video)', value: '4:3' },
        { label: '1:1 (square)', value: '1:1' },
        { label: '21:9 (ultrawide)', value: '21:9' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'allowFullscreen',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  labels: {
    plural: 'Embed Basic Blocks',
    singular: 'Embed Basic',
  },
}
