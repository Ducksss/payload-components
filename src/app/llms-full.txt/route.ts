import { getLLMText, source } from '@/lib/source'
import {
  faqEntries,
  githubRepoUrl,
  componentEntries,
  customComponentsDescription,
  customComponentsRoute,
  customComponentsTitle,
  siteDescription,
  siteUrl,
} from '@/lib/site'

export async function GET() {
  const docs = await Promise.all(source.getPages().map(getLLMText))
  const body = [
    '# Payload Components',
    '',
    siteDescription,
    '',
    `Home: ${siteUrl}/`,
    `Docs: ${siteUrl}/docs`,
    `Catalog: ${siteUrl}/components`,
    `${customComponentsTitle}: ${siteUrl}${customComponentsRoute}`,
    `Registry: ${siteUrl}/r/registry.json`,
    `GitHub: ${githubRepoUrl}`,
    '',
    `## ${customComponentsTitle}`,
    customComponentsDescription,
    'A Payload custom component is installable when its source, collection slot, render map, manifest fragments, generated types, and admin import map move together.',
    '',
    '## Components',
    ...componentEntries.map((component) => `- ${component.title} (${component.slug}): ${component.command}`),
    '',
    '## FAQ',
    ...faqEntries.flatMap((entry) => [`### ${entry.question}`, entry.answer, '']),
    '## Documentation',
    ...docs,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
