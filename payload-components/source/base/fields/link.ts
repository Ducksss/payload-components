import type { Field, GroupField } from 'payload'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: { label: 'Default', value: 'default' },
  outline: { label: 'Outline', value: 'outline' },
}

type LinkType = (options?: {
  appearances?: false | LinkAppearances[]
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

/**
 * A single editor-facing link: either an internal reference to a Page or a
 * custom URL, with an optional appearance the frontend maps to a button style.
 *
 * Mirrors the field the Payload website starter ships at `src/fields/link.ts`,
 * because that is the shape every installed block's `CMSLink` reads and the
 * shape the registry's sample content is written against.
 *
 * Pass `appearances: false` to drop the style selector entirely.
 */
export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              { label: 'Internal link', value: 'reference' },
              { label: 'Custom URL', value: 'custom' },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: { alignSelf: 'flex-end' },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (disableLabel) {
    linkTypes[0].admin = { ...linkTypes[0].admin, width: '50%' }
    linkTypes[1].admin = { ...linkTypes[1].admin, width: '50%' }

    linkResult.fields.push({ type: 'row', fields: linkTypes })
  } else {
    linkResult.fields.push(...linkTypes, {
      name: 'label',
      type: 'text',
      label: 'Label',
      required: true,
    })
  }

  if (appearances !== false) {
    const appearanceOptionsToUse = (appearances ?? ['default', 'outline']).map(
      (appearance) => appearanceOptions[appearance],
    )

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return { ...linkResult, ...overrides }
}
