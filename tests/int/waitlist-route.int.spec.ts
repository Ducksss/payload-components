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
    delete process.env.WAITLIST_WEBHOOK_URL
    delete process.env.WAITLIST_WEBHOOK_SECRET
    vi.restoreAllMocks()
  })

  it('returns 400 for an invalid email address', async () => {
    process.env.WAITLIST_WEBHOOK_URL = 'https://example.com/waitlist'
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'not-an-email', honey: '' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Enter a valid email address.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 400 for a filled honeypot field', async () => {
    process.env.WAITLIST_WEBHOOK_URL = 'https://example.com/waitlist'
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'hello@example.com', honey: 'bot' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid request.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 503 when the webhook URL is missing', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const response = await POST(createRequest({ email: 'hello@example.com', honey: '' }))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Waitlist is not configured right now.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards valid signups to the external webhook', async () => {
    process.env.WAITLIST_WEBHOOK_URL = 'https://example.com/waitlist'
    process.env.WAITLIST_WEBHOOK_SECRET = 'super-secret'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }))

    const response = await POST(createRequest({ email: 'hello@example.com', honey: '' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0] || []
    expect(url).toBe('https://example.com/waitlist')

    const headers = new Headers(init?.headers)
    const body = JSON.parse(String(init?.body)) as {
      email: string
      source: string
      submittedAt: string
    }

    expect(init?.method).toBe('POST')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer super-secret')
    expect(body.email).toBe('hello@example.com')
    expect(body.source).toBe('homepage-final-cta')
    expect(Date.parse(body.submittedAt)).not.toBeNaN()
  })

  it('returns 502 when the external webhook responds with an error', async () => {
    process.env.WAITLIST_WEBHOOK_URL = 'https://example.com/waitlist'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    const response = await POST(createRequest({ email: 'hello@example.com', honey: '' }))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'Waitlist is temporarily unavailable.',
    })
  })
})
