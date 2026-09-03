import { AsyncLocalStorage } from 'node:async_hooks'

export type CommandOutputWriter = (value: string) => void

const commandOutput = new AsyncLocalStorage<CommandOutputWriter>()

/* Command handlers report through this port instead of owning process.stdout.
 * The ordinary CLI installs the process writer at its boundary; embedded
 * callers such as MCP can install a request-scoped collector without mutating
 * a process-global stream. AsyncLocalStorage keeps overlapping tool calls
 * isolated from one another. */
export const writeCommandOutput = (value: string) => {
  const write = commandOutput.getStore() ?? ((chunk: string) => process.stdout.write(chunk))

  write(value)
}

export const withCommandOutput = async <T>({
  run,
  write,
}: {
  run: () => Promise<T>
  write: CommandOutputWriter
}) => await commandOutput.run(write, run)

export const captureCommandOutput = async (run: () => Promise<unknown>) => {
  const chunks: string[] = []

  await withCommandOutput({
    run,
    write: (chunk) => {
      chunks.push(chunk)
    },
  })

  return chunks.join('').trim()
}
