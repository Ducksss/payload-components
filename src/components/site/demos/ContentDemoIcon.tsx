import type { LucideIcon } from 'lucide-react'

import { Cpu, Gauge, Lock, Shield, Sparkles, Zap } from 'lucide-react'

import type { ContentIconKey } from '@/lib/demo-content'

/* Mirrors payload-components/source/blocks/shared/contentIcons.ts for the
 * Content demo twins. The production block looks an icon name up in
 * `contentIcons`; the previews are backend-free but otherwise render the same
 * lucide marks from the same allowlist. Presentational only (twin roots are
 * already aria-hidden). */
const icons: Record<ContentIconKey, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
  gauge: Gauge,
  shield: Shield,
}

export function ContentDemoIcon({
  className,
  name,
}: {
  className?: string
  name?: ContentIconKey
}) {
  const Icon = name ? icons[name] : null

  return Icon ? <Icon className={className} /> : null
}
