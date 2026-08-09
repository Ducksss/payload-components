import type { ArrayField, Field } from 'payload'

import { link, type LinkAppearances } from '@/fields/link'

type LinkGroupType = (options?: {
  appearances?: false | LinkAppearances[]
  overrides?: Partial<ArrayField>
}) => Field

/**
 * A repeatable list of links, stored as `links: [{ link: { … } }]`.
 *
 * Mirrors the field the Payload website starter ships at
 * `src/fields/linkGroup.ts`. Installed blocks compose it into their own field
 * lists — `linkGroup({ overrides: { maxRows: 2, minRows: 1 } })` — and render the
 * result through `CMSLink`, so the stored shape has to match what those blocks
 * read.
 */
export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    fields: [
      link({
        appearances,
      }),
    ],
  }

  return { ...generatedLinkGroup, ...overrides } as Field
}
