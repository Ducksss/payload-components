import { spawn, type ChildProcess } from 'node:child_process'
import { access, cp, mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createServer, type Server, type ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

import { loadManifest } from '../manifest'
import {
  runCommand as runBoundedCommand,
  shadcnCliPackage,
  terminateProcessTree,
} from '../utils'
import type { ComponentManifest } from '../types'

export const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000
export const SMOKE_SHARD_COUNT = 4

export type SmokeOptions = {
  keepTemp: boolean
  components?: string[]
  registryUrl?: string
  shardIndex?: number
  timeoutMs: number
}

type CreatePayloadAppArgsInput = {
  dbConnectionString?: string
  payloadVersion?: string
  projectName: string
}

type DirectShadcnAddArgsInput = {
  cwd: string
  itemName: string
  registryUrl: string
}

type CommandInput = {
  args: string[]
  command: string
  cwd: string
  env?: Partial<NodeJS.ProcessEnv>
  stage: string
  stdin?: string
  timeoutMs: number
}

type SmokeSummary = {
  directTargetPath?: string
  failureStage?: string
  registryUrl: string
  routeUrl?: string
  stageLog: string[]
  targetPath?: string
  tempRoot: string
}

type StaticRegistryServer = {
  close: () => Promise<void>
  urlTemplate: string
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '..', '..', '..')
const rootPackagePath = path.join(repoRoot, 'package.json')
const manifestDir = path.join(repoRoot, 'payload-components', 'manifests')
const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')

export const getInstallableComponentSlugs = async () => {
  const registry = JSON.parse(await readFile(registryDefinitionPath, 'utf8')) as {
    items: Array<{ name: string }>
  }
  const registrySlugs = registry.items.map((item) => item.name).sort()
  const manifestSlugs = (await readdir(manifestDir))
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => entry.replace(/\.json$/, ''))
    .sort()

  if (new Set(registrySlugs).size !== registrySlugs.length) {
    throw new Error('payload-components/registry.json contains duplicate item names.')
  }

  if (registrySlugs.length !== manifestSlugs.length || registrySlugs.some((slug, index) => slug !== manifestSlugs[index])) {
    throw new Error(
      'Fresh smoke requires payload-components/registry.json and payload-components/manifests to contain the same installable slugs.',
    )
  }

  return registrySlugs
}

export const getSmokeShard = (slugs: string[], shardIndex: number) => {
  if (!Number.isInteger(shardIndex) || shardIndex < 0 || shardIndex >= SMOKE_SHARD_COUNT) {
    throw new Error(
      `Smoke shard index must be an integer from 0 to ${SMOKE_SHARD_COUNT - 1}. Received "${shardIndex}".`,
    )
  }

  return [...slugs].sort().filter((_, index) => index % SMOKE_SHARD_COUNT === shardIndex)
}

const parseNextValue = (argv: string[], index: number, flag: string) => {
  const value = argv[index + 1]

  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}.`)
  }

  return value
}

export const parseSmokeArgs = (argv: string[]): SmokeOptions => {
  const options: SmokeOptions = {
    keepTemp: false,
    registryUrl: undefined,
    shardIndex: undefined,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--components') {
      const rawComponents = parseNextValue(argv, index, arg)
      options.components = rawComponents
        .split(',')
        .map((component) => component.trim())
        .filter(Boolean)
      index += 1
      continue
    }

    if (arg === '--shard-index') {
      const rawShardIndex = parseNextValue(argv, index, arg)
      const shardIndex = Number(rawShardIndex)

      if (!Number.isInteger(shardIndex) || shardIndex < 0 || shardIndex >= SMOKE_SHARD_COUNT) {
        throw new Error(
          `--shard-index must be an integer from 0 to ${SMOKE_SHARD_COUNT - 1}. Received "${rawShardIndex}".`,
        )
      }

      options.shardIndex = shardIndex
      index += 1
      continue
    }

    if (arg === '--registry-url') {
      options.registryUrl = parseNextValue(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--timeout') {
      const rawTimeout = parseNextValue(argv, index, arg)
      const timeoutMs = Number(rawTimeout)

      if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
        throw new Error(
          `--timeout must be a positive integer in milliseconds. Received "${rawTimeout}".`,
        )
      }

      options.timeoutMs = timeoutMs
      index += 1
      continue
    }

    if (arg === '--keep-temp') {
      options.keepTemp = true
      continue
    }

    throw new Error(`Unknown option "${arg}".`)
  }

  if (options.components?.length === 0) {
    throw new Error('--components must include at least one component name.')
  }

  if (options.components && typeof options.shardIndex === 'number') {
    throw new Error('--components and --shard-index cannot be used together.')
  }

  return options
}

export const resolveSmokeComponents = async (options: SmokeOptions) => {
  if (options.components) {
    return [...new Set(options.components)].sort()
  }

  const slugs = await getInstallableComponentSlugs()

  return typeof options.shardIndex === 'number' ? getSmokeShard(slugs, options.shardIndex) : slugs
}

export const getCreatePayloadAppArgs = ({
  dbConnectionString,
  payloadVersion,
  projectName,
}: CreatePayloadAppArgsInput) => {
  const args = [
    'dlx',
    'create-payload-app@latest',
    '-n',
    projectName,
    '-t',
    'website',
    '--db',
    dbConnectionString ? 'postgres' : 'sqlite',
  ]

  if (dbConnectionString) {
    args.push('--db-connection-string', dbConnectionString)
  } else {
    args.push('--db-accept-recommended')
  }

  args.push('--use-pnpm', '--no-agent', '--no-git')

  if (payloadVersion) {
    args.push('--version', payloadVersion)
  }

  return args
}

export const resolveRegistryItemUrl = (registryUrl: string, itemName: string) => {
  if (registryUrl.includes('{name}')) {
    return registryUrl.replaceAll('{name}', itemName)
  }

  if (registryUrl.endsWith('/registry.json')) {
    return registryUrl.replace(/registry\.json$/, `${itemName}.json`)
  }

  if (registryUrl.endsWith('.json')) {
    const parsed = new URL(registryUrl)
    const lastSegment = parsed.pathname.split('/').at(-1)

    if (lastSegment !== `${itemName}.json`) {
      throw new Error(
        `Registry URL "${registryUrl}" points to a single JSON item. Use a URL template with "{name}" when installing multiple components.`,
      )
    }

    return registryUrl
  }

  return `${registryUrl.replace(/\/$/, '')}/${itemName}.json`
}

export const getDirectShadcnAddArgs = ({
  cwd,
  itemName,
  registryUrl,
}: DirectShadcnAddArgsInput) => [
  'dlx',
  shadcnCliPackage,
  'add',
  resolveRegistryItemUrl(registryUrl, itemName),
  '--cwd',
  cwd,
  '--yes',
  '--overwrite',
]

const getRootPackage = async () =>
  JSON.parse(await readFile(rootPackagePath, 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

const getLocalPayloadVersion = async () => {
  const pkg = await getRootPackage()
  return pkg.dependencies?.payload ?? pkg.devDependencies?.payload
}

const exists = async (filePath: string) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const runCommand = async ({ args, command, cwd, env, stage, stdin, timeoutMs }: CommandInput) => {
  console.log(`\n[payload-components smoke] ${stage}`)
  console.log(`[payload-components smoke] $ ${command} ${args.join(' ')}`)
  console.log(`[payload-components smoke] cwd=${cwd}`)

  await runBoundedCommand({
    args,
    command,
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    stdin,
    timeoutMs,
  })
}

const killProcess = (child: ChildProcess) => terminateProcessTree(child)

const startProcess = ({
  args,
  command,
  cwd,
  env,
  stage,
}: Omit<CommandInput, 'stdin' | 'timeoutMs'>) => {
  console.log(`\n[payload-components smoke] ${stage}`)
  console.log(`[payload-components smoke] $ ${command} ${args.join(' ')}`)
  console.log(`[payload-components smoke] cwd=${cwd}`)

  return spawn(command, args, {
    cwd,
    detached: process.platform !== 'win32',
    env: {
      ...process.env,
      ...env,
    },
    stdio: 'inherit',
  })
}

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer()

    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()

      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Unable to allocate a local port.'))
        return
      }

      const { port } = address
      server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve(port)
        }
      })
    })
  })

export const getFreshServerArgs = (port: number) => [
  'start',
  '--hostname',
  '127.0.0.1',
  '--port',
  String(port),
]

const closeServer = (server: Server) =>
  new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })

const sendStaticFile = async (serverRoot: string, requestUrl: string, response: ServerResponse) => {
  const parsedUrl = new URL(requestUrl, 'http://127.0.0.1')
  const relativePath = decodeURIComponent(parsedUrl.pathname.replace(/^\//, ''))
  const filePath = path.resolve(serverRoot, relativePath)

  if (!filePath.startsWith(serverRoot + path.sep)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  try {
    const content = await readFile(filePath)
    response.writeHead(200, {
      'content-type': filePath.endsWith('.json')
        ? 'application/json; charset=utf-8'
        : 'application/octet-stream',
    })
    response.end(content)
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
}

const startStaticRegistryServer = async (): Promise<StaticRegistryServer> => {
  const serverRoot = path.join(repoRoot, 'public')
  const server = createServer((request, response) => {
    if (!request.url) {
      response.writeHead(400)
      response.end('Bad request')
      return
    }

    void sendStaticFile(serverRoot, request.url, response)
  })

  await new Promise<void>((resolve, reject) => {
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const address = server.address()

  if (!address || typeof address === 'string') {
    await closeServer(server)
    throw new Error('Unable to start the local registry server.')
  }

  return {
    close: () => closeServer(server),
    urlTemplate: `http://127.0.0.1:${address.port}/r/{name}.json`,
  }
}

const copyRepoFixture = async (targetPath: string) => {
  await cp(repoRoot, targetPath, {
    filter: (source) => {
      const relative = path.relative(repoRoot, source)

      if (!relative) {
        return true
      }

      return !relative
        .split(path.sep)
        .some((segment) =>
          [
            '.git',
            '.next',
            '.payload-components',
            '.playwright-cli',
            'coverage',
            'node_modules',
            'playwright-report',
            'test-results',
          ].includes(segment),
        )
    },
    recursive: true,
  })

  const rootNodeModules = path.join(repoRoot, 'node_modules')
  const targetNodeModules = path.join(targetPath, 'node_modules')

  if ((await exists(rootNodeModules)) && !(await exists(targetNodeModules))) {
    await symlink(rootNodeModules, targetNodeModules, 'dir')
  }

  await writeFile(
    path.join(targetPath, '.npmrc'),
    `virtual-store-dir=${path.join(repoRoot, 'node_modules', '.pnpm')}\n`,
  )
}

const removeManifestFiles = async (targetPath: string, manifests: ComponentManifest[]) => {
  for (const manifest of manifests) {
    for (const file of manifest.files) {
      await rm(path.join(targetPath, file), {
        force: true,
        recursive: true,
      })
    }
  }
}

const assertFilesDelivered = async (targetPath: string, manifests: ComponentManifest[]) => {
  for (const manifest of manifests) {
    for (const file of manifest.files) {
      if (!(await exists(path.join(targetPath, file)))) {
        throw new Error(
          `Direct shadcn smoke did not deliver ${file} for component "${manifest.name}".`,
        )
      }
    }
  }
}

const assertRegistryDependenciesDelivered = async (targetPath: string, componentName: string) => {
  const itemPath = path.join(repoRoot, 'public', 'r', `${componentName}.json`)
  const item = JSON.parse(await readFile(itemPath, 'utf8')) as {
    registryDependencies?: string[]
  }

  for (const dependency of item.registryDependencies ?? []) {
    const dependencyPath = path.join(targetPath, 'src', 'components', 'ui', `${dependency}.tsx`)

    if (!(await exists(dependencyPath))) {
      throw new Error(`Direct shadcn smoke did not deliver registry dependency "${dependency}".`)
    }
  }
}

const runDirectShadcnUrlSmoke = async ({
  components,
  manifests,
  registryUrl,
  stageLog,
  tempRoot,
  timeoutMs,
}: {
  components: string[]
  manifests: ComponentManifest[]
  registryUrl: string
  stageLog: string[]
  tempRoot: string
  timeoutMs: number
}) => {
  stageLog.push('direct-shadcn-url-smoke')

  const targetPath = path.join(tempRoot, 'direct-shadcn-target')
  await copyRepoFixture(targetPath)
  await removeManifestFiles(targetPath, manifests)

  for (const component of components) {
    await runCommand({
      args: getDirectShadcnAddArgs({
        cwd: targetPath,
        itemName: component,
        registryUrl,
      }),
      command: 'pnpm',
      cwd: repoRoot,
      stage: `direct shadcn URL install: ${component}`,
      timeoutMs,
    })
    await assertRegistryDependenciesDelivered(targetPath, component)
  }

  await assertFilesDelivered(targetPath, manifests)

  return targetPath
}

const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

const uploadFieldNames = new Set(['avatar', 'image', 'logo', 'poster', 'productImage', 'video'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isMissingUploadReference = (item: Record<string, unknown>, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

const valueNeedsSmokeMedia = (value: unknown, arrayName?: string): boolean => {
  if (Array.isArray(value)) {
    const uploadField = arrayName ? uploadFieldByArrayName[arrayName] : undefined

    return value.some(
      (item) =>
        (uploadField && isRecord(item) && isMissingUploadReference(item, uploadField)) ||
        valueNeedsSmokeMedia(item),
    )
  }

  if (!isRecord(value)) {
    return false
  }

  return Object.entries(value).some(
    ([key, nestedValue]) =>
      (uploadFieldNames.has(key) && isMissingUploadReference(value, key)) ||
      valueNeedsSmokeMedia(nestedValue, key),
  )
}

export const sampleContentNeedsSmokeMedia = (sampleContent: ComponentManifest['sampleContent']) =>
  valueNeedsSmokeMedia(sampleContent)

export const addSmokeUploadReferences = (
  value: unknown,
  mediaID: unknown,
  arrayName?: string,
): unknown => {
  if (Array.isArray(value)) {
    const uploadField = arrayName ? uploadFieldByArrayName[arrayName] : undefined

    return value.map((item) => {
      const hydratedItem = addSmokeUploadReferences(item, mediaID)

      if (!uploadField || !isRecord(hydratedItem)) return hydratedItem

      return {
        ...hydratedItem,
        [uploadField]: isMissingUploadReference(hydratedItem, uploadField)
          ? mediaID
          : hydratedItem[uploadField],
      }
    })
  }

  if (!isRecord(value)) return value

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      uploadFieldNames.has(key) && isMissingUploadReference(value, key)
        ? mediaID
        : addSmokeUploadReferences(nestedValue, mediaID, key),
    ]),
  )
}

export const writeSeedScript = async (targetPath: string, manifests: ComponentManifest[]) => {
  const layout = manifests.map((manifest) => ({
    ...manifest.sampleContent,
    id: `smoke-${manifest.name}`,
  }))
  const needsSmokeMedia = manifests.some((manifest) =>
    sampleContentNeedsSmokeMedia(manifest.sampleContent),
  )
  const scriptPath = path.join(targetPath, '.payload-components', 'smoke-seed.ts')

  await mkdir(path.dirname(scriptPath), {
    recursive: true,
  })

  await writeFile(
    scriptPath,
    `import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import 'dotenv/config'
import { getPayload } from 'payload'

const { default: config } = await import('../src/payload.config')

type SmokeSampleItem = Record<string, unknown>

const rawLayout = ${JSON.stringify(layout, null, 2)} satisfies SmokeSampleItem[]
const needsSmokeMedia = ${JSON.stringify(needsSmokeMedia)}

const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

const uploadFieldNames = new Set(${JSON.stringify([...uploadFieldNames])})

const isSmokeSampleItem = (value: unknown): value is SmokeSampleItem =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isRecord = isSmokeSampleItem
const isMissingUploadReference = (item: SmokeSampleItem, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

const addSmokeUploadReferences = ${addSmokeUploadReferences.toString()}

const createSmokeMedia = async () => {
  const mediaPath = path.join(process.cwd(), '.payload-components', 'smoke-placeholder.svg')

  await mkdir(path.dirname(mediaPath), { recursive: true })
  await writeFile(
    mediaPath,
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#f4f4f5"/><path d="M27 52h42v8H27zM27 36h42v8H27z" fill="#18181b"/></svg>',
  )

  return payload.create({
    collection: 'media',
    data: {
      alt: 'Payload Components smoke placeholder',
    },
    filePath: mediaPath,
    overrideAccess: true,
  })
}

const payload = await getPayload({ config })
const slug = 'payload-components-smoke'
const smokeMedia = needsSmokeMedia ? await createSmokeMedia() : undefined
const layout = smokeMedia
  ? rawLayout.map((block) => addSmokeUploadReferences(block, smokeMedia.id))
  : rawLayout

await payload.delete({
  collection: 'pages',
  context: {
    disableRevalidate: true,
  },
  overrideAccess: true,
  where: {
    slug: {
      equals: slug,
    },
  },
}).catch(() => undefined)

await payload.create({
  collection: 'pages',
  context: {
    disableRevalidate: true,
  },
  data: {
    title: 'Payload Component Smoke',
    slug,
    layout,
    _status: 'published',
  },
  overrideAccess: true,
})

// Payload keeps its database adapter alive after initialization. This script is a
// one-shot fixture command, so terminate explicitly once every write has completed.
console.log('Seeded /payload-components-smoke')
process.exit(0)
`,
  )

  return scriptPath
}

const waitForRoute = async (routeUrl: string, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs
  let lastError: unknown

  while (Date.now() < deadline) {
    try {
      const response = await fetch(routeUrl, {
        redirect: 'follow',
      })

      if (response.ok) {
        return
      }

      lastError = new Error(`Received HTTP ${response.status} from ${routeUrl}.`)
    } catch (error) {
      lastError = error
    }

    await sleep(1000)
  }

  throw new Error(`Timed out waiting for ${routeUrl}. Last error: ${String(lastError)}`)
}

const assertRouteRendersWithPlaywright = async ({
  manifests,
  routeUrl,
  timeoutMs,
}: {
  manifests: ComponentManifest[]
  routeUrl: string
  timeoutMs: number
}) => {
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()
    await page.goto(routeUrl, {
      timeout: timeoutMs,
      waitUntil: 'networkidle',
    })

    for (const manifest of manifests) {
      await page
        .locator(`#block-smoke-${manifest.name}`)
        .waitFor({
          timeout: Math.min(timeoutMs, 60_000),
        })
    }
  } finally {
    await browser.close()
  }
}

const packLocalPackage = async (tempRoot: string, timeoutMs: number) => {
  await runCommand({
    args: ['pack', '--pack-destination', tempRoot],
    command: 'pnpm',
    cwd: repoRoot,
    stage: 'pack local payload-components tarball',
    timeoutMs,
  })

  const entries = await readdir(tempRoot)
  const tarball = entries.find((entry) => entry.endsWith('.tgz'))

  if (!tarball) {
    throw new Error('pnpm pack did not produce a .tgz tarball.')
  }

  return path.join(tempRoot, tarball)
}

const runFreshPayloadRepoSmoke = async ({
  dbConnectionString,
  components,
  manifests,
  stageLog,
  tarballPath,
  tempRoot,
  timeoutMs,
}: {
  dbConnectionString?: string
  components: string[]
  manifests: ComponentManifest[]
  stageLog: string[]
  tarballPath: string
  tempRoot: string
  timeoutMs: number
}) => {
  stageLog.push('fresh-payload-repo-smoke')

  const payloadVersion = await getLocalPayloadVersion()
  const projectName = 'payload-components-smoke-target'
  const targetPath = path.join(tempRoot, projectName)

  await runCommand({
    args: getCreatePayloadAppArgs({
      dbConnectionString,
      payloadVersion,
      projectName,
    }),
    command: 'pnpm',
    cwd: tempRoot,
    stage: 'create fresh Payload website project',
    timeoutMs,
  })

  await runCommand({
    args: ['add', tarballPath],
    command: 'pnpm',
    cwd: targetPath,
    stage: 'install packed payload-components tarball into fresh project',
    timeoutMs,
  })

  for (const component of components) {
    await runCommand({
      args: ['exec', 'payload-components', 'add', component],
      command: 'pnpm',
      cwd: targetPath,
      stage: `payload-components add ${component} in fresh project`,
      timeoutMs,
    })
  }

  await runCommand({
    args: ['generate:types'],
    command: 'pnpm',
    cwd: targetPath,
    stage: 'fresh project generate:types',
    timeoutMs,
  })
  await runCommand({
    args: ['generate:importmap'],
    command: 'pnpm',
    cwd: targetPath,
    stage: 'fresh project generate:importmap',
    timeoutMs,
  })
  await runCommand({
    args: ['exec', 'tsc', '--noEmit'],
    command: 'pnpm',
    cwd: targetPath,
    stage: 'fresh project TypeScript',
    timeoutMs,
  })

  await writeSeedScript(targetPath, manifests)
  await runCommand({
    args: ['exec', 'tsx', '.payload-components/smoke-seed.ts'],
    command: 'pnpm',
    cwd: targetPath,
    env: smokeEnvForTarget('http://127.0.0.1:3000'),
    stage: 'seed fresh project sample content',
    timeoutMs,
  })

  await runCommand({
    args: ['build'],
    command: 'pnpm',
    cwd: targetPath,
    stage: 'fresh project build',
    timeoutMs,
  })

  const port = await getFreePort()
  const routeUrl = `http://127.0.0.1:${port}/payload-components-smoke`
  const productionServer = startProcess({
    args: getFreshServerArgs(port),
    command: 'pnpm',
    cwd: targetPath,
    env: smokeEnvForTarget(`http://127.0.0.1:${port}`),
    stage: 'start fresh project production server',
  })

  try {
    await waitForRoute(routeUrl, timeoutMs)
    await assertRouteRendersWithPlaywright({
      manifests,
      routeUrl,
      timeoutMs,
    })
  } finally {
    await killProcess(productionServer)
  }

  return {
    routeUrl,
    targetPath,
  }
}

const smokeEnvForTarget = (serverUrl: string): Partial<NodeJS.ProcessEnv> => ({
  CRON_SECRET: process.env.CRON_SECRET ?? 'payload-components-smoke-cron-secret',
  NEXT_PUBLIC_SERVER_URL: serverUrl,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'payload-components-smoke-secret',
  PREVIEW_SECRET: process.env.PREVIEW_SECRET ?? 'payload-components-smoke-preview-secret',
})

const writeSummary = async (summary: SmokeSummary) => {
  await writeFile(
    path.join(summary.tempRoot, 'smoke-summary.json'),
    JSON.stringify(summary, null, 2),
  )
  console.log('\n[payload-components smoke] summary')
  console.log(JSON.stringify(summary, null, 2))
}

export const runSmoke = async (options: SmokeOptions) => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'payload-components-fresh-smoke-'))
  const summary: SmokeSummary = {
    registryUrl: options.registryUrl ?? '',
    stageLog: [],
    tempRoot,
  }
  let registryServer: StaticRegistryServer | undefined
  let success = false

  try {
    const components = await resolveSmokeComponents(options)
    const manifests = await Promise.all(components.map((component) => loadManifest(component)))

    summary.stageLog.push('registry-build-and-check')
    await runCommand({
      args: ['registry:build'],
      command: 'pnpm',
      cwd: repoRoot,
      stage: 'build public registry artifacts',
      timeoutMs: options.timeoutMs,
    })
    await runCommand({
      args: ['registry:check'],
      command: 'pnpm',
      cwd: repoRoot,
      stage: 'check public registry artifacts',
      timeoutMs: options.timeoutMs,
    })
    const tarballPath = await packLocalPackage(tempRoot, options.timeoutMs)

    if (!options.registryUrl) {
      registryServer = await startStaticRegistryServer()
      summary.registryUrl = registryServer.urlTemplate
    } else {
      summary.registryUrl = options.registryUrl
    }

    summary.directTargetPath = await runDirectShadcnUrlSmoke({
      components,
      manifests,
      registryUrl: summary.registryUrl,
      stageLog: summary.stageLog,
      tempRoot,
      timeoutMs: options.timeoutMs,
    })

    const freshResult = await runFreshPayloadRepoSmoke({
      dbConnectionString: process.env.POSTGRES_URL,
      components,
      manifests,
      stageLog: summary.stageLog,
      tarballPath,
      tempRoot,
      timeoutMs: options.timeoutMs,
    })

    summary.routeUrl = freshResult.routeUrl
    summary.targetPath = freshResult.targetPath
    success = true
    await writeSummary(summary)
  } catch (error) {
    summary.failureStage = summary.stageLog.at(-1) ?? 'startup'
    await writeSummary(summary)
    console.error(error)
    throw error
  } finally {
    if (registryServer) {
      await registryServer.close()
    }

    if (success && !options.keepTemp) {
      await rm(tempRoot, {
        force: true,
        recursive: true,
      })
    } else {
      console.log(`[payload-components smoke] temp preserved at ${tempRoot}`)
    }
  }
}

const isMain = () =>
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  runSmoke(parseSmokeArgs(process.argv.slice(2))).catch(() => {
    process.exitCode = 1
  })
}
