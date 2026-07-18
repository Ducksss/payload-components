import { journalThemeCss } from './theme'
import type { BlogVisualEntry, ResolvedArtifact } from './types'

export const coverFontPaths = {
  geistBold: 'src/app/_fonts/Geist-Bold.ttf',
  geistMono: 'src/app/_fonts/GeistMono-Regular.ttf',
  geistRegular: 'src/app/_fonts/Geist-Regular.ttf',
  instrumentSerif: 'src/app/_fonts/InstrumentSerif-Italic.ttf',
} as const

type CoverFontPath = (typeof coverFontPaths)[keyof typeof coverFontPaths]

export type CoverFontData = Readonly<Record<CoverFontPath, string>>

export type CoverArtifact = ResolvedArtifact & {
  previewDataUrl?: string
}

export type CoverArtifacts = {
  primary: CoverArtifact
  secondary: CoverArtifact
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const seriesLabel = (series: BlogVisualEntry['series']) =>
  series.replaceAll('-', ' ').toUpperCase()

const evidenceDensity = (lineCount: number) => {
  if (lineCount <= 6) return 'code-sheet--roomy'
  if (lineCount <= 14) return 'code-sheet--regular'
  if (lineCount <= 20) return 'code-sheet--compact'
  return 'code-sheet--dense'
}

const codeEvidence = (evidence: string) => {
  const lines = evidence.split(/\r?\n/)
  const renderedLines = lines
    .map(
      (line, index) => `<span class="code-line${index === 0 ? ' code-line--anchor' : ''}">
        <span class="line-number">${String(index + 1).padStart(2, '0')}</span>
        <code>${escapeHtml(line || ' ')}</code>
      </span>`,
    )
    .join('')

  return `<div class="code-sheet ${evidenceDensity(lines.length)}">${renderedLines}</div>`
}

const sequenceEvidence = (artifact: Extract<CoverArtifact, { kind: 'sequence' }>) =>
  `<div class="sequence-flow">
    ${artifact.items
      .map(
        (item, index) => `<div class="sequence-item">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(item)}</strong>
        </div>${index < artifact.items.length - 1 ? '<i aria-hidden="true">→</i>' : ''}`,
      )
      .join('')}
  </div>`

const commandEvidence = (artifact: Extract<CoverArtifact, { kind: 'command' }>) => {
  const registryItems = artifact.registryItems ?? []
  const registryLabel = registryItems.length
    ? `<div class="registry-reference">${
        registryItems.length === 1
          ? `REGISTRY ITEM / ${escapeHtml(registryItems[0])}`
          : `REGISTRY ITEMS / ${registryItems.length} FROM registry.json`
      }</div>`
    : ''

  return `<div class="command-sheet">
    <div class="command-line"><span aria-hidden="true">$</span><code>${escapeHtml(artifact.command)}</code></div>
    ${registryLabel}
  </div>`
}

const routeEvidence = (artifact: Extract<CoverArtifact, { kind: 'route' }>) => {
  if (!artifact.previewDataUrl) return codeEvidence(artifact.evidence)

  if (!/^data:image\/(?:png|webp);base64,[A-Za-z0-9+/]+=*$/.test(artifact.previewDataUrl)) {
    throw new Error(`Route preview for ${artifact.route} must be an inline PNG or WebP data URL.`)
  }

  return `<figure class="route-preview">
    <img alt="${escapeHtml(`${artifact.label}: local route ${artifact.route}`)}" src="${artifact.previewDataUrl}" />
    <figcaption>${escapeHtml(artifact.route)}</figcaption>
  </figure>`
}

const artifactEvidence = (artifact: CoverArtifact) => {
  switch (artifact.kind) {
    case 'sequence':
      return sequenceEvidence(artifact)
    case 'command':
      return commandEvidence(artifact)
    case 'route':
      return routeEvidence(artifact)
    case 'source':
    case 'registry-item':
    case 'diff':
      return codeEvidence(artifact.evidence)
  }
}

const artifactRegion = (
  role: 'primary' | 'secondary',
  artifact: CoverArtifact,
) => `<section
    class="artifact artifact--${role}${role === 'primary' ? ' paper-edge' : ''}"
    data-cover-part="${role}"
    data-artifact-kind="${artifact.kind}"
    ${role === 'secondary' ? 'data-overlap-percent="0"' : ''}
  >
    <header class="artifact-header">
      <span>${role === 'primary' ? '01 / PRIMARY EVIDENCE' : '02 / CORROBORATING LAYER'}</span>
      <h2>${escapeHtml(artifact.label)}</h2>
      <b>${escapeHtml(artifact.kind)}</b>
    </header>
    <div class="artifact-body">${artifactEvidence(artifact)}</div>
  </section>`

const fontFace = ({
  data,
  family,
  path,
  style = 'normal',
  weight,
}: {
  data: string
  family: string
  path: CoverFontPath
  style?: 'italic' | 'normal'
  weight: number
}) => {
  if (!data || !/^[A-Za-z0-9+/]+=*$/.test(data)) {
    throw new Error(`Font data for ${path} is not valid base64.`)
  }

  return `
    /* ${path} */
    @font-face {
      font-display: block;
      font-family: '${family}';
      font-style: ${style};
      font-weight: ${weight};
      src: url("data:font/ttf;base64,${data}") format('truetype');
    }
  `
}

const renderFontFaces = (fontData: CoverFontData) =>
  [
    fontFace({
      data: fontData[coverFontPaths.geistRegular],
      family: 'Journal Sans',
      path: coverFontPaths.geistRegular,
      weight: 400,
    }),
    fontFace({
      data: fontData[coverFontPaths.geistBold],
      family: 'Journal Sans',
      path: coverFontPaths.geistBold,
      weight: 700,
    }),
    fontFace({
      data: fontData[coverFontPaths.geistMono],
      family: 'Journal Mono',
      path: coverFontPaths.geistMono,
      weight: 400,
    }),
    fontFace({
      data: fontData[coverFontPaths.instrumentSerif],
      family: 'Journal Serif',
      path: coverFontPaths.instrumentSerif,
      style: 'italic',
      weight: 400,
    }),
  ].join('\n')

const coverCss = `
  html,
  body {
    height: 630px;
    margin: 0;
    overflow: hidden;
    width: 1200px;
  }

  body {
    background: var(--journal-paper);
    color: var(--journal-graphite);
    font-family: 'Journal Sans', sans-serif;
  }

  .cover {
    background: var(--journal-paper);
    height: 630px;
    overflow: hidden;
    position: relative;
    width: 1200px;
  }

  .cover::before {
    border: 1px solid var(--journal-zinc);
    content: '';
    inset: 34px;
    pointer-events: none;
    position: absolute;
  }

  .canvas {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: 48px 92px 94px 94px 88px 58px;
    inset: 48px;
    position: absolute;
    z-index: 2;
  }

  .masthead {
    align-items: center;
    border-bottom: 1px solid var(--journal-graphite);
    display: flex;
    gap: 22px;
    grid-column: 1 / 13;
    grid-row: 1;
    min-width: 0;
  }

  .masthead-brand {
    align-items: center;
    display: flex;
    gap: 10px;
    white-space: nowrap;
  }

  .masthead-brand::before {
    background: var(--journal-emerald);
    content: '';
    height: 22px;
    width: 5px;
  }

  .masthead-brand strong {
    font-size: 14px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .masthead-series {
    color: var(--journal-ink-muted);
    font-family: 'Journal Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    margin-left: auto;
    text-transform: uppercase;
  }

  .issue {
    align-items: center;
    align-self: stretch;
    border-left: 1px solid var(--journal-zinc);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    justify-content: flex-end;
    letter-spacing: 0.08em;
    min-width: 80px;
  }

  .thesis {
    align-self: stretch;
    min-width: 0;
    padding: 7px 18px 0 0;
    position: relative;
    z-index: 2;
  }

  .thesis-label {
    color: var(--journal-emerald-dark);
    font-family: 'Journal Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .thesis h1 {
    font-family: 'Journal Serif', serif;
    font-size: 44px;
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.025em;
    line-height: 0.97;
    margin: 0;
    text-wrap: balance;
  }

  .thesis-rule {
    align-items: center;
    bottom: 3px;
    color: var(--journal-ink-muted);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    gap: 8px;
    letter-spacing: 0.1em;
    position: absolute;
    text-transform: uppercase;
  }

  .thesis-rule::before {
    background: var(--journal-emerald);
    content: '';
    height: 2px;
    width: 32px;
  }

  .artifact {
    background: var(--journal-white);
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    position: relative;
  }

  .artifact--primary {
    z-index: 3;
  }

  .artifact--secondary {
    border: 2px solid var(--journal-emerald-dark);
    box-shadow: 4px 4px 0 var(--journal-zinc);
    z-index: 2;
  }

  .artifact-header {
    align-items: center;
    border-bottom: 1px solid var(--journal-zinc-soft);
    display: grid;
    flex: 0 0 auto;
    gap: 3px 12px;
    grid-template-columns: minmax(0, 1fr) auto;
    min-height: 58px;
    padding: 10px 13px 9px;
  }

  .artifact-header > span {
    color: var(--journal-emerald-dark);
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    grid-column: 1;
    letter-spacing: 0.11em;
  }

  .artifact-header h2 {
    font-size: 16px;
    grid-column: 1;
    letter-spacing: -0.015em;
    line-height: 1;
    margin: 0;
  }

  .artifact-header b {
    align-self: center;
    border: 1px solid var(--journal-zinc);
    color: var(--journal-ink-muted);
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    font-weight: 400;
    grid-column: 2;
    grid-row: 1 / 3;
    letter-spacing: 0.08em;
    padding: 5px 7px;
    text-transform: uppercase;
  }

  .artifact--secondary .artifact-header {
    min-height: 52px;
    padding-bottom: 7px;
    padding-top: 8px;
  }

  .artifact--secondary .artifact-header h2 {
    font-size: 14px;
  }

  .artifact-body {
    background: var(--journal-paper);
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    padding: 10px;
  }

  .code-sheet {
    background: var(--journal-white);
    border-left: 3px solid var(--journal-emerald);
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    min-height: 0;
    padding: 7px 9px 7px 0;
  }

  .code-line {
    align-items: baseline;
    display: grid;
    flex: 0 0 auto;
    grid-template-columns: 30px minmax(0, 1fr);
    min-width: 0;
  }

  .code-line--anchor {
    background: var(--journal-zinc-soft);
  }

  .code-line code {
    color: var(--journal-graphite);
    font-family: 'Journal Mono', monospace;
    font-size: inherit;
    line-height: inherit;
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .line-number {
    color: var(--journal-emerald-dark);
    font-family: 'Journal Mono', monospace;
    font-size: 0.78em;
    padding-left: 7px;
    user-select: none;
  }

  .code-sheet--roomy .code-line { font-size: 16px; line-height: 1.36; min-height: 25px; }
  .code-sheet--regular .code-line { font-size: 12px; line-height: 1.32; min-height: 18px; }
  .code-sheet--compact .code-line { font-size: 10.5px; line-height: 1.23; min-height: 14px; }
  .code-sheet--dense .code-line { font-size: 8.5px; line-height: 1.12; min-height: 10px; }

  .sequence-flow {
    align-items: stretch;
    display: flex;
    height: 100%;
    justify-content: center;
  }

  .sequence-item {
    align-items: flex-start;
    background: var(--journal-white);
    border-bottom: 3px solid var(--journal-emerald);
    display: flex;
    flex: 1 1 min-content;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    padding: 8px;
  }

  .sequence-item span {
    color: var(--journal-emerald-dark);
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.08em;
  }

  .sequence-item strong {
    font-size: 12px;
    hyphens: none;
    line-height: 1.1;
    margin-top: 7px;
    overflow-wrap: normal;
    word-break: normal;
  }

  .sequence-flow i {
    align-items: center;
    color: var(--journal-emerald-dark);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 14px;
    font-style: normal;
    justify-content: center;
    flex: 0 0 10px;
    width: 10px;
  }

  .artifact[data-artifact-kind='command'] .artifact-body {
    background: var(--journal-graphite);
    padding: 14px;
  }

  .command-sheet {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  .command-line {
    align-items: flex-start;
    color: var(--journal-white);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 14px;
    gap: 9px;
    line-height: 1.45;
  }

  .command-line span {
    color: var(--journal-emerald);
    font-weight: 700;
  }

  .command-line code {
    font-family: inherit;
    overflow-wrap: anywhere;
  }

  .registry-reference {
    border-top: 1px solid var(--journal-ink-muted);
    color: var(--journal-zinc);
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.08em;
    padding-top: 9px;
  }

  .route-preview {
    background: var(--journal-white);
    display: grid;
    grid-template-rows: minmax(0, 1fr) 25px;
    height: 100%;
    margin: 0;
  }

  .route-preview img {
    height: 100%;
    object-fit: cover;
    object-position: top;
    width: 100%;
  }

  .route-preview figcaption {
    align-items: center;
    border-top: 1px solid var(--journal-zinc);
    color: var(--journal-ink-muted);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    padding: 0 8px;
  }

  .prompt {
    align-self: stretch;
    display: grid;
    gap: 3px 11px;
    grid-template-columns: 28px minmax(0, 1fr);
    min-width: 0;
    padding-top: 3px;
  }

  .prompt-mark {
    align-items: center;
    background: var(--journal-emerald);
    color: var(--journal-white);
    display: flex;
    font-family: 'Journal Mono', monospace;
    font-size: 17px;
    grid-row: 1 / 3;
    height: 28px;
    justify-content: center;
    margin-top: 1px;
    width: 28px;
  }

  .prompt-label {
    color: var(--journal-ink-muted);
    font-family: 'Journal Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .prompt p {
    font-size: 14px;
    line-height: 1.12;
    margin: 0;
  }

  .provenance {
    align-items: flex-start;
    border-top: 1px solid var(--journal-zinc);
    color: var(--journal-ink-muted);
    display: flex;
    flex-direction: column;
    font-family: 'Journal Mono', monospace;
    font-size: 7.5px;
    gap: 3px;
    justify-content: center;
    letter-spacing: 0.01em;
    line-height: 1.18;
    min-width: 0;
    padding: 4px 8px 0;
  }

  .provenance strong {
    color: var(--journal-emerald-dark);
    font-size: 7px;
    letter-spacing: 0.11em;
  }

  .provenance code {
    font-family: inherit;
    overflow-wrap: anywhere;
  }

  .layout-1 .thesis { grid-column: 1 / 5; grid-row: 2 / 4; }
  .layout-1 .artifact--primary { grid-column: 5 / 13; grid-row: 2 / 6; }
  .layout-1 .artifact--secondary { grid-column: 1 / 5; grid-row: 4 / 6; }
  .layout-1 .prompt { grid-column: 1 / 5; grid-row: 6; }
  .layout-1 .provenance { grid-column: 5 / 11; grid-row: 6; }

  .layout-2 .thesis { grid-column: 1 / 6; grid-row: 2 / 4; }
  .layout-2 .artifact--primary { grid-column: 6 / 13; grid-row: 2 / 5; }
  .layout-2 .artifact--primary { border-left: 7px solid var(--journal-emerald); }
  .layout-2 .artifact--primary .artifact-header {
    background: var(--journal-graphite);
    border-bottom-color: var(--journal-graphite);
    color: var(--journal-white);
  }
  .layout-2 .artifact--primary .artifact-header b {
    border-color: var(--journal-ink-muted);
    color: var(--journal-zinc);
  }
  .layout-2 .artifact--primary .artifact-header > span { color: var(--journal-emerald); }
  .layout-2 .artifact--secondary { grid-column: 1 / 6; grid-row: 4 / 6; }
  .layout-2 .prompt { grid-column: 1 / 6; grid-row: 6; }
  .layout-2 .provenance { grid-column: 6 / 11; grid-row: 6; }

  .layout-0 .thesis { grid-column: 1 / 9; grid-row: 2; }
  .layout-0 .thesis h1 { font-size: 36px; line-height: 0.95; }
  .layout-0 .thesis-rule { display: none; }
  .layout-0 .artifact--primary { grid-column: 1 / 9; grid-row: 3 / 6; }
  .layout-0 .artifact--secondary { grid-column: 9 / 13; grid-row: 3 / 5; }
  .layout-0 .prompt { grid-column: 9 / 13; grid-row: 5; padding-left: 4px; }
  .layout-0 .provenance { grid-column: 1 / 9; grid-row: 6; }

  .folio {
    grid-column: 11 / 13;
    grid-row: 6;
    padding-left: 12px;
  }

  .registration-mark--a { right: 29px; top: 152px; }
  .registration-mark--b { bottom: 92px; left: 29px; }
`

export const renderCoverHtml = (
  entry: BlogVisualEntry,
  artifacts: CoverArtifacts,
  fontData: CoverFontData,
) => {
  if (artifacts.primary.kind !== entry.primary.kind) {
    throw new Error(`Primary artifact kind for ${entry.slug} does not match its catalog entry.`)
  }
  if (artifacts.secondary.kind !== entry.secondary.kind) {
    throw new Error(`Secondary artifact kind for ${entry.slug} does not match its catalog entry.`)
  }
  if (artifacts.primary.kind === artifacts.secondary.kind) {
    throw new Error(`Cover artifacts for ${entry.slug} must use different evidence kinds.`)
  }

  const issue = String(entry.order).padStart(2, '0')
  const folio = String(entry.order).padStart(3, '0')
  const layout = `layout-${entry.order % 3}`
  const gridColumns = Array.from({ length: 12 }, () => '<span></span>').join('')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta content="width=1200, initial-scale=1" name="viewport" />
    <title>${escapeHtml(`Field Journal ${issue}: ${entry.thesis}`)}</title>
    <style>${renderFontFaces(fontData)}${journalThemeCss}${coverCss}</style>
  </head>
  <body>
    <main
      aria-label="${escapeHtml(`Community Field Journal issue ${issue}: ${entry.thesis}`)}"
      class="cover ${layout}"
      data-cover-layout="${layout}"
      data-slug="${escapeHtml(entry.slug)}"
      role="img"
    >
      <div aria-hidden="true" class="journal-grid">${gridColumns}</div>
      <i aria-hidden="true" class="crop-mark crop-mark--tl"></i>
      <i aria-hidden="true" class="crop-mark crop-mark--tr"></i>
      <i aria-hidden="true" class="crop-mark crop-mark--br"></i>
      <i aria-hidden="true" class="crop-mark crop-mark--bl"></i>
      <i aria-hidden="true" class="registration-mark registration-mark--a"></i>
      <i aria-hidden="true" class="registration-mark registration-mark--b"></i>

      <div class="canvas">
        <header class="masthead" data-cover-part="masthead">
          <div class="masthead-brand"><strong>Community Field Journal</strong></div>
          <span class="masthead-series">${escapeHtml(seriesLabel(entry.series))}</span>
          <span class="stamp">OPEN SOURCE<br />FIELD NOTE</span>
          <span class="issue" data-cover-part="issue">ISSUE ${issue}</span>
        </header>

        <section class="thesis" data-cover-part="thesis">
          <div class="thesis-label">Editorial thesis / ${escapeHtml(entry.slug)}</div>
          <h1>${escapeHtml(entry.thesis)}</h1>
          <div class="thesis-rule">repository evidence</div>
        </section>

        ${artifactRegion('primary', artifacts.primary)}
        ${artifactRegion('secondary', artifacts.secondary)}

        <aside class="prompt annotation" data-cover-part="prompt">
          <span aria-hidden="true" class="prompt-mark">↗</span>
          <span class="prompt-label">For the next builder</span>
          <p>${escapeHtml(entry.prompt)}</p>
        </aside>

        <aside aria-label="Repository provenance" class="provenance" data-cover-part="provenance">
          <strong>PROVENANCE / CHECK THE SOURCE</strong>
          <code>01 ${escapeHtml(artifacts.primary.provenance)}</code>
          <code>02 ${escapeHtml(artifacts.secondary.provenance)}</code>
        </aside>

        <footer class="folio" data-cover-part="folio">
          <span>PAYLOAD COMPONENTS</span>
          <strong>FIELD JOURNAL / ${folio}</strong>
        </footer>
      </div>
    </main>
  </body>
</html>`
}
