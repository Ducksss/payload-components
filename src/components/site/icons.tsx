import type { LucideIcon } from 'lucide-react'

import { Blocks, Braces, Database, Layers, Map, MoonStar, Scale, ShieldCheck } from 'lucide-react'

/**
 * Icon names referenced from src/lib/site.ts data. The data module stays
 * icon-free so tests and the llms.txt routes can import it without pulling
 * React components along.
 */
export const siteIcons = {
  blocks: Blocks,
  braces: Braces,
  database: Database,
  layers: Layers,
  map: Map,
  moon: MoonStar,
  scale: Scale,
  shield: ShieldCheck,
} satisfies Record<string, LucideIcon>

export type SiteIconName = keyof typeof siteIcons
