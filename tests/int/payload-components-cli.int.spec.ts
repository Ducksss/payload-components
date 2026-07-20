import path from 'node:path'

import { beforeAll, describe, expect, it, vi } from 'vitest'

type CliModule = {
  parseArgs?: (
    argv: string[],
    defaultCwd?: string,
  ) => {
    cwd: string
    demo: boolean
    help: boolean
    positional: string[]
  }
  runCli?: (options: {
    argv: string[]
    commands: {
      addCommand: (options: unknown) => Promise<void>
      doctorCommand: (options: unknown) => Promise<boolean>
      initCommand: (options: unknown) => Promise<void>
      seedCommand: (options: unknown) => Promise<void>
    }
    defaultCwd: string
    write: (value: string) => void
  }) => Promise<void>
}

describe('payload-components CLI demo seed parsing and orchestration', () => {
  let cli: CliModule

  beforeAll(async () => {
    const originalArgv = process.argv
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    process.argv = [process.execPath, 'vitest']

    try {
      cli = (await import('../../tools/payload-components/cli')) as CliModule
    } finally {
      process.argv = originalArgv
      write.mockRestore()
    }
  })

  it('parses --demo for add and resolves --cwd from the invocation directory', () => {
    expect(cli.parseArgs).toBeTypeOf('function')

    expect(
      cli.parseArgs?.(['add', 'hero-basic', '--demo', '--cwd', './consumer'], '/tmp/workspace'),
    ).toEqual({
      cwd: path.join('/tmp/workspace', 'consumer'),
      demo: true,
      help: false,
      positional: ['add', 'hero-basic'],
    })
  })

  it('rejects unknown flags and missing --cwd values', () => {
    expect(() => cli.parseArgs?.(['seed', 'hero-basic', '--force'])).toThrow(
      'Unknown option "--force".',
    )
    expect(() => cli.parseArgs?.(['seed', 'hero-basic', '--cwd', '--demo'])).toThrow(
      'Missing value for --cwd.',
    )
  })

  it('dispatches the standalone seed command with its component and cwd', async () => {
    expect(cli.runCli).toBeTypeOf('function')

    const commands = {
      addCommand: vi.fn().mockResolvedValue(undefined),
      doctorCommand: vi.fn().mockResolvedValue(true),
      initCommand: vi.fn().mockResolvedValue(undefined),
      seedCommand: vi.fn().mockResolvedValue(undefined),
    }

    await cli.runCli?.({
      argv: ['seed', 'logo-cloud-grid', '--cwd', './consumer'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.seedCommand).toHaveBeenCalledOnce()
    expect(commands.seedCommand).toHaveBeenCalledWith({
      componentName: 'logo-cloud-grid',
      cwd: path.join('/tmp/workspace', 'consumer'),
    })
    expect(commands.addCommand).not.toHaveBeenCalled()
  })

  it('passes --demo only to add orchestration', async () => {
    expect(cli.runCli).toBeTypeOf('function')

    const commands = {
      addCommand: vi.fn().mockResolvedValue(undefined),
      doctorCommand: vi.fn().mockResolvedValue(true),
      initCommand: vi.fn().mockResolvedValue(undefined),
      seedCommand: vi.fn().mockResolvedValue(undefined),
    }

    await cli.runCli?.({
      argv: ['add', 'hero-basic', '--demo'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.addCommand).toHaveBeenCalledWith({
      componentName: 'hero-basic',
      cwd: '/tmp/workspace',
      demo: true,
    })
    expect(commands.seedCommand).not.toHaveBeenCalled()
  })

  it('rejects extra positional arguments before dispatch', async () => {
    const commands = {
      addCommand: vi.fn().mockResolvedValue(undefined),
      doctorCommand: vi.fn().mockResolvedValue(true),
      initCommand: vi.fn().mockResolvedValue(undefined),
      seedCommand: vi.fn().mockResolvedValue(undefined),
    }

    await expect(
      cli.runCli?.({
        argv: ['seed', 'hero-basic', 'feature-grid-basic'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components seed accepts exactly one component name')

    await expect(
      cli.runCli?.({
        argv: ['doctor', 'hero-basic'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components doctor does not accept positional arguments')

    expect(commands.seedCommand).not.toHaveBeenCalled()
    expect(commands.doctorCommand).not.toHaveBeenCalled()
  })

  it('rejects --demo outside add and duplicate singleton flags', async () => {
    const commands = {
      addCommand: vi.fn().mockResolvedValue(undefined),
      doctorCommand: vi.fn().mockResolvedValue(true),
      initCommand: vi.fn().mockResolvedValue(undefined),
      seedCommand: vi.fn().mockResolvedValue(undefined),
    }

    await expect(
      cli.runCli?.({
        argv: ['seed', 'hero-basic', '--demo'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--demo can only be used with "payload-components add"')

    expect(() => cli.parseArgs?.(['add', 'hero-basic', '--demo', '--demo'])).toThrow(
      '--demo may only be specified once.',
    )
    expect(() =>
      cli.parseArgs?.(['seed', 'hero-basic', '--cwd', 'one', '--cwd', 'two']),
    ).toThrow('--cwd may only be specified once.')
  })
})
