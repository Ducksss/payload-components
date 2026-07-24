import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

import { blogVisualCatalog } from './catalog'
import type {
  Artifact,
  BlogVisualEntry,
  BlogVisualSeries,
  FigureMode,
  ResolvedArtifact,
} from './types'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const catalogPath = 'tools/blog/visual-system/catalog.ts'
const registryPath = 'payload-components/registry.json'

const visualSeries: ReadonlySet<BlogVisualSeries> = new Set([
  'project-notes',
  'foundations',
  'installer-internals',
  'component-design',
  'production-guides',
  'open-source',
])

const inspectFigures = new Set([
  '/blog/anatomy-of-an-install/figure-01-five-stage-pipeline.svg',
  '/blog/production-ready-payload-block-config/figure-01-config-anatomy.svg',
  '/blog/manifest-wiring-contract/figure-01-manifest-layers.svg',
  '/blog/text-anchors-vs-ast/figure-01-scoped-diff.svg',
  '/blog/payload-components-doctor/figure-01-doctor-report.svg',
  '/blog/reproducible-shadcn-registry/figure-01-deterministic-build.svg',
  '/blog/open-source-provenance/figure-01-provenance-chain.svg',
])

const joinFigures = new Set([
  '/blog/hello/figure-01-origin-story.svg',
  '/blog/contribute-payload-component/figure-01-contribution-workflow.svg',
  '/blog/community-driven-roadmap/figure-01-feedback-loop.svg',
])

type RegistryFile = {
  path: string
  target: string
}

type RegistryItem = {
  files: readonly RegistryFile[]
  name: string
}

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const resolveRepositoryPath = (repositoryPath: string) => {
  if (!repositoryPath || path.isAbsolute(repositoryPath)) {
    throw new Error(`Repository path must be relative: "${repositoryPath}".`)
  }

  const absolutePath = path.resolve(repoRoot, repositoryPath)
  const rootPrefix = `${repoRoot}${path.sep}`

  if (absolutePath !== repoRoot && !absolutePath.startsWith(rootPrefix)) {
    throw new Error(`Repository path escapes the checkout: "${repositoryPath}".`)
  }

  return absolutePath
}

const readRepositoryFile = async (repositoryPath: string) => {
  try {
    return await readFile(resolveRepositoryPath(repositoryPath), 'utf8')
  } catch (error) {
    throw new Error(`Unable to read ${repositoryPath}: ${describeError(error)}`)
  }
}

const assertRepositoryFile = async (repositoryPath: string) => {
  try {
    await access(resolveRepositoryPath(repositoryPath))
  } catch (error) {
    throw new Error(`Missing repository file ${repositoryPath}: ${describeError(error)}`)
  }
}

const parseRegistryFiles = (value: unknown, itemName: string): readonly RegistryFile[] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Registry item "${itemName}" has no files.`)
  }

  const files: RegistryFile[] = []

  for (const candidate of value) {
    if (
      !isRecord(candidate) ||
      typeof candidate.path !== 'string' ||
      candidate.path.trim() === '' ||
      typeof candidate.target !== 'string' ||
      candidate.target.trim() === ''
    ) {
      throw new Error(`Registry item "${itemName}" has an invalid file entry.`)
    }

    files.push({ path: candidate.path, target: candidate.target })
  }

  return files
}

const readRegistryItems = async (): Promise<readonly RegistryItem[]> => {
  const rawRegistry: unknown = JSON.parse(await readRepositoryFile(registryPath))

  if (!isRecord(rawRegistry) || !Array.isArray(rawRegistry.items)) {
    throw new Error(`${registryPath} does not contain an items array.`)
  }

  const items: RegistryItem[] = []

  for (const candidate of rawRegistry.items) {
    if (
      !isRecord(candidate) ||
      typeof candidate.name !== 'string' ||
      candidate.name.trim() === ''
    ) {
      throw new Error(`${registryPath} contains an item without a name.`)
    }

    items.push({
      files: parseRegistryFiles(candidate.files, candidate.name),
      name: candidate.name,
    })
  }

  return items
}

const getRegistryItem = async (name: string) => {
  const item = (await readRegistryItems()).find((candidate) => candidate.name === name)

  if (!item) {
    throw new Error(`Registry item "${name}" is missing from ${registryPath}.`)
  }

  for (const file of item.files) {
    await assertRepositoryFile(file.path)
  }

  return item
}

const anchorOffsets = (source: string, anchor: string) => {
  const offsets: number[] = []
  let offset = source.indexOf(anchor)

  while (offset !== -1) {
    offsets.push(offset)
    offset = source.indexOf(anchor, offset + anchor.length)
  }

  return offsets
}

const isImportOccurrence = (source: string, offset: number) => {
  const lineStart = source.lastIndexOf('\n', offset - 1) + 1
  const lineEnd = source.indexOf('\n', offset)
  const line = source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd)

  return /^\s*import\b/.test(line)
}

const excerptAtAnchor = ({
  anchor,
  path: sourcePath,
  source,
  take,
}: {
  anchor: string
  path: string
  source: string
  take: number
}) => {
  if (anchor.trim() === '') {
    throw new Error(`Source anchor for ${sourcePath} is empty.`)
  }

  if (!Number.isInteger(take) || take < 1) {
    throw new Error(`Source excerpt for ${sourcePath} must take at least one line.`)
  }

  const offsets = anchorOffsets(source, anchor)
  const anchorOffset = offsets.find((offset) => !isImportOccurrence(source, offset)) ?? offsets[0]

  if (anchorOffset === undefined) {
    throw new Error(`Anchor "${anchor}" is missing from ${sourcePath}.`)
  }

  return source
    .slice(anchorOffset)
    .split(/\r?\n/)
    .slice(0, take)
    .join('\n')
    .trimEnd()
}

const resolveSource = async (
  artifact: Extract<Artifact, { kind: 'source' }>,
): Promise<ResolvedArtifact> => {
  const source = await readRepositoryFile(artifact.path)
  const evidence = excerptAtAnchor({ ...artifact, source })

  return { ...artifact, evidence, provenance: artifact.path }
}

const resolveRegistryItem = async (
  artifact: Extract<Artifact, { kind: 'registry-item' }>,
): Promise<ResolvedArtifact> => {
  const item = await getRegistryItem(artifact.name)
  const targets = item.files.map((file) => `- ${file.path} → ${file.target}`).join('\n')

  return {
    ...artifact,
    evidence: `Registry item: ${item.name}\nFiles:\n${targets}`,
    provenance: `${registryPath}#${item.name}`,
  }
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const resolveRouteDeclaration = async (route: string): Promise<readonly string[]> => {
  if (
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.includes('#') ||
    /\s/.test(route)
  ) {
    throw new Error(`Route must be a local path: "${route}".`)
  }

  if (route === '/blog') {
    return ['src/app/blog/page.tsx']
  }

  const blogArticle = route.match(/^\/blog\/([a-z0-9-]+)$/)

  if (blogArticle) {
    return ['src/app/blog/[slug]/page.tsx', `content/blog/${blogArticle[1]}.mdx`]
  }

  if (route === '/components' || /^\/components\?[^#\s]+$/.test(route)) {
    return ['src/app/components/page.tsx']
  }

  const componentPreview = route.match(/^\/components\/preview\/([a-z0-9-]+)$/)

  if (componentPreview) {
    const registrySource = await readRepositoryFile('src/components/site/demos/registry.ts')
    const slug = componentPreview[1]

    if (!new RegExp(`^\\s+'${escapeRegExp(slug)}':`, 'm').test(registrySource)) {
      throw new Error(`Preview route slug "${slug}" is missing from the demo registry.`)
    }

    return [
      'src/app/components/preview/[slug]/page.tsx',
      'src/components/site/demos/registry.ts',
    ]
  }

  const componentDocs = route.match(/^\/docs\/components\/([a-z0-9-]+)$/)

  if (componentDocs) {
    return [
      'src/app/docs/[[...slug]]/page.tsx',
      `content/docs/components/${componentDocs[1]}.mdx`,
    ]
  }

  throw new Error(`Unsupported local route "${route}".`)
}

const resolveRoute = async (
  artifact: Extract<Artifact, { kind: 'route' }>,
): Promise<ResolvedArtifact> => {
  const declarations = await resolveRouteDeclaration(artifact.route)

  for (const declaration of declarations) {
    await assertRepositoryFile(declaration)
  }

  return {
    ...artifact,
    evidence: `Local route: ${artifact.route}\nDeclared by:\n${declarations
      .map((declaration) => `- ${declaration}`)
      .join('\n')}`,
    provenance: artifact.route,
  }
}

const resolveSequence = (
  artifact: Extract<Artifact, { kind: 'sequence' }>,
): ResolvedArtifact => {
  if (artifact.items.length === 0 || artifact.items.some((item) => item.trim() === '')) {
    throw new Error(`Sequence "${artifact.label}" must contain nonempty items.`)
  }

  return {
    ...artifact,
    evidence: artifact.items.join(' → '),
    provenance: catalogPath,
  }
}

const resolveCommand = async (
  artifact: Extract<Artifact, { kind: 'command' }>,
): Promise<ResolvedArtifact> => {
  if (artifact.command.trim() === '') {
    throw new Error(`Command "${artifact.label}" is empty.`)
  }

  const registryItems = artifact.registryItems ?? []

  for (const itemName of registryItems) {
    await getRegistryItem(itemName)
  }

  const itemEvidence = registryItems.length
    ? `\nRegistry items:\n${registryItems.map((itemName) => `- ${itemName}`).join('\n')}`
    : ''

  return {
    ...artifact,
    evidence: `Command: ${artifact.command}${itemEvidence}`,
    provenance: registryItems.length ? registryPath : catalogPath,
  }
}

const resolveDiff = async (
  artifact: Extract<Artifact, { kind: 'diff' }>,
): Promise<ResolvedArtifact> => {
  const declaredContext = [...artifact.before, ...artifact.after].join('\n')

  if (artifact.anchor.trim() === '' || !declaredContext.includes(artifact.anchor)) {
    throw new Error(`Diff context for ${artifact.path} does not include anchor "${artifact.anchor}".`)
  }

  const source = await readRepositoryFile(artifact.path)
  const sourceAnchor = excerptAtAnchor({
    anchor: artifact.anchor,
    path: artifact.path,
    source,
    take: 1,
  })

  return {
    ...artifact,
    evidence: `Source anchor:\n${sourceAnchor}\n\nBefore:\n${artifact.before.join(
      '\n',
    )}\n\nAfter:\n${artifact.after.join('\n')}`,
    provenance: artifact.path,
  }
}

export const resolveArtifact = async (artifact: Artifact): Promise<ResolvedArtifact> => {
  if (artifact.label.trim() === '') {
    throw new Error(`Artifact label for ${artifact.kind} evidence is empty.`)
  }

  switch (artifact.kind) {
    case 'source':
      return await resolveSource(artifact)
    case 'registry-item':
      return await resolveRegistryItem(artifact)
    case 'route':
      return await resolveRoute(artifact)
    case 'sequence':
      return resolveSequence(artifact)
    case 'command':
      return await resolveCommand(artifact)
    case 'diff':
      return await resolveDiff(artifact)
  }
}

const expectedFigureMode = (figurePath: string): FigureMode => {
  if (figurePath.endsWith('.webp')) return 'see'
  if (inspectFigures.has(figurePath)) return 'inspect'
  if (joinFigures.has(figurePath)) return 'join'
  if (figurePath.endsWith('.svg')) return 'trace'

  throw new Error(`Figure path has an unsupported format: ${figurePath}.`)
}

const validateEntry = async (
  entry: BlogVisualEntry,
  seenSlugs: Set<string>,
  seenOrders: Set<number>,
  seenFigures: Set<string>,
) => {
  if (!/^[a-z0-9-]+$/.test(entry.slug)) {
    throw new Error(`Post slug "${entry.slug}" is not a canonical local slug.`)
  }

  if (seenSlugs.has(entry.slug)) {
    throw new Error(`Post slug "${entry.slug}" appears more than once.`)
  }
  seenSlugs.add(entry.slug)

  if (!Number.isInteger(entry.order) || entry.order < 1) {
    throw new Error(`Publication order "${entry.order}" is invalid.`)
  }
  if (seenOrders.has(entry.order)) {
    throw new Error(`Publication order ${entry.order} appears more than once.`)
  }
  seenOrders.add(entry.order)

  if (!visualSeries.has(entry.series)) {
    throw new Error(`Visual series "${entry.series}" is invalid.`)
  }
  if (entry.thesis.trim() === '') {
    throw new Error('Thesis is empty.')
  }
  if (entry.prompt.trim() === '') {
    throw new Error('Community invitation is empty.')
  }
  if (entry.primary.kind === entry.secondary.kind) {
    throw new Error(`Primary and secondary artifacts both use kind "${entry.primary.kind}".`)
  }
  if (entry.figures.length === 0) {
    throw new Error('No figures are declared.')
  }

  const postPath = `content/blog/${entry.slug}.mdx`
  const postSource = await readRepositoryFile(postPath)
  const orderMatch = postSource.match(/^publicationOrder:\s*(\d+)\s*$/m)
  const seriesMatch = postSource.match(/^series:\s*([a-z0-9-]+)\s*$/m)

  if (!orderMatch || Number(orderMatch[1]) !== entry.order) {
    throw new Error(`${postPath} does not declare publicationOrder ${entry.order}.`)
  }
  if (!seriesMatch || seriesMatch[1] !== entry.series) {
    throw new Error(`${postPath} does not declare series ${entry.series}.`)
  }

  for (const figure of entry.figures) {
    const expectedPrefix = `/blog/${entry.slug}/`
    const canonicalFigurePath = path.posix.normalize(figure.path)

    if (canonicalFigurePath !== figure.path || !figure.path.startsWith(expectedPrefix)) {
      throw new Error(`Figure ${figure.path} is not owned by ${entry.slug}.`)
    }
    if (seenFigures.has(figure.path)) {
      throw new Error(`Figure ${figure.path} appears more than once.`)
    }
    seenFigures.add(figure.path)

    const expectedMode = expectedFigureMode(figure.path)
    if (figure.mode !== expectedMode) {
      throw new Error(`Figure ${figure.path} must use mode "${expectedMode}".`)
    }
    if (!postSource.includes(`src="${figure.path}"`)) {
      throw new Error(`${postPath} does not declare figure ${figure.path}.`)
    }

    await assertRepositoryFile(path.join('public', figure.path.slice(1)))
  }

  await resolveArtifact(entry.primary)
  await resolveArtifact(entry.secondary)
}

export const validateBlogVisualCatalog = async (
  entries: readonly BlogVisualEntry[] = blogVisualCatalog,
): Promise<void> => {
  const seenSlugs = new Set<string>()
  const seenOrders = new Set<number>()
  const seenFigures = new Set<string>()

  for (const entry of entries) {
    const owningSlug = entry.slug.trim() || '<missing-slug>'

    try {
      await validateEntry(entry, seenSlugs, seenOrders, seenFigures)
    } catch (error) {
      throw new Error(
        `Visual evidence for ${owningSlug} is invalid: ${describeError(error)}`,
      )
    }
  }
}
