import type { Metadata } from 'next'
import { absoluteURL, siteConfig } from './site'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteConfig.defaultDescription,
  images: [
    {
      alt: `${siteConfig.name} social preview`,
      height: 630,
      url: absoluteURL(siteConfig.defaultOgImagePath),
      width: 1200,
    },
  ],
  siteName: siteConfig.name,
  title: siteConfig.defaultTitle,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
