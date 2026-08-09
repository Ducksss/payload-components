import { compareInstalledFiles } from '../component-files'
import { addCommand } from '../commands/add'
import { diffCommand } from '../commands/diff'
import { doctorCommand } from '../commands/doctor'
import { listCommand } from '../commands/list'
import { buildInventory } from '../inventory'
import { loadAllManifests, loadManifest } from '../manifest'
import { loadAllTemplateManifests, loadTemplateManifest } from '../templates'

/* A Model Context Protocol server so coding agents can browse this registry and
 * plan an install without guessing at component names.
 *
 * Two deliberate constraints:
 *
 * 1. No SDK dependency. The published CLI ships only ajv and semver at runtime
 *    (everything else is a devDependency on purpose), and MCP over stdio is
 *    newline-delimited JSON-RPC 2.0 — small enough to implement exactly.
 *
 * 2. Every tool is read-only. stdout *is* the protocol stream here, and the
 *    install pipeline both prints to stdout and spawns child processes that
 *    inherit it, so a mutating tool would corrupt the transport. It is also the
 *    better boundary: this server answers "which block, and what will it change",
 *    and the agent runs the real `payload-components add` through the user's
 *    shell, where the change is visible and approvable. `plan_install` returns
 *    the same dry-run plan that command would print. */

export const MCP_PROTOCOL_VERSION = '2025-06-18'
export const SUPPORTED_PROTOCOL_VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18']

export const SERVER_INFO = {
  name: 'payload-components',
  title: 'Payload Components registry',
  version: '1',
} as const

export type JsonRpcRequest = {
  id?: number | string | null
  jsonrpc: '2.0'
  method: string
  params?: Record<string, unknown>
}

export type JsonRpcResponse = {
  error?: { code: number; data?: unknown; message: string }
  id: number | string | null
  jsonrpc: '2.0'
  result?: unknown
}

const JSON_RPC_ERRORS = {
  internalError: -32603,
  invalidParams: -32602,
  invalidRequest: -32600,
  methodNotFound: -32601,
  parseError: -32700,
} as const

export { JSON_RPC_ERRORS }

class UnknownToolError extends Error {}

type ToolDefinition = {
  description: string
  inputSchema: {
    additionalProperties: false
    properties: Record<string, unknown>
    required?: string[]
    type: 'object'
  }
  name: string
  run: (args: Record<string, unknown>) => Promise<string>
  title: string
}

const emptySchema = {
  additionalProperties: false as const,
  properties: {},
  type: 'object' as const,
}

const componentNameSchema = {
  additionalProperties: false as const,
  properties: {
    component: {
      description: 'Component name, for example "hero-basic". Use list_components to see them all.',
      type: 'string',
    },
  },
  required: ['component'],
  type: 'object' as const,
}

const requireString = (args: Record<string, unknown>, key: string) => {
  const value = args[key]

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`"${key}" must be a non-empty string.`)
  }

  return value
}

/* The install pipeline and the report commands print to stdout, which is the
   protocol stream. Capture their output and hand it back as the tool's text
   result instead of letting it reach the transport. */
const captureStdout = async (run: () => Promise<unknown>) => {
  const originalWrite = process.stdout.write.bind(process.stdout)
  const chunks: string[] = []

  process.stdout.write = ((chunk: unknown) => {
    chunks.push(String(chunk))
    return true
  }) as typeof process.stdout.write

  try {
    await run()
  } finally {
    process.stdout.write = originalWrite
  }

  return chunks.join('').trim()
}

const formatComponentDetail = async ({ component, cwd }: { component: string; cwd: string }) => {
  const manifest = await loadManifest(component)
  const inventory = await buildInventory({ cwd })
  const entry = inventory.entries.find(({ name }) => name === component)
  const fileReport = entry?.installed
    ? await compareInstalledFiles({
        cwd,
        localized: entry.installed.localized,
        manifest,
      }).catch(() => undefined)
    : undefined

  return JSON.stringify(
    {
      description: manifest.description,
      files: manifest.files,
      installCommand: `npx payload-components add ${manifest.name}`,
      installed: entry?.installed
        ? {
            localized: entry.installed.localized,
            modifiedFiles: fileReport?.modified ?? [],
            status: entry.installed.status,
            updateAvailable: entry.updateAvailable,
            version: entry.installed.manifestVersion,
          }
        : null,
      name: manifest.name,
      payloadWiring: manifest.payloadFragments.map((fragment) =>
        fragment.kind === 'renderBlocks'
          ? `maps block "${fragment.blockSlug}" to ${fragment.importName} in the blocks renderer`
          : `registers ${fragment.blockName} in the Pages layout blocks`,
      ),
      postInstall: manifest.postInstall,
      summary: manifest.preview.summary,
      supports: manifest.supports,
      title: manifest.title,
      version: manifest.version,
    },
    null,
    2,
  )
}

const matchesQuery = ({
  query,
  values,
}: {
  query: string
  values: Array<string | undefined>
}) => {
  const needles = query.toLowerCase().split(/\s+/).filter(Boolean)
  const haystack = values.filter(Boolean).join(' ').toLowerCase()

  return needles.every((needle) => haystack.includes(needle))
}

export const createMcpServer = ({ cwd }: { cwd: string }) => {
  const tools: ToolDefinition[] = [
    {
      description:
        'List every Payload block in the registry with its install command, and whether this project already has it installed or out of date.',
      inputSchema: emptySchema,
      name: 'list_components',
      run: async () => await captureStdout(() => listCommand({ cwd, json: true })),
      title: 'List components',
    },
    {
      description:
        'Find blocks by keyword across their name, title, and summary. Use this before install to pick the right variant of a family.',
      inputSchema: {
        additionalProperties: false,
        properties: {
          query: {
            description: 'Keywords, for example "pricing table" or "hero video".',
            type: 'string',
          },
        },
        required: ['query'],
        type: 'object',
      },
      name: 'search_components',
      run: async (args) => {
        const query = requireString(args, 'query')
        const manifests = await loadAllManifests()
        const matches = manifests
          .filter((manifest) =>
            matchesQuery({
              query,
              values: [manifest.name, manifest.title, manifest.description, manifest.preview.summary],
            }),
          )
          .map((manifest) => ({
            installCommand: `npx payload-components add ${manifest.name}`,
            name: manifest.name,
            summary: manifest.preview.summary,
            title: manifest.title,
          }))

        return JSON.stringify({ matches, query }, null, 2)
      },
      title: 'Search components',
    },
    {
      description:
        'Full detail for one block: description, the files it installs, the Payload wiring it applies, supported Payload/Next majors, and its status in this project.',
      inputSchema: componentNameSchema,
      name: 'get_component',
      run: async (args) =>
        await formatComponentDetail({ component: requireString(args, 'component'), cwd }),
      title: 'Get component',
    },
    {
      description:
        'Preview exactly what installing a block would change in this project — files, Payload wiring, dependencies, and post-install commands. Changes nothing.',
      inputSchema: componentNameSchema,
      name: 'plan_install',
      run: async (args) =>
        await captureStdout(() =>
          addCommand({ componentName: requireString(args, 'component'), cwd, dryRun: true }),
        ),
      title: 'Plan an install',
    },
    {
      description:
        'Compare recorded installs against the registry and report version, file, and wiring drift. Use before suggesting an update.',
      inputSchema: emptySchema,
      name: 'diff',
      run: async () => await captureStdout(() => diffCommand({ cwd, json: true })),
      title: 'Diff installs',
    },
    {
      description:
        'Diagnose whether this project can accept installs, and check every recorded install for drift.',
      inputSchema: emptySchema,
      name: 'doctor',
      run: async () => await captureStdout(() => doctorCommand({ cwd })),
      title: 'Doctor',
    },
    {
      description:
        'List the full-site templates, each with the block set it composes and the pages it spans.',
      inputSchema: emptySchema,
      name: 'list_templates',
      run: async () => {
        const templates = await loadAllTemplateManifests()

        return JSON.stringify(
          {
            templates: templates.map((template) => ({
              blocks: template.components.length,
              installCommand: `npx payload-components add-template ${template.slug}`,
              pages: template.pages.length,
              slug: template.slug,
              summary: template.summary,
              title: template.title,
            })),
          },
          null,
          2,
        )
      },
      title: 'List templates',
    },
    {
      description:
        'Full detail for one template: every block it needs and which blocks each page composes, in order.',
      inputSchema: {
        additionalProperties: false,
        properties: {
          template: {
            description: 'Template slug, for example "saas-launch".',
            type: 'string',
          },
        },
        required: ['template'],
        type: 'object',
      },
      name: 'get_template',
      run: async (args) =>
        JSON.stringify(await loadTemplateManifest(requireString(args, 'template')), null, 2),
      title: 'Get template',
    },
  ]

  const listToolsResult = {
    tools: tools.map(({ description, inputSchema, name, title }) => ({
      annotations: { openWorldHint: false, readOnlyHint: true, title },
      description,
      inputSchema,
      name,
    })),
  }

  const callTool = async (params: Record<string, unknown> | undefined) => {
    const name = typeof params?.name === 'string' ? params.name : ''
    const tool = tools.find((candidate) => candidate.name === name)

    /* Per MCP, an unknown tool name is a protocol-level invalid-params error,
       while a failure *inside* a known tool is a result with isError set — the
       agent can read and act on the latter. */
    if (!tool) {
      throw new UnknownToolError(`Unknown tool "${name}". Call tools/list for the available tools.`)
    }

    const args =
      params?.arguments && typeof params.arguments === 'object'
        ? (params.arguments as Record<string, unknown>)
        : {}

    /* A failing tool is reported as an unsuccessful result rather than a
       protocol error, so the agent can read the message and correct itself. */
    try {
      return {
        content: [{ text: await tool.run(args), type: 'text' }],
        isError: false,
      }
    } catch (error) {
      return {
        content: [
          { text: error instanceof Error ? error.message : 'Unknown error', type: 'text' },
        ],
        isError: true,
      }
    }
  }

  /* Returns undefined for notifications, which by JSON-RPC must not be answered. */
  const handle = async (request: JsonRpcRequest): Promise<JsonRpcResponse | undefined> => {
    const id = request.id ?? null

    if (request.method.startsWith('notifications/')) {
      return undefined
    }

    const respond = (result: unknown): JsonRpcResponse => ({ id, jsonrpc: '2.0', result })

    try {
      if (request.method === 'initialize') {
        const requested = request.params?.protocolVersion

        return respond({
          capabilities: { tools: { listChanged: false } },
          instructions:
            'Read-only registry access. Use search_components or list_components to find a block, get_component for its contract, and plan_install to see what an install would change. To actually install, run the printed npx command in the user\'s shell.',
          protocolVersion:
            typeof requested === 'string' && SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
              ? requested
              : MCP_PROTOCOL_VERSION,
          serverInfo: SERVER_INFO,
        })
      }

      if (request.method === 'ping') {
        return respond({})
      }

      if (request.method === 'tools/list') {
        return respond(listToolsResult)
      }

      if (request.method === 'tools/call') {
        return respond(await callTool(request.params))
      }

      return {
        error: { code: JSON_RPC_ERRORS.methodNotFound, message: `Unknown method "${request.method}".` },
        id,
        jsonrpc: '2.0',
      }
    } catch (error) {
      return {
        error: {
          code:
            error instanceof UnknownToolError
              ? JSON_RPC_ERRORS.invalidParams
              : JSON_RPC_ERRORS.internalError,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        id,
        jsonrpc: '2.0',
      }
    }
  }

  return { handle, toolNames: tools.map(({ name }) => name) }
}
