import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

import { ComponentCodeViewer } from '@/components/site/ComponentCodeViewer'
import { demosBySlug } from '@/components/site/demos/registry'
import { getComponentSources } from '@/lib/component-source'

/* Backs the <ComponentPreview slug="…" /> MDX component: a shadcn-style component
 * preview with Preview / Code tabs. Preview renders the kit's live demo twin
 * (shared demosBySlug registry, so it never drifts from the catalog); Code shows
 * every file the kit installs — the Payload block config.ts (schema), the
 * frontend Component.tsx, and any shared *Fields.ts — in a dark, editor-style
 * viewer (ComponentCodeViewer), read from source at build. */
export async function ComponentDocPreview({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  const sources = await getComponentSources(slug)

  return (
    <div className="not-prose my-6">
      <Tabs items={['Preview', 'Code']}>
        <Tab value="Preview">
          <div className="flex justify-center overflow-hidden rounded-lg border border-border bg-muted/30 px-4 py-8 sm:px-6 sm:py-10">
            <div className="w-full">
              <Demo />
            </div>
          </div>
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
