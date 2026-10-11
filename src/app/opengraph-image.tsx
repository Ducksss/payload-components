import { ImageResponse } from 'next/og'

import { heroDatasheet } from '@/lib/datasheet'
import { RootCard } from '@/lib/og/cards'
import { ogFonts, ogSize } from '@/lib/og/datasheet-card'
import { heroHeadline, primaryInstallCommand } from '@/lib/site'

export const alt = 'Payload Components — Payload blocks, fully wired'
export const contentType = 'image/png'
export const size = ogSize

/* Static at build time on purpose: no dynamic APIs, no network. The landing's
   first page as a datasheet: the claim in condensed Archivo with the one
   command, beside hero-basic drawn as its part — real fields in, the five
   files an install writes out to "J1 · your project". */
export default function OpenGraphImage() {
  return new ImageResponse(
    <RootCard command={primaryInstallCommand} datasheet={heroDatasheet} headline={heroHeadline} />,
    { ...ogSize, fonts: ogFonts },
  )
}
