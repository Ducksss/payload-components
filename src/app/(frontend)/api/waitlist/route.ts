import {
  normalizeMarketingToken,
  normalizeWaitlistIntent,
  normalizeWaitlistRole,
  type WaitlistIntent,
  type WaitlistRequestBody,
  type WaitlistRole,
} from '@/utilities/waitlist'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_REQUEST_SIZE = 2_048
const RESEND_EMAILS_URL = 'https://api.resend.com/emails'
const WAITLIST_EMAIL_TO = 'chaipinzheng@gmail.com'
const WAITLIST_EMAIL_FROM = 'Payload Kits <onboarding@resend.dev>'
const WAITLIST_SOURCE = 'homepage-final-cta'

type WaitlistSubmission = {
  currentPath?: string
  email: string
  intent: WaitlistIntent
  referrer?: string
  role?: WaitlistRole
  source?: string
  submittedAt: string
  utmCampaign?: string
  utmContent?: string
  utmMedium?: string
  utmSource?: string
  utmTerm?: string
}

const invalidRequest = (message: string) =>
  Response.json(
    {
      error: message,
    },
    { status: 400 },
  )

const escapeHTML = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return character
    }
  })

const formatValue = (value: string | undefined): string => value || 'Not provided'

const formatIntent = (intent: WaitlistIntent): string =>
  intent === 'design-partner' ? 'Design partner' : 'Waitlist'

const formatRole = (role: WaitlistRole | undefined): string => {
  switch (role) {
    case 'agency':
      return 'Agency'
    case 'freelancer':
      return 'Freelancer'
    case 'in-house':
      return 'In-house team'
    case 'other':
      return 'Other'
    default:
      return 'Not provided'
  }
}

const getSubmissionRows = (submission: WaitlistSubmission): [string, string][] => [
  ['Email', submission.email],
  ['Intent', formatIntent(submission.intent)],
  ['Role', formatRole(submission.role)],
  ['Source', formatValue(submission.source)],
  ['Current path', formatValue(submission.currentPath)],
  ['Referrer', formatValue(submission.referrer)],
  ['UTM source', formatValue(submission.utmSource)],
  ['UTM medium', formatValue(submission.utmMedium)],
  ['UTM campaign', formatValue(submission.utmCampaign)],
  ['UTM content', formatValue(submission.utmContent)],
  ['UTM term', formatValue(submission.utmTerm)],
  ['Submitted at', submission.submittedAt],
]

const buildEmailText = (submission: WaitlistSubmission): string => {
  const heading =
    submission.intent === 'design-partner'
      ? 'New Payload Kits design partner request'
      : 'New Payload Kits waitlist signup'

  return [
    heading,
    '',
    ...getSubmissionRows(submission).map(([label, value]) => `${label}: ${value}`),
  ].join('\n')
}

const buildEmailHTML = (submission: WaitlistSubmission): string => {
  const heading =
    submission.intent === 'design-partner'
      ? 'New Payload Kits design partner request'
      : 'New Payload Kits waitlist signup'

  const rows = getSubmissionRows(submission)
    .map(
      ([label, value]) => `<tr>
        <th align="left" style="border-bottom:1px solid #e5e7eb;padding:10px 12px;width:160px;color:#334155;font-size:13px;">${escapeHTML(
          label,
        )}</th>
        <td style="border-bottom:1px solid #e5e7eb;padding:10px 12px;color:#0f172a;font-size:13px;">${escapeHTML(
          value,
        )}</td>
      </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <div style="margin:0 auto;max-width:680px;padding:32px 20px;">
      <div style="border:1px solid #e2e8f0;background:#ffffff;padding:24px;">
        <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Payload Kits</p>
        <h1 style="margin:0 0 20px;color:#0f172a;font-size:22px;line-height:1.25;">${escapeHTML(
          heading,
        )}</h1>
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
          ${rows}
        </table>
      </div>
    </div>
  </body>
</html>`
}

const getRecipientEmails = (): string[] => {
  const configuredEmailTo = process.env.WAITLIST_EMAIL_TO?.trim() || WAITLIST_EMAIL_TO

  return configuredEmailTo
    .split(',')
    .map((email) => email.trim())
    .filter((email) => EMAIL_PATTERN.test(email))
    .slice(0, 50)
}

const normalizeResendTagValue = (value: string): string =>
  value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 256) || 'unknown'

const buildTags = (submission: WaitlistSubmission) => [
  {
    name: 'intent',
    value: normalizeResendTagValue(submission.intent),
  },
  {
    name: 'source',
    value: normalizeResendTagValue(submission.source || WAITLIST_SOURCE),
  },
  ...(submission.role
    ? [
        {
          name: 'role',
          value: normalizeResendTagValue(submission.role),
        },
      ]
    : []),
]

export async function POST(request: Request): Promise<Response> {
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

  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  const recipientEmails = getRecipientEmails()
  const emailFrom = process.env.WAITLIST_EMAIL_FROM?.trim() || WAITLIST_EMAIL_FROM

  if (!resendApiKey || recipientEmails.length === 0 || !emailFrom) {
    return Response.json(
      {
        error: 'Waitlist is not configured right now.',
      },
      { status: 503 },
    )
  }

  const submission: WaitlistSubmission = {
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
  }

  const subject =
    intent === 'design-partner'
      ? 'New Payload Kits design partner request'
      : 'New Payload Kits waitlist signup'

  try {
    const upstreamResponse = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `waitlist-${crypto.randomUUID()}`,
      },
      body: JSON.stringify({
        from: emailFrom,
        html: buildEmailHTML(submission),
        reply_to: email,
        subject,
        tags: buildTags(submission),
        text: buildEmailText(submission),
        to: recipientEmails,
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
