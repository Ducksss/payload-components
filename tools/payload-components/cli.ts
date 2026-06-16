import path from 'node:path'

import { addCommand } from './commands/add'
import { detectProject } from './project'
import { loadState } from './state'

const usage = `payload-components

Usage:
  payload-components add <component-name> [--cwd <path>]
  payload-components init [--cwd <path>]
  payload-components doctor [--cwd <path>]
  payload-components --help

Alpha commands:
  add     Install an alpha component through the payload-components wrapper and shadcn-compatible registry flow.
  init    Non-gating command shell reserved for a later alpha phase.
  doctor  Non-gating command shell reserved for the next alpha tranche.

Current alpha components:
  hero-basic
  feature-grid-basic
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

const placeholderCommand = async (commandName: 'doctor' | 'init', cwd: string) => {
  try {
    const project = await detectProject(cwd)
    const state = await loadState(cwd)
    const installedComponents = Object.keys(state.components)

    process.stdout.write(
      `${commandName}: detected ${project.target.id} in ${cwd}. ` +
        `This alpha tranche focuses on "payload-components add"; ${commandName} remains non-gating for now. ` +
        `Installed components: ${installedComponents.length ? installedComponents.join(', ') : 'none'}.\n`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    process.stdout.write(`${commandName}: placeholder command. Project detection failed: ${message}\n`)
  }
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
        'payload-components add requires a component name. Try "payload-components add hero-basic" or "payload-components add feature-grid-basic".',
      )
    }

    await addCommand({
      cwd,
      componentName,
    })
    return
  }

  if (command === 'init' || command === 'doctor') {
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
