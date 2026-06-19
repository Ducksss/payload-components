import { spawn, type ChildProcess } from 'node:child_process'
import { access, cp, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createServer, type Server, type ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

import { loadManifest } from '../manifest'
import { writeSeedScript } from '../seed/seed-script'
import { shadcnCliPackage } from '../utils'
import type { ComponentManifest } from '../types'

export const DEFAULT_SMOKE_COMPONENTS = [
  'hero-basic',
  'feature-grid-basic',
  'feature-split',
  'feature-bento',
  'feature-steps',
  'embed-basic',
  'content-columns',
  'content-feature-media',
  'content-stats',
  'content-list',
  'logo-cloud-grid',
  'logo-cloud-hover',
  'logo-cloud-marquee',
  'logo-cloud-inline',
  'logo-cloud-inline-wrap',
  'integration-grid',
  'integration-cluster',
  'integration-split',
  'integration-connect',
  'integration-orbit',
  'integration-list',
  'integration-marquee',
  'integration-testimonial',
  'call-to-action-centered',
  'call-to-action-boxed',
  'call-to-action-signup',
] as const
export const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000

type MutableSmokeComponents = Array<(typeof DEFAULT_SMOKE_COMPONENTS)[number] | string>

export type SmokeOptions = {
  keepTemp: boolean
  components: MutableSmokeComponents
  registryUrl?: string
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
    components: [...DEFAULT_SMOKE_COMPONENTS],
    registryUrl: undefined,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--components') {
      const rawComponents = parseNextValue(argv, index, arg)
      options.components = rawComponents
        .split(',')
        .map((component) => component.trim())
        .filter(Boolean)
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

  if (options.components.length === 0) {
    throw new Error('--components must include at least one component name.')
  }

  return options
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

const runCommand = async ({ args, command, cwd, env, stage, stdin, timeoutMs }: CommandInput) =>
  new Promise<void>((resolve, reject) => {
    console.log(`\n[payload-components smoke] ${stage}`)
    console.log(`[payload-components smoke] $ ${command} ${args.join(' ')}`)
    console.log(`[payload-components smoke] cwd=${cwd}`)

    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        ...env,
      },
      stdio: stdin ? ['pipe', 'inherit', 'inherit'] : 'inherit',
    })
    let settled = false

    const finish = (error?: Error) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timer)

      if (error) {
        reject(error)
      } else {
        resolve()
      }
    }

    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      finish(new Error(`Stage "${stage}" timed out after ${timeoutMs}ms.`))
    }, timeoutMs)

    if (stdin && child.stdin) {
      child.stdin.write(stdin)
      child.stdin.end()
    }

    child.on('error', (error) => finish(error))
    child.on('close', (code, signal) => {
      if (code === 0) {
        finish()
        return
      }

      finish(
        new Error(
          `Stage "${stage}" failed with ${signal ? `signal ${signal}` : `exit code ${code}`}.`,
        ),
      )
    })
  })

const killProcess = async (child: ChildProcess) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }

  child.kill('SIGTERM')
  await Promise.race([
    new Promise<void>((resolve) => child.once('close', () => resolve())),
    sleep(5000).then(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL')
      }
    }),
  ])
}

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
      const sampleLabel = manifest.sampleContent.title ?? manifest.sampleContent.heading

      if (typeof sampleLabel !== 'string') {
        throw new Error(
          `Manifest "${manifest.name}" sampleContent must include a visible title or heading for smoke assertions.`,
        )
      }

      await page
        .getByText(sampleLabel, { exact: false })
        .first()
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
  tempRoot,
  timeoutMs,
}: {
  dbConnectionString?: string
  components: string[]
  manifests: ComponentManifest[]
  stageLog: string[]
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

  const tarballPath = await packLocalPackage(tempRoot, timeoutMs)

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
  const devServer = startProcess({
    args: ['dev', '--hostname', '127.0.0.1', '--port', String(port)],
    command: 'pnpm',
    cwd: targetPath,
    env: smokeEnvForTarget(`http://127.0.0.1:${port}`),
    stage: 'start fresh project dev server',
  })

  try {
    await waitForRoute(routeUrl, timeoutMs)
    await assertRouteRendersWithPlaywright({
      manifests,
      routeUrl,
      timeoutMs,
    })
  } finally {
    await killProcess(devServer)
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
    const components = options.components.map(String)
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
