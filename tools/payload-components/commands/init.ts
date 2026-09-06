import path from 'node:path'

import {
  BASE_BUNDLE_DEPENDENCIES,
  getBaseBundleVersion,
  registerBaseCollections,
  syncBaseBundle,
} from '../base-bundle'
import {
  assertSafePackageManagerTargets,
  checkDependencyRequirements,
  installManifestDependencies,
} from '../dependencies'
import { resolveSafeProjectPath, safeProjectFileExists } from '../safe-path'
import { loadState, recordBaseBundleState } from '../state'
import {
  detectPackageManager,
  getShadcnCommand,
  printHeader,
  runCommand,
} from '../utils'

// Thin wrapper over `shadcn init` so a consumer can create the `components.json`
// that `payload-components add` requires. We intentionally do NOT run this from
// inside `add` — scaffolding shadcn/Tailwind as a side effect of installing one
// block would be a surprising, hard-to-review change. stdio is inherited so the
// user answers shadcn's prompts directly.
const runShadcnInit = async (cwd: string) => {
  const packageManager = await detectPackageManager(cwd)

  /* shadcn init is what produces components.json. A project that already has one
     is already initialized, so re-running it would re-prompt for choices the
     project has made — and it would make `init --scaffold` non-idempotent for no
     reason. */
  const componentsJsonPath = path.join(cwd, 'components.json')

  if (await safeProjectFileExists({ cwd, filePath: componentsJsonPath })) {
    printHeader(
      `payload-components: components.json already exists in ${cwd}; skipping shadcn init.`,
    )

    return packageManager
  }

  await resolveSafeProjectPath({ cwd, targetPath: componentsJsonPath })
  await assertSafePackageManagerTargets({ cwd, packageManager })

  const shadcn = getShadcnCommand(packageManager)

  printHeader(`payload-components: initializing shadcn in ${cwd}`)

  await runCommand({
    args: [...shadcn.args, 'init', '--cwd', cwd],
    command: shadcn.command,
    cwd,
  })

  /* shadcn init can exit 0 without writing components.json — a declined prompt,
     or a non-interactive shell that cannot answer one. Scaffolding on top of
     that would leave a project that still cannot install anything, while
     reporting success. Stop here instead. */
  if (!(await safeProjectFileExists({ cwd, filePath: componentsJsonPath }))) {
    throw new Error(
      [
        `shadcn init finished without creating components.json in ${cwd}.`,
        'That file is what registry installs read, so nothing was scaffolded.',
        'Run "shadcn init" yourself, answer its prompts, then re-run this command.',
      ].join('\n'),
    )
  }

  return packageManager
}

const findPayloadConfig = async (cwd: string) => {
  for (const candidate of ['src/payload.config.ts', 'payload.config.ts']) {
    if (await safeProjectFileExists({ cwd, filePath: path.join(cwd, candidate) })) {
      return candidate
    }
  }

  return undefined
}

export const initCommand = async ({
  cwd,
  force = false,
  scaffold = false,
}: {
  cwd: string
  force?: boolean
  scaffold?: boolean
}) => {
  const packageManager = await runShadcnInit(cwd)

  if (!scaffold) {
    printHeader(
      [
        'payload-components: shadcn initialized. Run "payload-components add <component>" next.',
        'If this is a bare Payload app with no Pages collection or blocks renderer,',
        'run "payload-components init --scaffold" to lay those down first.',
      ].join('\n'),
    )
    return
  }

  const state = await loadState(cwd)
  const baseVersion = await getBaseBundleVersion()
  const configFileRelPath = await findPayloadConfig(cwd)
  const dependencyCheck = await checkDependencyRequirements({
    allowMissing: true,
    cwd,
    dependencies: BASE_BUNDLE_DEPENDENCIES,
    label: 'dependencies',
  })

  if (dependencyCheck.missing.length > 0) {
    await installManifestDependencies({
      cwd,
      dependencies: Object.fromEntries(
        dependencyCheck.missing.map((name) => [
          name,
          BASE_BUNDLE_DEPENDENCIES[name as keyof typeof BASE_BUNDLE_DEPENDENCIES],
        ]),
      ),
      packageManager,
    })
  }

  /* Dependency compatibility is a precondition for the scaffold, not a later
   * repair step. In particular, an incompatible declared version must fail
   * before any managed files are written into the consumer project. */
  const { adopted, created, fileHashes, kept, modified, removed, updated } = await syncBaseBundle({
    cwd,
    force,
    recordedFileHashes: state.base?.fileHashes,
  })

  const registration = configFileRelPath
    ? await registerBaseCollections({ configFileRelPath, cwd })
    : undefined
  const recordedBaseVersion = modified.length > 0 && state.base ? state.base.version : baseVersion

  await recordBaseBundleState({
    cwd,
    fileHashes,
    installedAt: state.base?.installedAt,
    /* A locally edited owned file was deliberately not upgraded. Retain the
     * old contract version so diff/doctor continue to flag the incomplete run. */
    version: recordedBaseVersion,
  })

  printHeader(
    [
      `payload-components: scaffolded the starter base into ${cwd}`,
      '',
      created.length > 0 ? 'Created:' : 'Created nothing — every file was already present.',
      ...created.map((filePath) => `  ${filePath}`),
      ...(updated.length > 0
        ? ['', 'Updated:', ...updated.map((filePath) => `  ${filePath}`)]
        : []),
      ...(removed.length > 0
        ? ['', 'Removed retired managed files:', ...removed.map((filePath) => `  ${filePath}`)]
        : []),
      ...(adopted.length > 0
        ? ['', 'Adopted matching starter files:', ...adopted.map((filePath) => `  ${filePath}`)]
        : []),
      ...(kept.length > 0
        ? ['', 'Kept your existing implementations:', ...kept.map((filePath) => `  ${filePath}`)]
        : []),
      ...(modified.length > 0
        ? [
            '',
            'Kept locally edited managed files:',
            ...modified.map((filePath) => `  ${filePath}`),
            '  Re-run with --force only if those edits should be replaced by the current starter base.',
          ]
        : []),
      '',
      `Recorded starter base: ${recordedBaseVersion}`,
    ].join('\n'),
  )

  if (!configFileRelPath) {
    printHeader(
      'payload-components: no payload.config.ts found — register the Pages and Media collections yourself.',
    )
    return
  }

  if (registration?.patched) {
    printHeader(
      `payload-components: registered ${registration.registered?.join(' and ')} in ${configFileRelPath}.`,
    )
  } else if (registration?.reason === 'already-registered') {
    printHeader(`payload-components: ${configFileRelPath} already registers both collections.`)
  } else {
    /* Rewriting a buildConfig call whose shape we could not read would be an
       edit nobody could review. Say what is missing instead. */
    printHeader(
      [
        `payload-components: could not find a "collections: [" array in ${configFileRelPath}.`,
        '  Add Pages and Media to your config by hand:',
        "    import { Pages } from './collections/Pages'",
        "    import { Media } from './collections/Media'",
        '    collections: [Pages, Media],',
      ].join('\n'),
    )
  }

  printHeader(
    [
      'payload-components: next',
      '  1. Run your Payload type generation so @/payload-types exists.',
      '  2. Run "payload-components doctor" to confirm the project is now detectable.',
      '  3. Run "payload-components add hero-basic" to install your first block.',
    ].join('\n'),
  )
}
