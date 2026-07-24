import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  diagramDefinitions,
  hydrateDiagramDefinitions,
} from './visual-system/diagram-data'
import {
  renderDiagramSvg,
  validateDiagramDefinitions,
  validateRenderedDiagrams,
} from './visual-system/diagram-template'

import type { DiagramDefinition } from './visual-system/diagram-data'

type FigureOutput = {
  bytes: number
  outputPath: string
  path: string
  svg: string
}

type GenerateFigureOptions = {
  definitions?: readonly DiagramDefinition[]
  logger?: (line: string) => void
  outputRoot?: string
  requireCompleteCatalog?: boolean
  writeOutput?: (outputPath: string, svg: string) => Promise<void>
}

const defaultOutputRoot = path.resolve(import.meta.dirname, '../../public')

const defaultWriteOutput = async (outputPath: string, svg: string) => {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, svg, 'utf8')
}

export const buildFigureOutputs = async (
  definitions: readonly DiagramDefinition[] = diagramDefinitions,
  outputRoot = defaultOutputRoot,
  requireCompleteCatalog = definitions.length === diagramDefinitions.length,
): Promise<readonly FigureOutput[]> => {
  if (definitions.length === 0) return []

  validateDiagramDefinitions(definitions)

  const hydrated = await hydrateDiagramDefinitions(definitions, {
    requireCompleteCatalog,
  })
  const rendered = hydrated.map((diagram) => ({
    diagram,
    svg: renderDiagramSvg(diagram),
  }))

  validateRenderedDiagrams(rendered)

  return rendered.map(({ diagram, svg }) => ({
    bytes: Buffer.byteLength(svg),
    outputPath: path.resolve(outputRoot, diagram.path.replace(/^\//, '')),
    path: diagram.path,
    svg,
  }))
}

export const generateFigures = async ({
  definitions = diagramDefinitions,
  logger = console.log,
  outputRoot = defaultOutputRoot,
  requireCompleteCatalog = definitions.length === diagramDefinitions.length,
  writeOutput = defaultWriteOutput,
}: GenerateFigureOptions = {}): Promise<readonly FigureOutput[]> => {
  // Build, hydrate, render, and validate the complete batch before the first
  // directory or file write. One invalid late definition therefore leaves the
  // existing published set untouched.
  const outputs = await buildFigureOutputs(
    definitions,
    outputRoot,
    requireCompleteCatalog,
  )

  for (const output of outputs) {
    await writeOutput(output.outputPath, output.svg)
    logger(`Generated ${output.path} (${output.bytes} bytes).`)
  }

  logger(`Generated ${outputs.length} deterministic Field Journal blog figures.`)
  return outputs
}

const isMain = () =>
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  await generateFigures()
}
