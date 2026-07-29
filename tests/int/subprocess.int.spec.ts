import type { ChildProcess } from 'node:child_process'
import { readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { runCommand, terminateProcessTree } from '../../tools/payload-components/utils'

const spawnedPids = new Set<number>()

const isProcessAlive = (pid: number) => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

const waitForFile = async (filePath: string, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      return await readFile(filePath, 'utf8')
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  }

  throw new Error(`Timed out waiting for ${filePath}`)
}

const waitForProcessExit = async (pid: number, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline && isProcessAlive(pid)) {
    await new Promise((resolve) => setTimeout(resolve, 20))
  }

  return !isProcessAlive(pid)
}

describe('CLI subprocess cleanup', () => {
  afterEach(async () => {
    vi.restoreAllMocks()

    for (const pid of spawnedPids) {
      if (isProcessAlive(pid)) {
        try {
          process.kill(pid, 'SIGKILL')
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
        }
      }
    }
    spawnedPids.clear()
  })

  it('treats an EPERM process-group probe as completed cleanup', async () => {
    const child = {
      exitCode: null,
      once: vi.fn(),
      pid: 123,
      signalCode: null,
    } as unknown as ChildProcess
    const processKill = vi.spyOn(process, 'kill')

    processKill.mockReturnValueOnce(true).mockImplementationOnce(() => {
      throw Object.assign(new Error('operation not permitted'), { code: 'EPERM' })
    })

    await expect(terminateProcessTree(child, 0)).resolves.toBeUndefined()
  })

  it('times out and terminates the command process tree', async () => {
    const pidFile = path.join(os.tmpdir(), `payload-components-child-${process.pid}-${Date.now()}`)
    const childScript = [
      "const { spawn } = require('node:child_process')",
      "const { writeFileSync } = require('node:fs')",
      "const child = spawn(process.execPath, ['--eval', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })",
      `writeFileSync(${JSON.stringify(pidFile)}, String(child.pid))`,
      'setTimeout(() => process.exit(0), 1200)',
    ].join(';')
    const commandPromise = runCommand({
      args: ['--eval', childScript],
      command: process.execPath,
      cwd: process.cwd(),
      timeoutMs: 250,
    })

    const childPid = Number(await waitForFile(pidFile, 1_000))
    spawnedPids.add(childPid)

    try {
      await expect(commandPromise).rejects.toThrow(/timed out after 250ms/)
      await expect(waitForProcessExit(childPid, 2_000)).resolves.toBe(true)
    } finally {
      await rm(pidFile, { force: true })
    }
  }, 5_000)

  it('propagates an abort signal and terminates the command process tree', async () => {
    const pidFile = path.join(
      os.tmpdir(),
      `payload-components-abort-child-${process.pid}-${Date.now()}`,
    )
    const childScript = [
      "const { spawn } = require('node:child_process')",
      "const { writeFileSync } = require('node:fs')",
      "const child = spawn(process.execPath, ['--eval', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })",
      `writeFileSync(${JSON.stringify(pidFile)}, String(child.pid))`,
      'setTimeout(() => process.exit(0), 1200)',
    ].join(';')
    const controller = new AbortController()
    const commandPromise = runCommand({
      args: ['--eval', childScript],
      command: process.execPath,
      cwd: process.cwd(),
      signal: controller.signal,
      timeoutMs: 3_000,
    })

    const childPid = Number(await waitForFile(pidFile, 1_000))
    spawnedPids.add(childPid)
    controller.abort()

    try {
      await expect(commandPromise).rejects.toMatchObject({ name: 'AbortError' })
      await expect(waitForProcessExit(childPid, 2_000)).resolves.toBe(true)
    } finally {
      await rm(pidFile, { force: true })
    }
  }, 5_000)

  it('captures stdout and stderr for integration CLI assertions', async () => {
    const result = await runCommand({
      args: ['--eval', "process.stdout.write('out'); process.stderr.write('err')"],
      captureOutput: true,
      command: process.execPath,
      cwd: process.cwd(),
      timeoutMs: 1_000,
    })

    expect(result).toEqual({ stderr: 'err', stdout: 'out' })
  })

  it('tolerates EPIPE when a command closes stdin before consuming it', async () => {
    const result = await runCommand({
      args: ['--eval', 'process.stdin.destroy(); setTimeout(() => process.exit(0), 25)'],
      captureOutput: true,
      command: process.execPath,
      cwd: process.cwd(),
      stdin: 'x'.repeat(8 * 1024 * 1024),
      timeoutMs: 2_000,
    })

    expect(result).toEqual({ stderr: '', stdout: '' })
  })
})
