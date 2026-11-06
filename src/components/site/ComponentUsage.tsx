import { AdminFormMock } from '@/components/site/AdminFormMock'
import { componentNameOf, deriveAdminForm, isFileOnly } from '@/lib/component-composition'
import { getComponentManifest } from '@/lib/component-manifest'

/* Backs <ComponentUsage slug="…" /> — what the editor sees after install, the
 * part a generic component doc skips: a static mock of the Payload block form
 * built from the manifest's sampleContent, with the block's admin label (the
 * manifest title mirrors the block config's labels.singular). File-only
 * components show the same mock as the props their template passes. */

const steps = [
  'Add the block to a Page from the layout block picker.',
  'Fill the fields as above.',
  'Publish. RenderBlocks renders the block, fully typed.',
]

export async function ComponentUsage({ slug }: { slug: string }) {
  const manifest = await getComponentManifest(slug)

  if (!manifest) return null

  const fields = deriveAdminForm(manifest.sampleContent)
  const componentName = componentNameOf(manifest)

  if (isFileOnly(manifest)) {
    return (
      <div className="not-prose flex flex-col gap-5">
        <p className="max-w-prose text-sm leading-6 text-muted-foreground">
          Import{' '}
          <code className="wrap-anywhere font-mono text-[13px] text-foreground">
            {componentName}
          </code>{' '}
          into your post template and pass public content as props. The install adds no admin
          fields, so your template decides what loads and when it publishes.
        </p>
        <AdminFormMock eyebrow="Props" fields={fields} title="Props your template passes" />
      </div>
    )
  }

  return (
    <div className="not-prose flex flex-col gap-5">
      <p className="max-w-prose text-sm leading-6 text-muted-foreground">
        Editors add <strong className="font-medium text-foreground">{manifest.title}</strong> from a
        Page layout&apos;s block picker. This is the form they fill.
      </p>
      <AdminFormMock eyebrow="Block" fields={fields} title={manifest.title} />
      <ol className="flex flex-col gap-2 text-sm leading-6 text-foreground sm:flex-row sm:gap-5">
        {steps.map((step, index) => (
          <li className="flex gap-2 sm:flex-1" key={step}>
            <span className="shrink-0 font-mono text-xs leading-6 text-muted-foreground">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
