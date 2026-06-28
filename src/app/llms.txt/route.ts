import {
  faqEntries,
  githubRepoUrl,
  componentEntries,
  primaryInstallCommand,
  siteDescription,
  siteUrl,
  stackItems,
} from '@/lib/site'

/* Concise, AI-readable site index following the llmstxt.org convention:
   H1 + one-line summary, then linked sections. The FAQ is included verbatim
   because Q&A pairs are the format generative engines cite most reliably.
   The exhaustive dump (all docs) lives at /llms-full.txt. */
export function GET() {
  const body = [
    '# Payload Components',
    '',
    `> ${siteDescription}`,
    '',
    'Payload Components is an open-source (MIT) registry and CLI for Payload CMS v3 + Next.js.',
    `Running \`${primaryInstallCommand}\` copies a block's source, registers it in your`,
    'Pages collection, maps the renderer, and regenerates Payload types and the admin',
    'import map — landing as one reviewable git diff rather than a manual checklist.',
    'Docs runtime: Fumadocs-powered Next.js site.',
    '',
    '## Primary links',
    `- [Home](${siteUrl}/)`,
    `- [Docs](${siteUrl}/docs)`,
    `- [Component catalog](${siteUrl}/components)`,
    `- [About](${siteUrl}/about)`,
    `- [Public registry](${siteUrl}/r/registry.json)`,
    `- [Full LLM context](${siteUrl}/llms-full.txt)`,
    `- [Payload admin components guide](${siteUrl}/admin-components)`,
    `- [GitHub repository](${githubRepoUrl})`,
    '',
    '## Supported stack',
    ...stackItems.map((item) => `- ${item.label} (${item.detail})`),
    '',
    '## Installable components',
    /* Keep "<title>: <command>" intact (no backticks) — the GEO contract test
       in tests/e2e/geo.e2e.spec.ts pins that exact substring. */
    ...componentEntries.map((component) => `- ${component.title}: ${component.command} — ${component.description}`),
    '',
    '## Payload admin components guide',
    'A developer guide to Payload admin components: collection slots, custom views or fields, render maps, generated types, and admin import-map wiring.',
    'Payload admin components need more than React source: collection slots, custom views or fields, render maps, generated types, and the admin import map have to move together.',
    '',
    '## FAQ',
    ...faqEntries.flatMap((entry) => [`### ${entry.question}`, entry.answer, '']),
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
