import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { repoRoot, runCommand } from './utils'

export const assertPublishAllowed = ({
  packageVersion,
  releaseCommitOnMain,
  releaseTag,
}: {
  packageVersion: string
  releaseCommitOnMain: boolean
  releaseTag: string
}) => {
  const expectedTag = `v${packageVersion}`

  if (releaseTag !== expectedTag) {
    throw new Error(`Release tag must exactly match package version tag "${expectedTag}".`)
  }

  if (!releaseCommitOnMain) {
    throw new Error(`Release tag "${releaseTag}" does not point to a commit reachable from main.`)
  }
}

const parseTagArg = (argv: string[]) => {
  if (argv.length !== 2 || argv[0] !== '--tag' || !argv[1]) {
    throw new Error('Usage: publish-guard --tag <release-tag>')
  }

  return argv[1]
}

export const getCandidatePackageVersion = async ({
  cwd = repoRoot,
  releaseTag,
}: {
  cwd?: string
  releaseTag: string
}) => {
  const { stdout } = await runCommand({
    args: ['show', `refs/tags/${releaseTag}:package.json`],
    captureOutput: true,
    command: 'git',
    cwd,
    timeoutMs: 15_000,
  })
  let packageJson: unknown

  try {
    packageJson = JSON.parse(stdout)
  } catch (error) {
    throw new Error(`Release tag "${releaseTag}" contains an invalid package.json.`, {
      cause: error,
    })
  }

  const version =
    typeof packageJson === 'object' && packageJson !== null && 'version' in packageJson
      ? packageJson.version
      : undefined

  if (typeof version !== 'string' || !version.trim()) {
    throw new Error(`Release tag "${releaseTag}" package.json must declare a version.`)
  }

  return version
}

const getReleaseCommit = async (releaseTag: string) => {
  const { stdout } = await runCommand({
    args: ['rev-parse', '--verify', `refs/tags/${releaseTag}^{commit}`],
    captureOutput: true,
    command: 'git',
    cwd: repoRoot,
    timeoutMs: 15_000,
  })

  return stdout.trim()
}

const isCommitReachableFromMain = async (releaseCommit: string) => {
  try {
    await runCommand({
      args: ['merge-base', '--is-ancestor', releaseCommit, 'refs/remotes/origin/main'],
      captureOutput: true,
      command: 'git',
      cwd: repoRoot,
      timeoutMs: 15_000,
    })
    return true
  } catch (error) {
    if ((error as Error & { code?: number }).code === 1) {
      return false
    }

    throw error
  }
}

export const verifyPublishGuard = async (releaseTag: string) => {
  const candidateVersion = await getCandidatePackageVersion({ releaseTag })
  const expectedTag = `v${candidateVersion}`

  if (releaseTag !== expectedTag) {
    assertPublishAllowed({
      packageVersion: candidateVersion,
      releaseCommitOnMain: true,
      releaseTag,
    })
  }

  const releaseCommit = await getReleaseCommit(releaseTag)
  const releaseCommitOnMain = await isCommitReachableFromMain(releaseCommit)

  assertPublishAllowed({
    packageVersion: candidateVersion,
    releaseCommitOnMain,
    releaseTag,
  })

  process.stdout.write(
    `Publish guard passed for ${releaseTag} (${releaseCommit}, package ${candidateVersion}) on refs/remotes/origin/main.\n`,
  )
}

const isMain = () =>
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  verifyPublishGuard(parseTagArg(process.argv.slice(2))).catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
