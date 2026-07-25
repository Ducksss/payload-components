import path from 'node:path'

import { journalTheme } from './theme'

import type {
  DiagramDefinition,
  DiagramEdge,
  DiagramNode,
  HydratedDiagram,
} from './diagram-data'
import type { BlogVisualSeries } from './types'

const VIEWBOX = '0 0 1200 675'
const MAX_BODY_LINE_LENGTH = 68
const MAX_SVG_BYTES = 153_600

const seriesLabels: Record<BlogVisualSeries, string> = {
  'component-design': 'COMPONENT DESIGN',
  foundations: 'FOUNDATIONS',
  'installer-internals': 'INSTALLER INTERNALS',
  'open-source': 'OPEN SOURCE',
  'production-guides': 'PRODUCTION GUIDES',
  'project-notes': 'PROJECT NOTES',
}

type NodePosition = {
  height: number
  width: number
  x: number
  y: number
}

type RenderedDiagram = {
  diagram: HydratedDiagram
  svg: string
}

export const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const canonicalDiagramPath = (figurePath: string) =>
  /^\/blog\/[a-z0-9-]+\/figure-\d{2}-[a-z0-9-]+\.svg$/.test(figurePath) &&
  path.posix.normalize(figurePath) === figurePath

export const effectiveDiagramEdges = (
  definition: Pick<DiagramDefinition, 'edges' | 'rows'>,
): readonly DiagramEdge[] => {
  if (definition.edges) return definition.edges

  const nodes = definition.rows.flat()
  return nodes.slice(0, -1).map((node, index) => ({
    from: node.id,
    to: nodes[index + 1].id,
  }))
}

export const validateDiagramDefinitions = (
  definitions: readonly DiagramDefinition[],
): void => {
  if (definitions.length === 0) {
    throw new Error('At least one diagram definition is required.')
  }

  const seenPaths = new Set<string>()

  for (const definition of definitions) {
    if (!canonicalDiagramPath(definition.path)) {
      throw new Error(
        `Diagram path must be a canonical blog path without traversal: ${definition.path}`,
      )
    }
    if (seenPaths.has(definition.path)) {
      throw new Error(`Duplicate diagram path: ${definition.path}`)
    }
    seenPaths.add(definition.path)

    for (const [field, value] of [
      ['description', definition.description],
      ['kicker', definition.kicker],
      ['title', definition.title],
    ] as const) {
      if (value.trim() === '') {
        throw new Error(`${definition.path} has an empty ${field}.`)
      }
    }

    if (definition.evidenceLines !== undefined) {
      if (!Number.isInteger(definition.evidenceLines) || definition.evidenceLines < 1) {
        throw new Error(`${definition.path} has invalid evidenceLines.`)
      }
    }

    if (definition.rows.length === 0 || definition.rows.some((row) => row.length === 0)) {
      throw new Error(`${definition.path} must contain nonempty node rows.`)
    }

    const nodes = definition.rows.flat()
    const nodeIds = new Set<string>()

    for (const node of nodes) {
      if (!/^[a-z][a-z0-9-]*$/.test(node.id)) {
        throw new Error(`${definition.path} has invalid node id "${node.id}".`)
      }
      if (nodeIds.has(node.id)) {
        throw new Error(`${definition.path} has duplicate node id "${node.id}".`)
      }
      nodeIds.add(node.id)

      if (node.title.trim() === '' || node.body.trim() === '') {
        throw new Error(`${definition.path} has an empty node title or body.`)
      }
    }

    const seenEdges = new Set<string>()

    for (const edge of effectiveDiagramEdges(definition)) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        throw new Error(
          `${definition.path} has unknown edge endpoint ${edge.from} → ${edge.to}.`,
        )
      }

      const edgeKey = `${edge.from}\u0000${edge.to}`
      if (seenEdges.has(edgeKey)) {
        throw new Error(
          `${definition.path} has duplicate edge ${edge.from} → ${edge.to}.`,
        )
      }
      seenEdges.add(edgeKey)
    }
  }
}

const splitLongToken = (token: string, maxCharacters: number) => {
  const parts: string[] = []
  let remaining = token

  while ([...remaining].length > maxCharacters) {
    const characters = [...remaining]
    const breakpointCandidates = characters
      .slice(0, maxCharacters)
      .map((character, index) => ({ character, index }))
      .filter(({ character }) => /[-/.:+]/.test(character))
    const breakpoint =
      breakpointCandidates.at(-1)?.index === undefined
        ? maxCharacters
        : breakpointCandidates.at(-1)!.index + 1

    parts.push(characters.slice(0, breakpoint).join(''))
    remaining = characters.slice(breakpoint).join('')
  }

  if (remaining) parts.push(remaining)
  return parts
}

export const wrapDiagramText = (
  value: string,
  maxCharacters = MAX_BODY_LINE_LENGTH,
): readonly string[] => {
  if (!Number.isInteger(maxCharacters) || maxCharacters < 8) {
    throw new Error('Diagram text must wrap to at least eight characters.')
  }

  const lines: string[] = []

  for (const paragraph of value.split('\n')) {
    if (paragraph === '') {
      lines.push('')
      continue
    }

    const words = paragraph.trim().split(/\s+/).flatMap((word) =>
      [...word].length > maxCharacters
        ? splitLongToken(word, maxCharacters)
        : [word],
    )
    let current = ''

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word

      if ([...candidate].length <= maxCharacters) {
        current = candidate
        continue
      }

      if (current) lines.push(current)
      current = word
    }

    if (current) lines.push(current)
  }

  return lines.length > 0 ? lines : ['']
}

const renderTextLines = ({
  className,
  lineHeight,
  lines,
  role,
  x,
  y,
}: {
  className: string
  lineHeight: number
  lines: readonly string[]
  role?: string
  x: number
  y: number
}) =>
  lines
    .map(
      (line, index) =>
        `<text class="${className}"${role ? ` data-role="${role}"` : ''} x="${x}" y="${
          y + index * lineHeight
        }">${escapeXml(line || ' ')}</text>`,
    )
    .join('\n')

const nodeTextLimit = (width: number) =>
  Math.min(MAX_BODY_LINE_LENGTH, Math.max(15, Math.floor((width - 32) / 7.2)))

const nodeTextHeight = (node: DiagramNode, width: number) => {
  const titleLimit = Math.min(38, Math.max(13, Math.floor((width - 46) / 8)))
  const titleLines = wrapDiagramText(node.title, titleLimit)
  const bodyLines = wrapDiagramText(node.body, nodeTextLimit(width))
  const bodyLineHeight = node.kind === 'terminal' ? 17 : 16

  // Mirrors renderNode's baselines and reserves 13px below the final glyph
  // descent. Keeping this calculation beside layout prevents prose changes
  // from silently overflowing a fixed-height card.
  return 40 + titleLines.length * 17 + bodyLines.length * bodyLineHeight
}

const rowHorizontalGeometry = (row: readonly DiagramNode[]) => {
  const terminalRow = row.length === 1 && row[0].kind === 'terminal'
  const gap = row.length >= 5 ? 12 : row.length === 4 ? 16 : 22
  const maxWidth =
    row.length === 1
      ? terminalRow
        ? 1040
        : 840
      : 1096
  const width = (maxWidth - gap * Math.max(0, row.length - 1)) / row.length
  const xStart = (1200 - maxWidth) / 2

  return { gap, terminalRow, width, xStart }
}

const layoutDiagramRows = ({
  contentTop,
  diagramPath,
  edges,
  rows,
}: {
  contentTop: number
  diagramPath: string
  edges: readonly DiagramEdge[]
  rows: readonly (readonly DiagramNode[])[]
}) => {
  const contentBottom = 531
  const baseRowGap = rows.length === 3 ? 16 : 22
  const tallestLabel = Math.max(
    0,
    ...edges
      .filter((edge) => edge.label)
      .map((edge) => (wrapDiagramText(edge.label ?? '', 25).length - 1) * 15 + 22),
  )
  const rowGap = Math.max(baseRowGap, tallestLabel > 0 ? tallestLabel + 6 : 0)
  const horizontal = rows.map(rowHorizontalGeometry)
  const requiredHeights = rows.map((row, rowIndex) =>
    Math.max(
      ...row.map((node) => nodeTextHeight(node, horizontal[rowIndex].width)),
    ),
  )
  const preferredHeights = rows.map((row, rowIndex) => {
    const preferred = horizontal[rowIndex].terminalRow
      ? 152
      : row.length === 1
        ? 152
        : 116

    return Math.max(preferred, requiredHeights[rowIndex])
  })
  const heightBudget =
    contentBottom - contentTop - rowGap * Math.max(0, rows.length - 1)
  const requiredTotal = requiredHeights.reduce((sum, height) => sum + height, 0)

  if (requiredTotal > heightBudget) {
    throw new Error(
      `${diagramPath} needs ${requiredTotal}px of card content but only ${heightBudget}px is available.`,
    )
  }

  const desiredExtra = preferredHeights.map(
    (height, rowIndex) => height - requiredHeights[rowIndex],
  )
  const desiredExtraTotal = desiredExtra.reduce((sum, height) => sum + height, 0)
  const extraBudget = heightBudget - requiredTotal
  const extraScale =
    desiredExtraTotal === 0 ? 0 : Math.min(1, extraBudget / desiredExtraTotal)
  const heights = requiredHeights.map(
    (height, rowIndex) => height + desiredExtra[rowIndex] * extraScale,
  )
  const usedHeight =
    heights.reduce((sum, height) => sum + height, 0) +
    rowGap * Math.max(0, rows.length - 1)
  let y = contentTop + Math.max(0, (contentBottom - contentTop - usedHeight) / 2)

  return horizontal.map((geometry, rowIndex) => {
    const rowGeometry = {
      gap: geometry.gap,
      height: heights[rowIndex],
      width: geometry.width,
      xStart: geometry.xStart,
      y,
    }
    y += heights[rowIndex] + rowGap
    return rowGeometry
  })
}

const renderNode = (
  node: DiagramNode,
  position: NodePosition,
  ordinal: number,
) => {
  const code = node.kind === 'code' || node.kind === 'terminal'
  const titleLimit = Math.min(38, Math.max(13, Math.floor((position.width - 46) / 8)))
  const titleLines = wrapDiagramText(node.title, titleLimit)
  const bodyLines = wrapDiagramText(node.body, nodeTextLimit(position.width))
  const titleLineHeight = 17
  const bodyLineHeight = node.kind === 'terminal' ? 17 : 16
  const titleY = position.y + 27
  const bodyY = titleY + titleLines.length * titleLineHeight + 13
  const kind = node.kind ?? 'standard'

  return `<g class="node node--${kind}" data-node-id="${escapeXml(
    node.id,
  )}" data-node-kind="${kind}">
  <rect class="node-card" x="${position.x}" y="${position.y}" width="${
    position.width
  }" height="${position.height}" rx="${node.kind === 'terminal' ? 4 : 2}" />
  <path class="node-rule" d="M ${position.x} ${position.y + 5} H ${
    position.x + position.width
  }" />
  <text class="node-index" x="${position.x + 16}" y="${position.y + 26}">${String(
    ordinal,
  ).padStart(2, '0')}</text>
  ${renderTextLines({
    className: code ? 'node-title node-title--mono' : 'node-title',
    lineHeight: titleLineHeight,
    lines: titleLines,
    x: position.x + 43,
    y: titleY,
  })}
  ${renderTextLines({
    className: code ? 'node-body node-body--mono' : 'node-body',
    lineHeight: bodyLineHeight,
    lines: bodyLines,
    role: 'body-line',
    x: position.x + 16,
    y: bodyY,
  })}
</g>`
}

const edgePoints = (from: NodePosition, to: NodePosition) => {
  const fromCenter = {
    x: from.x + from.width / 2,
    y: from.y + from.height / 2,
  }
  const toCenter = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2,
  }
  const deltaX = toCenter.x - fromCenter.x
  const deltaY = toCenter.y - fromCenter.y
  const verticallySeparated =
    to.y >= from.y + from.height || from.y >= to.y + to.height

  if (verticallySeparated) {
    const direction = Math.sign(deltaY) || 1
    return {
      axis: 'vertical' as const,
      end: {
        x: toCenter.x,
        y: toCenter.y - direction * (to.height / 2 + 7),
      },
      start: {
        x: fromCenter.x,
        y: fromCenter.y + direction * (from.height / 2 + 2),
      },
    }
  }

  const direction = Math.sign(deltaX) || 1
  return {
    axis: 'horizontal' as const,
    end: {
      x: toCenter.x - direction * (to.width / 2 + 7),
      y: toCenter.y,
    },
    start: {
      x: fromCenter.x + direction * (from.width / 2 + 2),
      y: fromCenter.y,
    },
  }
}

const renderEdge = (
  edge: DiagramEdge,
  positions: ReadonlyMap<string, NodePosition>,
) => {
  const from = positions.get(edge.from)
  const to = positions.get(edge.to)

  if (!from || !to) {
    throw new Error(`Unknown edge endpoint ${edge.from} → ${edge.to}.`)
  }

  const { axis, end, start } = edgePoints(from, to)
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const curve =
    axis === 'horizontal'
      ? `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
      : `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`
  const labelLines = edge.label ? wrapDiagramText(edge.label, 25) : []
  const labelLineHeight = 15
  const labelWidth = Math.min(
    240,
    Math.max(
      88,
      Math.max(0, ...labelLines.map((line) => [...line].length)) * 7.8 + 20,
    ),
  )
  const labelHeight = (labelLines.length - 1) * labelLineHeight + 22
  const pathCenterX =
    axis === 'horizontal'
      ? (from.x < to.x
          ? from.x + from.width + to.x
          : to.x + to.width + from.x) / 2
      : midX
  const labelCenterY =
    axis === 'vertical'
      ? (from.y < to.y
          ? from.y + from.height + to.y
          : to.y + to.height + from.y) / 2
      : Math.min(from.y, to.y) - labelHeight / 2 - 8
  const rightOfVerticalPath = Math.max(start.x, end.x) + 12
  const leftOfVerticalPath = Math.min(start.x, end.x) - 12 - labelWidth
  const labelPaperX =
    axis === 'vertical'
      ? rightOfVerticalPath + labelWidth <= 1152
        ? rightOfVerticalPath
        : leftOfVerticalPath
      : pathCenterX - labelWidth / 2
  const labelPaperY = labelCenterY - labelHeight / 2
  const labelTextX = labelPaperX + labelWidth / 2
  const firstLabelBaseline = labelPaperY + 15

  return `<g class="edge"${
    edge.label ? ` data-edge-label="${escapeXml(edge.label)}"` : ''
  }>
  <path class="edge-path" data-edge-from="${escapeXml(
    edge.from,
  )}" data-edge-to="${escapeXml(edge.to)}" data-edge-axis="${axis}" d="${curve}" marker-end="url(#journal-arrow)" />
  ${
    edge.label
      ? `<rect class="edge-label-paper" x="${labelPaperX}" y="${labelPaperY}" width="${labelWidth}" height="${labelHeight}" rx="2" />
  <g text-anchor="middle">
    ${renderTextLines({
      className: 'edge-label',
      lineHeight: labelLineHeight,
      lines: labelLines,
      x: labelTextX,
      y: firstLabelBaseline,
    })}
  </g>`
      : ''
  }
</g>`
}

const renderEvidence = (diagram: HydratedDiagram) => {
  if (!diagram.evidenceExcerpt) return ''

  const excerpt = diagram.evidenceExcerpt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' · ')
  const wrappedLines = wrapDiagramText(excerpt, 68)
  const truncated = wrappedLines.length > 2
  const lines = wrappedLines.slice(0, 2)

  if (truncated) {
    const lastLine = [...(lines.at(-1) ?? '')].slice(0, 65).join('').trimEnd()
    lines[lines.length - 1] = `${lastLine} …`
  }

  return `<g data-journal-part="evidence" data-evidence-excerpt="${escapeXml(
    diagram.evidenceExcerpt,
  )}"${truncated ? ' data-evidence-truncated="true"' : ''}>
  <text class="footer-label" x="48" y="607">EVIDENCE EXCERPT</text>
  ${renderTextLines({
    className: 'evidence-line',
    lineHeight: 15,
    lines,
    x: 48,
    y: 626,
  })}
</g>`
}

export const renderDiagramSvg = (diagram: HydratedDiagram): string => {
  validateDiagramDefinitions([diagram])

  const titleLines = wrapDiagramText(diagram.title, 62).slice(0, 2)
  const contentTop = titleLines.length > 1 ? 174 : 143
  const diagramEdges = effectiveDiagramEdges(diagram)
  const positions = new Map<string, NodePosition>()
  const nodes: string[] = []
  const rowGeometries = layoutDiagramRows({
    contentTop,
    diagramPath: diagram.path,
    edges: diagramEdges,
    rows: diagram.rows,
  })
  let ordinal = 1

  for (const [rowIndex, row] of diagram.rows.entries()) {
    const geometry = rowGeometries[rowIndex]

    row.forEach((node, columnIndex) => {
      const position = {
        height: geometry.height,
        width: geometry.width,
        x: geometry.xStart + columnIndex * (geometry.width + geometry.gap),
        y: geometry.y,
      }
      positions.set(node.id, position)
      nodes.push(renderNode(node, position, ordinal))
      ordinal += 1
    })
  }

  const edges = diagramEdges.map((edge) =>
    renderEdge(edge, positions),
  )
  const issue = String(diagram.order).padStart(2, '0')
  const mode = diagram.mode.toUpperCase()
  const seriesLabel = seriesLabels[diagram.series]
  const promptLines = wrapDiagramText(diagram.prompt, 42).slice(0, 2)
  const provenanceLines = wrapDiagramText(diagram.provenance, 68).slice(0, 2)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img" aria-labelledby="diagram-title diagram-description" class="diagram diagram--${diagram.mode}" data-mode="${diagram.mode}" data-series="${diagram.series}" data-issue="${issue}">
  <title id="diagram-title">${escapeXml(diagram.title)}</title>
  <desc id="diagram-description">${escapeXml(diagram.description)}</desc>
  <defs>
    <pattern id="journal-grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${journalTheme.zincSoft}" stroke-width="1" />
    </pattern>
    <marker id="journal-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${journalTheme.emerald}" />
    </marker>
    <style>
      .diagram {
        background: ${journalTheme.paper};
        color: ${journalTheme.graphite};
      }
      .paper {
        fill: ${journalTheme.paper};
      }
      .grid {
        fill: url(#journal-grid-pattern);
      }
      .masthead,
      .mode-label,
      .folio-label,
      .footer-label,
      .node-index,
      .edge-label,
      .node-title--mono,
      .node-body--mono,
      .provenance-line {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .masthead {
        fill: ${journalTheme.graphite};
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1.7px;
      }
      .kicker {
        fill: ${journalTheme.emeraldDark};
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        font-weight: 750;
        letter-spacing: 1.5px;
      }
      .headline {
        fill: ${journalTheme.graphite};
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 28px;
        font-weight: 720;
        letter-spacing: -0.4px;
      }
      .mode-box {
        fill: ${journalTheme.white};
        stroke: ${journalTheme.emeraldDark};
        stroke-width: 2;
      }
      .mode-label {
        fill: ${journalTheme.emeraldDark};
        font-size: 13px;
        font-weight: 750;
        letter-spacing: 1.4px;
      }
      .folio-label {
        fill: ${journalTheme.inkMuted};
        font-size: 13px;
        font-weight: 650;
        letter-spacing: 1.2px;
      }
      .journal-rule {
        stroke: ${journalTheme.graphite};
        stroke-width: 1;
      }
      .accent-path {
        fill: none;
        stroke: ${journalTheme.emerald};
        stroke-linecap: round;
        stroke-width: 2.5;
      }
      .edge-path {
        fill: none;
        stroke: ${journalTheme.emerald};
        stroke-linecap: round;
        stroke-width: 2.25;
      }
      .diagram--join .edge-path {
        stroke-dasharray: 7 5;
      }
      .diagram--inspect .edge-path {
        stroke-width: 1.75;
      }
      .edge-label-paper {
        fill: ${journalTheme.paper};
        stroke: ${journalTheme.zincSoft};
        stroke-width: 1;
      }
      .edge-label {
        fill: ${journalTheme.emeraldDark};
        font-size: 13px;
        font-weight: 700;
      }
      .node-card {
        fill: ${journalTheme.white};
        stroke: ${journalTheme.zinc};
        stroke-width: 1.25;
      }
      .diagram--inspect .node-card {
        stroke: ${journalTheme.graphite};
      }
      .node--terminal .node-card {
        fill: ${journalTheme.graphite};
        stroke: ${journalTheme.graphite};
      }
      .node-rule {
        stroke: ${journalTheme.emerald};
        stroke-width: 5;
      }
      .node-index {
        fill: ${journalTheme.emeraldDark};
        font-size: 13px;
        font-weight: 700;
      }
      .node-title {
        fill: ${journalTheme.graphite};
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 15px;
        font-weight: 720;
      }
      .node-body {
        fill: ${journalTheme.inkMuted};
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        font-weight: 480;
      }
      .node--terminal .node-title,
      .node--terminal .node-body {
        fill: ${journalTheme.white};
      }
      .node--terminal .node-index {
        fill: ${journalTheme.emerald};
      }
      .footer-paper {
        fill: ${journalTheme.white};
        stroke: ${journalTheme.zinc};
        stroke-width: 1;
      }
      .footer-label {
        fill: ${journalTheme.emeraldDark};
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      .provenance-line,
      .evidence-line {
        fill: ${journalTheme.inkMuted};
        font-size: 13px;
      }
      .evidence-line {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .prompt {
        fill: ${journalTheme.emeraldDark};
        font-family: Georgia, serif;
        font-size: 16px;
        font-style: italic;
        font-weight: 650;
      }
      .registration {
        fill: none;
        stroke: ${journalTheme.emeraldDark};
        stroke-width: 1.5;
      }
    </style>
  </defs>
  <rect class="paper" width="1200" height="675" />
  <rect class="grid" data-journal-part="grid" x="28" y="24" width="1144" height="627" />
  <path class="journal-rule" d="M 36 62 H 1164" />
  <g data-journal-part="masthead">
    <text class="masthead" x="48" y="49">${seriesLabel} · ISSUE ${issue}</text>
  </g>
  <g data-journal-part="mode">
    <rect class="mode-box" x="876" y="27" width="96" height="27" rx="2" />
    <text class="mode-label" x="924" y="46" text-anchor="middle">${mode}</text>
  </g>
  <g data-journal-part="folio">
    <text class="folio-label" x="1152" y="47" text-anchor="end">FIELD NOTE ${issue} / 32</text>
  </g>
  <text class="kicker" x="48" y="86">${escapeXml(diagram.kicker)}</text>
  ${renderTextLines({
    className: 'headline',
    lineHeight: 31,
    lines: titleLines,
    x: 48,
    y: 119,
  })}
  <path class="accent-path" d="M 941 96 C 1004 83, 1054 105, 1138 81" />
  <circle class="registration" cx="1139" cy="81" r="8" />
  <g data-diagram-layer="edges">
    ${edges.join('\n')}
  </g>
  <g data-diagram-layer="nodes">
    ${nodes.join('\n')}
  </g>
  <rect class="footer-paper" x="36" y="546" width="1128" height="105" rx="2" />
  <g data-journal-part="provenance" data-provenance="${escapeXml(
    diagram.provenance,
  )}">
    <text class="footer-label" x="48" y="571">PROVENANCE</text>
    ${renderTextLines({
      className: 'provenance-line',
      lineHeight: 15,
      lines: provenanceLines,
      x: 48,
      y: 590,
    })}
  </g>
  ${renderEvidence(diagram)}
  <g data-journal-part="prompt" data-prompt="${escapeXml(diagram.prompt)}">
    <text class="footer-label" x="744" y="571">QUESTION FOR THE NEXT BUILDER</text>
    ${renderTextLines({
      className: 'prompt',
      lineHeight: 19,
      lines: promptLines,
      x: 744,
      y: 594,
    })}
  </g>
</svg>
`

  return svg.replace(/[ \t]+$/gm, '')
}

const themeColors = new Set(Object.values(journalTheme).map((color) => color.toLowerCase()))

export const validateRenderedDiagram = ({
  diagram,
  svg,
}: RenderedDiagram): void => {
  const context = diagram.path
  const bytes = Buffer.byteLength(svg)

  if (bytes > MAX_SVG_BYTES) {
    throw new Error(`${context} is ${bytes} bytes; maximum is ${MAX_SVG_BYTES}.`)
  }
  if (!svg.startsWith('<svg ') || !svg.includes(`viewBox="${VIEWBOX}"`)) {
    throw new Error(`${context} does not use the required SVG root and viewBox.`)
  }
  if (!svg.includes(`data-mode="${diagram.mode}"`)) {
    throw new Error(`${context} does not declare its catalog teaching mode.`)
  }
  if (
    !svg.includes('aria-labelledby="diagram-title diagram-description"') ||
    !svg.includes('<title id="diagram-title">') ||
    !svg.includes('<desc id="diagram-description">')
  ) {
    throw new Error(`${context} does not expose an accessible title and description.`)
  }

  for (const part of ['grid', 'masthead', 'mode', 'folio', 'provenance', 'prompt']) {
    const count = svg.match(new RegExp(`data-journal-part="${part}"`, 'g'))?.length ?? 0
    if (count !== 1) {
      throw new Error(`${context} must render journal part "${part}" exactly once.`)
    }
  }

  if (/<script\b|<foreignObject\b|<image\b|@import\b|@font-face\b/i.test(svg)) {
    throw new Error(`${context} contains unsafe or external-capable SVG content.`)
  }
  if (
    /(?:href|src)=["'](?:https?:)?\/\/|url\(["']?https?:\/\//i.test(svg)
  ) {
    throw new Error(`${context} contains an external URL.`)
  }
  if (/\b(?:rgb|hsl|lab|lch|hwb|color)a?\(/i.test(svg)) {
    throw new Error(`${context} uses an alternate color syntax.`)
  }

  for (const color of svg.match(/#[\da-f]{3,8}\b/gi) ?? []) {
    const normalized =
      color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase()
        : color.toLowerCase()

    if (!themeColors.has(normalized)) {
      throw new Error(`${context} uses unapproved color ${color}.`)
    }
  }

  const fontSizes = [
    ...[...svg.matchAll(/\bfont-size=["']([\d.]+)(?:px)?["']/gi)].map(
      (match) => Number(match[1]),
    ),
    ...[...svg.matchAll(/font-size\s*:\s*([\d.]+)px/gi)].map((match) =>
      Number(match[1]),
    ),
  ]
  if (fontSizes.length === 0 || Math.min(...fontSizes) < 13) {
    throw new Error(`${context} renders text smaller than 13px.`)
  }
  if (
    /<text\b[^>]*\btransform=["'][^"']*\bscale\(\s*(?:0(?:\.\d+)?|\.\d+)/i.test(
      svg,
    )
  ) {
    throw new Error(`${context} scales text below its declared size.`)
  }

  const expectedEdges = effectiveDiagramEdges(diagram).map(({ from, to }) => ({
    from,
    to,
  }))
  const renderedEdges = [
    ...svg.matchAll(/data-edge-from="([^"]+)"\s+data-edge-to="([^"]+)"/g),
  ].map((match) => ({ from: match[1], to: match[2] }))

  if (JSON.stringify(renderedEdges) !== JSON.stringify(expectedEdges)) {
    throw new Error(`${context} rendered edge metadata does not match its definition.`)
  }

  const bodyLines = [
    ...svg.matchAll(/<text[^>]+data-role="body-line"[^>]*>([^<]*)<\/text>/g),
  ].map((match) =>
    match[1]
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&apos;', "'"),
  )

  if (
    bodyLines.length === 0 ||
    bodyLines.some((line) => [...line].length > MAX_BODY_LINE_LENGTH)
  ) {
    throw new Error(`${context} has a body line longer than 68 characters.`)
  }
}

export const validateRenderedDiagrams = (
  outputs: readonly RenderedDiagram[],
): void => {
  for (const output of outputs) {
    validateRenderedDiagram(output)
  }
}
