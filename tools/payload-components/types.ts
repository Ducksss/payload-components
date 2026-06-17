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
  installedFiles: string[]
  lastAttemptAt: string
  lastError: InstallError | null
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

export type SupportedTarget = {
  allowedNextMajors: number[]
  allowedPayloadMajors: number[]
  description: string
  id: string
  requiredAnchors: Array<{
    file: string
    text: string
  }>
  requiredFiles: string[]
}

export type DetectedProject = {
  cwd: string
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
