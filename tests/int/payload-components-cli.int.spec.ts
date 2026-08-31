import path from 'node:path'

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

type CliModule = {
  parseArgs?: (
    argv: string[],
    defaultCwd?: string,
  ) => {
    acceptBreaking: boolean
    cwd: string
    defaultLocale?: string
    demo: boolean
    dryRun: boolean
    force: boolean
    help: boolean
    json: boolean
    locales?: string
    localized: boolean
    noFallback: boolean
    positional: string[]
    scaffold: boolean
  }
  runCli?: (options: {
    argv: string[]
    commands: {
      addCommand: (options: unknown) => Promise<void>
      addTemplateCommand: (options: unknown) => Promise<void>
      diffCommand: (options: unknown) => Promise<boolean>
      doctorCommand: (options: unknown) => Promise<0 | 1 | 2>
      initCommand: (options: unknown) => Promise<void>
      listCommand: (options: unknown) => Promise<void>
      localizeCommand: (options: unknown) => Promise<void>
      mcpCommand: (options: unknown) => Promise<void>
      newCommand: (options: unknown) => Promise<void>
      removeCommand: (options: unknown) => Promise<void>
      seedCommand: (options: unknown) => Promise<void>
      templatesCommand: (options: unknown) => Promise<void>
      updateCommand: (options: unknown) => Promise<void>
    }
    defaultCwd: string
    write: (value: string) => void
  }) => Promise<void>
}

const makeCommands = () => ({
  addCommand: vi.fn().mockResolvedValue(undefined),
  addTemplateCommand: vi.fn().mockResolvedValue(undefined),
  diffCommand: vi.fn().mockResolvedValue(true),
  doctorCommand: vi.fn().mockResolvedValue(0),
  initCommand: vi.fn().mockResolvedValue(undefined),
  listCommand: vi.fn().mockResolvedValue(undefined),
  localizeCommand: vi.fn().mockResolvedValue(undefined),
  mcpCommand: vi.fn().mockResolvedValue(undefined),
  newCommand: vi.fn().mockResolvedValue(undefined),
  removeCommand: vi.fn().mockResolvedValue(undefined),
  seedCommand: vi.fn().mockResolvedValue(undefined),
  templatesCommand: vi.fn().mockResolvedValue(undefined),
  updateCommand: vi.fn().mockResolvedValue(undefined),
})

describe('payload-components CLI parsing and orchestration', () => {
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

  afterEach(() => {
    process.exitCode = undefined
  })

  it('parses --demo for add and resolves --cwd from the invocation directory', () => {
    expect(cli.parseArgs).toBeTypeOf('function')

    expect(
      cli.parseArgs?.(['add', 'hero-basic', '--demo', '--cwd', './consumer'], '/tmp/workspace'),
    ).toEqual({
      acceptBreaking: false,
      cwd: path.join('/tmp/workspace', 'consumer'),
      demo: true,
      dryRun: false,
      force: false,
      help: false,
      json: false,
      localized: false,
      noFallback: false,
      positional: ['add', 'hero-basic'],
      scaffold: false,
    })
  })

  it('parses the lifecycle flags and keeps every component name positional', () => {
    expect(
      cli.parseArgs?.(
        ['update', 'hero-basic', 'faq-card', '--force', '--dry-run'],
        '/tmp/workspace',
      ),
    ).toEqual({
      acceptBreaking: false,
      cwd: '/tmp/workspace',
      demo: false,
      dryRun: true,
      force: true,
      help: false,
      json: false,
      localized: false,
      noFallback: false,
      positional: ['update', 'hero-basic', 'faq-card'],
      scaffold: false,
    })

    expect(cli.parseArgs?.(['list', '--json'], '/tmp/workspace')).toEqual({
      acceptBreaking: false,
      cwd: '/tmp/workspace',
      demo: false,
      dryRun: false,
      force: false,
      help: false,
      json: true,
      localized: false,
      noFallback: false,
      positional: ['list'],
      scaffold: false,
    })
  })

  it('rejects unknown flags and missing --cwd values', () => {
    expect(() => cli.parseArgs?.(['seed', 'hero-basic', '--verbose'])).toThrow(
      'Unknown option "--verbose".',
    )
    expect(() => cli.parseArgs?.(['seed', 'hero-basic', '--cwd', '--demo'])).toThrow(
      'Missing value for --cwd.',
    )
  })

  it('dispatches the standalone seed command with its component and cwd', async () => {
    expect(cli.runCli).toBeTypeOf('function')

    const commands = makeCommands()

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
    const commands = makeCommands()

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
      dryRun: false,
      localized: false,
    })
    expect(commands.seedCommand).not.toHaveBeenCalled()
  })

  it('passes --dry-run to add orchestration', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['add', 'hero-basic', '--dry-run'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.addCommand).toHaveBeenCalledWith({
      componentName: 'hero-basic',
      cwd: '/tmp/workspace',
      demo: false,
      dryRun: true,
      localized: false,
    })
  })

  it('installs several components in the order given, once each', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['add', 'hero-basic', 'faq-card', 'hero-basic'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.addCommand).toHaveBeenCalledTimes(2)
    expect(
      commands.addCommand.mock.calls.map(
        ([options]) => (options as { componentName: string }).componentName,
      ),
    ).toEqual(['hero-basic', 'faq-card'])
  })

  it('dispatches list and diff with --json and exits non-zero on drift', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['list', '--json'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.listCommand).toHaveBeenCalledWith({ cwd: '/tmp/workspace', json: true })

    commands.diffCommand.mockResolvedValueOnce(false)

    await cli.runCli?.({
      argv: ['diff', 'hero-basic', '--json'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.diffCommand).toHaveBeenCalledWith({
      componentNames: ['hero-basic'],
      cwd: '/tmp/workspace',
      json: true,
    })
    expect(process.exitCode).toBe(1)
  })

  it('leaves the exit code alone when diff reports a clean tree', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['diff'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.diffCommand).toHaveBeenCalledWith({
      componentNames: [],
      cwd: '/tmp/workspace',
      json: false,
    })
    expect(process.exitCode).toBeUndefined()
  })

  it('dispatches update with its flags and remove once per component', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['update', '--force'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.updateCommand).toHaveBeenCalledWith({
      acceptBreaking: false,
      componentNames: [],
      cwd: '/tmp/workspace',
      dryRun: false,
      force: true,
    })

    await cli.runCli?.({
      argv: ['remove', 'hero-basic', 'faq-card', '--dry-run', '--force'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.removeCommand).toHaveBeenCalledTimes(2)
    expect(commands.removeCommand).toHaveBeenNthCalledWith(1, {
      componentName: 'hero-basic',
      cwd: '/tmp/workspace',
      dryRun: true,
      force: true,
    })
    expect(commands.removeCommand).toHaveBeenNthCalledWith(2, {
      componentName: 'faq-card',
      cwd: '/tmp/workspace',
      dryRun: true,
      force: true,
    })
  })

  it('maps doctor exit codes and passes --json through', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['doctor', '--json'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.doctorCommand).toHaveBeenCalledWith({ cwd: '/tmp/workspace', json: true })
    expect(process.exitCode).toBeUndefined()

    /* 1 = a recorded install drifted; 2 = the project itself cannot accept
       installs. CI needs to tell those apart. */
    commands.doctorCommand.mockResolvedValueOnce(1)
    await cli.runCli?.({
      argv: ['doctor'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })
    expect(process.exitCode).toBe(1)

    process.exitCode = undefined
    commands.doctorCommand.mockResolvedValueOnce(2)
    await cli.runCli?.({
      argv: ['doctor'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })
    expect(process.exitCode).toBe(2)
  })

  it('dispatches the template commands', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['templates', '--json'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.templatesCommand).toHaveBeenCalledWith({ cwd: '/tmp/workspace', json: true })

    await cli.runCli?.({
      argv: ['add-template', 'saas-launch', '--dry-run'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.addTemplateCommand).toHaveBeenCalledWith({
      cwd: '/tmp/workspace',
      demo: false,
      dryRun: true,
      localized: false,
      templateSlug: 'saas-launch',
    })

    await expect(
      cli.runCli?.({
        argv: ['add-template'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components add-template requires a template name')

    await expect(
      cli.runCli?.({
        argv: ['add-template', 'saas-launch', 'agency-studio'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('accepts exactly one template name')
  })

  it('requires a component name for add and remove', async () => {
    const commands = makeCommands()

    await expect(
      cli.runCli?.({
        argv: ['add'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components add requires a component name')

    await expect(
      cli.runCli?.({
        argv: ['remove'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components remove requires a component name')
  })

  it('rejects extra positional arguments before dispatch', async () => {
    const commands = makeCommands()

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

    await expect(
      cli.runCli?.({
        argv: ['list', 'hero-basic'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('payload-components list does not accept positional arguments')

    expect(commands.seedCommand).not.toHaveBeenCalled()
    expect(commands.doctorCommand).not.toHaveBeenCalled()
    expect(commands.listCommand).not.toHaveBeenCalled()
  })

  it('rejects flags the target command does not accept', async () => {
    const commands = makeCommands()

    await expect(
      cli.runCli?.({
        argv: ['seed', 'hero-basic', '--demo'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--demo cannot be used with "payload-components seed"')

    await expect(
      cli.runCli?.({
        argv: ['doctor', '--dry-run'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--dry-run cannot be used with "payload-components doctor"')

    await expect(
      cli.runCli?.({
        argv: ['add', 'hero-basic', '--force'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--force cannot be used with "payload-components add"')

    await expect(
      cli.runCli?.({
        argv: ['seed', 'hero-basic', '--localized'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--localized cannot be used with "payload-components seed"')

    await expect(
      cli.runCli?.({
        argv: ['add', 'hero-basic', '--accept-breaking'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--accept-breaking cannot be used with "payload-components add"')

    await expect(
      cli.runCli?.({
        argv: ['remove', 'hero-basic', '--json'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--json cannot be used with "payload-components remove"')

    expect(commands.seedCommand).not.toHaveBeenCalled()
    expect(commands.removeCommand).not.toHaveBeenCalled()
  })

  it('rejects duplicate singleton flags and the demo/dry-run combination', async () => {
    const commands = makeCommands()

    expect(() => cli.parseArgs?.(['add', 'hero-basic', '--demo', '--demo'])).toThrow(
      '--demo may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['add', 'hero-basic', '--dry-run', '--dry-run'])).toThrow(
      '--dry-run may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['update', '--force', '--force'])).toThrow(
      '--force may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['update', '--accept-breaking', '--accept-breaking'])).toThrow(
      '--accept-breaking may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['list', '--json', '--json'])).toThrow(
      '--json may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['seed', 'hero-basic', '--cwd', 'one', '--cwd', 'two'])).toThrow(
      '--cwd may only be specified once.',
    )

    await expect(
      cli.runCli?.({
        argv: ['add', 'hero-basic', '--demo', '--dry-run'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--demo and --dry-run cannot be used together')
  })

  it('parses the localize value flags and keeps component names positional', () => {
    expect(
      cli.parseArgs?.(
        ['localize', 'hero-basic', '--locales', 'en,zh-TW', '--default-locale', 'zh-TW'],
        '/tmp/workspace',
      ),
    ).toEqual({
      acceptBreaking: false,
      cwd: '/tmp/workspace',
      defaultLocale: 'zh-TW',
      demo: false,
      dryRun: false,
      force: false,
      help: false,
      json: false,
      locales: 'en,zh-TW',
      localized: false,
      noFallback: false,
      positional: ['localize', 'hero-basic'],
      scaffold: false,
    })
  })

  it('dispatches localize with its locale selection and fallback default', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['localize', '--locales', 'en,zh', '--cwd', './consumer'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    /* fallback is an override, not a mandatory input: it reaches the command
       only when --no-fallback asks for it. */
    expect(commands.localizeCommand).toHaveBeenCalledWith({
      componentNames: [],
      cwd: path.join('/tmp/workspace', 'consumer'),
      dryRun: false,
      force: false,
      locales: 'en,zh',
    })
  })

  it('turns --no-fallback into fallback: false and passes named components through', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['localize', 'hero-basic', 'faq-card', 'hero-basic', '--no-fallback', '--dry-run'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.localizeCommand).toHaveBeenCalledWith({
      componentNames: ['hero-basic', 'faq-card'],
      cwd: '/tmp/workspace',
      dryRun: true,
      fallback: false,
      force: false,
    })
  })

  it('passes --localized through to add-template', async () => {
    const commands = makeCommands()

    await cli.runCli?.({
      argv: ['add-template', 'saas-launch', '--localized'],
      commands,
      defaultCwd: '/tmp/workspace',
      write: vi.fn(),
    })

    expect(commands.addTemplateCommand).toHaveBeenCalledWith({
      cwd: '/tmp/workspace',
      demo: false,
      dryRun: false,
      localized: true,
      templateSlug: 'saas-launch',
    })
  })

  it('rejects the localize flags on other commands and their duplicates', async () => {
    const commands = makeCommands()

    await expect(
      cli.runCli?.({
        argv: ['add', 'hero-basic', '--locales', 'en,zh'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--locales cannot be used with "payload-components add"')

    await expect(
      cli.runCli?.({
        argv: ['add', 'hero-basic', '--default-locale', 'en'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--default-locale cannot be used with "payload-components add"')

    await expect(
      cli.runCli?.({
        argv: ['update', '--no-fallback'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--no-fallback cannot be used with "payload-components update"')

    await expect(
      cli.runCli?.({
        argv: ['localize', '--json'],
        commands,
        defaultCwd: '/tmp/workspace',
        write: vi.fn(),
      }),
    ).rejects.toThrow('--json cannot be used with "payload-components localize"')

    expect(() => cli.parseArgs?.(['localize', '--locales', 'en', '--locales', 'zh'])).toThrow(
      '--locales may only be specified once.',
    )
    expect(() => cli.parseArgs?.(['localize', '--locales', '--dry-run'])).toThrow(
      'Missing value for --locales.',
    )
    expect(() => cli.parseArgs?.(['localize', '--default-locale'])).toThrow(
      'Missing value for --default-locale.',
    )
    expect(commands.localizeCommand).not.toHaveBeenCalled()
  })
})
