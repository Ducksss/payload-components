import { Step, Steps } from 'fumadocs-ui/components/steps'

import { getComponentManifest } from '@/lib/component-manifest'

/* Backs <ComponentUsage slug="…" /> — what an editor does after install, the part a
 * generic component doc skips. Driven by the manifest's pagesLayout fragment so
 * the block name is always correct. */
export async function ComponentUsage({ slug }: { slug: string }) {
  const manifest = await getComponentManifest(slug)

  if (!manifest) return null

  const layout = manifest.payloadFragments.find((fragment) => fragment.kind === 'pagesLayout')
  const blockName = layout && 'blockName' in layout ? layout.blockName : slug

  return (
    <Steps>
      <Step>
        <strong className="font-medium text-foreground">Add the block to a page.</strong> In the
        Payload admin, open (or create) a <strong>Page</strong> and add the{' '}
        <code className="font-mono text-[13px]">{blockName}</code> block to its layout.
      </Step>
      <Step>
        <strong className="font-medium text-foreground">Fill the content.</strong> Complete the
        fields from the <a href="#content-model">content model</a> above — the kit ships sample
        content you can start from.
      </Step>
      <Step>
        <strong className="font-medium text-foreground">Publish.</strong> Save and publish the page;
        the block renders through <code className="font-mono text-[13px]">RenderBlocks</code> on the
        frontend, fully typed — no extra wiring.
      </Step>
    </Steps>
  )
}
