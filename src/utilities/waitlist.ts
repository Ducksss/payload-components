export const WAITLIST_INTENTS = ['waitlist', 'design-partner'] as const
export const WAITLIST_ROLES = ['agency', 'freelancer', 'in-house', 'other'] as const

export type WaitlistIntent = (typeof WAITLIST_INTENTS)[number]
export type WaitlistRole = (typeof WAITLIST_ROLES)[number]

export type WaitlistRequestBody = {
  currentPath?: unknown
  email?: unknown
  honey?: unknown
  intent?: unknown
  referrer?: unknown
  role?: unknown
  source?: unknown
  utmCampaign?: unknown
  utmContent?: unknown
  utmMedium?: unknown
  utmSource?: unknown
  utmTerm?: unknown
}

const MARKETING_TOKEN_PATTERN = /^[a-z0-9-_/]{1,80}$/i

export const normalizeMarketingToken = (
  value: string | null | undefined,
  fallback?: string,
): string | undefined => {
  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    return fallback
  }

  if (!MARKETING_TOKEN_PATTERN.test(normalized)) {
    return fallback
  }

  return normalized
}

export const normalizeWaitlistIntent = (
  value: string | null | undefined,
  fallback: WaitlistIntent = 'waitlist',
): WaitlistIntent => {
  return WAITLIST_INTENTS.includes(value as WaitlistIntent) ? (value as WaitlistIntent) : fallback
}

export const normalizeWaitlistRole = (
  value: string | null | undefined,
): WaitlistRole | undefined => {
  return WAITLIST_ROLES.includes(value as WaitlistRole) ? (value as WaitlistRole) : undefined
}
