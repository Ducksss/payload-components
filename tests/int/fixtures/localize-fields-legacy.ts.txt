import type { Field } from 'payload'

/**
 * Mark a block's editorial text as localized.
 *
 * Payload localization is per field: `localized: true` stores a value per
 * configured locale. `localizeFields` walks a block's field list and sets it on
 * the leaf fields an editor writes prose into — `text`, `textarea`, and
 * `richText` — recursing through the containers those fields live in.
 *
 * Installed by `payload-components add <component> --localized`, which also
 * wraps the block config's `fields` array in this call:
 *
 * ```ts
 * export const HeroBasic: Block = {
 *   fields: localizeFields([...heroFields, { name: 'proofItems', type: 'array', fields: [...] }]),
 * }
 * ```
 *
 * Because the wrap happens after the shared family base is spread in, one call
 * covers both shared and variant-specific fields.
 *
 * Deliberate limits:
 * - Containers themselves are never marked. Payload rejects a localized field
 *   nested inside a localized parent, so localizing only leaves keeps every
 *   combination valid and makes the transform safe to re-apply.
 * - A field that already declares `localized` is left exactly as authored, so
 *   your own choices always win.
 * - Non-prose fields (`select`, `upload`, `relationship`, `number`, `checkbox`,
 *   and link `url`s) stay single-value. Localize those by hand where you want
 *   per-locale media or targets — the decision is content modelling, not a
 *   mechanical default.
 *
 * Localization must also be enabled at the config level, or `localized: true`
 * has no effect:
 *
 * ```ts
 * export default buildConfig({
 *   localization: { defaultLocale: 'en', locales: ['en', 'de'] },
 * })
 * ```
 *
 * Adding localization to a collection that already holds data changes how that
 * data is stored — migrate an existing database before adopting it.
 */

/* Narrowing on `field.type` rather than importing Payload's internal field
   guards: the discriminant is part of Payload's public Field union, so this stays
   type-safe without depending on helper exports that move between releases. */
const LOCALIZED_LEAF_TYPES = ['richText', 'text', 'textarea'] as const

type LocalizedLeafType = (typeof LOCALIZED_LEAF_TYPES)[number]

const isLocalizedLeaf = (field: Field): field is Extract<Field, { type: LocalizedLeafType }> =>
  LOCALIZED_LEAF_TYPES.includes(field.type as LocalizedLeafType)

const localizeField = (field: Field): Field => {
  if (isLocalizedLeaf(field)) {
    return 'localized' in field && field.localized !== undefined
      ? field
      : { ...field, localized: true }
  }

  if (field.type === 'array' || field.type === 'collapsible' || field.type === 'group') {
    return { ...field, fields: localizeFields(field.fields) }
  }

  if (field.type === 'row') {
    return { ...field, fields: localizeFields(field.fields) }
  }

  if (field.type === 'tabs') {
    return {
      ...field,
      tabs: field.tabs.map((tab) => ({ ...tab, fields: localizeFields(tab.fields) })),
    }
  }

  if (field.type === 'blocks') {
    return {
      ...field,
      blocks: field.blocks.map((block) => ({ ...block, fields: localizeFields(block.fields) })),
    }
  }

  return field
}

export const localizeFields = (fields: Field[]): Field[] => fields.map(localizeField)
