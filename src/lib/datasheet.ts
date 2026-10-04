import heroBasicManifest from '../../payload-components/manifests/hero-basic.json' with { type: 'json' }

/* The landing hero draws hero-basic as a part on a datasheet: its real fields
 * go in on one side, and the five artifacts an install writes come out on the
 * other, to "J1 · your project". Everything below is read from the manifest
 * except the field names, which live in the block config (target code the
 * site never imports); tests/int/datasheet.int.spec.ts checks them against
 * that source so the drawing cannot drift from what installs.
 *
 * Kept as data rather than drawn by hand so the same pinout can later render
 * a datasheet for any component from its manifest. */

type Manifest = typeof heroBasicManifest

/* What each post-install task regenerates in the consumer repo. */
const postInstallOutputs: Record<string, string> = {
  'generate:importmap': 'importMap.js',
  'generate:types': 'payload-types.ts',
}

/* `src/blocks/HeroBasic/config.ts` -> `HeroBasic/`: the block's own folder,
 * not the shared family file it also ships. */
function blockFolder(manifest: Manifest) {
  const blockFile = manifest.files.find((file) => !file.includes('/shared/'))
  const segments = blockFile?.split('/') ?? []
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
function patchedFiles(manifest: Manifest) {
  const rank = (file: string) => (file.includes('/collections/') ? 0 : 1)
  return [...manifest.recovery.patchedFiles].sort((a, b) => rank(a) - rank(b))
}

export const heroDatasheet = {
  /* Input pins, in the order the block config declares them. */
  fields: ['eyebrow', 'title', 'description', 'links[]', 'proofItems[]'],
  license: 'MIT',
  /* Output pins: copied source, the two patched host files, then what the
     post-install generators rewrite. */
  outputs: [
    blockFolder(heroBasicManifest),
    ...patchedFiles(heroBasicManifest).map(patchedFileLabel),
    ...heroBasicManifest.postInstall.map((task) => postInstallOutputs[task] ?? task),
  ],
  part: `PC-${heroBasicManifest.name.toUpperCase()}`,
  slug: heroBasicManifest.name,
  version: heroBasicManifest.version,
} as const
