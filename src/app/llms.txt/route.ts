import {
  aiDiscoveryRoute,
  blogRoute,
  faqEntries,
  feedRoute,
  githubRepoUrl,
  componentEntries,
  primaryInstallCommand,
  siteDescription,
  siteUrl,
  stackItems,
} from '@/lib/site'
import { templateDetailHref, templateShowcases } from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

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
    `- [AI discovery guide](${siteUrl}${aiDiscoveryRoute})`,
    `- [Component catalog](${siteUrl}/components)`,
    `- [Blog](${siteUrl}/blog)`,
    `- [Blog RSS](${siteUrl}/blog/rss.xml)`,
    `- [Template concepts](${siteUrl}/templates)`,
    `- [Blog](${siteUrl}${blogRoute})`,
    `- [Updates feed](${siteUrl}${feedRoute})`,
    `- [About](${siteUrl}/about)`,
    `- [Public registry](${siteUrl}/r/registry.json)`,
    `- [Full LLM context](${siteUrl}/llms-full.txt)`,
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
    '## Full-site template concepts',
    'Browsable multi-page site concepts composed from the blocks above. Each is a',
    `${TEMPLATE_CONCEPT_STATUS_LABEL.toLowerCase()} — not an installable template yet; no install command exists for them.`,
    ...templateShowcases.map(
      (template) =>
        `- [${template.title}](${siteUrl}${templateDetailHref(template.slug)}) — ${template.summary}`,
    ),
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
