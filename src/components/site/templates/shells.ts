import type { ComponentType, ReactNode } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { AgencyStudioShell } from './agency-studio/Shell'
import { CommerceBrandShell } from './commerce-brand/Shell'
import { EventConferenceShell } from './event-conference/Shell'
import { FintechTrustShell } from './fintech-trust/Shell'
import { PortfolioSoloShell } from './portfolio-solo/Shell'
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
  'commerce-brand': CommerceBrandShell,
  'event-conference': EventConferenceShell,
  'fintech-trust': FintechTrustShell,
  'portfolio-solo': PortfolioSoloShell,
  'saas-launch': SaasLaunchShell,
}
