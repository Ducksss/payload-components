const approvedEmbedHosts = new Set([
  'airtable.com',
  'docs.google.com',
  'form.typeform.com',
  'lookerstudio.google.com',
  'maps.google.com',
  'player.vimeo.com',
  'vimeo.com',
  'www.airtable.com',
  'www.google.com',
  'www.youtube-nocookie.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'youtube.com',
])

const approvedEmbedHostSuffixes = [
  '.airtable.com',
  '.google.com',
  '.typeform.com',
  '.vimeo.com',
  '.youtube-nocookie.com',
  '.youtube.com',
]

const embedUrlError = 'Use an approved HTTPS embed URL.'
const formActionError = 'Use a same-origin path, such as /api/newsletter.'
const sameOriginBase = 'https://payload-components.local'

const isApprovedEmbedHost = (hostname: string) => {
  const normalizedHost = hostname.toLowerCase()

  return (
    approvedEmbedHosts.has(normalizedHost) ||
    approvedEmbedHostSuffixes.some((suffix) => normalizedHost.endsWith(suffix))
  )
}

export const getSafeEmbedUrl = (value: unknown) => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()

  if (!trimmed) return undefined

  try {
    const parsed = new URL(trimmed)

    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
      return undefined
    }

    if (!isApprovedEmbedHost(parsed.hostname)) {
      return undefined
    }

    return parsed.toString()
  } catch {
    return undefined
  }
}

export const validateEmbedUrl = (value: unknown) => getSafeEmbedUrl(value) ? true : embedUrlError

export const getSafeFormAction = (value: unknown) => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()

  if (!trimmed || !trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return undefined
  }

  try {
    const parsed = new URL(trimmed, sameOriginBase)

    if (parsed.origin !== sameOriginBase) {
      return undefined
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return undefined
  }
}

export const validateSameOriginFormAction = (value: unknown) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return true
  }

  return getSafeFormAction(value) ? true : formActionError
}
