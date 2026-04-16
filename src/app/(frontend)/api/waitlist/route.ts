import {
  normalizeMarketingToken,
  normalizeWaitlistIntent,
  normalizeWaitlistRole,
  type WaitlistRequestBody,
} from '@/utilities/waitlist'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_REQUEST_SIZE = 2_048
const WAITLIST_SOURCE = 'homepage-final-cta'

const invalidRequest = (message: string) =>
  Response.json(
    {
      error: message,
    },
    { status: 400 },
  )

export async function POST(request: Request): Promise<Response> {
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL

  if (!webhookUrl) {
    return Response.json(
      {
        error: 'Waitlist is not configured right now.',
      },
      { status: 503 },
    )
  }

  const rawBody = await request.text()

  if (!rawBody || rawBody.length > MAX_REQUEST_SIZE) {
    return invalidRequest('Invalid request body.')
  }

  let body: WaitlistRequestBody

  try {
    body = JSON.parse(rawBody) as WaitlistRequestBody
  } catch {
    return invalidRequest('Invalid request body.')
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const honey = typeof body.honey === 'string' ? body.honey.trim() : ''
  const source = normalizeMarketingToken(
    typeof body.source === 'string' ? body.source : undefined,
    WAITLIST_SOURCE,
  )
  const intent = normalizeWaitlistIntent(
    typeof body.intent === 'string' ? body.intent : undefined,
    'waitlist',
  )
  const role = normalizeWaitlistRole(typeof body.role === 'string' ? body.role : undefined)
  const currentPath =
    typeof body.currentPath === 'string' && body.currentPath.trim()
      ? body.currentPath.trim().slice(0, 200)
      : undefined
  const referrer =
    typeof body.referrer === 'string' && body.referrer.trim()
      ? body.referrer.trim().slice(0, 500)
      : undefined
  const utmSource = normalizeMarketingToken(
    typeof body.utmSource === 'string' ? body.utmSource : undefined,
  )
  const utmMedium = normalizeMarketingToken(
    typeof body.utmMedium === 'string' ? body.utmMedium : undefined,
  )
  const utmCampaign = normalizeMarketingToken(
    typeof body.utmCampaign === 'string' ? body.utmCampaign : undefined,
  )
  const utmContent = normalizeMarketingToken(
    typeof body.utmContent === 'string' ? body.utmContent : undefined,
  )
  const utmTerm = normalizeMarketingToken(
    typeof body.utmTerm === 'string' ? body.utmTerm : undefined,
  )

  if (!email || !EMAIL_PATTERN.test(email)) {
    return invalidRequest('Enter a valid email address.')
  }

  if (honey) {
    return invalidRequest('Invalid request.')
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (process.env.WAITLIST_WEBHOOK_SECRET) {
    headers.set('Authorization', `Bearer ${process.env.WAITLIST_WEBHOOK_SECRET}`)
  }

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        currentPath,
        email,
        intent,
        referrer,
        role,
        source,
        submittedAt: new Date().toISOString(),
        utmCampaign,
        utmContent,
        utmMedium,
        utmSource,
        utmTerm,
      }),
      cache: 'no-store',
    })

    if (!upstreamResponse.ok) {
      return Response.json(
        {
          error: 'Waitlist is temporarily unavailable.',
        },
        { status: 502 },
      )
    }
  } catch {
    return Response.json(
      {
        error: 'Waitlist is temporarily unavailable.',
      },
      { status: 502 },
    )
  }

  return Response.json({
    ok: true,
  })
}
