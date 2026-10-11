import heroBasicManifest from '../../payload-components/manifests/hero-basic.json' with { type: 'json' }

/* A component drawn as a part on a datasheet: its inputs go in on one side —
 * the block's real fields, or a file-only component's props — and the artifacts
 * an install writes come out on the other, to "J1 · your project". Everything
 * here is read from the manifest except the inputs, which live in source the
 * site never imports: src/lib/component-datasheet.ts reads them from the block
 * config (or the component's props type) as text for the docs datasheets, and
 * tests/int/datasheet.int.spec.ts checks both against a TypeScript parse.
 *
 * This module stays free of Node APIs so the landing hero can import its one
 * datasheet anywhere. */

export type DatasheetManifest = {
  files: string[]
  installMode?: 'page-block' | 'file-only'
  name: string
  postInstall: string[]
  recovery: { patchedFiles: string[] }
  title?: string
  version: string
}

/* One input pin: a top-level block field (`links[]` for arrays) or a prop. */
export type DatasheetPin = {
  label: string
  name: string
  required: boolean
  /* The shared family module a field comes from (`heroFields`), if any. */
  shared?: string
  type: string
}

export type Datasheet = {
  /* What the input pins are: block fields, or a file-only component's props. */
  inputKind: 'fields' | 'props'
  inputs: DatasheetPin[]
  license: 'MIT'
  /* Output pins: copied source, the patched host files, then what the
     post-install generators rewrite. */
  outputs: string[]
  part: string
  slug: string
  title: string
  version: string
}

/* What each post-install task regenerates in the consumer repo. */
const postInstallOutputs: Record<string, string> = {
  'generate:importmap': 'importMap.js',
  'generate:types': 'payload-types.ts',
}

/* `src/blocks/HeroBasic/config.ts` -> `HeroBasic/`: the component's own
 * folder, not the shared family file it also ships. */
function sourceFolder(manifest: DatasheetManifest) {
  const ownFile = manifest.files.find((file) => !file.includes('/shared/'))
  const segments = ownFile?.split('/') ?? []
  return `${segments.at(-2) ?? manifest.name}/`
}

/* `src/collections/Pages/index.ts` -> `Pages/index.ts`, `src/blocks/RenderBlocks.tsx`
 * -> `RenderBlocks.tsx`: short enough to label a pad, still unambiguous. */
function patchedFileLabel(file: string) {
  const segments = file.split('/')
  const last = segments.at(-1) ?? file
  return last.startsWith('index.') ? `${segments.at(-2)}/${last}` : last
}

/* Collection first, then renderer: the order an install wires them in. */
function patchedFiles(manifest: DatasheetManifest) {
  const rank = (file: string) => (file.includes('/collections/') ? 0 : 1)
  return [...manifest.recovery.patchedFiles].sort((a, b) => rank(a) - rank(b))
}

export function datasheetFromManifest(
  manifest: DatasheetManifest,
  inputs: DatasheetPin[],
): Datasheet {
  return {
    inputKind: manifest.installMode === 'file-only' ? 'props' : 'fields',
    inputs,
    license: 'MIT',
    outputs: [
      sourceFolder(manifest),
      ...patchedFiles(manifest).map(patchedFileLabel),
      ...manifest.postInstall.map((task) => postInstallOutputs[task] ?? task),
    ],
    part: `PC-${manifest.name.toUpperCase()}`,
    slug: manifest.name,
    title: manifest.title ?? manifest.name,
    version: manifest.version,
  }
}

/* The landing hero's part. Its five fields are spelled out here, in config
 * order, so the hero stays a synchronous import; the int spec checks them
 * against the block config and against the docs datasheet for the same slug. */
const heroField = (name: string, type: string, required = false, shared?: string) => ({
  label: type === 'array' ? `${name}[]` : name,
  name,
  required,
  ...(shared ? { shared } : {}),
  type,
})

export const heroDatasheet = datasheetFromManifest(heroBasicManifest, [
  heroField('eyebrow', 'text', false, 'heroFields'),
  heroField('title', 'text', true, 'heroFields'),
  heroField('description', 'textarea', true, 'heroFields'),
  heroField('links', 'array', false, 'heroFields'),
  heroField('proofItems', 'array'),
])
