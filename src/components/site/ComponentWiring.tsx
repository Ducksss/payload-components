import { Callout } from 'fumadocs-ui/components/callout'

import { CompositionTree, InstalledFileTree } from '@/components/site/ComponentComposition'
import { deriveComposition } from '@/lib/component-composition'
import { getComponentManifest } from '@/lib/component-manifest'

/* Backs <ComponentWiring slug="…" /> — the "What it installs" reference, driven
 * entirely by the component manifest so it can't drift from what installs. Three
 * calm parts in one column: how the block hangs together in Payload (a
 * composition tree from sampleContent), the files that land (grouped by
 * directory), and the ledger of edits the install makes. Facts only; the
 * "wired, not pasted" pitch lives on the landing page. */

/* wrap-anywhere keeps a path whole when it fits a line and splits it only in a
 * phone column. The composition panel's path rows keep break-all instead: the
 * 390px e2e pin reads one of them and expects it to wrap. */
const code = 'wrap-anywhere font-mono text-[13px] text-foreground'

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">{children}</p>
  )
}

export async function ComponentWiring({ slug }: { slug: string }) {
  const manifest = await getComponentManifest(slug)

  if (!manifest) return null

  const { componentName, fileOnly, root } = deriveComposition(manifest)
  const patched = manifest.recovery.patchedFiles
  const pagesPath =
    patched.find((p) => p.includes('collections/Pages')) ?? 'src/collections/Pages/index.ts'
  const renderPath =
    patched.find((p) => p.includes('RenderBlocks')) ?? 'src/blocks/RenderBlocks.tsx'
  const sharedFiles = manifest.files.filter((file) => file.includes('/shared/'))
  const configFile = manifest.files.find((file) => file.endsWith('/config.ts'))
  const componentFile = manifest.files.find((file) => file.endsWith('/Component.tsx'))

  const edits: { action: string; file: string }[] = []
  if (manifest.payloadFragments.some((fragment) => fragment.kind === 'pagesLayout')) {
    edits.push({ action: 'Registers the block', file: pagesPath })
  }
  if (manifest.payloadFragments.some((fragment) => fragment.kind === 'renderBlocks')) {
    edits.push({ action: 'Maps the renderer', file: renderPath })
  }
  if (manifest.postInstall.includes('generate:types')) {
    edits.push({ action: 'Regenerates types', file: 'src/payload-types.ts' })
  }
  if (manifest.postInstall.includes('generate:importmap')) {
    edits.push({
      action: 'Regenerates the admin import map',
      file: 'src/app/(payload)/admin/importMap.js',
    })
  }

  const fileCount = `${manifest.files.length} ${manifest.files.length === 1 ? 'file' : 'files'}`

  return (
    <div className="not-prose flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Eyebrow>Composition</Eyebrow>
        <CompositionTree
          files={
            fileOnly
              ? [{ label: 'Props', path: componentFile ?? manifest.files[0] }]
              : [
                  ...(configFile ? [{ label: 'Fields', path: configFile }] : []),
                  { label: 'Render', path: componentFile ?? manifest.files[0] },
                ]
          }
          lead={
            fileOnly
              ? 'How the component sits in your template'
              : 'How the block hangs together in Payload'
          }
          root={root}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow>Files</Eyebrow>
        <p className="max-w-prose text-sm leading-6 text-muted-foreground">
          Copies {fileCount} into your project.
          {sharedFiles.length ? ' Files tagged shared are reused across the family.' : ''}
        </p>
        <InstalledFileTree files={manifest.files} shared={sharedFiles} />
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow>Edits</Eyebrow>
        {edits.length ? (
          <>
            <p className="max-w-prose text-sm leading-6 text-muted-foreground">
              Wires {componentName} into the project in {edits.length} places.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="hidden w-full text-left text-sm md:table">
                <tbody className="divide-y divide-border">
                  {edits.map((edit) => (
                    <tr key={edit.action}>
                      <td className="whitespace-nowrap px-5 py-3 font-medium leading-6 text-foreground">
                        {edit.action}
                      </td>
                      <td className="px-5 py-3 leading-6">
                        <code className="break-all font-mono text-[13px] text-muted-foreground">
                          {edit.file}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="divide-y divide-border md:hidden">
                {edits.map((edit) => (
                  <li className="flex flex-col gap-1 px-5 py-3 text-sm" key={edit.action}>
                    <span className="font-medium leading-6 text-foreground">{edit.action}</span>
                    <code className="break-all font-mono text-[13px] leading-6 text-muted-foreground">
                      {edit.file}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            Nothing is registered or generated. This file-only component is composed in your
            template, not added through the admin.
          </p>
        )}

        {sharedFiles.length ? (
          <Callout className="my-0 rounded-lg" type="info">
            {sharedFiles.map((file, index) => (
              <span key={file}>
                {index > 0 ? ' and ' : ''}
                <code className="font-mono text-[13px]">{file.split('/').pop()}</code>
              </span>
            ))}{' '}
            {sharedFiles.length === 1 ? 'is' : 'are'} shared source for this component family.
            Components that install the same path reuse your local copy, and re-running an install
            never overwrites a copy you have changed.
          </Callout>
        ) : null}

        <p className="max-w-prose text-sm leading-6 text-muted-foreground">
          Re-running the install detects existing source and wiring, then records install state in{' '}
          <code className={code}>.payload-components/state.json</code>.
        </p>
      </section>
    </div>
  )
}
