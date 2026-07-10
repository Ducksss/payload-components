import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import {
  sampleContentNeedsDemoMedia,
  writeSeedScript,
} from '../../tools/payload-components/seed/seed-script'
import {
  normalizeSmokeDatabaseConnectionString,
  parseSmokeArgs,
  smokeEnvForTarget,
} from '../../tools/payload-components/smoke/fresh-payload-repo'

describe('fresh Payload smoke arguments', () => {
  it('accepts pnpm\'s script argument separator', () => {
    expect(parseSmokeArgs(['--', '--components', 'hero-basic'])).toMatchObject({
      components: ['hero-basic'],
    })
  })

  it('passes the fresh target database URL to direct tsx commands', () => {
    expect(
      smokeEnvForTarget({
        databaseUrl: 'file:./payload-components-smoke-target.db',
        serverUrl: 'http://127.0.0.1:3100',
      }),
    ).toMatchObject({
      DATABASE_URL: 'file:./payload-components-smoke-target.db',
      NEXT_PUBLIC_SERVER_URL: 'http://127.0.0.1:3100',
    })
  })

  it('treats a blank POSTGRES_URL as absent and trims a configured URL', () => {
    expect(normalizeSmokeDatabaseConnectionString('')).toBeUndefined()
    expect(normalizeSmokeDatabaseConnectionString('   ')).toBeUndefined()
    expect(
      normalizeSmokeDatabaseConnectionString('  postgres://localhost/payload_components  '),
    ).toBe('postgres://localhost/payload_components')
  })
})

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

    expect(sampleContentNeedsDemoMedia(manifest.sampleContent)).toBe(true)
    expect(script).toContain('const needsDemoMedia = true')
    expect(script).toContain("collection: 'media'")
    expect(script).toContain("logos: 'logo'")
    expect(script).toContain('isMissingUploadReference(mappedItem, uploadField)')
  })

  it('does not create placeholder media for sample content without upload slots', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(sampleContentNeedsDemoMedia(manifest.sampleContent)).toBe(false)
    expect(script).toContain('const needsDemoMedia = false')
  })

  it('detects required upload slots nested inside team groups', async () => {
    const manifest = await loadManifest('team-roster')

    expect(sampleContentNeedsDemoMedia(manifest.sampleContent)).toBe(true)
  })

  it('checks page ownership before replacement and never swallows delete failures', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(script).toContain('const isOwnedDemoPage =')
    expect(script).toContain('Refusing to change')
    expect(script).not.toContain('.catch(() => undefined)')
  })
})
