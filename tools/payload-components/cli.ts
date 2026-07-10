import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { addCommand } from './commands/add'
import { doctorCommand } from './commands/doctor'
import { initCommand } from './commands/init'
import { seedCommand } from './commands/seed'

export const usage = `payload-components

Usage:
  payload-components add <component-name> [--cwd <path>] [--demo]
  payload-components seed <component-name> [--cwd <path>]
  payload-components init [--cwd <path>]
  payload-components doctor [--cwd <path>]
  payload-components --help

Commands:
  add     Install a component through the payload-components wrapper and shadcn-compatible registry flow.
  seed    Write a safe, runnable demo seed script for an installed component.
  init    Initialize shadcn in the project (creates components.json) so components can be installed.
  doctor  Diagnose project readiness and recorded component installs without changing files.

Flags:
  --demo  After a successful add, write the same demo seed script as the seed command.

Current components:
  hero-basic
  feature-grid-basic
  feature-split
  feature-bento
  feature-steps
  embed-basic
  content-columns
  content-image-lead
  content-feature-media
  content-feature-split
  content-showcase
  content-quote
  content-community
  content-split-rows
  content-rows
  content-image-frame
  content-stats
  content-list
  content-list-columns
  content-list-icons
  logo-cloud-grid
  logo-cloud-hover
  logo-cloud-marquee
  logo-cloud-inline
  logo-cloud-inline-wrap
  integration-grid
  integration-cluster
  integration-split
  integration-connect
  integration-orbit
  integration-list
  integration-marquee
  integration-testimonial
  call-to-action-centered
  call-to-action-boxed
  call-to-action-signup
  team-roster
  team-grid
  faq-accordion
  faq-split
  faq-card
  faq-icons
  faq-grouped
  faq-grid
  testimonials-quote
  testimonials-spotlight
  testimonials-grid
  testimonials-rating
  testimonials-bento
  testimonials-wall
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
  let help = false
  let hasCwd = false
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
    cwd,
    demo,
    help,
    positional,
  }
}

type CliCommands = {
  addCommand: typeof addCommand
  doctorCommand: typeof doctorCommand
  initCommand: typeof initCommand
  seedCommand: typeof seedCommand
}

const commands: CliCommands = {
  addCommand,
  doctorCommand,
  initCommand,
  seedCommand,
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
  const { cwd, demo, help, positional } = parseArgs(argv, defaultCwd)
  const [command, ...rest] = positional

  if (!command || help) {
    write(`${usage}\n`)
    return
  }

  if (demo && command !== 'add') {
    throw new Error('--demo can only be used with "payload-components add".')
  }

  if (command === 'add') {
    const [componentName] = rest

    if (!componentName) {
      throw new Error(
        'payload-components add requires a component name. Try "payload-components add hero-basic" or "payload-components add logo-cloud-grid".',
      )
    }

    if (rest.length !== 1) {
      throw new Error('payload-components add accepts exactly one component name.')
    }

    await commandHandlers.addCommand({
      cwd,
      componentName,
      demo,
    })
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

    const ok = await commandHandlers.doctorCommand({ cwd })

    if (!ok) {
      process.exitCode = 1
    }

    return
  }

  if (command === 'init') {
    if (rest.length > 0) {
      throw new Error('payload-components init does not accept positional arguments.')
    }

    await commandHandlers.initCommand({ cwd })
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
