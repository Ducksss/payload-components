import path from 'node:path'

import { addCommand } from './commands/add'
import { doctorCommand } from './commands/doctor'

const usage = `payload-components

Usage:
  payload-components add <component-name> [--cwd <path>]
  payload-components init [--cwd <path>]
  payload-components doctor [--cwd <path>]
  payload-components --help

Alpha commands:
  add     Install an alpha component through the payload-components wrapper and shadcn-compatible registry flow.
  init    Non-gating command shell reserved for a later alpha phase.
  doctor  Diagnose project readiness and recorded component installs without changing files.

Current alpha components:
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
`

const parseArgs = (argv: string[]) => {
  const args = [...argv]
  let cwd = process.cwd()
  let help = false
  const positional: string[] = []

  while (args.length > 0) {
    const current = args.shift()

    if (!current) {
      continue
    }

    if (current === '--cwd') {
      const value = args.shift()

      if (!value) {
        throw new Error('Missing value for --cwd.')
      }

      cwd = path.resolve(value)
      continue
    }

    if (current === '--help' || current === '-h') {
      help = true
      continue
    }

    positional.push(current)
  }

  return {
    cwd,
    help,
    positional,
  }
}

const placeholderCommand = async (commandName: 'init', cwd: string) => {
  process.stdout.write(
    `${commandName}: placeholder command in ${cwd}. This alpha tranche focuses on "payload-components add".\n`,
  )
}

const main = async () => {
  const { cwd, help, positional } = parseArgs(process.argv.slice(2))

  const [command, ...rest] = positional

  if (!command || help) {
    process.stdout.write(`${usage}\n`)
    return
  }

  if (command === 'add') {
    const [componentName] = rest

    if (!componentName) {
      throw new Error(
        'payload-components add requires a component name. Try "payload-components add hero-basic" or "payload-components add logo-cloud-grid".',
      )
    }

    await addCommand({
      cwd,
      componentName,
    })
    return
  }

  if (command === 'doctor') {
    const ok = await doctorCommand({ cwd })

    if (!ok) {
      process.exitCode = 1
    }

    return
  }

  if (command === 'init') {
    await placeholderCommand(command, cwd)
    return
  }

  throw new Error(`Unknown command "${command}".\n\n${usage}`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  process.stderr.write(`payload-components: ${message}\n`)
  process.exitCode = 1
})
