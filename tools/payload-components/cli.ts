import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { addCommand } from './commands/add'
import { addTemplateCommand } from './commands/add-template'
import { diffCommand } from './commands/diff'
import { doctorCommand } from './commands/doctor'
import { initCommand } from './commands/init'
import { listCommand } from './commands/list'
import { localizeCommand } from './commands/localize'
import { mcpCommand } from './commands/mcp'
import { removeCommand } from './commands/remove'
import { seedCommand } from './commands/seed'
import { templatesCommand } from './commands/templates'
import { updateCommand } from './commands/update'
import { withCommandOutput, writeCommandOutput } from './command-output'
import { listRegistryComponentNames } from './manifest'
import { withProjectMutationLock } from './project-lock'

export const usage = `payload-components

Usage:
  payload-components add <component-name...> [--cwd <path>] [--demo] [--dry-run] [--localized]
  payload-components add-template <template> [--cwd <path>] [--demo] [--dry-run] [--localized]
  payload-components templates [--cwd <path>] [--json]
  payload-components list [--cwd <path>] [--json]
  payload-components localize [component-name...] [--cwd <path>] [--locales <codes>]
                              [--default-locale <code>] [--no-fallback] [--dry-run] [--force]
  payload-components diff [component-name...] [--cwd <path>] [--json]
  payload-components update [component-name...] [--cwd <path>] [--dry-run] [--force] [--accept-breaking] [--accept-localization-policy-change]
  payload-components remove <component-name...> [--cwd <path>] [--dry-run] [--force] [--accept-stored-content]
  payload-components seed <component-name> [--cwd <path>]
  payload-components mcp [--cwd <path>]
  payload-components init [--cwd <path>] [--scaffold] [--force]
  payload-components doctor [--cwd <path>] [--json]
  payload-components --help

Commands:
  add     Install one or more components through the payload-components wrapper and shadcn-compatible registry flow.
  add-template  Install every block a full-site template composes, then print its page plan.
  templates  List the full-site templates and how many of their blocks are already installed.
  list    Show every registry component alongside what this project has recorded.
  localize  Turn on Payload localization for the project and mark installed blocks' text localized.
  diff    Compare recorded installs against the registry and report version, file, and wiring drift.
  update  Re-install recorded components at the version this CLI ships, protecting locally edited files.
  remove  Delete a component's exclusively owned files, unwire its block, and drop its install record.
  seed    Write a safe, runnable demo seed script for an installed component.
  mcp     Run a read-only Model Context Protocol server over stdio so coding agents can browse the registry.
  init    Initialize shadcn in the project (creates components.json) so components can be installed.
          With --scaffold, also lay down the starter base a bare Payload app is missing.
  doctor  Diagnose project readiness and recorded component installs without changing files.

Flags:
  --demo  After a successful add, write the demo seed script; with add-template, one per template page.
  --dry-run  Validate and preview an add, localize, update, or remove without changing files or running commands.
  --force  Let localize replace configured locales and wrap edited configs, update overwrite edits, remove delete unverifiable source, or init replace edited managed base files.
  --accept-breaking  Let update apply a version that changes content already stored in Payload.
  --accept-localization-policy-change  Adopt semantic field policies after migrating existing localized data.
  --accept-stored-content  Confirm that stored Page blocks were migrated or removed before their component code is removed.
  --localized  Install the block, or every block of a template, with its text fields marked localized: true.
  --locales  Comma-separated locale codes for localize, e.g. --locales en,zh,pt-BR.
  --default-locale  The canonical locale for localized values; defaults to the first --locales entry.
  --no-fallback  Let localize write fallback: false, so an empty locale renders empty.
  --json  Print machine-readable output from list, diff, and doctor.
  --scaffold  With init, install and lifecycle-manage the starter base (Pages, Media, RenderBlocks, CMSLink, linkGroup, cn).

Exit codes:
  diff exits 1 when any inspected component has drifted; update exits 1 when a
  component was skipped because of local edits or held back as breaking;
  localize exits 1 when it left the config or a block config untouched; doctor
  exits 1 when a recorded install needs attention and 2 when the project itself
  cannot accept installs.

`

export const getUsage = async () => {
  const componentNames = await listRegistryComponentNames()

  return `${usage}\nCurrent components:\n${componentNames.map((name) => `  ${name}`).join('\n')}`
}

export const parseArgs = (argv: string[], defaultCwd = process.cwd()) => {
  const args = [...argv]
  let cwd = defaultCwd
  let acceptStoredContent = false
  let defaultLocale: string | undefined
  let demo = false
  let dryRun = false
  let acceptBreaking = false
  let acceptLocalizationPolicyChange = false
  let force = false
  let help = false
  let hasCwd = false
  let json = false
  let locales: string | undefined
  let localized = false
  let noFallback = false
  let scaffold = false
  const positional: string[] = []

  while (args.length > 0) {
    const current = args.shift()

    if (!current) {
      continue
    }

    if (current === '--cwd') {
      if (hasCwd) {
        throw new Error('--cwd may only be specified once.')
      }

      const value = args.shift()

      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --cwd.')
      }

      hasCwd = true
      cwd = path.resolve(defaultCwd, value)
      continue
    }

    /* Value-taking flags follow --cwd: one occurrence, a value that is not
       itself a flag, and a named error when either rule is broken. */
    if (current === '--locales' || current === '--default-locale') {
      const isLocales = current === '--locales'

      if (isLocales ? locales !== undefined : defaultLocale !== undefined) {
        throw new Error(`${current} may only be specified once.`)
      }

      const value = args.shift()

      if (!value || value.startsWith('-')) {
        throw new Error(`Missing value for ${current}.`)
      }

      if (isLocales) {
        locales = value
      } else {
        defaultLocale = value
      }

      continue
    }

    if (current === '--no-fallback') {
      if (noFallback) {
        throw new Error('--no-fallback may only be specified once.')
      }

      noFallback = true
      continue
    }

    if (current === '--demo') {
      if (demo) {
        throw new Error('--demo may only be specified once.')
      }

      demo = true
      continue
    }

    if (current === '--dry-run') {
      if (dryRun) {
        throw new Error('--dry-run may only be specified once.')
      }

      dryRun = true
      continue
    }

    if (current === '--accept-breaking') {
      if (acceptBreaking) {
        throw new Error('--accept-breaking may only be specified once.')
      }

      acceptBreaking = true
      continue
    }

    if (current === '--accept-localization-policy-change') {
      if (acceptLocalizationPolicyChange) {
        throw new Error('--accept-localization-policy-change may only be specified once.')
      }

      acceptLocalizationPolicyChange = true
      continue
    }

    if (current === '--accept-stored-content') {
      if (acceptStoredContent) {
        throw new Error('--accept-stored-content may only be specified once.')
      }

      acceptStoredContent = true
      continue
    }

    if (current === '--force') {
      if (force) {
        throw new Error('--force may only be specified once.')
      }

      force = true
      continue
    }

    if (current === '--json') {
      if (json) {
        throw new Error('--json may only be specified once.')
      }

      json = true
      continue
    }

    if (current === '--localized') {
      if (localized) {
        throw new Error('--localized may only be specified once.')
      }

      localized = true
      continue
    }

    if (current === '--scaffold') {
      if (scaffold) {
        throw new Error('--scaffold may only be specified once.')
      }

      scaffold = true
      continue
    }

    if (current === '--help' || current === '-h') {
      help = true
      continue
    }

    if (current.startsWith('-')) {
      throw new Error(`Unknown option "${current}".`)
    }

    positional.push(current)
  }

  return {
    acceptBreaking,
    acceptLocalizationPolicyChange,
    acceptStoredContent,
    cwd,
    defaultLocale,
    demo,
    dryRun,
    force,
    help,
    json,
    locales,
    localized,
    noFallback,
    positional,
    scaffold,
  }
}

type CliCommands = {
  addCommand: typeof addCommand
  addTemplateCommand: typeof addTemplateCommand
  diffCommand: typeof diffCommand
  doctorCommand: typeof doctorCommand
  initCommand: typeof initCommand
  listCommand: typeof listCommand
  localizeCommand: typeof localizeCommand
  mcpCommand: typeof mcpCommand
  removeCommand: typeof removeCommand
  seedCommand: typeof seedCommand
  templatesCommand: typeof templatesCommand
  updateCommand: typeof updateCommand
}

const commands: CliCommands = {
  addCommand,
  addTemplateCommand,
  diffCommand,
  doctorCommand,
  initCommand,
  listCommand,
  localizeCommand,
  mcpCommand,
  removeCommand,
  seedCommand,
  templatesCommand,
  updateCommand,
}

/* One place to reject a flag a command does not accept, so an unsupported
   combination fails loudly instead of being silently ignored. */
const assertFlagsAllowed = ({
  allowed,
  command,
  flags,
}: {
  allowed: string[]
  command: string
  flags: Record<string, boolean>
}) => {
  for (const [flag, isSet] of Object.entries(flags)) {
    if (isSet && !allowed.includes(flag)) {
      const flagName = flag.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

      throw new Error(`--${flagName} cannot be used with "payload-components ${command}".`)
    }
  }
}

export const runCli = async ({
  argv = process.argv.slice(2),
  commands: commandHandlers = commands,
  defaultCwd = process.cwd(),
  write = (value: string) => process.stdout.write(value),
}: {
  argv?: string[]
  commands?: CliCommands
  defaultCwd?: string
  write?: (value: string) => void
} = {}): Promise<0 | 1 | 2> => {
  return await withCommandOutput({
    write,
    run: async () => {
      const {
        acceptBreaking,
        acceptLocalizationPolicyChange,
        acceptStoredContent,
        cwd,
        defaultLocale,
        demo,
        dryRun,
        force,
        help,
        json,
        locales,
        localized,
        noFallback,
        positional,
        scaffold,
      } = parseArgs(argv, defaultCwd)
      const [command, ...rest] = positional

      const runMutation = async <T>(
        operation: string,
        mutationCwd: string,
        run: () => Promise<T>,
      ) => {
        /* Unit tests inject handlers and assert only CLI routing. The real command
         * table is the published execution path that needs the cross-process lock. */
        if (commandHandlers !== commands || dryRun) {
          return await run()
        }

        return await withProjectMutationLock({ cwd: mutationCwd, operation, run })
      }

      if (!command || help) {
        writeCommandOutput(`${await getUsage()}\n`)
        return 0
      }

      const allowedFlags: Record<string, string[]> = {
        add: ['demo', 'dryRun', 'localized'],
        'add-template': ['demo', 'dryRun', 'localized'],
        diff: ['json'],
        doctor: ['json'],
        init: ['force', 'scaffold'],
        list: ['json'],
        localize: ['defaultLocale', 'dryRun', 'force', 'locales', 'noFallback'],
        remove: ['acceptStoredContent', 'dryRun', 'force'],
        mcp: [],
        seed: [],
        templates: ['json'],
        update: ['acceptBreaking', 'acceptLocalizationPolicyChange', 'dryRun', 'force'],
      }

      if (allowedFlags[command]) {
        assertFlagsAllowed({
          allowed: allowedFlags[command],
          command,
          flags: {
            acceptBreaking,
            acceptLocalizationPolicyChange,
            acceptStoredContent,
            defaultLocale: Boolean(defaultLocale),
            demo,
            dryRun,
            force,
            json,
            locales: Boolean(locales),
            localized,
            noFallback,
            scaffold,
          },
        })
      }

      if (demo && dryRun) {
        throw new Error('--demo and --dry-run cannot be used together.')
      }

      /* Deduplicate while preserving the order given: installing a family and its
     shared base twice in one command would re-run the whole pipeline for no
     reason, and the second pass would report "already installed". */
      const uniqueNames = [...new Set(rest)]

      if (command === 'add') {
        if (uniqueNames.length === 0) {
          throw new Error(
            'payload-components add requires a component name. Try "payload-components add hero-basic" or "payload-components add logo-cloud-grid".',
          )
        }

        await runMutation(`add ${uniqueNames.join(', ')}`, cwd, async () => {
          for (const componentName of uniqueNames) {
            await commandHandlers.addCommand({
              cwd,
              componentName,
              demo,
              dryRun,
              localized,
            })
          }
        })

        return 0
      }

      if (command === 'add-template') {
        const [templateSlug] = uniqueNames

        if (!templateSlug) {
          throw new Error(
            'payload-components add-template requires a template name. Try "payload-components add-template saas-launch".',
          )
        }

        if (uniqueNames.length !== 1) {
          throw new Error('payload-components add-template accepts exactly one template name.')
        }

        await runMutation(`add-template ${templateSlug}`, cwd, () =>
          commandHandlers.addTemplateCommand({ cwd, demo, dryRun, localized, templateSlug }),
        )
        return 0
      }

      if (command === 'templates') {
        if (rest.length > 0) {
          throw new Error('payload-components templates does not accept positional arguments.')
        }

        await commandHandlers.templatesCommand({ cwd, json })
        return 0
      }

      if (command === 'list') {
        if (rest.length > 0) {
          throw new Error('payload-components list does not accept positional arguments.')
        }

        await commandHandlers.listCommand({ cwd, json })
        return 0
      }

      if (command === 'localize') {
        const isComplete = await runMutation('localize', cwd, () =>
          commandHandlers.localizeCommand({
            componentNames: uniqueNames,
            cwd,
            ...(defaultLocale ? { defaultLocale } : {}),
            dryRun,
            ...(noFallback ? { fallback: false } : {}),
            force,
            ...(locales ? { locales } : {}),
          }),
        )

        return isComplete ? 0 : 1
      }

      if (command === 'diff') {
        const isClean = await commandHandlers.diffCommand({
          componentNames: uniqueNames,
          cwd,
          json,
        })

        return isClean ? 0 : 1
      }

      if (command === 'update') {
        const isComplete = await runMutation('update', cwd, () =>
          commandHandlers.updateCommand({
            acceptBreaking,
            acceptLocalizationPolicyChange,
            componentNames: uniqueNames,
            cwd,
            dryRun,
            force,
          }),
        )

        return isComplete ? 0 : 1
      }

      if (command === 'remove') {
        if (uniqueNames.length === 0) {
          throw new Error(
            'payload-components remove requires a component name. Try "payload-components remove hero-basic".',
          )
        }

        await runMutation(`remove ${uniqueNames.join(', ')}`, cwd, async () => {
          for (const componentName of uniqueNames) {
            await commandHandlers.removeCommand({
              acceptStoredContent,
              componentName,
              cwd,
              dryRun,
              force,
            })
          }
        })

        return 0
      }

      if (command === 'seed') {
        const [componentName] = rest

        if (!componentName) {
          throw new Error(
            'payload-components seed requires a component name. Try "payload-components seed hero-basic".',
          )
        }

        if (rest.length !== 1) {
          throw new Error('payload-components seed accepts exactly one component name.')
        }

        await runMutation(`seed ${componentName}`, cwd, () =>
          commandHandlers.seedCommand({
            cwd,
            componentName,
          }),
        )
        return 0
      }

      if (command === 'doctor') {
        if (rest.length > 0) {
          throw new Error('payload-components doctor does not accept positional arguments.')
        }

        const exitCode = await commandHandlers.doctorCommand({ cwd, json })

        return exitCode
      }

      if (command === 'mcp') {
        if (rest.length > 0) {
          throw new Error('payload-components mcp does not accept positional arguments.')
        }

        await commandHandlers.mcpCommand({ cwd })
        return 0
      }

      if (command === 'init') {
        if (rest.length > 0) {
          throw new Error('payload-components init does not accept positional arguments.')
        }

        if (force && !scaffold) {
          throw new Error('--force requires "payload-components init --scaffold".')
        }

        await runMutation('init', cwd, () => commandHandlers.initCommand({ cwd, force, scaffold }))
        return 0
      }

      throw new Error(`Unknown command "${command}".\n\n${await getUsage()}`)
    },
  })
}

const isDirectRun = (() => {
  if (!process.argv[1]) {
    return false
  }

  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
})()

if (isDirectRun) {
  runCli()
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      process.stderr.write(`payload-components: ${message}\n`)
      process.exitCode = 1
    })
}
