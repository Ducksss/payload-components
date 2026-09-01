import type { Block } from 'payload'

import { createTeamFields, createTeamMemberFields } from '@/blocks/shared/teamFields'

export const TeamGrid: Block = {
  slug: 'teamGrid',
  interfaceName: 'TeamGridBlock',
  fields: [
    // Shared team core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/teamFields.
    ...createTeamFields(),
    {
      name: 'description',
      type: 'textarea',
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
      fields: createTeamMemberFields(),
    },
  ],
  labels: {
    plural: 'Team Grid Blocks',
    singular: 'Team Grid',
  },
}
