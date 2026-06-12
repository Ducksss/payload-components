import {
  faqEntries,
  githubRepoUrl,
  kitEntries,
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
    '# Payload Kits',
    '',
    `> ${siteDescription}`,
    '',
    'Payload Kits is an open-source (MIT) registry and CLI for Payload CMS v3 + Next.js.',
    `Running \`${primaryInstallCommand}\` copies a block's source, registers it in your`,
    'Pages collection, maps the renderer, and regenerates Payload types and the admin',
    'import map — landing as one reviewable git diff rather than a manual checklist.',
    'Docs runtime: Fumadocs-powered Next.js site.',
    '',
    '## Primary links',
    `- [Home](${siteUrl}/)`,
    `- [Docs](${siteUrl}/docs)`,
    `- [Kit catalog](${siteUrl}/components)`,
    `- [About](${siteUrl}/about)`,
    `- [Public registry (JSON)](${siteUrl}/r/registry.json)`,
    `- [Full LLM context](${siteUrl}/llms-full.txt)`,
    `- [GitHub repository](${githubRepoUrl})`,
    '',
    '## Supported stack',
    ...stackItems.map((item) => `- ${item.label} (${item.detail})`),
    '',
    '## Installable kits',
    ...kitEntries.map((kit) => `- ${kit.title}: \`${kit.command}\` — ${kit.description}`),
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
