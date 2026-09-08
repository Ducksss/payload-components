import { readFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('visual install walkthrough', () => {
  it('links the visual guide from setup and the docs navigation', async () => {
    const [installation, meta] = await Promise.all([
      readFile(path.join(root, 'content/docs/installation.mdx'), 'utf8'),
      readFile(path.join(root, 'content/docs/meta.json'), 'utf8'),
    ])
    expect(installation).toContain('](/docs/install-walkthrough)')
    expect(JSON.parse(meta).pages).toContain('install-walkthrough')
  })

  it('documents the wrapper, truthful fixture verification, and manual shadcn wiring', async () => {
    const guide = await readFile(path.join(root, 'content/docs/install-walkthrough.mdx'), 'utf8')
    for (const command of [
      'npx payload-components add hero-basic --dry-run',
      'npx payload-components add feature-grid-basic',
      'npx payload-components doctor --json',
      'pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/hero-basic.json',
    ])
      expect(guide).toContain(command)
    expect(guide).toContain('fixture uses local source files and stub generation scripts')
    expect(guide).toContain('[ok] feature-grid-basic: Payload fragments')
    expect(guide).toContain('They do not add Payload collection registrations')
    expect(guide).toContain('/docs/admin/feature-grid-picker.png')
    expect(guide).not.toContain('DOCTOR_EXCERPT')
  })

  it.each(['catalog', 'docs', 'component'])(
    'ships an optimized, correctly encoded %s screenshot',
    async (name) => {
      const asset = await readFile(path.join(root, `public/docs/walkthrough/${name}.jpg`))
      const metadata = await sharp(asset).metadata()
      expect(metadata.format).toBe('jpeg')
      expect(metadata.width).toBe(1440)
      expect(metadata.height).toBe(1000)
      expect(asset.byteLength).toBeLessThan(500_000)
      const guide = await readFile(path.join(root, 'content/docs/install-walkthrough.mdx'), 'utf8')
      expect(guide).toContain(`/docs/walkthrough/${name}.jpg`)
    },
  )
})
