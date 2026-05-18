import { getServerSideURL } from './getURL'

const DEFAULT_SITE_URL = 'http://localhost:3000'

export const siteConfig = {
  defaultDescription:
    'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
  defaultOgImagePath: '/website-template-OG.webp',
  defaultTitle: 'Payload Kits | Install production-ready Payload blocks with one command',
  githubUrl: 'https://github.com/Ducksss/payload-components',
  name: 'Payload Kits',
  twitterCreator: '@payloadcms',
}

export const normalizeSiteURL = (url: string | undefined | null): string => {
  const trimmedURL = url?.trim()

  if (!trimmedURL) {
    return DEFAULT_SITE_URL
  }

  const urlWithProtocol = /^https?:\/\//i.test(trimmedURL) ? trimmedURL : `https://${trimmedURL}`

  try {
    return new URL(urlWithProtocol).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const getSiteURL = () => normalizeSiteURL(getServerSideURL())

export const normalizePathname = (path: string | undefined | null): string => {
  const trimmedPath = path?.trim()

  if (!trimmedPath) {
    return '/'
  }

  let pathname: string

  if (/^https?:\/\//i.test(trimmedPath)) {
    try {
      pathname = new URL(trimmedPath).pathname
    } catch {
      pathname = '/'
    }
  } else {
    pathname = trimmedPath.split(/[?#]/)[0]
  }

  const normalized = `/${pathname.replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/')

  if (normalized.length > 1) {
    return normalized.replace(/\/+$/, '')
  }

  return '/'
}

export const absoluteURL = (pathOrURL: string | undefined | null): string => {
  if (!pathOrURL) {
    return getSiteURL()
  }

  if (/^https?:\/\//i.test(pathOrURL)) {
    return pathOrURL
  }

  return new URL(pathOrURL, `${getSiteURL()}/`).toString()
}

export const withSiteTitle = (title?: string | null): string => {
  const trimmedTitle = title?.trim()

  if (!trimmedTitle) {
    return siteConfig.defaultTitle
  }

  return trimmedTitle.includes(siteConfig.name) ? trimmedTitle : `${trimmedTitle} | ${siteConfig.name}`
}
