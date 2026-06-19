import type { Block } from 'payload'

import { faqFields } from '@/blocks/shared/faqFields'
import { iconField } from '@/blocks/shared/faqIcons'

export const FaqGrouped: Block = {
  slug: 'faqGrouped',
  interfaceName: 'FaqGroupedBlock',
  fields: [
    // Shared FAQ core (eyebrow, title, description). This variant buckets
    // questions under titled, icon-tagged groups, so it defines a nested
    // groups array rather than the shared faqItemsField.
    ...faqFields,
    {
      name: 'groups',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        iconField,
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'FAQ Grouped Blocks',
    singular: 'FAQ Grouped',
  },
}
