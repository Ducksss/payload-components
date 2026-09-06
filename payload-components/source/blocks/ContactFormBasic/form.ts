export type ContactField = 'name' | 'email' | 'organization' | 'message'
export type ContactErrors = Partial<Record<ContactField, string>>

export const validateContactForm = (data: FormData): ContactErrors => {
  const errors: ContactErrors = {}
  const name = String(data.get('name') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  const message = String(data.get('message') ?? '').trim()
  if (!name) errors.name = 'Enter your name.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address.'
  if (!message) errors.message = 'Enter a message.'
  return errors
}

/** An explicit acknowledgement prevents an HTML redirect or a 200 error page from looking successful. */
export const sendContactForm = async (action: string, data: FormData): Promise<void> => {
  const response = await fetch(action, {
    method: 'POST',
    body: data,
    credentials: 'same-origin',
    redirect: 'error',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error('The endpoint did not accept the message.')
  const result: unknown = await response.json()
  if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error('The endpoint did not acknowledge the message.')
  }
}
