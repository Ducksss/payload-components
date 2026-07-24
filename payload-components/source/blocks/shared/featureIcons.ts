import type { LucideIcon } from 'lucide-react'
import type { Field } from 'payload'

import { ChartBarIncreasing, Database, Fingerprint, IdCard, Shield, Zap } from 'lucide-react'

/**
 * Shared icon allowlist for Feature variants with editor-selected icons.
 *
 * Payload stores the stable string key while the frontend resolves the matching
 * Lucide component. The field factory lets each variant choose whether an icon
 * is optional without duplicating the editor options or rendering map.
 */
export const featureIconOptions = [
  'chart',
  'database',
  'fingerprint',
  'id-card',
  'shield',
  'zap',
] as const

export type FeatureIconName = (typeof featureIconOptions)[number]

export function createFeatureIconField(required = false): Field {
  return {
    name: 'icon',
    type: 'select',
    options: [
      { label: 'Chart', value: 'chart' },
      { label: 'Database', value: 'database' },
      { label: 'Fingerprint', value: 'fingerprint' },
      { label: 'ID card', value: 'id-card' },
      { label: 'Shield', value: 'shield' },
      { label: 'Zap', value: 'zap' },
    ],
    required,
  }
}

export const featureIcons: Record<FeatureIconName, LucideIcon> = {
  chart: ChartBarIncreasing,
  database: Database,
  fingerprint: Fingerprint,
  'id-card': IdCard,
  shield: Shield,
  zap: Zap,
}
