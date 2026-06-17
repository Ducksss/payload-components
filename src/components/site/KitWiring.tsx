import { Callout } from 'fumadocs-ui/components/callout'

import { getKitManifest } from '@/lib/kit-manifest'

/* Backs <KitWiring slug="…" /> — the factual "what it installs & wires" reference,
 * driven entirely by the kit manifest so it can't drift from what installs. States
 * which files land and which edits the install makes; the "wired, not pasted" pitch
 * lives on the landing page, not here. */
export async function KitWiring({ slug }: { slug: string }) {
  const manifest = await getKitManifest(slug)

  if (!manifest) return null

  const patched = manifest.recovery.patchedFiles
  const pagesPath = patched.find((p) => p.includes('collections/Pages')) ?? 'src/collections/Pages/index.ts'
  const renderPath = patched.find((p) => p.includes('RenderBlocks')) ?? 'src/blocks/RenderBlocks.tsx'
  const sharedFile = manifest.files.find((file) => file.includes('/shared/'))

  const edits: { action: string; file: string }[] = [
    { action: 'Registers the block', file: pagesPath },
    { action: 'Maps the renderer', file: renderPath },
  ]
  if (manifest.postInstall.includes('generate:types')) {
    edits.push({ action: 'Regenerates types', file: 'src/payload-types.ts' })
  }
  if (manifest.postInstall.includes('generate:importmap')) {
    edits.push({ action: 'Regenerates the admin import map', file: 'src/app/(payload)/admin/importMap.js' })
  }

  return (
    <div className="not-prose my-6 flex flex-col gap-5">
      <div>
        <p className="mb-3 text-sm leading-6 text-muted-foreground">
          Copies {manifest.files.length} source{' '}
          {manifest.files.length === 1 ? 'file' : 'files'} into your project:
        </p>
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-muted/30">
          {manifest.files.map((file) => (
            <li key={file} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <code className="truncate font-mono text-[13px] text-foreground/90">{file}</code>
              {file === sharedFile ? (
                <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  shared
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-sm leading-6 text-muted-foreground">
          …and makes {edits.length} edits to wire the block into your project:
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              {edits.map((edit) => (
                <tr key={edit.action}>
                  <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">
                    {edit.action}
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="font-mono text-[13px] text-muted-foreground">{edit.file}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sharedFile ? (
        <Callout type="info">
          <code className="font-mono text-[13px]">{sharedFile.split('/').pop()}</code> is the shared
          field core for this family — every variant composes it. Editing it updates each installed
          block at once, and re-running an install never overwrites a copy you have changed.
        </Callout>
      ) : null}

      <p className="text-sm leading-6 text-muted-foreground">
        Re-running the install converges: it detects existing wiring, skips it, and records install
        state in <code className="font-mono text-[13px]">.payload-kit/state.json</code>.
      </p>
    </div>
  )
}
