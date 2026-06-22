import type { LucideIcon } from 'lucide-react'

import { Aperture, Boxes, Cpu, Gem, Globe, Hexagon, Leaf, Waves } from 'lucide-react'

import { cn } from '@/utilities/ui'

/* Fake company logos for the Logo Cloud demo twins. In production each logo is
 * a Media upload; the landing/docs previews are backend-free, so we render
 * invented, monochrome icon + wordmark lockups instead — enough to read as a
 * real wall of customer logos without shipping any third-party trademark.
 * Presentational only (the twin root is already aria-hidden). */

export type DemoLogo = { Icon: LucideIcon; name: string }

export const demoLogos: DemoLogo[] = [
  { Icon: Waves, name: 'Northwind' },
  { Icon: Globe, name: 'Globex' },
  { Icon: Cpu, name: 'Initech' },
  { Icon: Hexagon, name: 'Vandelay' },
  { Icon: Leaf, name: 'Soylent' },
  { Icon: Aperture, name: 'Hooli' },
  { Icon: Gem, name: 'Umbra' },
  { Icon: Boxes, name: 'Stark' },
]

export function DemoLogoMark({ Icon, className, name }: DemoLogo & { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-foreground/70', className)}>
      <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
      <span className="whitespace-nowrap text-base font-semibold tracking-tight">{name}</span>
    </span>
  )
}
