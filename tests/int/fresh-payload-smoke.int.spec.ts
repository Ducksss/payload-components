import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import {
  sampleContentNeedsSmokeMedia,
  writeSeedScript,
} from '../../tools/payload-components/seed/seed-script'

describe('fresh Payload smoke seed generation', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('adds placeholder media seeding when sample content has required upload slots', async () => {
    const manifest = await loadManifest('logo-cloud-grid')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(sampleContentNeedsSmokeMedia(manifest.sampleContent)).toBe(true)
    expect(script).toContain('const needsSmokeMedia = true')
    expect(script).toContain("collection: 'media'")
    expect(script).toContain("logos: addUploadReference(block.logos, 'logo', mediaID)")
  })

  it('does not create placeholder media for sample content without upload slots', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(sampleContentNeedsSmokeMedia(manifest.sampleContent)).toBe(false)
    expect(script).toContain('const needsSmokeMedia = false')
  })
})
