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
  pageStatus: 'draft' | 'published'
  scriptRelPath: string
  slug: string
  title: string
}

export const SMOKE_SEED_TARGET: SeedTarget = {
  configFileRelPath: path.join('src', 'payload.config.ts'),
  marker: 'payload-components:smoke',
  pageStatus: 'published',
  scriptRelPath: path.join('.payload-components', 'smoke-seed.ts'),
  slug: 'payload-components-smoke',
  title: 'Payload Component Smoke',
}

const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

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

  return Object.entries(value).some(([key, nestedValue]) => valueNeedsDemoMedia(nestedValue, key))
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

const getBlockType = (manifest: ComponentManifest) => {
  const blockType = manifest.sampleContent.blockType

  if (typeof blockType !== 'string' || blockType.length === 0) {
    throw new Error(`Manifest "${manifest.name}" sampleContent must include a string blockType.`)
  }

  return blockType
}

export const buildSeedScript = ({
  manifests,
  target,
}: {
  manifests: ComponentManifest[]
  target: SeedTarget
}): string => {
  if (manifests.length === 0) {
    throw new Error('At least one component manifest is required to build a seed script.')
  }

  const firstManifest = manifests[0]
  const firstBlockType = getBlockType(firstManifest)
  const rawLayout = manifests.map((manifest, index) => ({
    ...manifest.sampleContent,
    id: index === 0 ? target.marker : `${target.marker}:${manifest.name}`,
  }))
  const needsDemoMedia = manifests.some((manifest) =>
    sampleContentNeedsDemoMedia(manifest.sampleContent),
  )
  const configImportPath = getConfigImportPath(target)
  const demoMediaMarker = `${target.marker}:media`
  const requirePagesDrafts = target.pageStatus === 'draft'
  const pageStatusField =
    target.pageStatus === 'draft' ? "    _status: 'draft' as const," : "    _status: 'published',"
  const draftOption = target.pageStatus === 'draft' ? 'true' : 'false'
  const completionMessage =
    target.pageStatus === 'draft'
      ? "'Seeded draft demo at /' + demoSlug"
      : "'Seeded /' + demoSlug"

  return `${SEED_SCRIPT_OWNERSHIP_HEADER}
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { getPayload } from 'payload'

const { default: config } = await import(${quoteTsString(configImportPath)})

type DemoDocument = Record<string, unknown> & { id: number | string }
type DemoSampleValue = Record<string, unknown>

const demoSlug = ${quoteTsString(target.slug)}
const demoMarker = ${quoteTsString(target.marker)}
const demoMediaMarker = ${quoteTsString(demoMediaMarker)}
const demoMediaAlt = 'Payload Components generated demo media [' + demoMediaMarker + ']'
const demoTitle = ${quoteTsString(target.title)}
const demoBlockType = ${quoteTsString(firstBlockType)}
const rawLayout = ${JSON.stringify(rawLayout, null, 2)} satisfies DemoSampleValue[]
const needsDemoMedia = ${JSON.stringify(needsDemoMedia)}
const requirePagesDrafts = ${JSON.stringify(requirePagesDrafts)}
const mutationContext = { disableRevalidate: true }
const uploadFieldByArrayName: Record<string, string> = {
  avatars: 'avatar',
  integrations: 'logo',
  logos: 'logo',
  members: 'avatar',
}

const isRecord = (value: unknown): value is DemoSampleValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isMissingUploadReference = (item: DemoSampleValue, fieldName: string) =>
  typeof item[fieldName] === 'undefined' || item[fieldName] === null || item[fieldName] === ''

const addDemoUploadReferences = (
  value: unknown,
  mediaID: unknown,
  parentKey?: string,
): unknown => {
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
    })
  }

  if (!isRecord(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      addDemoUploadReferences(nestedValue, mediaID, key),
    ]),
  )
}

const isOwnedDemoPage = (page: DemoDocument) => {
  const firstBlock = Array.isArray(page.layout) ? page.layout[0] : undefined

  return (
    page.slug === demoSlug &&
    page.title === demoTitle &&
    isRecord(firstBlock) &&
    firstBlock.id === demoMarker &&
    firstBlock.blockType === demoBlockType
  )
}

const payload = await getPayload({ config })
const pagesCollection = payload.config.collections.find(
  (collection) => collection.slug === 'pages',
)

if (!pagesCollection) {
  throw new Error('The generated demo seed requires a Pages collection with slug "pages".')
}

const pagesSupportDrafts = Boolean(pagesCollection.versions?.drafts)

if (requirePagesDrafts && !pagesSupportDrafts) {
  throw new Error(
    'The generated demo seed requires drafts to be enabled on the Pages collection; no content was changed.',
  )
}

const existingPages = await payload.find({
  collection: 'pages',
  depth: 0,
  draft: ${draftOption},
  overrideAccess: true,
  pagination: false,
  where: {
    slug: {
      equals: demoSlug,
    },
  },
})
const existingPageDocuments = existingPages.docs as unknown as DemoDocument[]
const conflictingPage = existingPageDocuments.find((page) => !isOwnedDemoPage(page))

if (conflictingPage) {
  throw new Error(
    'Refusing to change /' +
      demoSlug +
      ': the existing Page does not match the exact generated demo ownership contract.',
  )
}

if (existingPageDocuments.length > 1) {
  throw new Error(
    'Refusing to change /' + demoSlug + ': multiple Pages use the generated demo slug.',
  )
}

const existingPage = existingPageDocuments[0]

const prepareDemoMedia = async () => {
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
  const [primaryMedia, ...duplicateMediaDocuments] = existingMediaDocuments

  if (primaryMedia) {
    return { document: primaryMedia, duplicateMediaDocuments }
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

    return { document, duplicateMediaDocuments: [] as DemoDocument[] }
  } finally {
    await rm(mediaTempDirectory, { force: true, recursive: true })
  }
}

const preparedMedia = needsDemoMedia ? await prepareDemoMedia() : undefined
const layout = preparedMedia
  ? rawLayout.map((block) => addDemoUploadReferences(block, preparedMedia.document.id))
  : rawLayout
const pageData = {
  title: demoTitle,
  slug: demoSlug,
  layout,
${pageStatusField}
}

if (existingPage) {
  await payload.update({
    collection: 'pages',
    context: mutationContext,
    data: pageData,
    draft: ${draftOption},
    id: existingPage.id,
    overrideAccess: true,
  })
} else {
  await payload.create({
    collection: 'pages',
    context: mutationContext,
    data: pageData,
    draft: ${draftOption},
    overrideAccess: true,
  })
}

for (const duplicateMedia of preparedMedia?.duplicateMediaDocuments ?? []) {
  await payload.delete({
    collection: 'media',
    context: mutationContext,
    id: duplicateMedia.id,
    overrideAccess: true,
  })
}

console.log(${completionMessage})
`
}

const isMissingPathError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT'

const ensureSafeDirectory = async (targetRoot: string, directoryPath: string) => {
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
      throw new Error(`Refusing to use symbolic link in seed script path: ${currentPath}`)
    }

    if (!stats.isDirectory()) {
      throw new Error(`Seed script parent path is not a directory: ${currentPath}`)
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

export const writeSeedScript = async (
  targetPath: string,
  manifests: ComponentManifest[],
  target: SeedTarget = SMOKE_SEED_TARGET,
): Promise<string> => {
  const targetRoot = await realpath(path.resolve(targetPath))
  const scriptPath = path.resolve(targetRoot, target.scriptRelPath)
  const configPath = path.resolve(targetRoot, target.configFileRelPath)

  if (scriptPath === targetRoot || !isPathInside(targetRoot, scriptPath)) {
    throw new Error(
      `Seed script path "${target.scriptRelPath}" must stay inside the target project.`,
    )
  }

  if (configPath === targetRoot || !isPathInside(targetRoot, configPath)) {
    throw new Error('Payload config path must stay inside the target project.')
  }

  const source = buildSeedScript({ manifests, target })
  const scriptDirectory = path.dirname(scriptPath)

  // Guard against accidental escapes and symlinks already present in the
  // caller-owned checkout. This non-privileged developer CLI assumes that a
  // hostile same-user process is not concurrently replacing project paths.
  await ensureSafeDirectory(targetRoot, scriptDirectory)
  await assertReplaceableSeedScript(scriptPath)

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
