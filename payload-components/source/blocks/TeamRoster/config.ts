import type { Block } from 'payload'

import { teamFields, teamMemberFields } from '@/blocks/shared/teamFields'

export const TeamRoster: Block = {
  slug: 'teamRoster',
  interfaceName: 'TeamRosterBlock',
  fields: [
    // Shared team core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/teamFields.
    ...teamFields,
    {
      name: 'groups',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Groups',
        singular: 'Group',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'members',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 12,
          admin: {
            initCollapsed: true,
          },
          // Shared member shape — see @/blocks/shared/teamFields.
          fields: teamMemberFields,
        },
      ],
    },
  ],
  labels: {
    plural: 'Team Roster Blocks',
    singular: 'Team Roster',
  },
}
