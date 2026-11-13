import { ComponentCodePeek, CopyCodeButton } from '@/components/site/ComponentCodeViewer'
import { DocCodeBlock, peekLines } from '@/components/site/ComponentDocPreview'
import { ComponentPreviewFrame } from '@/components/site/ComponentPreviewFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { getExampleState } from '@/components/site/demos/states'
import { getComponentManifest } from '@/lib/component-manifest'
import { componentEntries } from '@/lib/site'

/* Backs <ComponentExample slug="…" state="…" /> in MDX: one example in a doc
 * page's "Examples" section, as one window —
 *
 *   ┌ live demo twin in the example state (toolbar-less iframe) ┐
 *   ├ data peek: the block JSON an editor would enter, "View data" ┤
 *   └ (expanded) the full JSON + copy                             ┘
 *
 * The heading and the one-line summary are NOT rendered here: the MDX writes
 * `### <State title>` + the sentence above this tag so the table of contents,
 * search, and the markdown surfaces see them. The iframe loads the static
 * per-state route (/components/preview/<slug>/<state>) and is measured the
 * same way as the main preview (ComponentPreviewFrame, variant "example").
 * The JSON is `{ blockType, ...content }` — the manifest's sampleContent
 * blockType (falling back to the slug) plus the state's demo content — so it
 * reads like the document Payload stores for this block. */
export async function ComponentExample({ slug, state }: { slug: string; state: string }) {
  const example = getExampleState(slug, state)

  if (!example || !demosBySlug[slug]) return null

  const manifest = await getComponentManifest(slug)
  const sampleBlockType = manifest?.sampleContent?.blockType
  const blockType = typeof sampleBlockType === 'string' ? sampleBlockType : slug
  const title = componentEntries.find((entry) => entry.slug === slug)?.title ?? slug
  const data = JSON.stringify({ blockType, ...(example.content as object) }, null, 2)
  const id = `${slug}-${example.id}-data`

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border">
      <ComponentPreviewFrame
        slug={slug}
        title={title}
        variant="example"
        src={`/components/preview/${slug}/${example.id}`}
        frameTitle={`${title} example: ${example.title}`}
      />
      <ComponentCodePeek
        id={id}
        label="View data"
        peek={<DocCodeBlock code={peekLines(data)} lang="json" />}
      >
        <div className="flex items-center justify-between gap-3 border-b border-terminal-border px-4 py-2.5">
          <span className="truncate font-mono text-xs text-terminal-muted">
            Block data · {example.title}
          </span>
          <CopyCodeButton code={data} />
        </div>
        <DocCodeBlock code={data} lang="json" />
      </ComponentCodePeek>
    </div>
  )
}
