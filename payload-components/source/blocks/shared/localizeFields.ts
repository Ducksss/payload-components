import type { Field } from 'payload'
import { fieldHasSubFields, fieldIsBlockType } from 'payload/shared'

/**
 * Mark a block's editorial text as localized.
 *
 * Payload localization is per field: `localized: true` stores a value per
 * configured locale. `localizeFields` walks a block's field list and applies
 * the explicit policy authored on each persisted text leaf:
 *
 * ```ts
 * custom: { payloadComponents: { localization: 'localized' } }
 * custom: { payloadComponents: { localization: 'global' } }
 * ```
 *
 * Storage type is deliberately not policy. A URL and a heading are both
 * Payload `text` fields, but only the heading should gain per-locale storage.
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
 *   consumer choices always win.
 * - Unmarked fields stay global. This conservative default keeps fields from
 *   consumer helpers (including link URLs) out of per-locale storage.
 * - Non-text fields stay single-value. Localize those by hand where you want
 *   per-locale media or targets — the decision is content modelling.
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

const LOCALIZED_LEAF_TYPES = ['richText', 'text', 'textarea'] as const

type LocalizedLeafType = (typeof LOCALIZED_LEAF_TYPES)[number]

const isLocalizedLeaf = (field: Field): field is Extract<Field, { type: LocalizedLeafType }> =>
  LOCALIZED_LEAF_TYPES.includes(field.type as LocalizedLeafType)

type LocalizationPolicy = 'global' | 'localized'

const getLocalizationPolicy = (field: Field): LocalizationPolicy | undefined => {
  if (!('custom' in field) || !field.custom || typeof field.custom !== 'object') return undefined

  const payloadComponents = (field.custom as Record<string, unknown>).payloadComponents
  if (!payloadComponents || typeof payloadComponents !== 'object') return undefined

  const policy = (payloadComponents as Record<string, unknown>).localization
  return policy === 'global' || policy === 'localized' ? policy : undefined
}

const localizeField = (field: Field): Field => {
  if (isLocalizedLeaf(field)) {
    if ('localized' in field && field.localized !== undefined) return field
    return getLocalizationPolicy(field) === 'localized' ? { ...field, localized: true } : field
  }

  if (fieldHasSubFields(field)) {
    return { ...field, fields: localizeFields(field.fields) }
  }

  if (field.type === 'tabs') {
    return {
      ...field,
      tabs: field.tabs.map((tab) => ({ ...tab, fields: localizeFields(tab.fields) })),
    }
  }

  if (fieldIsBlockType(field)) {
    return {
      ...field,
      blocks: field.blocks.map((block) => ({ ...block, fields: localizeFields(block.fields) })),
    }
  }

  return field
}

export const localizeFields = (fields: Field[]): Field[] => fields.map(localizeField)
