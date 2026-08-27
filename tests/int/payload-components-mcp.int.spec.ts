import { rm } from 'node:fs/promises'
import { PassThrough } from 'node:stream'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { mcpCommand } from '../../tools/payload-components/commands/mcp'
import {
  createMcpServer,
  JSON_RPC_ERRORS,
  MCP_PROTOCOL_VERSION,
  SERVER_INFO,
  SUPPORTED_PROTOCOL_VERSIONS,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from '../../tools/payload-components/mcp/server'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import { recordInstalledState } from '../../tools/payload-components/state'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* The MCP server is hand-rolled JSON-RPC so the published CLI keeps shipping only
 * ajv and semver at runtime. These specs pin the handshake, the read-only tool
 * surface, and — most importantly — that no tool leaks output onto stdout, since
 * stdout is the transport. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.restoreAllMocks()
})

const installedFixture = async (componentNames: string[]) => {
  const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames, {
    preseedSource: true,
  })

  fixtureDirs.push(fixtureDir)

  for (const manifest of manifests) {
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalledState({
      cwd: fixtureDir,
      manifest,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
  }

  return fixtureDir
}

const request = (method: string, params?: Record<string, unknown>): JsonRpcRequest => ({
  id: 1,
  jsonrpc: '2.0',
  method,
  ...(params ? { params } : {}),
})

const callTool = async ({
  args,
  cwd,
  name,
}: {
  args?: Record<string, unknown>
  cwd: string
  name: string
}) => {
  const server = createMcpServer({ cwd })
  const response = await server.handle(request('tools/call', { arguments: args ?? {}, name }))
  const result = response?.result as
    { content: Array<{ text: string; type: string }>; isError: boolean } | undefined

  if (!result) {
    throw new Error(`tools/call for "${name}" returned no result.`)
  }

  return { isError: result.isError, text: result.content[0]?.text ?? '' }
}

describe('MCP handshake', () => {
  it('answers initialize with the negotiated protocol version and server info', async () => {
    const server = createMcpServer({ cwd: process.cwd() })
    const response = await server.handle(request('initialize', { protocolVersion: '2024-11-05' }))
    const result = response?.result as {
      capabilities: { tools: unknown }
      protocolVersion: string
      serverInfo: typeof SERVER_INFO
    }

    /* Echo a version the client asked for when it is one we speak. */
    expect(result.protocolVersion).toBe('2024-11-05')
    expect(SUPPORTED_PROTOCOL_VERSIONS).toContain(result.protocolVersion)
    expect(result.serverInfo).toEqual(SERVER_INFO)
    expect(result.capabilities.tools).toBeDefined()
  })

  it('falls back to its own protocol version for an unknown request', async () => {
    const server = createMcpServer({ cwd: process.cwd() })
    const response = await server.handle(request('initialize', { protocolVersion: '1999-01-01' }))

    expect((response?.result as { protocolVersion: string }).protocolVersion).toBe(
      MCP_PROTOCOL_VERSION,
    )
  })

  it('never answers a notification and rejects an unknown method', async () => {
    const server = createMcpServer({ cwd: process.cwd() })

    await expect(
      server.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }),
    ).resolves.toBeUndefined()

    const response = await server.handle(request('resources/list'))

    expect(response?.error?.code).toBe(JSON_RPC_ERRORS.methodNotFound)
  })

  it('responds to ping', async () => {
    const server = createMcpServer({ cwd: process.cwd() })

    expect((await server.handle(request('ping')))?.result).toEqual({})
  })
})

describe('MCP tools', () => {
  it('advertises every tool as read-only with a schema', async () => {
    const server = createMcpServer({ cwd: process.cwd() })
    const response = await server.handle(request('tools/list'))
    const { tools } = response?.result as {
      tools: Array<{
        annotations: { readOnlyHint: boolean }
        description: string
        inputSchema: { type: string }
        name: string
      }>
    }

    expect(tools.map(({ name }) => name).sort()).toEqual([...server.toolNames].sort())
    expect(tools.length).toBeGreaterThanOrEqual(8)

    for (const tool of tools) {
      expect(tool.annotations.readOnlyHint, `${tool.name} must be read-only`).toBe(true)
      expect(tool.description.length).toBeGreaterThan(20)
      expect(tool.inputSchema.type).toBe('object')
    }
  })

  it('exposes no tool that mutates the project', async () => {
    const server = createMcpServer({ cwd: process.cwd() })

    for (const name of server.toolNames) {
      expect(name).not.toMatch(/^(add|install|remove|update|seed|init)/)
    }
  })

  it('searches components by keyword', async () => {
    const { isError, text } = await callTool({
      args: { query: 'hero' },
      cwd: process.cwd(),
      name: 'search_components',
    })
    const { matches } = JSON.parse(text) as {
      matches: Array<{ installCommand: string; name: string }>
    }

    expect(isError).toBe(false)
    expect(matches.length).toBeGreaterThan(1)
    expect(matches.map(({ name }) => name)).toContain('hero-basic')
    expect(matches[0].installCommand).toMatch(/^npx payload-components add /)
  })

  it('returns install status in get_component for an installed block', async () => {
    const cwd = await installedFixture(['hero-basic'])
    const { text } = await callTool({
      args: { component: 'hero-basic' },
      cwd,
      name: 'get_component',
    })
    const detail = JSON.parse(text) as {
      installed: { status: string; updateAvailable: boolean } | null
      payloadWiring: string[]
      version: string
    }

    expect(detail.installed?.status).toBe('installed')
    expect(detail.installed?.updateAvailable).toBe(false)
    expect(detail.payloadWiring).toHaveLength(2)
    expect(detail.version).toBe('0.1.0')
  })

  it('separates an unknown tool from a failure inside a known tool', async () => {
    const server = createMcpServer({ cwd: process.cwd() })
    const unknownTool = await server.handle(request('tools/call', { name: 'nope' }))

    /* An unknown tool is a protocol error; a bad argument is a readable result
       the agent can correct itself from. */
    expect(unknownTool?.error?.code).toBe(JSON_RPC_ERRORS.invalidParams)
    expect(unknownTool?.result).toBeUndefined()

    const badArgs = await callTool({
      args: {},
      cwd: process.cwd(),
      name: 'get_component',
    })

    expect(badArgs.isError).toBe(true)
    expect(badArgs.text).toContain('must be a non-empty string')
  })

  it('captures the dry-run plan instead of writing it to stdout', async () => {
    const cwd = await installedFixture(['hero-basic'])
    const stdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    const { isError, text } = await callTool({
      args: { component: 'hero-basic' },
      cwd,
      name: 'plan_install',
    })

    /* The plan must arrive in the tool result, never on the protocol stream. */
    expect(stdoutWrite).not.toHaveBeenCalled()
    expect(isError).toBe(false)
    expect(text).toContain('dry run for "hero-basic"')
    expect(text).toContain('Payload wiring:')
  })

  it('lists templates with their install command and block count', async () => {
    const { text } = await callTool({ cwd: process.cwd(), name: 'list_templates' })
    const { templates } = JSON.parse(text) as {
      templates: Array<{ blocks: number; installCommand: string; slug: string }>
    }

    expect(templates).toHaveLength(13)
    expect(templates[0].installCommand).toMatch(/^npx payload-components add-template /)
    expect(templates[0].blocks).toBeGreaterThan(5)
  })

  it('returns the full block-and-page plan for one template', async () => {
    const { text } = await callTool({
      args: { template: 'portfolio-solo' },
      cwd: process.cwd(),
      name: 'get_template',
    })
    const template = JSON.parse(text) as { components: string[]; pages: unknown[]; slug: string }

    expect(template.slug).toBe('portfolio-solo')
    expect(template.components).toContain('hero-kinetic')
    expect(template.pages).toHaveLength(5)
  })
})

describe('MCP stdio transport', () => {
  const runOverStdio = async (requests: unknown[]) => {
    const input = new PassThrough()
    const output = new PassThrough()
    const received: JsonRpcResponse[] = []

    output.on('data', (chunk: Buffer) => {
      for (const line of String(chunk)
        .split('\n')
        .filter((value) => value.trim() !== '')) {
        received.push(JSON.parse(line) as JsonRpcResponse)
      }
    })

    vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

    const running = mcpCommand({ cwd: process.cwd(), input, output })

    for (const value of requests) {
      input.write(`${typeof value === 'string' ? value : JSON.stringify(value)}\n`)
    }

    input.end()
    await running

    return received
  }

  it('answers one line per request and stays silent for notifications', async () => {
    const received = await runOverStdio([
      request('initialize', { protocolVersion: MCP_PROTOCOL_VERSION }),
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { id: 2, jsonrpc: '2.0', method: 'tools/list' },
    ])

    expect(received).toHaveLength(2)
    expect(received[0].id).toBe(1)
    expect(received[1].id).toBe(2)
    expect((received[1].result as { tools: unknown[] }).tools.length).toBeGreaterThan(0)
  })

  it('reports malformed input as a JSON-RPC error and keeps serving', async () => {
    const received = await runOverStdio(['{ not json', '', request('ping')])

    expect(received).toHaveLength(2)
    expect(received[0].error?.code).toBe(JSON_RPC_ERRORS.parseError)
    expect(received[1].result).toEqual({})
  })

  it('rejects a request that is not JSON-RPC 2.0', async () => {
    const received = await runOverStdio([{ id: 7, method: 'ping' }])

    expect(received[0].error?.code).toBe(JSON_RPC_ERRORS.invalidRequest)
    expect(received[0].id).toBe(7)
  })
})
