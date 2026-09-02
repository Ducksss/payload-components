import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  createInstallFixture,
  createInstallFixtureForComponents,
} from './payload-components-fixture'

import type { ComponentManifest, InstallState } from '../../tools/payload-components/types'
import { runCommand } from '../../tools/payload-components/utils'

const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')
const integrationCommandTimeoutMs = 30_000

const runAddCommand = async (fixtureDir: string, componentName: string, extraArgs: string[] = []) =>
  runCommand({
    args: [payloadComponentBin, 'add', componentName, '--cwd', fixtureDir, ...extraArgs],
    captureOutput: true,
    command: process.execPath,
    cwd: repoRoot,
    env: process.env,
    timeoutMs: integrationCommandTimeoutMs,
  })

const runDoctorCommand = async (fixtureDir: string, extraArgs: string[] = []) => {
  try {
    const result = await runCommand({
      args: [payloadComponentBin, 'doctor', '--cwd', fixtureDir, ...extraArgs],
      captureOutput: true,
      command: process.execPath,
      cwd: repoRoot,
      env: process.env,
      timeoutMs: integrationCommandTimeoutMs,
    })

    return {
      code: 0,
      stderr: result.stderr,
      stdout: result.stdout,
    }
  } catch (error) {
    const result = error as Error & {
      code?: number
      stderr?: string
      stdout?: string
    }

    return {
      code: result.code ?? 1,
      stderr: result.stderr ?? '',
      stdout: result.stdout ?? '',
    }
  }
}

const getStateEntry = (
  manifest: ComponentManifest,
  overrides: Partial<InstallState['components'][string]> = {},
): InstallState['components'][string] => ({
  fileHashes: {},
  installedAt: '2026-04-16T00:00:00.000Z',
  lastAttemptAt: '2026-04-16T00:00:00.000Z',
  lastError: null,
  manifestVersion: manifest.version,
  patchedFiles: manifest.recovery.patchedFiles,
  registryItemName: manifest.registryItemName,
  status: 'installed',
  targetId: 'payload-website-starter',
  ...overrides,
})

const writeInstallState = async ({
  fixtureDir,
  manifest,
  overrides,
}: {
  fixtureDir: string
  manifest: ComponentManifest
  overrides?: Partial<InstallState['components'][string]>
}) => {
  await mkdir(path.join(fixtureDir, '.payload-components'), { recursive: true })

  const state: InstallState = {
    components: {
      [manifest.name]: getStateEntry(manifest, overrides),
    },
    version: 4,
  }

  await writeFile(
    path.join(fixtureDir, '.payload-components', 'state.json'),
    `${JSON.stringify(state, null, 2)}\n`,
    'utf8',
  )
}

/* Exit codes are a contract: 2 means the project itself cannot accept installs
 * (unsupported shape, unreadable state, missing generators), 1 means the project
 * is fine but a recorded install needs attention. CI responds differently to each. */
describe('payload-components doctor', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('passes a supported project with no recorded installs without writing state', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('[ok] project: payload-website-starter')
    expect(result.stdout).toContain('[ok] state: no recorded components')
    await expect(
      access(path.join(fixtureDir, '.payload-components', 'state.json')),
    ).rejects.toThrow()
  }, 180000)

  /* Internationalization only works when the config declares locales AND the
     installed blocks mark their text localized. Each half is silently inert
     without the other, so doctor names whichever one is missing. */
  it('reports the locales the Payload config declares', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeFile(
      path.join(fixtureDir, 'src', 'payload.config.ts'),
      [
        "import { buildConfig } from 'payload'",
        '',
        'export default buildConfig({',
        '  localization: {',
        "    defaultLocale: 'en',",
        '    fallback: true,',
        '    locales: [',
        "      { code: 'en', label: 'English' },",
        "      { code: 'zh', label: '简体中文' },",
        '    ],',
        '  },',
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stdout).toContain(
      '[ok] localization: 2 locales — en (English), zh (简体中文), default en',
    )
  }, 180000)

  it('names the required localization setting a config is missing', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    /* Payload v3 requires defaultLocale alongside locales; reporting a healthy
       locale count around the hole would hide a config Payload rejects. */
    await writeFile(
      path.join(fixtureDir, 'src', 'payload.config.ts'),
      [
        "import { buildConfig } from 'payload'",
        '',
        'export default buildConfig({',
        "  localization: { locales: ['en', 'zh'] },",
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stdout).toContain('[ok] localization: 2 locales — en (English), zh (简体中文)')
    expect(result.stdout).toContain(
      '[warn] localization: src/payload.config.ts declares locales but no defaultLocale',
    )
  }, 180000)

  it('reads a runtime-computed locale set as configured, not as missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic', {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)
    await runAddCommand(fixtureDir, manifest.name)
    await writeFile(
      path.join(fixtureDir, 'src', 'payload.config.ts'),
      [
        "import { buildConfig } from 'payload'",
        '',
        'export default buildConfig({',
        '  localization: {',
        "    defaultLocale: 'en',",
        "    locales: ['en'],",
        '    ...runtimeLocalization,',
        '  },',
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stdout).toContain('(locales resolved at runtime)')
    expect(result.stdout).not.toContain('declares no locales')
    expect(result.stdout).toContain(
      '[warn] localization: hero-basic does not mark its text localized, so every locale stores the same copy',
    )
  }, 180000)

  it('names every recorded component that is not localized', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(
      ['hero-basic', 'faq-card'],
      { preseedSource: true },
    )
    tempDirs.push(fixtureDir)

    for (const manifest of manifests) {
      await runAddCommand(
        fixtureDir,
        manifest.name,
        manifest.name === 'hero-basic' ? ['--localized'] : [],
      )
    }
    await writeFile(
      path.join(fixtureDir, 'src', 'payload.config.ts'),
      [
        "import { buildConfig } from 'payload'",
        '',
        'export default buildConfig({',
        "  localization: { defaultLocale: 'en', locales: ['en', 'zh'] },",
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stdout).toContain(
      '[warn] localization: faq-card does not mark its text localized, so every locale stores the same copy',
    )
    expect(result.stdout).not.toContain(
      '[warn] localization: hero-basic does not mark its text localized',
    )
  }, 180000)

  it('reports localization: false as disabled rather than runtime-configured', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeFile(
      path.join(fixtureDir, 'src', 'payload.config.ts'),
      [
        "import { buildConfig } from 'payload'",
        '',
        'export default buildConfig({',
        '  localization: false,',
        '  collections: [],',
        '})',
        '',
      ].join('\n'),
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stdout).toContain('[ok] localization: disabled in src/payload.config.ts')
    expect(result.stdout).not.toContain('(locales resolved at runtime)')
  }, 180000)

  it('warns when a component is localized but the config declares no locales', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic', {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)
    await writeInstallState({ fixtureDir, manifest, overrides: { localized: true } })

    const result = await runDoctorCommand(fixtureDir)

    expect(result.stdout).toContain(
      '[warn] localization: hero-basic marks its text localized, but src/payload.config.ts declares no locales',
    )
    expect(result.stdout).toContain('payload-components localize --locales en,zh')
  }, 180000)

  it('fails when a recorded localized install is missing its shared helper', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic', {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)
    await runAddCommand(fixtureDir, manifest.name, ['--localized'])
    await rm(path.join(fixtureDir, 'src', 'blocks', 'shared', 'localizeFields.ts'))

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain(
      '[error] localization: missing src/blocks/shared/localizeFields.ts, required by hero-basic',
    )
    expect(result.stdout).toContain('payload-components update hero-basic')
  }, 180000)

  it('fails when a recorded component is missing files and Payload fragments', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeInstallState({ fixtureDir, manifest })

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] hero-basic: missing files')
    expect(result.stdout).toContain('src/blocks/HeroBasic/config.ts')
    expect(result.stdout).toContain('[error] hero-basic: missing Payload fragments')
    expect(result.stdout).toContain('renderBlocks.block:heroBasic')
    expect(result.stdout).toContain('Run "payload-components add hero-basic" to retry the install.')
  }, 180000)

  it('fails when a recorded component is missing a registry dependency target', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('faq-accordion', {
      preseedSource: true,
    })
    tempDirs.push(fixtureDir)
    await runAddCommand(fixtureDir, manifest.name)
    await rm(path.join(fixtureDir, 'src', 'components', 'ui', 'accordion.tsx'))

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain(
      '[error] faq-accordion: missing registry dependencies accordion (src/components/ui/accordion.tsx)',
    )
    expect(result.stdout).not.toContain('[error] faq-accordion: missing files')

    await writeFile(
      path.join(fixtureDir, 'src', 'components', 'ui', 'accordion.tsx'),
      'export const Accordion = () => null\n',
      'utf8',
    )
    const repairedResult = await runDoctorCommand(fixtureDir)

    expect(repairedResult.code).toBe(0)
    expect(repairedResult.stdout).toContain('[ok] faq-accordion: registry dependencies')
  }, 180000)

  it('reports partial install state with the failed stage and message', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeInstallState({
      fixtureDir,
      manifest,
      overrides: {
        installedAt: null,
        lastError: {
          message: 'generate:types failed',
          stage: 'post-install',
        },
        status: 'partial',
      },
    })

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] hero-basic: install is partial')
    expect(result.stdout).toContain('post-install: generate:types failed')
    expect(result.stdout).toContain('[warn] hero-basic: owned component files')
    expect(result.stdout).toContain('src/blocks/HeroBasic/config.ts')
    expect(result.stdout).toContain('[warn] hero-basic: patched host files')
    expect(result.stdout).toContain('src/blocks/RenderBlocks.tsx')
  }, 180000)

  it('fails unsupported project shapes', async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-doctor-'))
    tempDirs.push(fixtureDir)
    await writeFile(
      path.join(fixtureDir, 'package.json'),
      `${JSON.stringify({ dependencies: { next: '^16.0.0', payload: '^3.0.0' } }, null, 2)}\n`,
      'utf8',
    )
    // shadcn is initialized (components.json present) but the repo lacks the
    // RenderBlocks/Pages shape, so detection should report an unsupported shape
    // rather than hinting at init.
    await writeFile(path.join(fixtureDir, 'components.json'), '{}\n', 'utf8')

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(2)
    expect(result.stdout).toContain('[error] project:')
    expect(result.stdout).toContain('Unsupported project shape')
  })

  it('hints at init when components.json is missing', async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-doctor-'))
    tempDirs.push(fixtureDir)
    await writeFile(
      path.join(fixtureDir, 'package.json'),
      `${JSON.stringify({ dependencies: { next: '^16.0.0', payload: '^3.0.0' } }, null, 2)}\n`,
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(2)
    expect(result.stdout).toContain('[error] project:')
    expect(result.stdout).toContain('No components.json found')
    expect(result.stdout).toContain('payload-components init')
  })

  it('fails unsupported install state versions', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await mkdir(path.join(fixtureDir, '.payload-components'), { recursive: true })
    await writeFile(
      path.join(fixtureDir, '.payload-components', 'state.json'),
      `${JSON.stringify({ components: {}, version: 999 }, null, 2)}\n`,
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(2)
    expect(result.stdout).toContain('[error] state:')
    expect(result.stdout).toContain('Unsupported payload-components state version')
  }, 180000)

  it('fails when required post-install scripts are missing', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    const packageJsonPath = path.join(fixtureDir, 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>
    }

    delete packageJson.scripts?.['generate:types']
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(2)
    expect(result.stdout).toContain('[error] scripts: missing generate:types')
    expect(result.stdout).toContain('[ok] scripts: generate:importmap')
  }, 180000)
})

describe('payload-components doctor --json', () => {
  const jsonTempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(
      jsonTempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })),
    )
  })

  it('emits a machine-readable report instead of the text one', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    jsonTempDirs.push(fixtureDir)

    const result = await runDoctorCommand(fixtureDir, ['--json'])
    const report = JSON.parse(result.stdout) as {
      components: Array<{ healthy: boolean; name: string }>
      exitCode: number
      findings: Array<{ message: string; scope: string; status: string }>
      healthy: boolean
    }

    expect(result.code).toBe(0)
    expect(report).toMatchObject({ components: [], exitCode: 0, healthy: true })
    /* No human formatting leaks into the JSON stream. */
    expect(result.stdout).not.toContain('[ok]')
    expect(report.findings.every(({ status }) => ['error', 'ok', 'warn'].includes(status))).toBe(
      true,
    )
    expect(report.findings.map(({ scope }) => scope)).toContain('project')
  }, 180000)

  it('scopes findings so a consumer can group them without parsing messages', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    jsonTempDirs.push(fixtureDir)
    await writeInstallState({ fixtureDir, manifest })

    const result = await runDoctorCommand(fixtureDir, ['--json'])
    const report = JSON.parse(result.stdout) as {
      components: Array<{ healthy: boolean; name: string }>
      exitCode: number
      findings: Array<{ message: string; scope: string; status: string }>
    }

    expect(result.code).toBe(1)
    expect(report.exitCode).toBe(1)
    expect(report.components).toEqual([{ healthy: false, name: 'hero-basic' }])
    expect(
      report.findings.filter(({ scope, status }) => scope === 'hero-basic' && status === 'error')
        .length,
    ).toBeGreaterThan(0)
    /* The project itself is fine here — nothing project-scoped may be an error,
       or the exit code would have been 2. */
    expect(
      report.findings.some(
        ({ scope, status }) =>
          status === 'error' && ['project', 'scripts', 'state'].includes(scope),
      ),
    ).toBe(false)
  }, 180000)
})
