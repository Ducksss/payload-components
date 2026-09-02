import path from 'node:path'

import {
  compareInstalledFiles,
  copySharedSourceFile,
  resolveRecordedFileHashes,
} from '../component-files'
import { buildInventory, selectInstalled } from '../inventory'
import {
  formatLocaleList,
  parseLocaleCodes,
  renderLocalizationBlock,
  resolveLocales,
  type ResolvedLocales,
} from '../locales'
import { loadManifest } from '../manifest'
import {
  applyLocalizedFields,
  detectProject,
  isBlockConfigFile,
  localizeBlockConfigSource,
  readPayloadLocalization,
  setPayloadLocalization,
  LOCALIZE_HELPER_FILE,
} from '../project'
import { readSafeProjectFile, writeSafeProjectFile } from '../safe-path'
import { loadState, recordLocalizedInstall } from '../state'
import { printHeader } from '../utils'

import { getPayloadConfigFile } from './seed'

/* `payload-components localize` closes the two halves of Payload
 * internationalization that have to agree before an editor sees a locale
 * switcher:
 *
 *   1. the config level — `localization: { locales, defaultLocale, fallback }`,
 *      which is what makes any locale exist at all;
 *   2. the field level — the installed block configs whose prose fields carry
 *      `localized: true`, via the same localizeFields wrapper `add --localized`
 *      installs.
 *
 * Either half alone is inert: locales with no localized fields store one value
 * per document, and localized fields with no locales are ignored outright. This
 * command is the one place that sets both, and it is idempotent so it can be
 * re-run after installing more blocks. */

type ComponentPlan = {
  /* Block configs already wrapped — nothing to do, but they still confirm the
   * component is localized so state gets recorded. */
  alreadyWrapped: string[]
  componentName: string
  /* Locally modified block configs. Wrapping one would re-baseline a consumer
   * edit as pristine, so it is skipped unless --force. */
  blockedFiles: string[]
  /* Recorded but not on disk. A broken install, which is doctor's job to
   * diagnose — named here so the component does not print an empty entry. */
  missingFiles: string[]
  pendingFiles: string[]
}

type ConfigOutcome =
  | { kind: 'patched' | 'replaced' }
  | { kind: 'already-configured'; matches: boolean }
  | { kind: 'kept' }
  | { kind: 'no-build-config' }
  | { kind: 'existing-unreadable' }

const formatPlan = ({
  configFileRelPath,
  configOutcome,
  cwd,
  dryRun,
  fallback,
  plans,
  skipped,
  summary,
}: {
  configFileRelPath: string
  configOutcome: ConfigOutcome
  cwd: string
  dryRun: boolean
  fallback: boolean
  plans: ComponentPlan[]
  skipped: ComponentPlan[]
  /* Undefined when the config computes its locales at runtime. */
  summary: ResolvedLocales | undefined
}) => {
  const verb = dryRun ? 'would ' : ''
  const wrapped = plans.flatMap(({ pendingFiles }) => pendingFiles)
  const lines = [
    dryRun
      ? `payload-components: dry run for localizing ${cwd}`
      : `payload-components: localizing ${cwd}`,
    '',
    ...(summary
      ? [
          `Locales: ${formatLocaleList(summary.locales)}`,
          `  default: ${summary.defaultLocale}${fallback ? ' · fallback to the default when a locale is empty' : ' · no fallback'}`,
        ]
      : [
          `Locales: declared in ${configFileRelPath}, but computed at runtime — this command cannot name them`,
        ]),
  ]

  if (summary && summary.unlabelled.length > 0) {
    lines.push(
      `  no catalog label for ${summary.unlabelled.join(', ')} — the code is used as the label; edit it in ${configFileRelPath}`,
    )
  }

  lines.push('', 'Payload config:')

  if (configOutcome.kind === 'patched') {
    lines.push(`  ${configFileRelPath} (${verb}add the localization block)`)
  } else if (configOutcome.kind === 'replaced') {
    lines.push(`  ${configFileRelPath} (${verb}replace the existing localization block — --force)`)
  } else if (configOutcome.kind === 'already-configured') {
    lines.push(
      configOutcome.matches
        ? `  ${configFileRelPath} (already declares exactly these locales)`
        : `  ${configFileRelPath} (skipped — already declares a different localization block)`,
    )
  } else if (configOutcome.kind === 'kept') {
    lines.push(`  ${configFileRelPath} (unchanged — keeping the locales it already declares)`)
  } else if (configOutcome.kind === 'no-build-config') {
    lines.push(`  ${configFileRelPath} (skipped — no buildConfig({ ... }) call found)`)
  } else {
    lines.push(
      `  ${configFileRelPath} (skipped — its localization config cannot be safely replaced)`,
    )
  }

  lines.push('', 'Blocks:')

  if (plans.length === 0 && skipped.length === 0) {
    lines.push(
      '  no recorded components — use --localized on future installs, or re-run localize afterward',
    )
  }

  for (const plan of plans) {
    lines.push(
      `  ${plan.componentName}:`,
      ...plan.pendingFiles.map((filePath) => `    ${filePath} (${verb}wrap fields in localizeFields)`),
      ...plan.alreadyWrapped.map((filePath) => `    ${filePath} (already localized)`),
      ...plan.blockedFiles.map(
        (filePath) => `    ${filePath} (${verb}wrap — local edits accepted by --force)`,
      ),
      ...plan.missingFiles.map(
        (filePath) =>
          `    ${filePath} (missing — run "payload-components add ${plan.componentName}")`,
      ),
    )
  }

  for (const plan of skipped) {
    lines.push(
      `  ${plan.componentName}: skipped — ${plan.blockedFiles.length} locally modified block config${
        plan.blockedFiles.length === 1 ? '' : 's'
      }`,
      ...plan.blockedFiles.map((filePath) => `    ${filePath}`),
      '    Re-run with --force to wrap them anyway, or copy your changes out first.',
    )
  }

  if (wrapped.length > 0 || plans.some(({ blockedFiles }) => blockedFiles.length > 0)) {
    lines.push('', `Helper:`, `  ${LOCALIZE_HELPER_FILE} (${verb}create if absent)`)
  }

  return lines.join('\n')
}

const formatNextSteps = ({
  packageManager,
  summary,
}: {
  packageManager: string
  summary: ResolvedLocales | undefined
}) => {
  /* A stand-in when the locales are computed at runtime: the query snippet is
   * illustrative, and a placeholder reads better than omitting the step. */
  const secondLocale = summary
    ? (summary.locales.find(({ code }) => code !== summary.defaultLocale)?.code ??
      summary.defaultLocale)
    : '<locale>'
  const runner =
    packageManager === 'npm'
      ? 'npx'
      : packageManager === 'bun'
        ? 'bunx'
        : `${packageManager} exec`
  /* The blocks express reading-order geometry logically, so they mirror on their
   * own — but only once something sets `dir`, and nothing in the install can do
   * that for you. Say it only when an RTL locale was actually chosen. */
  const rtl = summary?.locales.filter((locale) => locale.rtl) ?? []

  return [
    'payload-components: next',
    `  1. Regenerate types: ${runner} payload generate:types`,
    '  2. Restart the dev server, then open a Page in the admin — a locale selector',
    '     appears in the document toolbar for the fields this run marked localized.',
    `  3. Render a locale from the front end by passing it to your query:`,
    `       const page = await payload.find({ collection: 'pages', locale: '${secondLocale}' })`,
    "  4. The admin UI's own language is a separate setting (i18n.supportedLanguages),",
    '     and so is per-locale media. Both are covered here:',
    '       https://www.payload-components.xyz/docs/localization',
    ...(rtl.length > 0
      ? [
          '',
          `  ${formatLocaleList(rtl)} ${rtl.length === 1 ? 'reads' : 'read'} right to left.`,
          '  The blocks mirror themselves, but only once your root layout sets dir:',
          `       const RTL_LOCALES = new Set(${JSON.stringify(rtl.map(({ code }) => code))})`,
          "       <html lang={locale} dir={RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'}>",
          '  Without it the page stays left-to-right and the mirroring never applies.',
        ]
      : []),
    '',
    '  Localizing a collection that already holds data changes how that data is',
    '  stored. Payload does not backfill existing values. Back up the database',
    '  and explicitly migrate them into the default locale before applying the',
    '  schema change.',
  ].join('\n')
}

const buildComponentPlan = async ({
  componentName,
  cwd,
  state,
}: {
  componentName: string
  cwd: string
  state: Awaited<ReturnType<typeof loadState>>
}): Promise<ComponentPlan> => {
  const manifest = await loadManifest(componentName)
  const installedEntry = state.components[componentName]
  const configFiles = manifest.files.filter((filePath) => isBlockConfigFile(filePath))
  const alreadyWrapped: string[] = []
  const candidates: string[] = []
  const missingFiles: string[] = []

  for (const projectPath of configFiles) {
    const existing = await readSafeProjectFile({
      cwd,
      filePath: path.join(cwd, projectPath),
    }).catch(() => undefined)

    if (existing === undefined) {
      missingFiles.push(projectPath)
      continue
    }

    /* The wrapper is the same deterministic transform the writer applies, so a
     * no-op transform is the honest "already localized" check. */
    if (localizeBlockConfigSource(existing) === existing) {
      alreadyWrapped.push(projectPath)
      continue
    }

    candidates.push(projectPath)
  }

  if (candidates.length === 0 || !installedEntry) {
    return {
      alreadyWrapped,
      blockedFiles: [],
      componentName,
      missingFiles,
      pendingFiles: candidates,
    }
  }

  const baselineHashes = await resolveRecordedFileHashes({
    componentName,
    installed: installedEntry,
    manifest,
  })
  const fileReport = await compareInstalledFiles({
    ...(baselineHashes ? { baselineHashes } : {}),
    cwd,
    localized: installedEntry.localized === true,
    manifest: { files: candidates, registryItemName: manifest.registryItemName },
  })

  return {
    alreadyWrapped,
    blockedFiles: fileReport.modified,
    componentName,
    missingFiles,
    pendingFiles: candidates.filter((filePath) => !fileReport.modified.includes(filePath)),
  }
}

export const localizeCommand = async ({
  componentNames = [],
  cwd,
  defaultLocale,
  dryRun = false,
  fallback = true,
  force = false,
  locales: localeCodes,
}: {
  componentNames?: string[]
  cwd: string
  defaultLocale?: string
  dryRun?: boolean
  fallback?: boolean
  force?: boolean
  locales?: string
}) => {
  const project = await detectProject(cwd)
  const configFileRelPath = await getPayloadConfigFile(project)
  const configPath = path.join(cwd, configFileRelPath)
  const configSource = await readSafeProjectFile({ cwd, filePath: configPath })
  const declared = readPayloadLocalization(configSource)

  /* A config that computes its locales — `locales: getLocales()` — is localized;
   * this command just cannot enumerate the set. Wrapping its blocks is still the
   * right thing to do, so only a plainly locale-less config is refused. */
  const declaresLocales = declared !== undefined && (!declared.localesEnumerable || declared.locales.length > 0)

  if (!localeCodes && !declaresLocales) {
    throw new Error(
      [
        `${configFileRelPath} does not declare any locales yet, so there is nothing to localize into.`,
        'Say which languages this project supports, e.g.:',
        '  payload-components localize --locales en,zh',
        '  payload-components localize --locales en,zh-TW,ja --default-locale zh-TW',
      ].join('\n'),
    )
  }

  /* --default-locale and --no-fallback only reach the config through the block
   * this command renders, and it renders one only when --locales says what to
   * put in it. Without that, they would be accepted and silently dropped. */
  if (!localeCodes && (defaultLocale !== undefined || fallback === false)) {
    const flag = defaultLocale !== undefined ? '--default-locale' : '--no-fallback'

    throw new Error(
      [
        `${flag} only applies to the localization block this command writes, which needs --locales.`,
        `Pass the full locale set you want, e.g.:`,
        `  payload-components localize --locales ${declared?.locales.join(',') || 'en,zh'} ${flag}${
          defaultLocale === undefined ? '' : ` ${defaultLocale}`
        }`,
        'Changing locales the config already declares also needs --force.',
      ].join('\n'),
    )
  }

  /* No --locales on a project that already declares them means "wrap my blocks
   * for the locales I have" — the common second run, after installing more
   * blocks. Both guards above have run, so this path has locales in the config
   * and no flags of its own; it only reads, and never patches, the config.
   *
   * A declared defaultLocale outside its own locale list is a config Payload
   * would reject. Ignore it for display rather than failing with an error that
   * names a flag the caller never passed — `doctor` reports that shape. */
  const declaredCodes = declared?.locales ?? []
  const declaredDefault =
    declared?.defaultLocale && declaredCodes.includes(declared.defaultLocale)
      ? declared.defaultLocale
      : undefined
  /* Set only when --locales asked for a specific set. It is the one input that
   * can produce a config patch, so keeping it separate is what lets the writer
   * below stay non-optional. */
  const requested = localeCodes
    ? resolveLocales({ codes: parseLocaleCodes(localeCodes), defaultLocale })
    : undefined
  /* What to print. Undefined when the config computes its locales at runtime —
   * there is a locale set, this command just cannot name it. */
  const summary =
    requested ??
    (declaredCodes.length > 0
      ? resolveLocales({
          codes: declaredCodes,
          ...(declaredDefault ? { defaultLocale: declaredDefault } : {}),
        })
      : undefined)
  const resolvedFallback = requested ? fallback : (declared?.fallback ?? true)
  const configPatch = requested
    ? setPayloadLocalization({
        force,
        renderBlock: (indent) =>
          renderLocalizationBlock({
            defaultLocale: requested.defaultLocale,
            fallback: resolvedFallback,
            indent,
            locales: requested.locales,
          }),
        source: configSource,
      })
    : undefined
  const configOutcome: ConfigOutcome = !configPatch
    ? { kind: 'kept' }
    : configPatch.kind === 'already-configured'
      ? { kind: 'already-configured', matches: configPatch.matches }
      : { kind: configPatch.kind }

  const inventory = await buildInventory({ cwd })
  const state = await loadState(cwd)
  const installed = selectInstalled(inventory)
  const installedNames = installed.map(({ name }) => name)

  for (const componentName of componentNames) {
    if (!installedNames.includes(componentName)) {
      throw new Error(
        `Component "${componentName}" is not recorded as installed in ${cwd}. Run "payload-components add ${componentName} --localized" to install it localized.`,
      )
    }
  }

  const targets =
    componentNames.length > 0
      ? installed.filter(({ name }) => componentNames.includes(name))
      : installed
  const missingPolicies = targets.filter(
    ({ name }) => state.components[name]?.localizationPolicy !== 'semantic-v1',
  )

  if (missingPolicies.length > 0) {
    throw new Error(
      [
        `Semantic localization policies are missing from: ${missingPolicies.map(({ name }) => name).join(', ')}.`,
        'Install the current field metadata before changing Payload storage:',
        `  payload-components update ${missingPolicies.map(({ name }) => name).join(' ')}`,
        'If any of those components is already localized, migrate its operational values first and add --accept-localization-policy-change.',
      ].join('\n'),
    )
  }
  const plans: ComponentPlan[] = []
  const skipped: ComponentPlan[] = []

  for (const entry of targets) {
    const plan = await buildComponentPlan({ componentName: entry.name, cwd, state })

    if (plan.blockedFiles.length > 0 && !force) {
      skipped.push(plan)
      continue
    }

    plans.push(plan)
  }

  printHeader(
    formatPlan({
      configFileRelPath,
      configOutcome,
      cwd,
      dryRun,
      fallback: resolvedFallback,
      plans,
      skipped,
      summary,
    }),
  )

  if (dryRun) {
    return
  }

  if (configPatch && (configPatch.kind === 'patched' || configPatch.kind === 'replaced')) {
    await writeSafeProjectFile({ contents: configPatch.source, cwd, filePath: configPath })
  }

  const wrappedComponents: string[] = []

  for (const plan of plans) {
    const configFiles = [...plan.pendingFiles, ...plan.blockedFiles]

    if (configFiles.length > 0 || plan.alreadyWrapped.length > 0) {
      await copySharedSourceFile({ cwd, projectPath: LOCALIZE_HELPER_FILE })
    }

    const rewrittenFiles = await applyLocalizedFields({ configFiles, cwd })

    if (rewrittenFiles.length > 0) {
      wrappedComponents.push(plan.componentName)
    }

    /* Record even when nothing was rewritten: a component whose config was
     * already wrapped by hand is localized, and state has to say so or `update`
     * will reinstall it without the wrapper. */
    if (configFiles.length > 0 || plan.alreadyWrapped.length > 0) {
      await recordLocalizedInstall({ componentName: plan.componentName, cwd, rewrittenFiles })
    }
  }

  printHeader(
    [
      `payload-components: localized ${cwd}`,
      wrappedComponents.length > 0
        ? `  wrapped ${wrappedComponents.join(', ')}`
        : '  no block config needed wrapping',
    ].join('\n'),
  )

  printHeader(
    formatNextSteps({ packageManager: project.packageManager, summary }),
  )

  /* Non-zero whenever this run left something it was asked to change, so CI can
   * gate on "the project is fully localized" the way it gates on `diff`. A
   * recorded component whose block config is not on disk counts: it was in scope
   * and did not get wrapped, whatever the reason. */
  const leftUntouched =
    skipped.length > 0 ||
    plans.some((plan) => plan.missingFiles.length > 0) ||
    configOutcome.kind === 'no-build-config' ||
    configOutcome.kind === 'existing-unreadable' ||
    (configOutcome.kind === 'already-configured' && !configOutcome.matches)

  if (leftUntouched) {
    process.exitCode = 1
  }
}
