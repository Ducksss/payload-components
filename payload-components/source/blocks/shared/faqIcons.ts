import type { Field } from 'payload'
import type { LucideIcon } from 'lucide-react'

import { Clock, CreditCard, Globe, HelpCircle, Package, Truck } from 'lucide-react'

/**
 * Shared icon allowlist for the icon-bearing FAQ variants
 * (faq-icons, faq-grouped).
 *
 * Payload cannot store a React component, so each FAQ item (or group) picks an
 * icon by name from this fixed allowlist (`iconField`, a `select`) and the
 * frontend looks the name up in `faqIcons` at render. Keeping the options and
 * the component map in one file means the editor choices can never drift from
 * what actually renders — add an icon by adding it to both `faqIconOptions`
 * and `faqIcons` together.
 *
 * Installed once per repo at `src/blocks/shared/faqIcons.ts`; re-running
 * `payload-components add faq-*` never overwrites a copy you have already edited.
 */
export const faqIconOptions = ['clock', 'credit-card', 'truck', 'globe', 'package', 'help-circle'] as const

export type FaqIconName = (typeof faqIconOptions)[number]

export const iconField: Field = {
  name: 'icon',
  type: 'select',
  options: [
    { label: 'Clock', value: 'clock' },
    { label: 'Credit card', value: 'credit-card' },
    { label: 'Truck', value: 'truck' },
    { label: 'Globe', value: 'globe' },
    { label: 'Package', value: 'package' },
    { label: 'Help circle', value: 'help-circle' },
  ],
}

export const faqIcons: Record<FaqIconName, LucideIcon> = {
  clock: Clock,
  'credit-card': CreditCard,
  truck: Truck,
  globe: Globe,
  package: Package,
  'help-circle': HelpCircle,
}
