import type { LucideIcon } from 'lucide-react'

import { Clock, CreditCard, Globe, HelpCircle, Package, Truck } from 'lucide-react'

import type { FaqIconKey } from '@/lib/demo-content'

/* Mirrors payload-components/source/blocks/shared/faqIcons.ts for the FAQ demo
 * twins. The production block looks an icon name up in `faqIcons`; the previews
 * are backend-free but otherwise render the same lucide marks from the same
 * allowlist. Presentational only (twin roots are already aria-hidden). */
const icons: Record<FaqIconKey, LucideIcon> = {
  clock: Clock,
  'credit-card': CreditCard,
  truck: Truck,
  globe: Globe,
  package: Package,
  'help-circle': HelpCircle,
}

export function FaqDemoIcon({ className, name }: { className?: string; name?: FaqIconKey }) {
  const Icon = name ? icons[name] : null

  return Icon ? <Icon className={className} /> : null
}
