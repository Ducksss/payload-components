import { expect, it } from 'vitest'
import { needsConsumerChecks } from '../../tools/ci/classify-changes.mjs'

it('skips consumer jobs only for known site-only changes', () => {
  expect(
    needsConsumerChecks(['src/app/page.tsx', 'content/docs/index.mdx', 'public/favicon.svg']),
  ).toBe(false)
  for (const file of [
    'tools/payload-components/project.ts',
    'payload-components/source/base/collections/Pages/index.ts',
    'pnpm-lock.yaml',
    '.github/workflows/registry-verification.yml',
    'future-package/index.ts',
  ]) {
    expect(needsConsumerChecks(['README.md', file]), file).toBe(true)
  }
})
