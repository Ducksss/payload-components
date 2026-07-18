import { execFile } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import {
  writeSeedScript,
  type SeedTarget,
} from '../../tools/payload-components/seed/seed-script'
import type { ComponentManifest } from '../../tools/payload-components/types'

type StubCall = {
  collection: 'media' | 'pages'
  context?: { disableRevalidate?: boolean }
  data?: Record<string, unknown>
  draft?: boolean
  filePath?: string
  id?: number | string
  method: 'create' | 'delete' | 'find' | 'update'
  overrideAccess?: boolean
  overrideLock?: boolean
}

type StubDocument = Record<string, unknown> & { id: number | string }

type StubState = {
  calls: StubCall[]
  media: StubDocument[]
  nextID: number
  pages: StubDocument[]
}

type OwnershipState = {
  component: string
  manifestVersion: string
  mediaId: number | string | null
  mediaOperationToken: string | null
  pageId: number | string | null
  pageOperationToken: string | null
  token: string
  version: 1
}

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const tsxCli = path.join(repoRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs')
const runtimeTarget: SeedTarget = {
  configFileRelPath: path.join('src', 'payload.config.ts'),
  marker: 'payload-components:demo:logo-cloud-grid',
  ownershipStateRelPath: path.join(
    '.payload-components',
    'demo-state',
    'logo-cloud-grid.json',
  ),
  pageStatus: 'draft',
  scriptRelPath: path.join('payload-components', 'seed-logo-cloud-grid.ts'),
  slug: 'payload-components-demo-logo-cloud-grid',
  title: 'Payload Components demo — Logo Cloud Grid',
}

const emptyState = (): StubState => ({ calls: [], media: [], nextID: 1, pages: [] })

const stubPayloadModule = `import { readFile, writeFile } from 'node:fs/promises'

const statePath = process.env.PAYLOAD_STUB_STATE

if (!statePath) throw new Error('PAYLOAD_STUB_STATE is required')

const load = async () => JSON.parse(await readFile(statePath, 'utf8'))
const save = async (state) => writeFile(statePath, JSON.stringify(state, null, 2) + '\\n')
const clone = (value) => JSON.parse(JSON.stringify(value))

export const getPayload = async ({ config }) => ({
  config,
  find: async (options) => {
    const state = await load()
    state.calls.push(clone({ method: 'find', ...options }))
    await save(state)
    const documents = options.collection === 'pages' ? state.pages : state.media
    const expected = options.where?.slug?.equals ?? options.where?.alt?.equals
    const field = options.collection === 'pages' ? 'slug' : 'alt'
    return { docs: documents.filter((document) => document[field] === expected) }
  },
  create: async (options) => {
    const state = await load()
    state.calls.push(clone({ method: 'create', ...options }))
    await save(state)
    if (options.collection === 'media' && process.env.PAYLOAD_STUB_FAIL_MEDIA_WRITE === '1') {
      throw new Error('injected media write failure')
    }
    if (options.collection === 'pages' && process.env.PAYLOAD_STUB_FAIL_PAGE_WRITE === '1') {
      throw new Error('injected page write failure')
    }
    if (options.filePath) await accessFile(options.filePath)
    const document = { id: state.nextID++, ...clone(options.data) }
    state[options.collection].push(document)
    await save(state)
    return document
  },
  update: async (options) => {
    const state = await load()
    state.calls.push(clone({ method: 'update', ...options }))
    await save(state)
    if (process.env.PAYLOAD_STUB_FAIL_PAGE_WRITE === '1') {
      throw new Error('injected page write failure')
    }
    const index = state.pages.findIndex((page) => page.id === options.id)
    if (index === -1) throw new Error('missing page')
    state.pages[index] = { ...state.pages[index], ...clone(options.data) }
    await save(state)
    return state.pages[index]
  },
  delete: async (options) => {
    const state = await load()
    state.calls.push(clone({ method: 'delete', ...options }))
    const key = options.collection === 'pages' ? 'pages' : 'media'
    state[key] = state[key].filter((document) => document.id !== options.id)
    await save(state)
  },
})

const accessFile = async (filePath) => {
  const { access } = await import('node:fs/promises')
  await access(filePath)
}
`

const createRuntimeFixture = async ({
  drafts = true,
  emptyUploadReference = false,
  manifestName = 'logo-cloud-grid',
  state = emptyState(),
}: {
  drafts?: boolean
  emptyUploadReference?: boolean
  manifestName?: string
  state?: StubState
} = {}) => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-runtime-'))
  const statePath = path.join(fixtureDir, 'payload-stub-state.json')
  const packageDir = path.join(fixtureDir, 'node_modules', 'payload')
  const configPath = path.join(fixtureDir, 'src', 'payload.config.ts')

  await Promise.all([
    mkdir(packageDir, { recursive: true }),
    mkdir(path.dirname(configPath), { recursive: true }),
  ])
  await Promise.all([
    writeFile(
      path.join(fixtureDir, 'package.json'),
      `${JSON.stringify({ private: true, type: 'module' }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(
      path.join(packageDir, 'package.json'),
      `${JSON.stringify({ name: 'payload', type: 'module', exports: './index.js' }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(path.join(packageDir, 'index.js'), stubPayloadModule, 'utf8'),
    writeFile(
      configPath,
      `export default { collections: [{ slug: 'pages', versions: { drafts: ${drafts} } }] }\n`,
      'utf8',
    ),
    writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8'),
  ])

  const loadedManifest = await loadManifest(manifestName)
  const manifest: ComponentManifest = emptyUploadReference
    ? {
        ...loadedManifest,
        sampleContent: {
          ...loadedManifest.sampleContent,
          logos: (
            loadedManifest.sampleContent.logos as Array<Record<string, unknown>>
          ).map((logo, index) => (index === 0 ? { ...logo, logo: '' } : logo)),
        },
      }
    : loadedManifest
  const target = {
    ...runtimeTarget,
    marker: `payload-components:demo:${manifest.name}`,
    ownershipStateRelPath: path.join(
      '.payload-components',
      'demo-state',
      `${manifest.name}.json`,
    ),
    scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
    slug: `payload-components-demo-${manifest.name}`,
    title: `Payload Components demo — ${manifest.title}`,
  }
  const scriptPath = await writeSeedScript(fixtureDir, [manifest], target)
  const ownershipStatePath = path.join(fixtureDir, target.ownershipStateRelPath)

  return { fixtureDir, ownershipStatePath, scriptPath, statePath, target }
}

const runScript = (
  scriptPath: string,
  statePath: string,
  extraEnv: Partial<NodeJS.ProcessEnv> = {},
) =>
  execFileAsync(process.execPath, [tsxCli, scriptPath], {
    cwd: path.dirname(path.dirname(scriptPath)),
    env: { ...process.env, ...extraEnv, PAYLOAD_STUB_STATE: statePath },
    maxBuffer: 10_000_000,
    timeout: 20_000,
  })

const readState = async (statePath: string) =>
  JSON.parse(await readFile(statePath, 'utf8')) as StubState

const readOwnershipState = async (statePath: string) =>
  JSON.parse(await readFile(statePath, 'utf8')) as OwnershipState

describe('generated demo seed runtime', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
    tempDirs.length = 0
  })

  it('refuses drafts-disabled Pages before querying or mutating content', async () => {
    const fixture = await createRuntimeFixture({ drafts: false, manifestName: 'hero-basic' })
    tempDirs.push(fixture.fixtureDir)

    await expect(runScript(fixture.scriptPath, fixture.statePath)).rejects.toMatchObject({
      stderr: expect.stringContaining('requires drafts to be enabled'),
    })

    expect(await readState(fixture.statePath)).toEqual(emptyState())
  })

  it('creates a draft once and updates the exact owned Page in place on rerun', async () => {
    const fixture = await createRuntimeFixture({ manifestName: 'hero-basic' })
    tempDirs.push(fixture.fixtureDir)

    await runScript(fixture.scriptPath, fixture.statePath)
    await runScript(fixture.scriptPath, fixture.statePath)

    const state = await readState(fixture.statePath)
    const pageWrites = state.calls.filter(
      (call) => call.collection === 'pages' && ['create', 'update'].includes(call.method),
    )

    expect(pageWrites.map((call) => call.method)).toEqual(['create', 'update'])
    expect(pageWrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          context: { disableRevalidate: true },
          draft: true,
          overrideAccess: true,
        }),
        expect.objectContaining({
          method: 'update',
          overrideLock: false,
        }),
      ]),
    )
    expect(state.calls.some((call) => call.collection === 'pages' && call.method === 'delete')).toBe(
      false,
    )
    expect(state.pages).toHaveLength(1)
    expect(state.pages[0]).toMatchObject({
      _status: 'draft',
      slug: fixture.target.slug,
      title: fixture.target.title,
    })
    expect((state.pages[0].layout as Array<Record<string, unknown>>)[0]).toMatchObject({
      id: `${fixture.target.marker}:${(await readOwnershipState(fixture.ownershipStatePath)).token}:${
        (await readOwnershipState(fixture.ownershipStatePath)).pageOperationToken
      }`,
    })
    expect(await readOwnershipState(fixture.ownershipStatePath)).toMatchObject({
      pageId: state.pages[0].id,
    })
  })

  it('refuses a forged same-slug Page even when its public marker fields look owned', async () => {
    const state = emptyState()
    state.pages.push({
      id: 40,
      layout: [{ blockType: 'logoCloudGrid', id: 'payload-components:demo:logo-cloud-grid' }],
      slug: runtimeTarget.slug,
      title: runtimeTarget.title,
    })
    const fixture = await createRuntimeFixture({ state })
    tempDirs.push(fixture.fixtureDir)

    await expect(runScript(fixture.scriptPath, fixture.statePath)).rejects.toMatchObject({
      stderr: expect.stringContaining('has no matching local ownership record'),
    })

    const result = await readState(fixture.statePath)
    expect(result.pages).toEqual(state.pages)
    expect(result.calls.filter((call) => ['create', 'delete', 'update'].includes(call.method))).toEqual(
      [],
    )
  })

  it('refuses marker-like media collisions without deleting or reusing them', async () => {
    const state = emptyState()
    const fixture = await createRuntimeFixture({ state })
    tempDirs.push(fixture.fixtureDir)
    const ownershipState = await readOwnershipState(fixture.ownershipStatePath)
    ownershipState.mediaOperationToken = '11111111-1111-4111-8111-111111111111'
    await writeFile(
      fixture.ownershipStatePath,
      `${JSON.stringify(ownershipState, null, 2)}\n`,
      'utf8',
    )
    const alt =
      `Payload Components generated demo media [` +
      `payload-components:demo:logo-cloud-grid:media:${ownershipState.token}:` +
      `${ownershipState.mediaOperationToken}]`
    state.media.push({ alt, id: 10 }, { alt, id: 11 })
    await writeFile(fixture.statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

    await expect(runScript(fixture.scriptPath, fixture.statePath)).rejects.toMatchObject({
      stderr: expect.stringContaining('does not match its private ownership record'),
    })

    const result = await readState(fixture.statePath)
    expect(result.media).toEqual(state.media)
    expect(result.calls.some((call) => call.collection === 'media' && call.method === 'create')).toBe(
      false,
    )
    expect(result.calls.some((call) => call.method === 'delete')).toBe(false)
    expect(result.pages).toEqual([])
  })

  it('journals a Media operation token before attempting the create', async () => {
    const fixture = await createRuntimeFixture()
    tempDirs.push(fixture.fixtureDir)

    await expect(
      runScript(fixture.scriptPath, fixture.statePath, {
        PAYLOAD_STUB_FAIL_MEDIA_WRITE: '1',
      }),
    ).rejects.toMatchObject({ stderr: expect.stringContaining('injected media write failure') })

    expect(await readOwnershipState(fixture.ownershipStatePath)).toMatchObject({
      mediaId: null,
      mediaOperationToken: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      ),
      pageId: null,
    })
  })

  it('adopts the exact Media created by an interrupted journaled operation', async () => {
    const state = emptyState()
    const fixture = await createRuntimeFixture({ state })
    tempDirs.push(fixture.fixtureDir)
    const ownershipState = await readOwnershipState(fixture.ownershipStatePath)
    ownershipState.mediaOperationToken = '22222222-2222-4222-8222-222222222222'
    await writeFile(
      fixture.ownershipStatePath,
      `${JSON.stringify(ownershipState, null, 2)}\n`,
      'utf8',
    )
    state.media.push({
      alt:
        `Payload Components generated demo media [` +
        `${fixture.target.marker}:media:${ownershipState.token}:` +
        `${ownershipState.mediaOperationToken}]`,
      id: 73,
    })
    state.nextID = 74
    await writeFile(fixture.statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

    await runScript(fixture.scriptPath, fixture.statePath)

    const result = await readState(fixture.statePath)
    expect(
      result.calls.filter(
        (call) => call.collection === 'media' && call.method === 'create',
      ),
    ).toHaveLength(0)
    expect(result.media).toEqual(state.media)
    expect(await readOwnershipState(fixture.ownershipStatePath)).toMatchObject({
      mediaId: 73,
      mediaOperationToken: ownershipState.mediaOperationToken,
    })
  })

  it('persists a newly created media ID before a failed Page write and reuses it on retry', async () => {
    const fixture = await createRuntimeFixture()
    tempDirs.push(fixture.fixtureDir)

    await expect(
      runScript(fixture.scriptPath, fixture.statePath, { PAYLOAD_STUB_FAIL_PAGE_WRITE: '1' }),
    ).rejects.toMatchObject({ stderr: expect.stringContaining('injected page write failure') })

    const result = await readState(fixture.statePath)
    const ownershipAfterFailure = await readOwnershipState(fixture.ownershipStatePath)
    expect(result.media).toHaveLength(1)
    expect(ownershipAfterFailure).toMatchObject({
      mediaId: result.media[0].id,
      pageId: null,
      pageOperationToken: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      ),
    })
    expect(result.calls.some((call) => call.method === 'delete')).toBe(false)

    await runScript(fixture.scriptPath, fixture.statePath)

    const afterRetry = await readState(fixture.statePath)
    expect(
      afterRetry.calls.filter(
        (call) => call.collection === 'media' && call.method === 'create',
      ),
    ).toHaveLength(1)
    expect(afterRetry.media).toHaveLength(1)
    expect(afterRetry.pages).toHaveLength(1)
    expect(await readOwnershipState(fixture.ownershipStatePath)).toMatchObject({
      mediaId: afterRetry.media[0].id,
      pageId: afterRetry.pages[0].id,
    })
  })

  it('adopts the exact Page created by an interrupted journaled operation', async () => {
    const state = emptyState()
    const fixture = await createRuntimeFixture({ manifestName: 'hero-basic', state })
    tempDirs.push(fixture.fixtureDir)
    const ownershipState = await readOwnershipState(fixture.ownershipStatePath)
    ownershipState.pageOperationToken = '33333333-3333-4333-8333-333333333333'
    await writeFile(
      fixture.ownershipStatePath,
      `${JSON.stringify(ownershipState, null, 2)}\n`,
      'utf8',
    )
    state.pages.push({
      _status: 'draft',
      id: 91,
      layout: [
        {
          blockType: 'heroBasic',
          id:
            `${fixture.target.marker}:${ownershipState.token}:` +
            ownershipState.pageOperationToken,
        },
      ],
      slug: fixture.target.slug,
      title: fixture.target.title,
    })
    state.nextID = 92
    await writeFile(fixture.statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

    await runScript(fixture.scriptPath, fixture.statePath)

    const result = await readState(fixture.statePath)
    expect(
      result.calls.filter(
        (call) => call.collection === 'pages' && call.method === 'create',
      ),
    ).toHaveLength(0)
    expect(result.pages).toHaveLength(1)
    expect(await readOwnershipState(fixture.ownershipStatePath)).toMatchObject({
      pageId: 91,
      pageOperationToken: ownershipState.pageOperationToken,
    })
  })

  it('creates placeholder uploads in an OS temp directory and removes it afterward', async () => {
    const fixture = await createRuntimeFixture()
    tempDirs.push(fixture.fixtureDir)

    await runScript(fixture.scriptPath, fixture.statePath)

    const result = await readState(fixture.statePath)
    const mediaCreate = result.calls.find(
      (call) => call.collection === 'media' && call.method === 'create',
    )

    expect(mediaCreate?.filePath).toContain(
      path.join(os.tmpdir(), 'payload-components-demo-logo-cloud-grid-'),
    )
    await expect(access(path.dirname(mediaCreate?.filePath ?? ''))).rejects.toThrow()
  })

  it('fills upload references that manifests express as empty strings', async () => {
    const fixture = await createRuntimeFixture({ emptyUploadReference: true })
    tempDirs.push(fixture.fixtureDir)

    await runScript(fixture.scriptPath, fixture.statePath)

    const result = await readState(fixture.statePath)
    const firstLogo = (
      result.pages[0].layout as Array<{ logos: Array<{ logo: unknown }> }>
    )[0].logos[0]

    expect(firstLogo.logo).toBe(result.media[0].id)
  })

  it('refuses a missing private ownership state before querying or mutating Payload', async () => {
    const fixture = await createRuntimeFixture({ manifestName: 'hero-basic' })
    tempDirs.push(fixture.fixtureDir)
    await rm(fixture.ownershipStatePath)

    await expect(runScript(fixture.scriptPath, fixture.statePath)).rejects.toMatchObject({
      stderr: expect.stringContaining('private ownership state'),
    })

    expect(await readState(fixture.statePath)).toEqual(emptyState())
  })

  it('refuses an owned ID when the database marker no longer matches its private token', async () => {
    const fixture = await createRuntimeFixture({ manifestName: 'hero-basic' })
    tempDirs.push(fixture.fixtureDir)
    await runScript(fixture.scriptPath, fixture.statePath)

    const state = await readState(fixture.statePath)
    ;(state.pages[0].layout as Array<Record<string, unknown>>)[0].id =
      'payload-components:demo:hero-basic:forged'
    await writeFile(fixture.statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

    await expect(runScript(fixture.scriptPath, fixture.statePath)).rejects.toMatchObject({
      stderr: expect.stringContaining('does not match its private ownership record'),
    })

    const result = await readState(fixture.statePath)
    expect(result.calls.filter((call) => ['create', 'delete', 'update'].includes(call.method))).toHaveLength(
      1,
    )
  })
})
