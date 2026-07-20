import { randomUUID } from 'node:crypto'
import { constants as fsConstants } from 'node:fs'
import {
  lstat,
  mkdir,
  open,
  realpath,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import type { ComponentManifest } from '../types'

import { isPathInside } from '../utils'

type SampleValue = Record<string, unknown>

export const SEED_SCRIPT_OWNERSHIP_HEADER = '// payload-components:generated-seed:v1'

export type SeedTarget = {
  configFileRelPath: string
  marker: string
  ownershipStateRelPath: string
  scriptRelPath: string
  slug: string
  title: string
}

type SeedOwnershipState = {
  component: string
  manifestVersion: string
  mediaId: number | string | null
  mediaOperationToken: string | null
  pageId: number | string | null
  pageOperationToken: string | null
  token: string
  version: 1
}

const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

const uploadFieldNames = new Set(['avatar', 'image', 'logo', 'poster', 'productImage', 'video'])

const isRecord = (value: unknown): value is SampleValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isMissingUploadReference = (item: SampleValue, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

const valueNeedsDemoMedia = (value: unknown, parentKey?: string): boolean => {
  if (Array.isArray(value)) {
    const uploadField = parentKey ? uploadFieldByArrayName[parentKey] : undefined

    return value.some(
      (item) =>
        (uploadField && isRecord(item) && isMissingUploadReference(item, uploadField)) ||
        valueNeedsDemoMedia(item),
    )
  }

  if (!isRecord(value)) {
    return false
  }

  return Object.entries(value).some(
    ([key, nestedValue]) =>
      (uploadFieldNames.has(key) && isMissingUploadReference(value, key)) ||
      valueNeedsDemoMedia(nestedValue, key),
  )
}

export const sampleContentNeedsDemoMedia = (
  sampleContent: ComponentManifest['sampleContent'],
) => valueNeedsDemoMedia(sampleContent)

const quoteTsString = (value: string) =>
  `'${value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')}'`

const getConfigImportPath = (target: SeedTarget) => {
  const relativePath = path.relative(path.dirname(target.scriptRelPath), target.configFileRelPath)
  const withoutExtension = relativePath.replace(/\.(?:[cm]?[jt]s)$/, '')
  const normalized = withoutExtension.split(path.sep).join('/')

  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

const getPayloadTypesImportPath = (target: SeedTarget) => {
  const typesFileRelPath = path.join(
    path.dirname(target.configFileRelPath),
    'payload-types.ts',
  )
  const relativePath = path.relative(path.dirname(target.scriptRelPath), typesFileRelPath)
  const withoutExtension = relativePath.replace(/\.(?:[cm]?[jt]s)$/, '')
  const normalized = withoutExtension.split(path.sep).join('/')

  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

const getBlockType = (manifest: ComponentManifest) => {
  const blockType = manifest.sampleContent.blockType

  if (typeof blockType !== 'string' || blockType.length === 0) {
    throw new Error(`Manifest "${manifest.name}" sampleContent must include a string blockType.`)
  }

  return blockType
}

const getOwnershipStateImportPath = (target: SeedTarget) => {
  const relativePath = path.relative(
    path.dirname(target.scriptRelPath),
    target.ownershipStateRelPath,
  )
  const normalized = relativePath.split(path.sep).join('/')

  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

export const buildSeedScript = ({
  manifests,
  ownershipState,
  target,
}: {
  manifests: ComponentManifest[]
  ownershipState: SeedOwnershipState
  target: SeedTarget
}): string => {
  if (manifests.length === 0) {
    throw new Error('At least one component manifest is required to build a seed script.')
  }

  const firstManifest = manifests[0]
  const firstBlockType = getBlockType(firstManifest)
  const rawLayout = manifests.map((manifest) => manifest.sampleContent)
  const rawLayoutBlockNames = manifests.map((manifest) => manifest.name)
  const rawLayoutBlockTypes = manifests.map((manifest) => getBlockType(manifest))
  const needsDemoMedia = manifests.some((manifest) =>
    sampleContentNeedsDemoMedia(manifest.sampleContent),
  )
  const configImportPath = getConfigImportPath(target)
  const payloadTypesImportPath = getPayloadTypesImportPath(target)
  const ownershipStateImportPath = getOwnershipStateImportPath(target)
  const demoMediaMarkerPrefix = `${target.marker}:media`

  return `${SEED_SCRIPT_OWNERSHIP_HEADER}
import { randomUUID } from 'node:crypto'
import { lstat, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import type { Page } from ${quoteTsString(payloadTypesImportPath)}

const { default: config } = await import(${quoteTsString(configImportPath)})

type DemoDocument = Record<string, unknown> & { id: number | string }
type DemoPageLayout = NonNullable<Page['layout']>
type DemoSampleValue = Record<string, unknown>
type DemoOwnershipState = {
  component: string
  manifestVersion: string
  mediaId: number | string | null
  mediaOperationToken: string | null
  pageId: number | string | null
  pageOperationToken: string | null
  token: string
  version: 1
}

const demoSlug = ${quoteTsString(target.slug)}
const demoMarkerPrefix = ${quoteTsString(target.marker)}
const demoMediaMarkerPrefix = ${quoteTsString(demoMediaMarkerPrefix)}
const ownershipToken = ${quoteTsString(ownershipState.token)}
const demoTitle = ${quoteTsString(target.title)}
const demoBlockType = ${quoteTsString(firstBlockType)}
const expectedComponent = ${quoteTsString(firstManifest.name)}
const expectedManifestVersion = ${quoteTsString(firstManifest.version)}
const ownershipStatePath = new URL(${quoteTsString(ownershipStateImportPath)}, import.meta.url)
const rawLayout = ${JSON.stringify(rawLayout, null, 2)} satisfies DemoSampleValue[]
const rawLayoutBlockNames = ${JSON.stringify(rawLayoutBlockNames)} as const
const rawLayoutBlockTypes = ${JSON.stringify(rawLayoutBlockTypes)} as const
const needsDemoMedia = ${JSON.stringify(needsDemoMedia)}
const mutationContext = { disableRevalidate: true }
const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

const uploadFieldNames = new Set(${JSON.stringify([...uploadFieldNames])})

const isRecord = (value: unknown): value is DemoSampleValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isDocumentID = (value: unknown): value is number | string =>
  typeof value === 'number' || typeof value === 'string'

const isOperationToken = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value)

const assertPrivateOwnershipStateFile = async () => {
  const stateFilePath = fileURLToPath(ownershipStatePath)
  let stats

  try {
    stats = await lstat(stateFilePath)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        'The generated demo seed private ownership state is missing; no content was changed. ' +
          'Run "payload-components seed ' +
          expectedComponent +
          '" to regenerate it.',
      )
    }

    throw error
  }

  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error(
      'The generated demo seed private ownership state is not a regular file; no content was changed.',
    )
  }
}

const loadOwnershipState = async (): Promise<DemoOwnershipState> => {
  await assertPrivateOwnershipStateFile()
  let parsed: unknown

  try {
    parsed = JSON.parse(await readFile(ownershipStatePath, 'utf8'))
  } catch {
    throw new Error(
      'The generated demo seed private ownership state is unreadable; no content was changed.',
    )
  }

  if (
    !isRecord(parsed) ||
    parsed.version !== 1 ||
    parsed.component !== expectedComponent ||
    parsed.manifestVersion !== expectedManifestVersion ||
    parsed.token !== ownershipToken ||
    (parsed.pageId !== null && !isDocumentID(parsed.pageId)) ||
    (parsed.mediaId !== null && !isDocumentID(parsed.mediaId)) ||
    (parsed.pageOperationToken !== null &&
      !isOperationToken(parsed.pageOperationToken)) ||
    (parsed.mediaOperationToken !== null &&
      !isOperationToken(parsed.mediaOperationToken)) ||
    (parsed.pageId !== null && parsed.pageOperationToken === null) ||
    (parsed.mediaId !== null && parsed.mediaOperationToken === null)
  ) {
    throw new Error(
      'The generated demo seed private ownership state does not match this generated script; no content was changed.',
    )
  }

  return parsed as DemoOwnershipState
}

const saveOwnershipState = async (state: DemoOwnershipState) => {
  await assertPrivateOwnershipStateFile()
  const stateFilePath = fileURLToPath(ownershipStatePath)
  const tempPath = path.join(
    path.dirname(stateFilePath),
    '.' + path.basename(stateFilePath) + '.' + process.pid + '.' + randomUUID() + '.tmp',
  )

  try {
    await writeFile(tempPath, JSON.stringify(state, null, 2) + '\\n', {
      encoding: 'utf8',
      flag: 'wx',
      mode: 0o600,
    })
    await rename(tempPath, stateFilePath)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }
}

const isMissingUploadReference = (item: DemoSampleValue, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

const valueNeedsDemoMedia = (value: unknown, parentKey?: string): boolean => {
  if (Array.isArray(value)) {
    const uploadField = parentKey ? uploadFieldByArrayName[parentKey] : undefined

    return value.some(
      (item) =>
        (uploadField && isRecord(item) && isMissingUploadReference(item, uploadField)) ||
        valueNeedsDemoMedia(item),
    )
  }

  if (!isRecord(value)) {
    return false
  }

  return Object.entries(value).some(
    ([key, nestedValue]) =>
      (uploadFieldNames.has(key) && isMissingUploadReference(value, key)) ||
      valueNeedsDemoMedia(nestedValue, key),
  )
}

const addDemoUploadReferences = <Value>(
  value: Value,
  mediaID: number | string,
  parentKey?: string,
): Value => {
  if (Array.isArray(value)) {
    const uploadField = parentKey ? uploadFieldByArrayName[parentKey] : undefined

    return value.map((item) => {
      const mappedItem = addDemoUploadReferences(item, mediaID)

      if (!uploadField || !isRecord(mappedItem)) {
        return mappedItem
      }

      return {
        ...mappedItem,
        [uploadField]: isMissingUploadReference(mappedItem, uploadField)
          ? mediaID
          : mappedItem[uploadField],
      }
    }) as Value
  }

  if (!isRecord(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      uploadFieldNames.has(key) && isMissingUploadReference(value, key)
        ? mediaID
        : addDemoUploadReferences(nestedValue, mediaID, key),
    ]),
  ) as Value
}

const assertDemoPageLayout = (value: unknown): asserts value is DemoPageLayout => {
  if (!Array.isArray(value) || value.length !== rawLayoutBlockTypes.length) {
    throw new Error('Generated demo layout does not match the installed manifest set.')
  }

  value.forEach((block, index) => {
    if (
      !isRecord(block) ||
      block.blockType !== rawLayoutBlockTypes[index] ||
      typeof block.id !== 'string' ||
      valueNeedsDemoMedia(block)
    ) {
      throw new Error(
        'Generated demo block "' + rawLayoutBlockNames[index] + '" is incomplete; no Page was changed.',
      )
    }
  })
}

const isOwnedDemoPage = (page: DemoDocument) => {
  const firstBlock = Array.isArray(page.layout) ? page.layout[0] : undefined

  return (
    page.slug === demoSlug &&
    page.title === demoTitle &&
    isRecord(firstBlock) &&
    firstBlock.id ===
      demoMarkerPrefix + ':' + ownershipToken + ':' + ownershipState.pageOperationToken &&
    firstBlock.blockType === demoBlockType
  )
}

let ownershipState = await loadOwnershipState()

const journalPageOperation = async () => {
  if (ownershipState.pageOperationToken !== null) {
    return ownershipState.pageOperationToken
  }

  const operationToken = randomUUID()
  ownershipState = {
    ...ownershipState,
    pageOperationToken: operationToken,
  }
  await saveOwnershipState(ownershipState)

  return operationToken
}

const journalMediaOperation = async () => {
  if (ownershipState.mediaOperationToken !== null) {
    return ownershipState.mediaOperationToken
  }

  const operationToken = randomUUID()
  ownershipState = {
    ...ownershipState,
    mediaOperationToken: operationToken,
  }
  await saveOwnershipState(ownershipState)

  return operationToken
}

const payload = await getPayload({ config })
const pagesCollection = payload.config.collections.find(
  (collection) => collection.slug === 'pages',
)

if (!pagesCollection) {
  throw new Error('The generated demo seed requires a Pages collection with slug "pages".')
}

const pagesSupportDrafts = Boolean(pagesCollection.versions?.drafts)

if (!pagesSupportDrafts) {
  throw new Error(
    'The generated demo seed requires drafts to be enabled on the Pages collection; no content was changed.',
  )
}

const pageOperationToken = await journalPageOperation()
const existingPages = await payload.find({
  collection: 'pages',
  depth: 0,
  draft: true,
  overrideAccess: true,
  pagination: false,
  where: {
    slug: {
      equals: demoSlug,
    },
  },
})
const existingPageDocuments = existingPages.docs as unknown as DemoDocument[]
let existingPageID = ownershipState.pageId

if (existingPageID === null && existingPageDocuments.length === 1) {
  if (!isOwnedDemoPage(existingPageDocuments[0])) {
    throw new Error(
      'Refusing to change /' +
        demoSlug +
        ': the existing Page has no matching local ownership record.',
    )
  }

  existingPageID = existingPageDocuments[0].id
  ownershipState = {
    ...ownershipState,
    pageId: existingPageID,
  }
  await saveOwnershipState(ownershipState)
} else if (existingPageID === null && existingPageDocuments.length > 1) {
  throw new Error(
    'Refusing to change /' +
      demoSlug +
      ': the existing Pages do not match one private ownership record.',
  )
}

if (
  existingPageID !== null &&
  (existingPageDocuments.length !== 1 ||
    existingPageDocuments[0].id !== existingPageID ||
    !isOwnedDemoPage(existingPageDocuments[0]))
) {
  throw new Error(
    'Refusing to change /' +
      demoSlug +
      ': the existing Page does not match its private ownership record.',
  )
}

const prepareDemoMedia = async () => {
  const mediaOperationToken = await journalMediaOperation()
  const demoMediaAlt =
    'Payload Components generated demo media [' +
    demoMediaMarkerPrefix +
    ':' +
    ownershipToken +
    ':' +
    mediaOperationToken +
    ']'
  const existingMediaResult = await payload.find({
    collection: 'media',
    depth: 0,
    overrideAccess: true,
    pagination: false,
    where: {
      alt: {
        equals: demoMediaAlt,
      },
    },
  })
  const existingMediaDocuments = existingMediaResult.docs as unknown as DemoDocument[]
  let existingMediaID = ownershipState.mediaId

  if (existingMediaID === null && existingMediaDocuments.length === 1) {
    existingMediaID = existingMediaDocuments[0].id
    ownershipState = {
      ...ownershipState,
      mediaId: existingMediaID,
    }
    await saveOwnershipState(ownershipState)
  } else if (existingMediaID === null && existingMediaDocuments.length > 1) {
    throw new Error(
      'Refusing to reuse generated-marker Media: it does not match its private ownership record.',
    )
  }

  if (
    existingMediaID !== null &&
    (existingMediaDocuments.length !== 1 ||
      existingMediaDocuments[0].id !== existingMediaID)
  ) {
    throw new Error(
      'Refusing to reuse generated-marker Media: it does not match its private ownership record.',
    )
  }

  if (existingMediaID !== null) {
    return existingMediaDocuments[0]
  }

  const mediaTempDirectory = await mkdtemp(
    path.join(tmpdir(), ${quoteTsString(`payload-components-demo-${firstManifest.name}-`)}),
  )
  const mediaPath = path.join(mediaTempDirectory, 'placeholder.svg')

  try {
    await writeFile(
      mediaPath,
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#f4f4f5"/><path d="M27 52h42v8H27zM27 36h42v8H27z" fill="#18181b"/></svg>',
    )

    const document = await payload.create({
      collection: 'media',
      context: mutationContext,
      data: {
        alt: demoMediaAlt,
      },
      filePath: mediaPath,
      overrideAccess: true,
    })

    ownershipState = {
      ...ownershipState,
      mediaId: document.id,
    }
    await saveOwnershipState(ownershipState)

    return document
  } finally {
    await rm(mediaTempDirectory, { force: true, recursive: true })
  }
}

const preparedMedia = needsDemoMedia ? await prepareDemoMedia() : undefined
const demoMarker = demoMarkerPrefix + ':' + ownershipToken + ':' + pageOperationToken
const layoutWithMarkers = rawLayout.map((block, index) => ({
  ...block,
  id: index === 0 ? demoMarker : demoMarker + ':' + rawLayoutBlockNames[index],
}))
const layoutCandidate: unknown = preparedMedia
  ? layoutWithMarkers.map((block) => addDemoUploadReferences(block, preparedMedia.id))
  : layoutWithMarkers
assertDemoPageLayout(layoutCandidate)
const pageData = {
  title: demoTitle,
  slug: demoSlug,
  layout: layoutCandidate,
  _status: 'draft' as const,
}

if (existingPageID !== null) {
  await payload.update({
    collection: 'pages',
    context: mutationContext,
    data: pageData,
    draft: true,
    id: existingPageID,
    overrideAccess: true,
    overrideLock: false,
  })
} else {
  const createdPage = await payload.create({
    collection: 'pages',
    context: mutationContext,
    data: pageData,
    draft: true,
    overrideAccess: true,
  })

  ownershipState = {
    ...ownershipState,
    pageId: createdPage.id,
  }
  await saveOwnershipState(ownershipState)
}

console.log('Seeded draft demo at /' + demoSlug)
`
}

const isMissingPathError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT'

const ensureSafeDirectory = async (
  targetRoot: string,
  directoryPath: string,
  label: 'demo ownership state' | 'seed script',
) => {
  const relativeDirectory = path.relative(targetRoot, directoryPath)
  let currentPath = targetRoot

  for (const segment of relativeDirectory.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment)
    let stats

    try {
      stats = await lstat(currentPath)
    } catch (error) {
      if (!isMissingPathError(error)) {
        throw error
      }

      await mkdir(currentPath)
      stats = await lstat(currentPath)
    }

    if (stats.isSymbolicLink()) {
      throw new Error(`Refusing to use symbolic link in ${label} path: ${currentPath}`)
    }

    if (!stats.isDirectory()) {
      throw new Error(`${label} parent path is not a directory: ${currentPath}`)
    }
  }
}

const assertReplaceableSeedScript = async (scriptPath: string) => {
  let fileHandle

  try {
    fileHandle = await open(
      scriptPath,
      fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK,
    )
  } catch (error) {
    if (isMissingPathError(error)) {
      return
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error.code === 'ELOOP' || error.code === 'EMLINK')
    ) {
      throw new Error(`Refusing to replace symbolic link at seed script path: ${scriptPath}`)
    }

    if (error instanceof Error && 'code' in error && error.code === 'EISDIR') {
      throw new Error(`Refusing to replace non-file at seed script path: ${scriptPath}`)
    }

    throw error
  }

  try {
    const [openedStats, pathStats] = await Promise.all([fileHandle.stat(), lstat(scriptPath)])

    if (pathStats.isSymbolicLink()) {
      throw new Error(`Refusing to replace symbolic link at seed script path: ${scriptPath}`)
    }

    if (!openedStats.isFile() || !pathStats.isFile()) {
      throw new Error(`Refusing to replace non-file at seed script path: ${scriptPath}`)
    }

    if (openedStats.dev !== pathStats.dev || openedStats.ino !== pathStats.ino) {
      throw new Error(`Seed script changed while its ownership was being verified: ${scriptPath}`)
    }

    const existingSource = await fileHandle.readFile('utf8')

    if (!existingSource.startsWith(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)) {
      throw new Error(
        `Refusing to overwrite unowned seed script at ${scriptPath}. Move or remove it explicitly, then retry.`,
      )
    }
  } finally {
    await fileHandle.close()
  }
}

const readOrCreateOwnershipState = async ({
  manifest,
  statePath,
}: {
  manifest: ComponentManifest
  statePath: string
}): Promise<SeedOwnershipState> => {
  let fileHandle

  try {
    fileHandle = await open(
      statePath,
      fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK,
    )
  } catch (error) {
    if (isMissingPathError(error)) {
      const state: SeedOwnershipState = {
        component: manifest.name,
        manifestVersion: manifest.version,
        mediaId: null,
        mediaOperationToken: null,
        pageId: null,
        pageOperationToken: null,
        token: randomUUID(),
        version: 1,
      }

      await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, {
        encoding: 'utf8',
        flag: 'wx',
        mode: 0o600,
      })

      return state
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error.code === 'ELOOP' || error.code === 'EMLINK')
    ) {
      throw new Error(`Refusing symbolic link at demo ownership state path: ${statePath}`)
    }

    if (error instanceof Error && 'code' in error && error.code === 'EISDIR') {
      throw new Error(`Refusing non-file at demo ownership state path: ${statePath}`)
    }

    throw error
  }

  try {
    const [openedStats, pathStats] = await Promise.all([fileHandle.stat(), lstat(statePath)])

    if (
      pathStats.isSymbolicLink() ||
      !openedStats.isFile() ||
      !pathStats.isFile() ||
      openedStats.dev !== pathStats.dev ||
      openedStats.ino !== pathStats.ino
    ) {
      throw new Error(`Refusing unsafe demo ownership state file: ${statePath}`)
    }

    let state: SeedOwnershipState

    try {
      state = JSON.parse(await fileHandle.readFile('utf8')) as SeedOwnershipState
    } catch {
      throw new Error(`Refusing unreadable demo ownership state file: ${statePath}`)
    }

    if (
      state.version !== 1 ||
      state.component !== manifest.name ||
      state.manifestVersion !== manifest.version ||
      typeof state.token !== 'string' ||
      !/^[0-9a-f-]{36}$/.test(state.token) ||
      (state.pageOperationToken !== null &&
        (typeof state.pageOperationToken !== 'string' ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
            state.pageOperationToken,
          ))) ||
      (state.mediaOperationToken !== null &&
        (typeof state.mediaOperationToken !== 'string' ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
            state.mediaOperationToken,
          ))) ||
      (state.pageId !== null &&
        typeof state.pageId !== 'number' &&
        typeof state.pageId !== 'string') ||
      (state.mediaId !== null &&
        typeof state.mediaId !== 'number' &&
        typeof state.mediaId !== 'string') ||
      (state.pageId !== null && state.pageOperationToken === null) ||
      (state.mediaId !== null && state.mediaOperationToken === null)
    ) {
      throw new Error(
        `Refusing mismatched demo ownership state for "${manifest.name}" at ${statePath}. Remove the demo content and state explicitly before regenerating.`,
      )
    }

    return state
  } finally {
    await fileHandle.close()
  }
}

export const writeSeedScript = async (
  targetPath: string,
  manifests: ComponentManifest[],
  target: SeedTarget,
): Promise<string> => {
  if (manifests.length === 0) {
    throw new Error('At least one component manifest is required to write a seed script.')
  }

  const targetRoot = await realpath(path.resolve(targetPath))
  const scriptPath = path.resolve(targetRoot, target.scriptRelPath)
  const configPath = path.resolve(targetRoot, target.configFileRelPath)
  const ownershipStatePath = path.resolve(targetRoot, target.ownershipStateRelPath)

  if (scriptPath === targetRoot || !isPathInside(targetRoot, scriptPath)) {
    throw new Error(
      `Seed script path "${target.scriptRelPath}" must stay inside the target project.`,
    )
  }

  if (configPath === targetRoot || !isPathInside(targetRoot, configPath)) {
    throw new Error('Payload config path must stay inside the target project.')
  }

  if (
    ownershipStatePath === targetRoot ||
    !isPathInside(targetRoot, ownershipStatePath)
  ) {
    throw new Error('Demo ownership state path must stay inside the target project.')
  }

  if (ownershipStatePath === scriptPath) {
    throw new Error('Demo ownership state path must be separate from the seed script path.')
  }

  const scriptDirectory = path.dirname(scriptPath)
  const ownershipStateDirectory = path.dirname(ownershipStatePath)

  // Guard against accidental escapes and symlinks already present in the
  // caller-owned checkout. This non-privileged developer CLI assumes that a
  // hostile same-user process is not concurrently replacing project paths.
  await ensureSafeDirectory(targetRoot, scriptDirectory, 'seed script')
  await assertReplaceableSeedScript(scriptPath)
  await ensureSafeDirectory(targetRoot, ownershipStateDirectory, 'demo ownership state')
  const ownershipState = await readOrCreateOwnershipState({
    manifest: manifests[0],
    statePath: ownershipStatePath,
  })
  const source = buildSeedScript({ manifests, ownershipState, target })

  const tempPath = path.join(
    scriptDirectory,
    `.${path.basename(scriptPath)}.${process.pid}.${randomUUID()}.tmp`,
  )

  try {
    await writeFile(tempPath, source, { encoding: 'utf8', flag: 'wx', mode: 0o644 })

    const resolvedDirectory = await realpath(scriptDirectory)

    if (resolvedDirectory !== scriptDirectory || !isPathInside(targetRoot, resolvedDirectory)) {
      throw new Error(
        'Seed script parent directory changed or escaped the target project during generation.',
      )
    }

    await rename(tempPath, scriptPath)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }

  return scriptPath
}
