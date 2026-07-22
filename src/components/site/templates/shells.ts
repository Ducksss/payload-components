import type { ComponentType, ReactNode } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { AgencyStudioShell } from './agency-studio/Shell'
import { SaasLaunchShell } from './saas-launch/Shell'

/* Maps a template slug to its owned shell — the fictional site's real header,
 * internal navigation, footer, and scoped theme root. Shells receive the page's
 * active path ('' = home) and render the composed visual canvas as children. */

export type TemplateShellProps = {
  activePath: string
  children: ReactNode
  template: TemplateShowcase
}

export const templateShellsBySlug: Record<string, ComponentType<TemplateShellProps>> = {
  'agency-studio': AgencyStudioShell,
  'saas-launch': SaasLaunchShell,
}
