import { getPayload, Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload
const describeWithDatabase = process.env.POSTGRES_URL ? describe : describe.skip

describeWithDatabase('API', () => {
  beforeAll(async () => {
    const { default: config } = await import('@/payload.config')
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 60000)

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
