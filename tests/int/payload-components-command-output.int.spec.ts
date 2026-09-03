import { describe, expect, it } from 'vitest'

import {
  captureCommandOutput,
  writeCommandOutput,
} from '../../tools/payload-components/command-output'

describe('command output port', () => {
  it('isolates overlapping embedded command captures', async () => {
    const [left, right] = await Promise.all([
      captureCommandOutput(async () => {
        writeCommandOutput('left:one\n')
        await Promise.resolve()
        writeCommandOutput('left:two\n')
      }),
      captureCommandOutput(async () => {
        writeCommandOutput('right:one\n')
        await Promise.resolve()
        writeCommandOutput('right:two\n')
      }),
    ])

    expect(left).toBe('left:one\nleft:two')
    expect(right).toBe('right:one\nright:two')
  })
})
