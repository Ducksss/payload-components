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

it('treats root project docs and RFCs as site-only', () => {
  for (const file of [
    'ROADMAP.md',
    'DESIGN.md',
    'SECURITY.md',
    'CODE_OF_CONDUCT.md',
    'rfcs/0001-installable-templates.md',
  ]) {
    expect(needsConsumerChecks([file]), file).toBe(false)
    expect(needsConsumerChecks([file, 'tools/payload-components/project.ts']), file).toBe(true)
    // These paths only count at the repository root; nested copies stay consumer-affecting.
    const nested = `payload-components/${file}`
    expect(needsConsumerChecks([nested]), nested).toBe(true)
  }
})
