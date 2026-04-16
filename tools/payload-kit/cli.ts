import path from 'node:path'

import { addCommand } from './commands/add'
import { detectProject } from './project'
import { loadState } from './state'

const usage = `payload-kit

Usage:
  payload-kit add <kit-name> [--cwd <path>]
  payload-kit init [--cwd <path>]
  payload-kit doctor [--cwd <path>]
  payload-kit --help

POC commands:
  add     Install the golden kit through a shadcn-compatible registry flow.
  init    Placeholder command shell for the post-POC roadmap.
  doctor  Placeholder command shell for the post-POC roadmap.
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
    const installedKits = Object.keys(state.kits)

    process.stdout.write(
      `${commandName}: detected ${project.target.id} in ${cwd}. ` +
        `This POC only implements "payload-kit add hero-basic". ` +
        `Installed kits: ${installedKits.length ? installedKits.join(', ') : 'none'}.\n`,
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
    const [kitName] = rest

    if (!kitName) {
      throw new Error('payload-kit add requires a kit name. Try "payload-kit add hero-basic".')
    }

    await addCommand({
      cwd,
      kitName,
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
  process.stderr.write(`payload-kit: ${message}\n`)
  process.exitCode = 1
})
