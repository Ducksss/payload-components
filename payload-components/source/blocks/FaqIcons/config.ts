import type { Block } from 'payload'

import { faqFields } from '@/blocks/shared/faqFields'
import { iconField } from '@/blocks/shared/faqIcons'

export const FaqIcons: Block = {
  slug: 'faqIcons',
  interfaceName: 'FaqIconsBlock',
  fields: [
    // Shared FAQ core (eyebrow, title, description). The item shape adds a
    // per-question icon, so this variant defines its own items array rather
    // than the shared faqItemsField.
    ...faqFields,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        iconField,
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
  labels: {
    plural: 'FAQ Icons Blocks',
    singular: 'FAQ Icons',
  },
}
