import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { addCommand } from './commands/add'
import { addTemplateCommand } from './commands/add-template'
import { diffCommand } from './commands/diff'
import { doctorCommand } from './commands/doctor'
import { initCommand } from './commands/init'
import { listCommand } from './commands/list'
import { mcpCommand } from './commands/mcp'
import { newCommand } from './commands/new'
import { removeCommand } from './commands/remove'
import { seedCommand } from './commands/seed'
import { templatesCommand } from './commands/templates'
import { updateCommand } from './commands/update'

export const usage = `payload-components

Usage:
  payload-components add <component-name...> [--cwd <path>] [--demo] [--dry-run] [--localized]
  payload-components add-template <template> [--cwd <path>] [--demo] [--dry-run]
  payload-components templates [--cwd <path>] [--json]
  payload-components list [--cwd <path>] [--json]
  payload-components diff [component-name...] [--cwd <path>] [--json]
  payload-components update [component-name...] [--cwd <path>] [--dry-run] [--force] [--accept-breaking]
  payload-components remove <component-name...> [--cwd <path>] [--dry-run]
  payload-components seed <component-name> [--cwd <path>]
  payload-components mcp [--cwd <path>]
  payload-components new <component-name>
  payload-components init [--cwd <path>] [--scaffold]
  payload-components doctor [--cwd <path>] [--json]
  payload-components --help

Commands:
  add     Install one or more components through the payload-components wrapper and shadcn-compatible registry flow.
  add-template  Install every block a full-site template composes, then print its page plan.
  templates  List the full-site templates and how many of their blocks are already installed.
  list    Show every registry component alongside what this project has recorded.
  diff    Compare recorded installs against the registry and report version, file, and wiring drift.
  update  Re-install recorded components at the version this CLI ships, protecting locally edited files.
  remove  Delete a component's exclusively owned files, unwire its block, and drop its install record.
  seed    Write a safe, runnable demo seed script for an installed component.
  mcp     Run a read-only Model Context Protocol server over stdio so coding agents can browse the registry.
  new     Scaffold a new component bundle in this repository (contributors only).
  init    Initialize shadcn in the project (creates components.json) so components can be installed.
          With --scaffold, also lay down the starter base a bare Payload app is missing.
  doctor  Diagnose project readiness and recorded component installs without changing files.

Flags:
  --demo  After a successful add, write the demo seed script; with add-template, one per template page.
  --dry-run  Validate and preview an add, update, or remove without changing files or running commands.
  --force  Let update overwrite files you have edited locally.
  --accept-breaking  Let update apply a version that changes content already stored in Payload.
  --localized  Install the block with its text fields marked localized: true for Payload localization.
  --json  Print machine-readable output from list, diff, and doctor.
  --scaffold  With init, install the starter base (Pages, Media, RenderBlocks, CMSLink, Media, linkGroup, cn).

Exit codes:
  diff exits 1 when any inspected component has drifted; update exits 1 when a
  component was skipped because of local edits or held back as breaking; doctor
  exits 1 when a recorded install needs attention and 2 when the project itself
  cannot accept installs.

Current components:
  hero-basic
  hero-video
  hero-product-tilt
  hero-aurora
  hero-kinetic
  feature-grid-basic
  feature-split
  feature-bento
  feature-steps
  feature-accordion
  feature-cards-media
  feature-icon-grid
  embed-basic
  logo-cloud-grid
  logo-cloud-hover
  logo-cloud-marquee
  logo-cloud-inline
  logo-cloud-inline-wrap
  content-columns
  content-image-lead
  content-feature-media
  content-feature-split
  content-showcase
  content-quote
  content-community
  integration-grid
  integration-cluster
  integration-split
  integration-connect
  integration-orbit
  integration-list
  integration-marquee
  integration-testimonial
  content-split-rows
  content-rows
  content-image-frame
  content-stats
  content-list
  content-list-columns
  content-list-icons
  call-to-action-centered
  call-to-action-boxed
  call-to-action-signup
  contact-routing-form
  team-roster
  team-grid
  faq-accordion
  faq-split
  faq-card
  faq-icons
  faq-grouped
  faq-grid
  comparator-table
  comparator-grid
  comparator-stack
  testimonials-quote
  testimonials-spotlight
  testimonials-grid
  testimonials-rating
  testimonials-bento
  testimonials-wall
  stats-proof
  pricing-cards
  pricing-cards-muted
  pricing-cards-cta
  pricing-split
  pricing-enterprise
`

export const parseArgs = (argv: string[], defaultCwd = process.cwd()) => {
  const args = [...argv]
  let cwd = defaultCwd
  let demo = false
  let dryRun = false
  let acceptBreaking = false
  let force = false
  let help = false
  let hasCwd = false
  let json = false
  let localized = false
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
    cwd,
    demo,
    dryRun,
    force,
    help,
    json,
    localized,
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
  mcpCommand: typeof mcpCommand
  newCommand: typeof newCommand
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
  mcpCommand,
  newCommand,
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
} = {}) => {
  const {
    acceptBreaking,
    cwd,
    demo,
    dryRun,
    force,
    help,
    json,
    localized,
    positional,
    scaffold,
  } = parseArgs(argv, defaultCwd)
  const [command, ...rest] = positional

  if (!command || help) {
    write(`${usage}\n`)
    return
  }

  const allowedFlags: Record<string, string[]> = {
    add: ['demo', 'dryRun', 'localized'],
    'add-template': ['demo', 'dryRun'],
    diff: ['json'],
    doctor: ['json'],
    init: ['scaffold'],
    list: ['json'],
    remove: ['dryRun'],
    mcp: [],
    new: [],
    seed: [],
    templates: ['json'],
    update: ['acceptBreaking', 'dryRun', 'force'],
  }

  if (allowedFlags[command]) {
    assertFlagsAllowed({
      allowed: allowedFlags[command],
      command,
      flags: { acceptBreaking, demo, dryRun, force, json, localized, scaffold },
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

    for (const componentName of uniqueNames) {
      await commandHandlers.addCommand({
        cwd,
        componentName,
        demo,
        dryRun,
        localized,
      })
    }

    return
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

    await commandHandlers.addTemplateCommand({ cwd, demo, dryRun, templateSlug })
    return
  }

  if (command === 'templates') {
    if (rest.length > 0) {
      throw new Error('payload-components templates does not accept positional arguments.')
    }

    await commandHandlers.templatesCommand({ cwd, json })
    return
  }

  if (command === 'list') {
    if (rest.length > 0) {
      throw new Error('payload-components list does not accept positional arguments.')
    }

    await commandHandlers.listCommand({ cwd, json })
    return
  }

  if (command === 'diff') {
    const isClean = await commandHandlers.diffCommand({
      componentNames: uniqueNames,
      cwd,
      json,
    })

    if (!isClean) {
      process.exitCode = 1
    }

    return
  }

  if (command === 'update') {
    await commandHandlers.updateCommand({
      acceptBreaking,
      componentNames: uniqueNames,
      cwd,
      dryRun,
      force,
    })
    return
  }

  if (command === 'remove') {
    if (uniqueNames.length === 0) {
      throw new Error(
        'payload-components remove requires a component name. Try "payload-components remove hero-basic".',
      )
    }

    for (const componentName of uniqueNames) {
      await commandHandlers.removeCommand({ componentName, cwd, dryRun })
    }

    return
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

    await commandHandlers.seedCommand({
      cwd,
      componentName,
    })
    return
  }

  if (command === 'doctor') {
    if (rest.length > 0) {
      throw new Error('payload-components doctor does not accept positional arguments.')
    }

    const exitCode = await commandHandlers.doctorCommand({ cwd, json })

    if (exitCode !== 0) {
      process.exitCode = exitCode
    }

    return
  }

  if (command === 'mcp') {
    if (rest.length > 0) {
      throw new Error('payload-components mcp does not accept positional arguments.')
    }

    await commandHandlers.mcpCommand({ cwd })
    return
  }

  if (command === 'new') {
    const [componentSlug] = uniqueNames

    if (!componentSlug) {
      throw new Error(
        'payload-components new requires a component name. Try "payload-components new hero-split".',
      )
    }

    if (uniqueNames.length !== 1) {
      throw new Error('payload-components new accepts exactly one component name.')
    }

    await commandHandlers.newCommand({ componentSlug })
    return
  }

  if (command === 'init') {
    if (rest.length > 0) {
      throw new Error('payload-components init does not accept positional arguments.')
    }

    await commandHandlers.initCommand({ cwd, scaffold })
    return
  }

  throw new Error(`Unknown command "${command}".\n\n${usage}`)
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
  runCli().catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    process.stderr.write(`payload-components: ${message}\n`)
    process.exitCode = 1
  })
}
