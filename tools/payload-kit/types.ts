export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

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

export type KitManifest = {
  $schema?: string
  description: string
  files: string[]
  name: string
  payloadFragments: PayloadFragment[]
  postInstall: string[]
  preview: {
    summary: string
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

export type InstallState = {
  kits: Record<
    string,
    {
      installedAt: string
      manifestVersion: string
      status: 'installed' | 'partial'
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
