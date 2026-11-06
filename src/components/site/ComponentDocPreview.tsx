import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc'

import { ComponentCodePeek, ComponentCodeViewer } from '@/components/site/ComponentCodeViewer'
import { ComponentPreviewFrame } from '@/components/site/ComponentPreviewFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { getComponentSources } from '@/lib/component-source'
import { componentEntries } from '@/lib/site'

/* Backs the <ComponentPreview slug="…" /> MDX component: the shadcn-style
 * preview at the top of every component doc page, as one window —
 *
 *   ┌ toolbar + live demo twin (ComponentPreviewFrame, iframe) ┐
 *   ├ code peek: the first lines of config.ts, faded, "View code" ┤
 *   └ (expanded) ComponentCodeViewer: file tree + files + copy    ┘
 *
 * The code is always one click away without hiding the preview: no tabs. The
 * peek is highlighted server-side at build (ServerCodeBlock → Shiki) so the
 * band paints finished on first load; the full viewer highlights on the client
 * once, up front, so expanding is instant. Sources are every file the
 * component installs — the Payload block config.ts (schema) first, then the
 * frontend Component.tsx and any shared *Fields.ts — read from source at build
 * by getComponentSources, never imported or executed. */

/* Must match CODE_THEME in ComponentCodeViewer.tsx (a 'use client' module, so
   its constant cannot be imported here). */
const CODE_THEME = 'github-dark-default'

/* Lines the collapsed peek shows before the ~9rem clip; a few more than fit so
   the fade visibly cuts the last ones. */
const PEEK_LINES = 8

export const peekLines = (code: string, lines = PEEK_LINES) =>
  code.split('\n').slice(0, lines).join('\n')

/* Server-highlighted code block on the dark surface. Shared by the main
   preview's peek and the Examples' block-data peek + full view
   (ComponentExample). Same theme/options as the client viewer so the two
   pipelines render identically. */
export function DocCodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <ServerCodeBlock
      code={code}
      lang={lang}
      themes={{ dark: CODE_THEME, light: CODE_THEME }}
      defaultColor={false}
      codeblock={{
        allowCopy: false,
        'data-line-numbers': true,
        className: 'my-0 rounded-none border-0 bg-terminal text-terminal-foreground',
      }}
    />
  )
}

export async function ComponentDocPreview({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  const sources = await getComponentSources(slug)
  const title = componentEntries.find((entry) => entry.slug === slug)?.title ?? slug
  const first = sources[0]

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border">
      <ComponentPreviewFrame slug={slug} title={title} />
      {first ? (
        <ComponentCodePeek
          id={`${slug}-code`}
          peek={<DocCodeBlock code={peekLines(first.code)} lang={first.lang} />}
        >
          <ComponentCodeViewer files={sources} />
        </ComponentCodePeek>
      ) : null}
    </div>
  )
}
