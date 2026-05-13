import { afterEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/(frontend)/api/waitlist/route'

const createRequest = (body: unknown) =>
  new Request('http://localhost:3000/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

describe('waitlist route', () => {
  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.WAITLIST_EMAIL_FROM
    delete process.env.WAITLIST_EMAIL_TO
    vi.restoreAllMocks()
  })

  it('returns 400 for an invalid email address', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'not-an-email', honey: '' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Enter a valid email address.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 400 for a filled honeypot field', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'hello@example.com', honey: 'bot' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid request.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 503 when the Resend API key is missing', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'hello@example.com', honey: '' }))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Waitlist is not configured right now.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends valid signups through Resend', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }))

    const response = await POST(
      createRequest({
        currentPath: '/?source=Launch_Post&utm_source=Newsletter&utm_medium=Email',
        email: 'hello@example.com',
        honey: '',
        intent: 'design-partner',
        referrer: 'https://example.com/ref',
        role: 'agency',
        source: 'Launch/Post',
        utmMedium: 'Email',
        utmSource: 'Newsletter',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0] || []
    expect(url).toBe('https://api.resend.com/emails')

    const headers = new Headers(init?.headers)
    const body = JSON.parse(String(init?.body)) as {
      from: string
      html: string
      reply_to: string
      subject: string
      tags: { name: string; value: string }[]
      text: string
      to: string[]
    }

    expect(init?.method).toBe('POST')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer re_test_key')
    expect(headers.get('Idempotency-Key')).toMatch(/^waitlist-/)
    expect(init?.cache).toBe('no-store')
    expect(body.from).toBe('Payload Kits <onboarding@resend.dev>')
    expect(body.to).toEqual(['chaipinzheng@gmail.com'])
    expect(body.reply_to).toBe('hello@example.com')
    expect(body.subject).toBe('New Payload Kits design partner request')
    expect(body.tags).toEqual([
      { name: 'intent', value: 'design-partner' },
      { name: 'source', value: 'launch_post' },
      { name: 'role', value: 'agency' },
    ])
    expect(body.text).toContain('Email: hello@example.com')
    expect(body.text).toContain('Source: launch/post')
    expect(body.text).toContain('UTM source: newsletter')
    expect(body.html).toContain('New Payload Kits design partner request')
    expect(body.html).toContain('hello@example.com')
  })

  it('escapes dynamic values in the HTML email', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }))

    const response = await POST(
      createRequest({
        currentPath: '/"><script>alert(1)</script>',
        email: 'hello@example.com',
        honey: '',
      }),
    )

    expect(response.status).toBe(200)

    const [, init] = fetchMock.mock.calls[0] || []
    const body = JSON.parse(String(init?.body)) as {
      html: string
    }

    expect(body.html).toContain('/&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(body.html).not.toContain('<script>alert(1)</script>')
  })

  it('returns 502 when Resend responds with an error', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    const response = await POST(createRequest({ email: 'hello@example.com', honey: '' }))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'Waitlist is temporarily unavailable.',
    })
  })
})
