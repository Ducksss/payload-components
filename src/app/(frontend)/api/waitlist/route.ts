const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_REQUEST_SIZE = 1_024
const WAITLIST_SOURCE = 'homepage-final-cta'

type WaitlistRequestBody = {
  email?: unknown
  honey?: unknown
}

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
        email,
        source: WAITLIST_SOURCE,
        submittedAt: new Date().toISOString(),
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
