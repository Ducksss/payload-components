import type { Field } from 'payload'
import type { LucideIcon } from 'lucide-react'

import { Cpu, Gauge, Lock, Shield, Sparkles, Zap } from 'lucide-react'

/**
 * Shared icon allowlist for the feature-bearing Content variants
 * (content-feature-media, content-feature-split, content-showcase).
 *
 * Payload cannot store a React component, so each feature item picks an icon
 * by name from this fixed allowlist (`iconField`, a `select`) and the frontend
 * looks the name up in `contentIcons` at render. Keeping the options and the
 * component map in one file means the editor choices can never drift from what
 * actually renders — add an icon by adding it to both `contentIconOptions`
 * and `contentIcons` together.
 *
 * Installed once per repo at `src/blocks/shared/contentIcons.ts`; re-running
 * `payload-components add content-*` never overwrites a copy you have already edited.
 */
export const contentIconOptions = ['zap', 'cpu', 'lock', 'sparkles', 'gauge', 'shield'] as const

export type ContentIconName = (typeof contentIconOptions)[number]

export const iconField: Field = {
  name: 'icon',
  type: 'select',
  options: [
    { label: 'Zap', value: 'zap' },
    { label: 'Cpu', value: 'cpu' },
    { label: 'Lock', value: 'lock' },
    { label: 'Sparkles', value: 'sparkles' },
    { label: 'Gauge', value: 'gauge' },
    { label: 'Shield', value: 'shield' },
  ],
}

export const contentIcons: Record<ContentIconName, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
  gauge: Gauge,
  shield: Shield,
}
