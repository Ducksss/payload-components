import type { ComponentType, ReactNode } from 'react'

import type { TemplateShowcase } from '@/lib/templates/types'

import { AgencyStudioShell } from './agency-studio/Shell'
import { CivicCouncilShell } from './civic-council/Shell'
import { CommerceBrandShell } from './commerce-brand/Shell'
import { EducationCourseShell } from './education-course/Shell'
import { EventConferenceShell } from './event-conference/Shell'
import { FintechTrustShell } from './fintech-trust/Shell'
import { HealthcareClinicShell } from './healthcare-clinic/Shell'
import { MarketplaceWholesaleShell } from './marketplace-wholesale/Shell'
import { MusicArtistShell } from './music-artist/Shell'
import { NonprofitCauseShell } from './nonprofit-cause/Shell'
import { PortfolioSoloShell } from './portfolio-solo/Shell'
import { RealEstateListingShell } from './real-estate-listing/Shell'
import { RestaurantBistroShell } from './restaurant-bistro/Shell'
import { SaasLaunchShell } from './saas-launch/Shell'
import { TradeServiceShell } from './trade-service/Shell'

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
  'civic-council': CivicCouncilShell,
  'commerce-brand': CommerceBrandShell,
  'education-course': EducationCourseShell,
  'event-conference': EventConferenceShell,
  'fintech-trust': FintechTrustShell,
  'healthcare-clinic': HealthcareClinicShell,
  'marketplace-wholesale': MarketplaceWholesaleShell,
  'music-artist': MusicArtistShell,
  'nonprofit-cause': NonprofitCauseShell,
  'portfolio-solo': PortfolioSoloShell,
  'real-estate-listing': RealEstateListingShell,
  'restaurant-bistro': RestaurantBistroShell,
  'saas-launch': SaasLaunchShell,
  'trade-service': TradeServiceShell,
}
