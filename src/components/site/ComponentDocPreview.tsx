import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

import { ComponentCodeViewer } from '@/components/site/ComponentCodeViewer'
import { ComponentPreviewFrame } from '@/components/site/ComponentPreviewFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { getComponentSources } from '@/lib/component-source'
import { componentEntries } from '@/lib/site'

/* Backs the <ComponentPreview slug="…" /> MDX component: a shadcn-style component
 * preview with Preview / Code tabs. Preview renders the component's live demo twin
 * in a responsive frame (ComponentPreviewFrame loads /components/preview/<slug> in
 * an iframe so the twin's breakpoints actually reflow); the demosBySlug guard keeps
 * it in step with the catalog. Code shows every file the component installs — the
 * Payload block config.ts (schema), the frontend Component.tsx, and any shared
 * *Fields.ts — in a dark, editor-style viewer (ComponentCodeViewer), read from
 * source at build. */
export async function ComponentDocPreview({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  const sources = await getComponentSources(slug)
  const title = componentEntries.find((entry) => entry.slug === slug)?.title ?? slug

  return (
    <div className="not-prose my-6">
      <Tabs items={['Preview', 'Code']}>
        {/* p-0: the preview frame sits flush in the Tabs panel so the panel itself
            is the single window (no extra padded card around the chrome). */}
        <Tab value="Preview" className="p-0">
          <ComponentPreviewFrame slug={slug} title={title} />
        </Tab>
        <Tab value="Code">
          {sources.length > 0 ? (
            <ComponentCodeViewer files={sources} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Source unavailable — see the files under “What it installs”.
            </p>
          )}
        </Tab>
      </Tabs>
    </div>
  )
}
