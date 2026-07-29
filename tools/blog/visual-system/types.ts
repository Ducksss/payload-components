export type BlogVisualSeries =
  | 'project-notes'
  | 'foundations'
  | 'installer-internals'
  | 'component-design'
  | 'production-guides'
  | 'open-source'

export type FigureMode = 'see' | 'trace' | 'inspect' | 'join'

export type RouteCapture = {
  columns: number
  position: 'bottom' | 'center' | 'top'
  selectors: readonly string[]
}

export type Artifact =
  | { kind: 'source'; label: string; path: string; anchor: string; take: number }
  | { kind: 'registry-item'; label: string; name: string }
  | { kind: 'route'; label: string; route: string; capture?: RouteCapture }
  | { kind: 'sequence'; label: string; items: readonly string[] }
  | { kind: 'command'; label: string; command: string; registryItems?: readonly string[] }
  | {
      kind: 'diff'
      label: string
      path: string
      anchor: string
      before: readonly string[]
      after: readonly string[]
    }

export type BlogFigureVisual = {
  path: string
  mode: FigureMode
}

export type BlogVisualEntry = {
  slug: string
  order: number
  series: BlogVisualSeries
  thesis: string
  prompt: string
  primary: Artifact
  secondary: Artifact
  figures: readonly BlogFigureVisual[]
}

export type ResolvedArtifact = Artifact & {
  evidence: string
  provenance: string
}
