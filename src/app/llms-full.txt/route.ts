import { getLLMText, source } from '@/lib/source'
import { faqEntries, githubRepoUrl, componentEntries, siteDescription, siteUrl } from '@/lib/site'

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
    `Comparison: ${siteUrl}/compare/shadcn-vs-payload-components`,
    `Registry: ${siteUrl}/r/registry.json`,
    `GitHub: ${githubRepoUrl}`,
    '',
    '## shadcn add vs payload-components add',
    'Raw shadcn registry delivery installs the files declared by a registry item. For a Payload Components layout block, payload-components add uses that same delivery and then registers the block in Pages, maps RenderBlocks, runs payload generate:types and payload generate:importmap, and records install state for safe retries.',
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
