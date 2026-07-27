import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp, { type OverlayOptions } from 'sharp'

import { blogVisualCatalog } from './visual-system/catalog'

import type { FigureMode } from './visual-system/types'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const defaultAssetRoot = path.join(repoRoot, 'public')
const defaultOutputDirectory = path.join(repoRoot, 'output', 'blog-visual-review')
const columns = 4
const pageWidth = 1800
const outerPadding = 48
const gap = 24
const labelHeight = 44
const thumbnailBackground = '#ffffff'
const reviewPaper = '#f7f5ef'
const reviewInk = '#18181b'
const reviewMuted = '#52525b'
const reviewEmerald = '#059669'

export type ContactSheetKind = 'covers' | 'figures'

export type ContactSheetInput = {
  label: string
  path: string
}

export type RenderContactSheetsOptions = {
  assetRoot?: string
  logger?: (line: string) => void
  outputDirectory?: string
}

export type ContactSheetResult = {
  count: number
  height: number
  kind: ContactSheetKind
  outputPath: string
  width: number
}

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const cellWidth = () =>
  Math.floor((pageWidth - outerPadding * 2 - gap * (columns - 1)) / columns)

const labelSvg = (width: number, lines: readonly string[]) => {
  const lineHeight = 16
  const padding = 8
  const textLength = width - padding * 2
  const text = lines
    .map(
      (line, index) => `<text
        fill="${index === 0 ? reviewInk : reviewMuted}"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="${index === 0 ? 12 : 10}"
        font-weight="${index === 0 ? 700 : 500}"
        lengthAdjust="spacingAndGlyphs"
        textLength="${textLength}"
        x="${padding}"
        y="${14 + index * lineHeight}"
      >${escapeXml(line)}</text>`,
    )
    .join('')

  return Buffer.from(`<svg height="${labelHeight}" width="${width}" xmlns="http://www.w3.org/2000/svg">
    <rect fill="${reviewPaper}" height="${labelHeight}" width="${width}" />
    <rect fill="${reviewEmerald}" height="${labelHeight}" width="4" />
    ${text}
  </svg>`)
}

export const getContactSheetInputs = (): Record<
  ContactSheetKind,
  readonly ContactSheetInput[]
> => ({
  covers: blogVisualCatalog.map((entry) => ({
    label: `${String(entry.order).padStart(2, '0')} · ${entry.slug}`,
    path: `/blog/${entry.slug}/cover.webp`,
  })),
  figures: blogVisualCatalog.flatMap((entry) =>
    entry.figures.map((figure, index) => ({
      label: `${String(entry.order).padStart(2, '0')} · ${entry.slug} · ${figure.mode.toUpperCase()} · FIGURE ${String(index + 1).padStart(2, '0')}`,
      path: figure.path,
    })),
  ),
})

const getModeFromLabel = (label: string): FigureMode | null => {
  const match = label.match(/\b(SEE|TRACE|INSPECT|JOIN)\b/)
  return match ? (match[1].toLocaleLowerCase('en-US') as FigureMode) : null
}

const createContactSheet = async (
  kind: ContactSheetKind,
  inputs: readonly ContactSheetInput[],
  assetRoot: string,
  outputDirectory: string,
): Promise<ContactSheetResult> => {
  const width = cellWidth()
  const thumbnailHeight = kind === 'covers'
    ? Math.round(width * (630 / 1200))
    : Math.round(width * (675 / 1200))
  const rows = Math.ceil(inputs.length / columns)
  const rowHeight = thumbnailHeight + labelHeight
  const height = outerPadding * 2 + rows * rowHeight + Math.max(0, rows - 1) * gap
  const composites: OverlayOptions[] = []

  for (const [index, input] of inputs.entries()) {
    const column = index % columns
    const row = Math.floor(index / columns)
    const left = outerPadding + column * (width + gap)
    const top = outerPadding + row * (rowHeight + gap)
    const sourcePath = path.join(assetRoot, input.path.replace(/^\//, ''))
    const thumbnail = await sharp(sourcePath, { density: 144 })
      .resize({
        background: thumbnailBackground,
        fit: 'contain',
        height: thumbnailHeight,
        width,
      })
      .flatten({ background: thumbnailBackground })
      .png()
      .toBuffer()
    const mode = getModeFromLabel(input.label)
    const secondLine = mode
      ? `${mode.toUpperCase()} · ${input.path}`
      : input.path

    composites.push(
      { input: thumbnail, left, top },
      {
        input: labelSvg(width, [input.label, secondLine]),
        left,
        top: top + thumbnailHeight,
      },
    )
  }

  const outputPath = path.join(outputDirectory, `${kind}.webp`)
  await mkdir(outputDirectory, { recursive: true })
  await sharp({
    create: {
      background: reviewPaper,
      channels: 4,
      height,
      width: pageWidth,
    },
  })
    .composite(composites)
    .webp({ effort: 6, quality: 86 })
    .toFile(outputPath)

  return { count: inputs.length, height, kind, outputPath, width: pageWidth }
}

export const renderContactSheets = async ({
  assetRoot = defaultAssetRoot,
  logger = console.log,
  outputDirectory = defaultOutputDirectory,
}: RenderContactSheetsOptions = {}): Promise<readonly ContactSheetResult[]> => {
  const inputs = getContactSheetInputs()
  const results = await Promise.all([
    createContactSheet('covers', inputs.covers, assetRoot, outputDirectory),
    createContactSheet('figures', inputs.figures, assetRoot, outputDirectory),
  ])

  for (const result of results) {
    logger(
      `Rendered ${result.kind} contact sheet: ${result.count} assets → ${result.outputPath}`,
    )
  }

  return results
}

const isMain = () =>
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  await renderContactSheets()
}
