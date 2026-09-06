import { createInterface } from 'node:readline'

import { createMcpServer, JSON_RPC_ERRORS, type JsonRpcRequest } from '../mcp/server'

/* MCP's stdio transport is newline-delimited JSON-RPC 2.0: one JSON object per
 * line in, one per line out. stdout carries the protocol and nothing else, so
 * every human-readable message goes to stderr and the tools capture any stdout
 * their handlers would have written. */
export const mcpCommand = async ({
  cwd,
  input = process.stdin,
  output = process.stdout,
}: {
  cwd: string
  input?: NodeJS.ReadableStream
  output?: NodeJS.WritableStream
}) => {
  const server = createMcpServer({ cwd })
  /* Bound up front so the transport stays independent from command output. */
  const writeLine = (value: string) => {
    output.write(`${value}\n`)
  }

  process.stderr.write(
    `payload-components: MCP server ready over stdio (${server.toolNames.length} read-only tools) in ${cwd}\n`,
  )

  const lines = createInterface({ crlfDelay: Infinity, input })

  for await (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === '') {
      continue
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(trimmed)
    } catch {
      writeLine(
        JSON.stringify({
          error: { code: JSON_RPC_ERRORS.parseError, message: 'Invalid JSON.' },
          id: null,
          jsonrpc: '2.0',
        }),
      )
      continue
    }

    /* `null`, numbers, strings, and arrays are valid JSON but not JSON-RPC
     * frames; reading fields off them would throw and kill the whole loop. */
    const record =
      typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null

    if (!record || record.jsonrpc !== '2.0' || typeof record.method !== 'string') {
      writeLine(
        JSON.stringify({
          error: {
            code: JSON_RPC_ERRORS.invalidRequest,
            message: 'Expected a JSON-RPC 2.0 request with a string method.',
          },
          id: record?.id ?? null,
          jsonrpc: '2.0',
        }),
      )
      continue
    }

    const response = await server.handle(record as unknown as JsonRpcRequest)

    if (response) {
      writeLine(JSON.stringify(response))
    }
  }
}
