import { getSafeFormAction } from './safeUrls'

export const contactChannelTypeOptions = ['email', 'phone', 'url'] as const

export type ContactChannelType = (typeof contactChannelTypeOptions)[number]

type ContactValidationContext = {
  siblingData?: Record<string, unknown> | null
}

const contactErrors: Record<ContactChannelType, string> = {
  email: 'Enter a valid email address.',
  phone: 'Enter a valid phone number with 7 to 15 digits.',
  url: 'Enter an HTTPS URL or a same-origin path such as /support.',
}

export const getSafeContactHref = (type: unknown, value: unknown) => {
  if (
    !contactChannelTypeOptions.includes(type as ContactChannelType) ||
    typeof value !== 'string'
  ) {
    return undefined
  }

  const trimmed = value.trim()

  if (!trimmed || /[\r\n]/.test(trimmed)) return undefined

  if (type === 'email') {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed)
      ? `mailto:${trimmed}`
      : undefined
  }

  if (type === 'phone') {
    const normalized = trimmed.replace(/[\s().-]/g, '')

    return /^\+?\d{7,15}$/.test(normalized) ? `tel:${normalized}` : undefined
  }

  const sameOriginPath = getSafeFormAction(trimmed)
  if (sameOriginPath) return sameOriginPath

  try {
    const parsed = new URL(trimmed)

    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return undefined

    return parsed.toString()
  } catch {
    return undefined
  }
}

export const validateContactValue = (
  value: unknown,
  { siblingData }: ContactValidationContext,
) => {
  const type = siblingData?.type

  if (!contactChannelTypeOptions.includes(type as ContactChannelType)) {
    return 'Choose a contact channel type before entering its value.'
  }

  return getSafeContactHref(type, value) ? true : contactErrors[type as ContactChannelType]
}
