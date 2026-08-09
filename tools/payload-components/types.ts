import type { INSTALL_STAGES } from './constants'

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'
export type InstallStage = (typeof INSTALL_STAGES)[number]
export type InstallStatus = 'installed' | 'partial'
export type DependencyMap = Record<string, string>

export type PayloadFragment =
  | {
      kind: 'pagesLayout'
      blockName: string
      importName: string
      importPath: string
    }
  | {
      kind: 'renderBlocks'
      blockSlug: string
      importName: string
      importPath: string
    }

export type ComponentManifest = {
  $schema?: string
  dependencies: DependencyMap
  description: string
  files: string[]
  name: string
  payloadFragments: PayloadFragment[]
  peerDependencies: DependencyMap
  postInstall: string[]
  preview: {
    summary: string
  }
  recovery: {
    patchedFiles: string[]
  }
  registryItemName: string
  sampleContent: Record<string, unknown>
  supportedTargets: string[]
  supports: {
    nextMajors: number[]
    payloadMajors: number[]
  }
  title: string
  version: string
}

export type InstallError = {
  message: string
  stage: InstallStage
}

export type InstallStateEntry = {
  installedAt: string | null
  lastAttemptAt: string
  lastError: InstallError | null
  /* Present only when the component was installed with --localized, so state
   * files for ordinary installs are unchanged. */
  localized?: boolean
  manifestVersion: string
  patchedFiles: string[]
  registryItemName: string
  status: InstallStatus
  targetId: string
}

export type InstallState = {
  components: Record<
    string,
    InstallStateEntry
  >
  version: 2
}

export type InstallStateV1 = {
  components: Record<
    string,
    {
      installedAt: string
      manifestVersion: string
      status: InstallStatus
      touchedFiles: string[]
    }
  >
  version: 1
}

export type SupportMatrix = {
  targets: SupportedTarget[]
  version: number
}

/* The two files every install patches. A target declares candidate paths for
 * each because the same page-blocks shape lives at different paths across real
 * repos (flat Pages file, no src directory); the first candidate that exists
 * and carries every anchor wins. */
export type HostFileRole = 'pagesLayout' | 'renderBlocks'

export type HostFileRequirement = {
  anchors: string[]
  candidates: string[]
}

/* Each entry must exist. An array means "any one of these paths". */
export type RequiredFile = string | string[]

export type SupportedTarget = {
  allowedNextMajors: number[]
  allowedPayloadMajors: number[]
  description: string
  hostFiles: Record<HostFileRole, HostFileRequirement>
  id: string
  requiredFiles: RequiredFile[]
}

/* Where this project actually keeps the files the installer patches. */
export type ResolvedHostFiles = Record<HostFileRole, string>

export type DetectedProject = {
  cwd: string
  hostFiles: ResolvedHostFiles
  lockfilePath: string
  nextMajor: number
  packageManager: PackageManager
  payloadMajor: number
  target: SupportedTarget
}

export type RegistryDefinition = {
  $schema?: string
  homepage: string
  items: Array<{
    description?: string
    files?: Array<{
      content?: string
      path: string
      target: string
      type: string
    }>
    docs?: string
    meta?: Record<string, unknown>
    name: string
    registryDependencies?: string[]
    title?: string
    type?: string
  }>
  name: string
}

export type ResolvedRegistryDependency = {
  name: string
  targetFile: string
}

export type ResolvedInstallPlan = Pick<
  ComponentManifest,
  | 'dependencies'
  | 'files'
  | 'name'
  | 'payloadFragments'
  | 'peerDependencies'
  | 'postInstall'
  | 'recovery'
  | 'registryItemName'
  | 'version'
> & {
  registryDependencies: ResolvedRegistryDependency[]
}
