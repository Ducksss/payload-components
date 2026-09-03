import type { Block } from 'payload'

import { teamFields, teamMemberFields } from '@/blocks/shared/teamFields'

export const TeamBios: Block = {
  slug: 'teamBios',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_tea_bio',
  interfaceName: 'TeamBiosBlock',
  fields: [
    // Shared team core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/teamFields.
    ...teamFields,
    {
      name: 'description',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'members',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      // Shared member shape plus the bio this variant renders — see
      // @/blocks/shared/teamFields. Appending here keeps `bio` off the compact
      // team-grid and team-roster schemas, which have no room to show it.
      fields: [
        ...teamMemberFields,
        {
          name: 'bio',
          type: 'textarea',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Team Bios Blocks',
    singular: 'Team Bios',
  },
}
